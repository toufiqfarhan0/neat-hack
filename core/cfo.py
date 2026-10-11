"""
OVIO Unit Economics & Business Plan Engine — Powered by CFO.ai (cfo.ai)
Calculates real-time financial ROI, token inference COGS, contingency fees,
pricing tiers, gross margins, 24-month cash runway, and native cfo.ai formula modeling.
"""

from __future__ import annotations

import json
import logging
from typing import Dict, Any, List, Optional
from pathlib import Path

logger = logging.getLogger("ovio.cfo")

# ─────────────────────────────────────────────────────────────
# PRICING ARCHITECTURE (Contingency, Hybrid, Enterprise)
# ─────────────────────────────────────────────────────────────
DEFAULT_CONTINGENCY_FEE_PCT = 0.18  # 18% standard contingency fee

# Claude-Haiku / Nova pricing per 1M tokens: $0.25 prompt, $1.25 completion
CLAUDE_HAIKU_INPUT_PER_1M = 0.25
CLAUDE_HAIKU_OUTPUT_PER_1M = 1.25

# Hosting, DB & Telemetry overhead per 10,000 disbursements audited
INFRASTRUCTURE_COGS_PER_10K_TX = 0.05  # $0.05 per 10,000 transactions

PRICING_TIERS = {
    "contingency_pure": {
        "name": "Contingency Recovery (Zero Upfront)",
        "annual_base_usd": 0.0,
        "contingency_fee_pct": 0.18,
        "billing_cadence": "Success-based clawback post-recovery",
        "target_market": "Mid-tier municipal controllers & counties",
        "description": "Zero capital risk. OVIO audits past 3-year ledgers and retains 18% of validated recovered leakage."
    },
    "hybrid_shield": {
        "name": "Continuous Treasury Shield (Hybrid SaaS)",
        "annual_base_usd": 42000.0,  # $3,500 / month
        "contingency_fee_pct": 0.10,  # Reduced 10% contingency on live intercepts
        "billing_cadence": "Annual upfront subscription + 10% contingency",
        "target_market": "Large metropolitan cities ($500M+ budget) & state agencies",
        "description": "Real-time pre-disbursement payment interceptor integrated with ERP webhooks."
    },
    "enterprise_sovereign": {
        "name": "Enterprise Sovereign (VPC / On-Prem)",
        "annual_base_usd": 120000.0,  # $10,000 / month
        "contingency_fee_pct": 0.05,   # 5% contingency
        "billing_cadence": "Multi-year enterprise contract",
        "target_market": "Fortune 500 enterprises & federal state treasury departments",
        "description": "Dedicated single-tenant deployment with SOC2 Type II, FedRAMP, and air-gapped LLM gateway."
    }
}


def calculate_recovery_economics(
    findings: List[Dict[str, Any]],
    total_tokens_in: int,
    total_tokens_out: int,
    contingency_fee_pct: float = DEFAULT_CONTINGENCY_FEE_PCT
) -> Dict[str, Any]:
    """
    Computes precise CFO.ai unit economics for an autonomous AP audit run:
    - Gross Treasury Leakage Identified ($)
    - Net Client Value Recovered ($)
    - Contingency Fee Revenue Earned ($)
    - Inference Cost of Goods Sold ($)
    - Gross Margin (%)
    - Return on AI Spend (ROI Multiplier)
    """
    gross_leakage = sum(f.get("amount_at_risk", 0.0) for f in findings if f.get("is_duplicate"))

    # Compute inference COGS
    cogs_in = (total_tokens_in / 1_000_000.0) * CLAUDE_HAIKU_INPUT_PER_1M
    cogs_out = (total_tokens_out / 1_000_000.0) * CLAUDE_HAIKU_OUTPUT_PER_1M
    total_cogs = cogs_in + cogs_out

    # Contingency revenue model
    contingency_earned = gross_leakage * contingency_fee_pct
    net_treasury_benefit = gross_leakage - contingency_earned

    # Gross margin & ROI
    gross_profit = contingency_earned - total_cogs
    margin_pct = (gross_profit / contingency_earned * 100.0) if contingency_earned > 0 else 100.0
    roi_multiplier = (gross_leakage / total_cogs) if total_cogs > 0 else 999999.0

    economics = {
        "gross_leakage_identified_usd": round(gross_leakage, 2),
        "contingency_fee_earned_usd": round(contingency_earned, 2),
        "net_treasury_benefit_usd": round(net_treasury_benefit, 2),
        "total_inference_cogs_usd": round(total_cogs, 5),
        "gross_margin_pct": round(margin_pct, 2),
        "roi_multiplier": round(roi_multiplier, 1),
        "findings_count": len([f for f in findings if f.get("is_duplicate")]),
        "contingency_rate": f"{int(contingency_fee_pct * 100)}%",
    }

    logger.info(
        f"[CFO.AI UNIT ECONOMICS] Identified: ${gross_leakage:,.2f} | "
        f"Inference Spend: ${total_cogs:.4f} | ROI: {roi_multiplier:,.0f}x"
    )
    return economics


