"""
Unit and E2E Tests for CFO.ai Decision-Level Ledger, Resilient Scenario Provisioning & Ari Integration.
"""

import pytest
from pathlib import Path
from core.cfo_sync import (
    CFO_TABLE_SCHEMAS,
    CANDIDATE_MODEL_RATES,
    build_create_table_payload,
    validate_table_schema,
    provision_cfo_scenario_tables,
    publish_audit_run_to_cfo,
    reprice_run_with_candidate_model,
    generate_ari_scenario_context,
    load_scenario_state,
    seed_canonical_benchmark_data
)


def test_build_create_table_payload():
    payload = build_create_table_payload("Audit_Run_Ledger")
    assert payload["operation"] == "create_table"
    assert payload["table_id"] == "Audit_Run_Ledger"
    assert payload["primary_key"] == "run_id"
    assert len(payload["columns"]) >= 10

    # Ensure all required column properties exist
    for col in payload["columns"]:
        assert "id" in col
        assert "name" in col
        assert "type" in col

    # Negative test for invalid table name
    with pytest.raises(ValueError):
        build_create_table_payload("NonExistent_Table")


def test_validate_table_schema():
    valid_data = {
        "columns": [
            {"id": "run_id"}, {"id": "timestamp"}, {"id": "dataset"},
            {"id": "rows_scanned"}, {"id": "gross_leakage_recovered_usd"},
            {"id": "contingency_fee_earned_usd"}, {"id": "measured_tokens_in"},
            {"id": "measured_tokens_out"}, {"id": "inference_cogs_usd"},
            {"id": "net_roi_multiplier"}, {"id": "routing_model"},
            {"id": "cost_type"}, {"id": "neatlogs_trace_id"},
            {"id": "entire_checkpoint_ref"}
        ]
    }
    is_valid, err = validate_table_schema("Audit_Run_Ledger", valid_data)
    assert is_valid is True
    assert err is None

    # Missing column failure
    invalid_data = {"columns": [{"id": "run_id"}]}
    is_valid, err = validate_table_schema("Audit_Run_Ledger", invalid_data)
    assert is_valid is False
    assert "missing required schema columns" in err


def test_resilient_provisioning_and_idempotency(tmp_path):
    state_file = tmp_path / "scenario_state.json"

    # 1. First-time provisioning
    diag = provision_cfo_scenario_tables(state_file)
    assert diag["success"] is True
    assert set(diag["provisioned_tables"]) == {"Audit_Run_Ledger", "Adjudication_Decision_Trail", "Pricing_Assumptions"}
    assert set(diag["verified_tables"]) == {"Audit_Run_Ledger", "Adjudication_Decision_Trail", "Pricing_Assumptions"}
    assert len(diag["errors"]) == 0

    state = load_scenario_state(state_file)
    # Pricing assumptions must be seeded with candidate models
    assert len(state["tables"]["Pricing_Assumptions"]["rows"]) >= 5

    # 2. Idempotent re-provisioning must preserve state and not fail
    diag2 = provision_cfo_scenario_tables(state_file)
    assert diag2["success"] is True
    state2 = load_scenario_state(state_file)
    assert len(state2["tables"]["Pricing_Assumptions"]["rows"]) == len(state["tables"]["Pricing_Assumptions"]["rows"])


def test_publish_audit_run_idempotency(tmp_path):
    state_file = tmp_path / "scenario_state.json"
    provision_cfo_scenario_tables(state_file)

    run_record = {
        "run_id": "test-run-001",
        "dataset": "test_ledger.csv",
        "rows_scanned": 500,
        "gross_leakage_recovered_usd": 15000.00,
        "contingency_fee_earned_usd": 2700.00,
        "measured_tokens_in": 1200,
        "measured_tokens_out": 400,
        "inference_cogs_usd": 0.0008,
        "net_roi_multiplier": 18750000.0,
        "routing_model": "claude-3-haiku",
        "cost_type": "measured_telemetry",
        "neatlogs_trace_id": "trace-test-123",
        "entire_checkpoint_ref": "chk-test-456"
    }

    decisions = [
        {
            "task_id": "task-alpha",
            "candidate_vendor": "ACME Supplies",
            "amount_at_risk_usd": 15000.00,
            "action_taken": "AUTHORIZE_CLAWBACK",
            "is_duplicate": True,
            "confidence_score": 0.99,
            "routing_tier": "claude-3-haiku",
            "tools_called_count": 3,
            "tools_called": ["fetch_vendor_history", "check_sibling_distribution"],
            "pruned_at_zero_tokens": False,
            "decision_rationale": "Identical invoice number INV-991 wire duplicate",
            "evidence_digest": "sha256-acme-digest"
        },
        {
            "task_id": "task-beta",
            "candidate_vendor": "Beta Logistics",
            "amount_at_risk_usd": 2500.00,
            "action_taken": "DISMISS",
            "is_duplicate": False,
            "confidence_score": 0.95,
            "routing_tier": "claude-3-haiku",
            "tools_called_count": 0,
            "tools_called": [],
            "pruned_at_zero_tokens": True,
            "decision_rationale": "Recurring monthly lease contract",
            "evidence_digest": "sha256-beta-digest"
        }
    ]

    res1 = publish_audit_run_to_cfo(run_record, decisions, state_file)
    assert res1["status"] == "success"
    assert res1["total_runs"] == 1
    assert res1["total_decisions"] == 2
    assert res1["decisions_added"] == 2

    # Repeat run with identical run_id and task_ids must NOT create duplicate records
    res2 = publish_audit_run_to_cfo(run_record, decisions, state_file)
    assert res2["status"] == "success"
    assert res2["total_runs"] == 1
    assert res2["total_decisions"] == 2
    assert res2["decisions_added"] == 0  # 0 new decisions added on repeat run


def test_what_if_model_repricing_arithmetic(tmp_path):
    state_file = tmp_path / "scenario_state.json"
    seed_canonical_benchmark_data(state_file)

    # Reprice LA run on GPT-4o
    gpt4_impact = reprice_run_with_candidate_model("run-la-controller-2024", "gpt-4o", state_file)
    assert gpt4_impact["candidate_model"] == "GPT-4o (Frontier Comparison)"
    assert gpt4_impact["financial_impact"]["repriced_cogs_usd"] > gpt4_impact["financial_impact"]["original_cogs_usd"]
    assert gpt4_impact["financial_impact"]["gross_margin_pct"] > 99.0  # Contingency fee still dwarfs compute

    # Reprice LA run on Nova-Lite (ultra-low cost)
    nova_impact = reprice_run_with_candidate_model("run-la-controller-2024", "nova-lite", state_file)
    assert nova_impact["candidate_model"] == "Amazon Nova Lite"
    assert nova_impact["financial_impact"]["repriced_cogs_usd"] < gpt4_impact["financial_impact"]["repriced_cogs_usd"]
    assert "headroom_verdict" in nova_impact["financial_impact"]


def test_ari_scenario_context_content(tmp_path):
    state_file = tmp_path / "scenario_state.json"
    seed_canonical_benchmark_data(state_file)

    state = load_scenario_state(state_file)
    ari_guide = generate_ari_scenario_context(state)

    md = ari_guide["scenario_markdown"]
    assert "CFO.ai Scenario Context Guide for Ari" in md
    assert "Audit_Run_Ledger" in md
    assert "Adjudication_Decision_Trail" in md
    assert "measured_telemetry" in md
    assert "pruned_at_zero_tokens" in md
    assert ari_guide["summary_metrics"]["total_runs_indexed"] >= 2
    assert ari_guide["summary_metrics"]["total_gross_recovered_usd"] > 300000.00
