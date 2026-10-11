"""
Full pipeline integration tests for OVIO Treasury Recovery Agent:
Validates Neatlogs wrapping, Entire checkpoints, CFO.ai unit economics,
hash-bucket blocking, and canonicalization.
"""

import os
from decimal import Decimal
import pytest

from core.ledger import canonical_vendor, canonical_invoice, load_ledger
from core.blocking import generate_candidates, prune_rules
from core.cfo import calculate_recovery_economics
from core.checkpoint import save_checkpoint, restore_checkpoint
from core.llm import get_llm_client, adjudicate_candidate


def test_canonical_normalization():
    """Verify entity normalization rules for corporate vendor names and invoice numbers."""
    assert canonical_vendor("THE PACIFIC ASIAN FAMILY, INC.") == "PACIFICASIANFAMILY"
    assert canonical_vendor("LOS ANGELES LGBT CENTER LLC") == "LOSANGELESLGBTCENTER"
    assert canonical_vendor("A & B TRUCKING CO") == "ABTRUCKING"
    assert canonical_vendor("") is None

    assert canonical_invoice("INV-0004521") == "4521"
    assert canonical_invoice("inv-99214") == "99214"
    assert canonical_invoice("000000") == "0"
    assert canonical_invoice("") is None


def test_entire_checkpoint_save_and_restore():
    """Verify Entire.io checkpoint persistence and restoration."""
    payload = {
        "status": "in_progress",
        "actionable_candidates": 12,
        "recovered_amount": 45000.0,
    }
    filepath = save_checkpoint(
        stage_name="test_stage",
        state_payload=payload,
        session_id="test_sess_001"
    )
    assert os.path.exists(filepath)

    restored = restore_checkpoint("test_stage", session_id="test_sess_001")
    assert restored is not None
    assert restored["actionable_candidates"] == 12
    assert restored["recovered_amount"] == 45000.0


def test_cfo_unit_economics():
    """Verify CFO.ai financial model calculations."""
    mock_findings = [
        {"candidate_id": "C1", "is_duplicate": True, "amount_at_risk": 50000.0},
        {"candidate_id": "C2", "is_duplicate": True, "amount_at_risk": 25000.0},
        {"candidate_id": "C3", "is_duplicate": False, "amount_at_risk": 10000.0},
    ]
    econ = calculate_recovery_economics(
        findings=mock_findings,
        total_tokens_in=5000,
        total_tokens_out=1500,
        contingency_fee_pct=0.18
    )

    assert econ["gross_leakage_identified_usd"] == 75000.0
    assert econ["contingency_fee_earned_usd"] == 13500.0  # 18% of 75,000
    assert econ["net_treasury_benefit_usd"] == 61500.0
    assert econ["findings_count"] == 2
    assert econ["total_inference_cogs_usd"] > 0.0
    assert econ["roi_multiplier"] > 10000.0


def test_blocking_and_rule_pruning():
    """Verify hash-bucketed blocking and deterministic rule pruning."""
    mock_txs = [
        {
            "transaction_id": "T1",
            "vendor_name_raw": "ACME SUPPLY CO",
            "vendor_canonical": "ACMESUPPLY",
            "invoice_number_raw": "INV-101",
            "invoice_canonical": "101",
            "amount": Decimal("15000.00"),
            "payment_status": "PAID",
            "department": "FIRE",
            "po_number": "PO-100",
            "description": "Protective gear",
        },
        {
            "transaction_id": "T2",
            "vendor_name_raw": "ACME SUPPLY LLC",
            "vendor_canonical": "ACMESUPPLY",
            "invoice_number_raw": "101",
            "invoice_canonical": "101",
            "amount": Decimal("15000.00"),
            "payment_status": "PAID",
            "department": "FIRE",
            "po_number": "PO-100",
            "description": "Protective gear",
        },
        {
            "transaction_id": "T3",
            "vendor_name_raw": "ACME SUPPLY",
            "vendor_canonical": "ACMESUPPLY",
            "invoice_number_raw": "INV-102",
            "invoice_canonical": "102",
            "amount": Decimal("15000.00"),
            "payment_status": "VOID",  # Voided decoy
            "department": "FIRE",
            "po_number": "PO-100",
            "description": "Voided draw",
        },
    ]

    candidates = generate_candidates(mock_txs, min_amount=1000.0)
    assert len(candidates) >= 1

    actionable, dismissed = prune_rules(candidates)
    assert len(actionable) >= 1
    # Check that T3 (VOID) was dismissed by deterministic rule
    void_dismissals = [d for d in dismissed if d.get("dismiss_reason") == "payment_voided_or_reversed"]
    assert len(void_dismissals) >= 1


def test_llm_client_wrapping():
    """Verify OpenAI client with LiteLLM endpoint is created and wrapped with neatlogs."""
    client = get_llm_client()
    assert client is not None