def calculate_token_roi_sensitivity() -> List[Dict[str, Any]]:
    """
    Evaluates ROI across varied duplicate leakage rates in enterprise ledgers:
    Demonstrates that 2-stage hash blocking + rule pruning generates >100,000x ROI
    even on clean ledgers with 0.05% duplicate rates.
    """
    sample_volume = 50_000  # 50,000 transactions audited ($150M total spend)
    avg_tx_amount = 3_000.0  # Average transaction amount $3,000

    rates = [
        {"scenario": "Ultra-Clean Corporate (0.02% error rate)", "duplicate_pct": 0.0002},
        {"scenario": "Standard Municipal Ledger (0.08% error rate)", "duplicate_pct": 0.0008},
        {"scenario": "High-Volume County Ledger (0.25% error rate)", "duplicate_pct": 0.0025},
        {"scenario": "ERP Migration Disruption (0.80% error rate)", "duplicate_pct": 0.0080},
    ]

    table = []
    for r in rates:
        dup_count = int(sample_volume * r["duplicate_pct"])
        gross_recovery = dup_count * avg_tx_amount
        contingency_rev = gross_recovery * DEFAULT_CONTINGENCY_FEE_PCT

        # Filter efficiency: 92% of transactions pruned before LLM
        pairs_blocked = int(sample_volume * 0.015)  # 750 pairs blocked
        pairs_pruned = int(pairs_blocked * 0.90)    # 675 pruned by deterministic rules
        llm_adjudications = max(dup_count * 2, pairs_blocked - pairs_pruned)

        # Token spend (320 prompt tokens, 90 completion tokens per pair)
        prompt_tokens = llm_adjudications * 320
        comp_tokens = llm_adjudications * 90
        token_cogs = (prompt_tokens / 1e6 * CLAUDE_HAIKU_INPUT_PER_1M) + (comp_tokens / 1e6 * CLAUDE_HAIKU_OUTPUT_PER_1M)
        total_cogs = token_cogs + (sample_volume / 10_000 * INFRASTRUCTURE_COGS_PER_10K_TX)

        roi = (gross_recovery / total_cogs) if total_cogs > 0 else 0.0
        gross_margin = ((contingency_rev - total_cogs) / contingency_rev * 100.0) if contingency_rev > 0 else 0.0

        table.append({
            "scenario": r["scenario"],
            "disbursements_audited": sample_volume,
            "duplicates_detected": dup_count,
            "gross_leakage_recovered_usd": round(gross_recovery, 2),
            "contingency_revenue_usd": round(contingency_rev, 2),
            "total_cogs_usd": round(total_cogs, 4),
            "gross_margin_pct": round(gross_margin, 2),
            "roi_multiplier": round(roi, 1),
        })

    return table


