"""
Unit tests for CFO.ai (cfo.ai) Unit Economics, Business Plan & Runway Models.
"""

from pathlib import Path
from core.cfo import (
    calculate_recovery_economics,
    calculate_token_roi_sensitivity,
    calculate_24_month_runway,
    generate_cfoai_model_definition,
    export_cfo_model_file
)


def test_recovery_economics_calculation():
    mock_findings = [
        {"is_duplicate": True, "amount_at_risk": 10000.00},
        {"is_duplicate": True, "amount_at_risk": 5000.00},
        {"is_duplicate": False, "amount_at_risk": 3000.00},
    ]

    # Prompt: 1,000 tokens ($0.00025), Completion: 300 tokens ($0.000375)
    econ = calculate_recovery_economics(
        findings=mock_findings,
        total_tokens_in=1000,
        total_tokens_out=300,
        contingency_fee_pct=0.18
    )

    assert econ["gross_leakage_identified_usd"] == 15000.00
    assert econ["contingency_fee_earned_usd"] == 2700.00
    assert econ["net_treasury_benefit_usd"] == 12300.00
    assert econ["findings_count"] == 2
    assert econ["gross_margin_pct"] > 99.0
    assert econ["roi_multiplier"] > 10000.0


def test_token_roi_sensitivity_table():
    table = calculate_token_roi_sensitivity()
    assert len(table) == 4

    for row in table:
        assert row["disbursements_audited"] == 50000
        assert row["gross_leakage_recovered_usd"] > 0
        assert row["contingency_revenue_usd"] > 0
        assert row["total_cogs_usd"] > 0
        assert row["gross_margin_pct"] >= 99.0
        assert row["roi_multiplier"] > 50000.0


def test_24_month_runway_projections():
    base = calculate_24_month_runway("base")
    assert base["scenario"] == "base"
    assert base["initial_funding_usd"] == 1500000.0
    assert base["month_24_cash_usd"] > 1000000.0
    assert len(base["trajectory"]) == 24

    bull = calculate_24_month_runway("bull")
    assert bull["month_24_arr_usd"] > base["month_24_arr_usd"]

    bear = calculate_24_month_runway("bear")
    assert bear["month_24_arr_usd"] < base["month_24_arr_usd"]


def test_cfo_model_json_export(tmp_path):
    target = tmp_path / "test_cfo_model.json"
    exported_path = export_cfo_model_file(filepath=str(target))

    assert Path(exported_path).exists()
    model = generate_cfoai_model_definition()
    assert model["model_version"] == "cfo.ai/v1"
    assert len(model["variables"]) >= 6
    assert len(model["dimensions"]) >= 3
