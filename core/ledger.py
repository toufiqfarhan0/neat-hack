"""
OVIO Enterprise Accounts Payable Ingestion & Canonicalization Engine
Loads real municipal/state disbursement ledgers (LA Controller, Oklahoma Treasury)
Collapses distribution lines onto payment grain and generates canonical hashes.
"""

from __future__ import annotations

import csv
import logging
import os
from decimal import Decimal
from typing import Dict, Any, List, Optional, Tuple

from core.telemetry import span_scope

logger = logging.getLogger("ovio.ledger")

_CORPORATE_SUFFIXES = frozenset({
    "INC", "LLC", "LTD", "CORP", "CORPORATION", "CO", "COMPANY", "LP", "LLP", "THE"
})


def canonical_vendor(name: Optional[str]) -> Optional[str]:
    """Extracts a stable normalized vendor entity key."""
    if not name:
        return None
    tokens = []
    current = []
    for char in name:
        if char.isalnum():
            current.append(char.upper())
        elif current:
            tokens.append("".join(current))
            current = []
    if current:
        tokens.append("".join(current))

    tokens = [t for t in tokens if t not in ("AND", "&")]
    while tokens and tokens[0] == "THE":
        tokens.pop(0)
    while tokens and tokens[-1] in _CORPORATE_SUFFIXES:
        tokens.pop()
    return "".join(tokens) if tokens else None


def canonical_invoice(number: Optional[str]) -> Optional[str]:
    """Normalizes invoice numbers by stripping standard prefixes and leading zeroes."""
    if not number:
        return None
    text = number.strip().upper()
    if text.startswith("INV"):
        rest = text[3:]
        if not rest or not rest[0].isalpha():
            text = rest
    compact = "".join(c for c in text if c.isalnum())
    if not compact:
        return None
    stripped = compact.lstrip("0")
    return stripped if stripped else "0"


def load_ledger(filepath: str, max_rows: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    Ingests raw ledger CSV rows and groups multi-line disbursements by transaction_id.
    Operates on real datasets: la_sample.csv (20,139 rows) or ok_sample.csv (5,000 rows).
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Ledger file not found: {filepath}")

    with span_scope(
        name="tool.ledger_fetch",
        span_kind="TOOL",
        attributes={"filepath": filepath, "max_rows": max_rows or -1}
    ):
        raw_groups: Dict[str, Dict[str, Any]] = {}
        rows_processed = 0

        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            for raw_row in reader:
                rows_processed += 1
                if max_rows and rows_processed > max_rows:
                    break

                row = {k.lower().strip(): (v or "").strip() for k, v in raw_row.items() if k}

                # Resolve transaction ID
                tx_id = (
                    row.get("transaction_id")
                    or row.get("id")
                    or row.get("voucher_id")
                    or row.get("vouchernbr")
                    or f"TX-{rows_processed}"
                ).strip()

                # Parse dollar amount safely
                raw_amt = (
                    row.get("dollar_amount")
                    or row.get("amount")
                    or row.get("pymnt_amt")
                    or row.get("spend")
                    or "0"
                ).replace("$", "").replace(",", "").strip()

                try:
                    amount = Decimal(raw_amt)
                except Exception:
                    amount = Decimal("0.00")

                # Resolve vendor name
                vendor_raw = (
                    row.get("vendor_name")
                    or row.get("vendor")
                    or row.get("supplier_name")
                    or "UNKNOWN"
                ).strip()

                # Resolve invoice number
                inv_raw = (
                    row.get("inv_num")
                    or row.get("invoice_num")
                    or row.get("invoice_number")
                    or row.get("voucher_id_related")
                    or ""
                ).strip()

                # Payment date
                pmt_date = (
                    row.get("transaction_date")
                    or row.get("date")
                    or row.get("payment_date")
                    or row.get("pymnt_dt")
                    or row.get("effdt")
                    or ""
                ).split("T")[0]

                # Department & PO
                dept = (row.get("department_name") or row.get("department") or row.get("agencyname") or "").strip()
                po = (row.get("po_num") or row.get("po_number") or row.get("po_id") or "").strip()
                desc = (row.get("description") or row.get("detailed_item_description") or row.get("item_description") or "").strip()
                status = (row.get("payment_status") or row.get("transaction_type") or "").upper().strip()

                if tx_id not in raw_groups:
                    raw_groups[tx_id] = {
                        "transaction_id": tx_id,
                        "vendor_name_raw": vendor_raw,
                        "vendor_canonical": canonical_vendor(vendor_raw),
                        "invoice_number_raw": inv_raw,
                        "invoice_canonical": canonical_invoice(inv_raw),
                        "amount": amount,
                        "payment_date": pmt_date,
                        "department": dept,
                        "po_number": po,
                        "description": desc,
                        "payment_status": status,
                        "line_count": 1,
                        "line_amounts": [amount],
                    }
                else:
                    g = raw_groups[tx_id]
                    g["amount"] += amount
                    g["line_count"] += 1
                    g["line_amounts"].append(amount)
                    if not g["invoice_number_raw"] and inv_raw:
                        g["invoice_number_raw"] = inv_raw
                        g["invoice_canonical"] = canonical_invoice(inv_raw)
                    if not g["po_number"] and po:
                        g["po_number"] = po

        aggregated = list(raw_groups.values())
        logger.info(f"Loaded {rows_processed} rows -> {len(aggregated)} unique payments from {filepath}")
        return aggregated