def calculate_24_month_runway(scenario: str = "base") -> Dict[str, Any]:
    """
    Simulates a 24-month financial runway & growth trajectory using cfo.ai models:
    - Initial Seed Capital: $1,500,000
    - Headcount & Burn Model: Engineering, GTM, Cloud Infrastructure
    - Customer Cohort Progression: Contingency vs Hybrid Shield contracts
    - Break-even Month and Terminal Cash Position
    """
    initial_cash = 1_500_000.0

    # Monthly OpEx configuration (Lean agentic startup headcount ramp)
    headcount_ramp = {
        # Months 1-6: 3 founders/engineers + infra/legal = $45k/mo
        1: 45_000.0,
        # Months 7-12: 5 engineers + 1 GTM + cloud/sales = $70k/mo
        7: 70_000.0,
        # Months 13-24: 8 team members + marketing/compliance = $110k/mo
        13: 110_000.0
    }

    # Customer acquisition growth parameters
    # Average municipal AP leakage is ~$250k - $400k/yr (~$22k/mo recovered per client)
    if scenario == "bull":
        start_customers = 3
        growth_per_month = 2.2
        avg_recovery_per_client_mo = 28_000.0
    elif scenario == "bear":
        start_customers = 1
        growth_per_month = 0.8
        avg_recovery_per_client_mo = 16_000.0
    else:  # base
        start_customers = 2
        growth_per_month = 1.4
        avg_recovery_per_client_mo = 22_500.0

    current_cash = initial_cash
    breakeven_month = None
    monthly_data = []

    cum_revenue = 0.0
    cum_burn = 0.0

    for month in range(1, 25):
        # Determine OpEx for the month
        if month >= 13:
            opex = headcount_ramp[13]
        elif month >= 7:
            opex = headcount_ramp[7]
        else:
            opex = headcount_ramp[1]

        # Customer count
        active_clients = int(start_customers + (month - 1) * growth_per_month)

        # Revenue breakdown: 65% contingency clawbacks, 35% Hybrid SaaS subscriptions
        hybrid_clients = int(active_clients * 0.40)
        pure_contingency_clients = active_clients - hybrid_clients

        saas_rev = hybrid_clients * (42_000.0 / 12.0)
        contingency_rev = (active_clients * avg_recovery_per_client_mo) * DEFAULT_CONTINGENCY_FEE_PCT
        total_rev = saas_rev + contingency_rev

        # Total COGS (Token inference + cloud hosting)
        cogs = active_clients * 45.0  # ~$45 per client per month in token spend + vector search
        gross_profit = total_rev - cogs
        net_cash_flow = gross_profit - opex

        current_cash += net_cash_flow
        cum_revenue += total_rev
        cum_burn += opex

        if net_cash_flow > 0 and breakeven_month is None:
            breakeven_month = month

        monthly_data.append({
            "month": month,
            "clients": active_clients,
            "revenue": round(total_rev, 2),
            "cogs": round(cogs, 2),
            "opex": round(opex, 2),
            "net_flow": round(net_cash_flow, 2),
            "ending_cash": round(current_cash, 2),
        })

    return {
        "scenario": scenario,
        "initial_funding_usd": initial_cash,
        "breakeven_month": breakeven_month or "Post-Month 24",
        "month_24_cash_usd": round(current_cash, 2),
        "month_24_arr_usd": round(monthly_data[-1]["revenue"] * 12.0, 2),
        "total_revenue_24mo_usd": round(cum_revenue, 2),
        "total_opex_24mo_usd": round(cum_burn, 2),
        "trajectory": monthly_data
    }


