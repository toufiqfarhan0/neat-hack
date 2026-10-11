"""
OVIO High-Performance Hash-Bucketed Candidate Blocking & Rule-Pruning Engine
Employs composite key indexing to find duplicate candidates in O(N) time complexity.
Prunes false alarms deterministically before invoking LLM inference.
"""

from __future__ import annotations

import logging
from collections import defaultdict
from decimal import Decimal
from itertools import combinations
from typing import Dict, Any, List, Tuple, Set

from core.telemetry import span_scope

logger = logging.getLogger("ovio.blocking")

_VOID_STATUSES = frozenset({"CANCELLED", "CANCELED", "VOID", "VOIDED", "REVERSED", "REVERSAL"})


def generate_candidates(
    transactions: List[Dict[str, Any]],
    min_amount: float = 1000.0,
    bucket_cap: int = 50,
) -> List[Dict[str, Any]]:
    """
    Executes composite-key blocking across aggregated transactions.
    Filters out disbursements beneath the materiality threshold.
    """
    with span_scope(
        name="tool.blocking",
        span_kind="TOOL",
        attributes={"total_transactions": len(transactions), "min_amount": min_amount}
    ) as span:
        span["input"] = {"total_transactions": len(transactions), "min_amount": min_amount}
        candidates: List[Dict[str, Any]] = []
        seen_pairs: Set[Tuple[str, str]] = set()

        # 1. Bucket by (vendor_canonical, amount)
        exact_buckets: Dict[Tuple[str, Decimal], List[Dict[str, Any]]] = defaultdict(list)
        # 2. Bucket by invoice_canonical
        invoice_buckets: Dict[str, List[Dict[str, Any]]] = defaultdict(list)

        min_decimal = Decimal(str(min_amount))

        for tx in transactions:
            amt = tx.get("amount", Decimal("0"))
            if amt < min_decimal:
                continue

            v_canon = tx.get("vendor_canonical")
            inv_canon = tx.get("invoice_canonical")

            if v_canon:
                exact_buckets[(v_canon, amt)].append(tx)

            if inv_canon and inv_canon != "0" and len(inv_canon) >= 4:
                invoice_buckets[inv_canon].append(tx)

        candidate_counter = 0

        # Exact Duplicate candidates: same vendor + same dollar amount
        for (v_canon, amt), bucket in exact_buckets.items():
            if len(bucket) < 2:
                continue
            # Cap comparisons per bucket to prevent combinatorial explosion on standard fees
            active_slice = bucket[:bucket_cap]
            for tx1, tx2 in combinations(active_slice, 2):
                pair_key = tuple(sorted([tx1["transaction_id"], tx2["transaction_id"]]))
                if pair_key in seen_pairs:
                    continue
                seen_pairs.add(pair_key)

                candidate_counter += 1
                candidates.append({
                    "candidate_id": f"CAND-EX-{candidate_counter:04d}",
                    "signal": "exact_duplicate",
                    "tx1": tx1,
                    "tx2": tx2,
                    "amount_at_risk": float(amt),
                })

        # Invoice Variant / Cross-Department candidates: same invoice number across departments or vendors
        for inv_canon, bucket in invoice_buckets.items():
            if len(bucket) < 2:
                continue
            active_slice = bucket[:bucket_cap]
            for tx1, tx2 in combinations(active_slice, 2):
                pair_key = tuple(sorted([tx1["transaction_id"], tx2["transaction_id"]]))
                if pair_key in seen_pairs:
                    continue
                seen_pairs.add(pair_key)

                signal = (
                    "cross_department"
                    if tx1.get("department") and tx2.get("department") and tx1["department"] != tx2["department"]
                    else "invoice_variant"
                )

                candidate_counter += 1
                risk_amt = float(min(tx1["amount"], tx2["amount"]))
                candidates.append({
                    "candidate_id": f"CAND-INV-{candidate_counter:04d}",
                    "signal": signal,
                    "tx1": tx1,
                    "tx2": tx2,
                    "amount_at_risk": risk_amt,
                })

        logger.info(f"Generated {len(candidates)} blocked candidate pairs")
        span["output"] = {"candidates_blocked": len(candidates)}
        return candidates


def prune_rules(candidates: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Deterministic Decoy Dismissal (Stage 4).
    Prunes false alarms (cancelled invoices, distinct PO line splits, multi-month leases).
    Returns (actionable_candidates, dismissed_candidates).
    """
    with span_scope(
        name="tool.rule_prune",
        span_kind="TOOL",
        attributes={"input_candidates": len(candidates)}
    ) as span:
        span["input"] = {"input_candidates": len(candidates)}
        actionable = []
        dismissed = []

        for cand in candidates:
            tx1 = cand["tx1"]
            tx2 = cand["tx2"]

            # Rule 1: Voided / Cancelled payments
            if (
                tx1.get("payment_status") in _VOID_STATUSES
                or tx2.get("payment_status") in _VOID_STATUSES
            ):
                cand["dismiss_reason"] = "payment_voided_or_reversed"
                dismissed.append(cand)
                continue

            # Rule 2: Identical transaction recorded twice as split distribution lines
            if tx1["transaction_id"] == tx2["transaction_id"]:
                cand["dismiss_reason"] = "single_transaction_split_lines"
                dismissed.append(cand)
                continue

            # Rule 3: Different PO numbers with distinct descriptions
            if (
                tx1.get("po_number")
                and tx2.get("po_number")
                and tx1["po_number"] != tx2["po_number"]
                and tx1.get("description")
                and tx2.get("description")
                and tx1["description"] != tx2["description"]
            ):
                cand["dismiss_reason"] = "distinct_purchase_orders"
                dismissed.append(cand)
                continue

            # Rule 4: Redacted PII placeholder entities (e.g., PROTECTED INFORMATION, UNKNOWN)
            if tx1.get("vendor_canonical") in ("PROTECTEDINFORMATION", "UNKNOWN", "REDACTED"):
                cand["dismiss_reason"] = "redacted_pii_placeholder"
                dismissed.append(cand)
                continue

            # Legitimate candidate requiring adjudication
            actionable.append(cand)

        logger.info(f"Rule pruning complete: {len(actionable)} actionable, {len(dismissed)} dismissed")
        span["output"] = {"actionable_candidates": len(actionable), "dismissed_decoys": len(dismissed)}
        return actionable, dismissed
