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


def test_lenient_plain_text_and_json_parsing():
    """
    Verify robust parser handles strict JSON, markdown code blocks,
    and plain-text key-value fallback formats without failure.
    """
    from core.llm import _extract_and_parse_json

    # 1. Strict JSON
    strict_json = '{"is_duplicate": true, "confidence": 0.95, "explanation_type": "true_duplicate", "reasoning": "Identical invoice"}'
    res1 = _extract_and_parse_json(strict_json)
    assert res1["is_duplicate"] is True
    assert res1["confidence"] == 0.95

    # 2. Markdown Code Block
    markdown_json = '```json\n{"is_duplicate": false, "confidence": 0.80, "explanation_type": "different_po", "reasoning": "Distinct contracts"}\n```'
    res2 = _extract_and_parse_json(markdown_json)
    assert res2["is_duplicate"] is False
    assert res2["confidence"] == 0.80

    # 3. Plain-text key-value fallback (no JSON brackets)
    plain_text = """
    is_duplicate: true
    confidence: 0.92
    explanation_type: true_duplicate
    reasoning: Vendor name and invoice INV-1029 match with exact amount.
    recommended_action: ESCALATE_FOR_CLAWBACK
    invoice_match_status: exact_match
    """
    res3 = _extract_and_parse_json(plain_text)
    assert res3["is_duplicate"] is True
    assert res3["confidence"] == 0.92
    assert res3["explanation_type"] == "true_duplicate"
    assert "INV-1029" in res3["reasoning"]
    assert res3["recommended_action"] == "ESCALATE_FOR_CLAWBACK"


def test_adjudication_output_validation():
    """Verify validation guardrail ensures complete typed schema and non-empty output."""
    from core.llm import validate_adjudication_output

    partial_output = {
        "is_duplicate": "true",
        "confidence": 0.99,
    }
    validated = validate_adjudication_output(partial_output, candidate_id="CAND-001")
    assert validated["is_duplicate"] is True
    assert validated["confidence"] == 0.99
    assert validated["explanation_type"] == "true_duplicate"
    assert len(validated["reasoning"]) > 0
    assert validated["recommended_action"] == "ESCALATE_FOR_CLAWBACK"
    assert validated["candidate_id"] == "CAND-001"


def test_audit_chain_execution():
    """Verify chain execution path ovio_treasury_recovery_audit runs and produces non-empty output."""
    from core.agent import run_audit_chain

    result = run_audit_chain(max_adjudications=1)
    assert result is not None
    assert result["status"] == "COMPLETED"
    assert result["total_transactions"] > 0
    assert result["candidates_blocked"] > 0
    assert len(result["findings"]) >= 1
    # Verify no empty output
    finding = result["findings"][0]
    assert "is_duplicate" in finding
    assert "confidence" in finding
    assert "reasoning" in finding


def test_substantially_similar_invoices():
    """Verify invoice comparison accurately distinguishes variants from distinct invoices."""
    from core.llm import are_invoices_substantially_similar

    # Substantially similar variants
    assert are_invoices_substantially_similar("INV-1029", "1029") is True
    assert are_invoices_substantially_similar("AL-9921", "AL-9921-DUP") is True
    assert are_invoices_substantially_similar("000452", "452") is True
    assert are_invoices_substantially_similar("INV-8820A", "INV-8820") is True

    # Completely different alphanumeric strings (anti-hallucination cases)
    assert are_invoices_substantially_similar("212410021D294", "2124424210232") is False
    assert are_invoices_substantially_similar("INV-2024-01", "INV-2024-02") is False
    assert are_invoices_substantially_similar("38240000068056", "38240000070447") is False


def test_cand_ex_0003_anti_hallucination_guardrail():
    """
    Verify candidate CAND-EX-0003 (with completely distinct invoice numbers
    212410021D294 vs 2124424210232) is correctly classified as Is Duplicate: false
    and does not trigger the compliance guardrail.
    """
    from core.llm import validate_adjudication_output
    from core.agent import verify_clawback_guardrail

    tx1 = {
        "transaction_id": "AD26240000115457",
        "vendor_canonical": "CENTERFORTHEPACIFICASIANFAMILY",
        "invoice_canonical": "212410021D294",
        "invoice_number_raw": "212410021D294",
        "amount": 12818.0,
        "po_number": "SC21CO24138706Y",
    }
    tx2 = {
        "transaction_id": "AD26240000115458",
        "vendor_canonical": "CENTERFORTHEPACIFICASIANFAMILY",
        "invoice_canonical": "2124424210232",
        "invoice_number_raw": "2124424210232",
        "amount": 12818.0,
        "po_number": "SC21CO24138706Y",
    }

    # Simulate an LLM hallucination output claiming a transcription variance
    hallucinated_verdict = {
        "candidate_id": "CAND-EX-0003",
        "is_duplicate": True,
        "confidence": 0.95,
        "explanation_type": "true_duplicate",
        "reasoning": "Invoice numbers differ slightly due to system transcription variance.",
        "recommended_action": "ESCALATE_FOR_CLAWBACK",
        "invoice_match_status": "canonical_variant"
    }

    # Anti-hallucination guardrail validates output against actual transaction parameters
    corrected = validate_adjudication_output(
        hallucinated_verdict,
        candidate_id="CAND-EX-0003",
        tx1=tx1,
        tx2=tx2
    )

    # Verification criteria from recommended action:
    # 1. is_duplicate must be False
    assert corrected["is_duplicate"] is False
    # 2. explanation_type must reflect distinct invoices
    assert corrected["explanation_type"] == "distinct_invoices"
    assert corrected["recommended_action"] == "DISMISS"
    assert corrected["invoice_match_status"] == "distinct_invoices"

    # 3. verify_clawback_guardrail must NOT authorize clawback
    clawback_gate = verify_clawback_guardrail(corrected, tx1, tx2)
    assert clawback_gate["dispatch_status"] == "HELD_FOR_REVIEW"