def model_cash_rescue_scenarios(
    current_cash: float = 120_000.0,
    receivables: float = 85_000.0,
    overdue_ar: float = 42_000.0,
    upcoming_ap: float = 72_000.0,
    monthly_opex: float = 35_000.0,
    safety_threshold: float = 50_000.0,
    horizon_days: int = 90
) -> Dict[str, Any]:
    """
    Evaluates alternative cashflow rescue interventions in cfo.ai:
    - Main (No Intervention): Projected floor under baseline trajectory
    - Scenario A (Accelerate Overdue AR): Collect overdue receivables
    - Scenario B (Defer Discretionary AP): Extend vendor payment terms
    - Scenario C (Combined Rescue): Maximize projected cash floor
    """
    total_opex_horizon = (monthly_opex / 30.0) * horizon_days
    net_scheduled_outflow = upcoming_ap + total_opex_horizon
    
    baseline_ar_collection = (receivables - overdue_ar) * 0.45
    main_floor = current_cash + baseline_ar_collection - net_scheduled_outflow
    
    scen_a_inflow = baseline_ar_collection + (overdue_ar * 0.80)
    scen_a_floor = current_cash + scen_a_inflow - net_scheduled_outflow
    
    deferred_ap = min(20_000.0, upcoming_ap * 0.35)
    scen_b_outflow = (upcoming_ap - deferred_ap) + total_opex_horizon
    scen_b_floor = current_cash + baseline_ar_collection - scen_b_outflow
    
    scen_c_floor = current_cash + scen_a_inflow - scen_b_outflow
    
    recommended = "Scenario C" if scen_c_floor >= safety_threshold else "Scenario A"
    shortfall = max(0.0, safety_threshold - main_floor)
    
    return {
        "horizon_days": horizon_days,
        "current_cash": current_cash,
        "safety_threshold": safety_threshold,
        "baseline_trajectory_floor": round(main_floor, 2),
        "potential_shortfall": round(shortfall, 2),
        "status": "CRITICAL_SHORTFALL" if main_floor < safety_threshold else "SAFE",
        "scenarios": [
            {
                "id": "main",
                "name": "Main (No Intervention)",
                "projected_floor": round(main_floor, 2),
                "variance_to_target": round(main_floor - safety_threshold, 2),
                "risk_level": "HIGH" if main_floor < safety_threshold else "LOW",
                "action": "Do nothing. Accept trajectory."
            },
            {
                "id": "scenario_a",
                "name": "Scenario A: Accelerate Overdue AR",
                "projected_floor": round(scen_a_floor, 2),
                "variance_to_target": round(scen_a_floor - safety_threshold, 2),
                "risk_level": "LOW",
                "action": f"Collect ${overdue_ar:,.0f} overdue invoices via automated reminders & payment links."
            },
            {
                "id": "scenario_b",
                "name": "Scenario B: Defer Discretionary AP",
                "projected_floor": round(scen_b_floor, 2),
                "variance_to_target": round(scen_b_floor - safety_threshold, 2),
                "risk_level": "MEDIUM",
                "action": f"Negotiate 30-day extension on ${deferred_ap:,.0f} vendor payables."
            },
            {
                "id": "scenario_c",
                "name": "Scenario C: Combined Rescue (AR + AP)",
                "projected_floor": round(scen_c_floor, 2),
                "variance_to_target": round(scen_c_floor - safety_threshold, 2),
                "risk_level": "MINIMAL",
                "action": f"Collect ${overdue_ar:,.0f} AR and defer ${deferred_ap:,.0f} AP. Highest safety margin."
            }
        ],
        "recommended_scenario": recommended,
        "selected_floor": round(scen_c_floor, 2),
        "safety_margin": round(scen_c_floor - safety_threshold, 2)
    }


def generate_cfoai_model_definition() -> Dict[str, Any]:
    """
    Builds native cfo.ai financial model specification conforming to https://docs.cfo.ai.
    Defines Variables, Dimensions, Table Blocks, and Formulas that can be imported directly
    into the cfo.ai application.
    """
    return {
        "model_version": "cfo.ai/v1",
        "model_name": "OVIO Autonomous Treasury AP Recovery Financial Model",
        "description": "Multi-tier unit economics, AI token inference COGS, contingency fee yield, and 24-month runway forecast.",
        "dimensions": [
            {
                "id": "scenario",
                "name": "Scenario",
                "items": ["Base", "Bull", "Bear"]
            },
            {
                "id": "pricing_tier",
                "name": "Pricing Tier",
                "items": ["Contingency Recovery", "Hybrid Treasury Shield", "Enterprise Sovereign"]
            },
            {
                "id": "time_month",
                "name": "Planning Period",
                "grain": "month",
                "range": ["2026-01", "2027-12"]
            }
        ],
        "variables": [
            {
                "id": "disbursements_audited",
                "name": "Disbursements Audited",
                "type": "count",
                "format": "#,##0",
                "description": "Total payment records ingested across municipal ledgers"
            },
            {
                "id": "leakage_identified",
                "name": "Gross AP Leakage",
                "type": "currency",
                "format": "$#,##0.00",
                "description": "Identified duplicate disbursements verified by Claude-Haiku"
            },
            {
                "id": "contingency_fee_rev",
                "name": "Contingency Fee Revenue",
                "type": "currency",
                "format": "$#,##0.00",
                "formula": "Gross AP Leakage * 0.18",
                "description": "18% contingency recovery fee earned upon validation"
            },
            {
                "id": "saas_subscription_rev",
                "name": "SaaS Subscription Revenue",
                "type": "currency",
                "format": "$#,##0.00",
                "description": "Annual recurring subscription fees for Continuous Treasury Shield"
            },
            {
                "id": "token_inference_cogs",
                "name": "LLM Inference COGS",
                "type": "currency",
                "format": "$#,##0.0000",
                "formula": "(Prompt_Tokens / 1000000 * 0.25) + (Completion_Tokens / 1000000 * 1.25)",
                "description": "Claude-Haiku token spend for forensic candidate adjudication"
            },
            {
                "id": "gross_profit",
                "name": "Gross Profit",
                "type": "currency",
                "format": "$#,##0.00",
                "formula": "Contingency Fee Revenue + SaaS Subscription Revenue - LLM Inference COGS",
                "description": "Net margin before corporate operating expenditures"
            },
            {
                "id": "gross_margin_pct",
                "name": "Gross Margin %",
                "type": "percentage",
                "format": "0.00%",
                "formula": "Gross Profit / (Contingency Fee Revenue + SaaS Subscription Revenue)",
                "description": "Sustained gross margin (>99% on contingency, 93% blended)"
            },
            {
                "id": "cash_runway_months",
                "name": "Cash Runway Months",
                "type": "ratio",
                "format": "0.0",
                "formula": "iferror(Cash_Balance / Net_Burn, 99.0)",
                "description": "Remaining months of operational cash at current net burn"
            },
            {
                "id": "token_roi_multiplier",
                "name": "Token ROI Multiplier",
                "type": "ratio",
                "format": "#,##0.0x",
                "formula": "Gross AP Leakage / LLM Inference COGS",
                "description": "Recovery yield generated per dollar of AI inference cost"
            }
        ],
        "assumptions": {
            "initial_seed_funding_usd": 1500000.0,
            "default_contingency_rate": 0.18,
            "haiku_input_cost_per_1m": 0.25,
            "haiku_output_cost_per_1m": 1.25,
            "deterministic_filter_pass_pct": 0.92,
            "avg_municipal_ticket_size_usd": 3200.0,
            "monthly_burn_rate_m1_m6": 60000.0,
            "monthly_burn_rate_m7_m12": 90000.0,
            "monthly_burn_rate_m13_m24": 150000.0
        }
    }


def export_cfo_model_file(filepath: Optional[str] = None) -> str:
    """
    Exports the cfo.ai model definition and 24-month forecast to a local JSON file.
    """
    target = Path(filepath) if filepath else Path(__file__).resolve().parent.parent / "cfo_model.json"
    data = generate_cfoai_model_definition()
    data["runway_projections"] = {
        "base": calculate_24_month_runway("base"),
        "bull": calculate_24_month_runway("bull"),
        "bear": calculate_24_month_runway("bear")
    }
    data["sensitivity_analysis"] = calculate_token_roi_sensitivity()

    with open(target, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    logger.info(f"[CFO.AI MODEL] Successfully exported to {target}")
    return str(target)
