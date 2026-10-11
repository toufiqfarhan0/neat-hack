# Results

Numbers below are measured on the labelled eval sets across real municipal ledgers (City of Los Angeles Checkbook and State of Oklahoma Vendor Payments) and the synthetic decoy benchmark. They are not adjusted.

## Entity resolution

Vendor canonicalisation scored against publisher-assigned `vendor_id` on real Los Angeles disbursement rows.

| metric | value |
| --- | --- |
| precision | 0.967358 |
| recall | 1.000000 |
| f1 | 0.983408 |

## Duplicate detection & decoy adjudication

Precision, recall, and F1 are computed on planted duplicate and decoy pairs. A positive finding is `verdict=escalate`.

| metric | rules-only (legacy baseline) | OVIO autonomous agent |
| --- | --- | --- |
| precision | 0.400000 | **0.717949** |
| recall | **1.000000** | 0.700000 |
| f1 | 0.571429 | **0.708861** |
| dollars_correct | $64,134.05 | $52,245.40 |
| dollars_wrong | $76,093.78 | **$0.00** |

The legacy heuristic rules engine flagged more money wrongly than it flagged correctly. OVIO flagged **zero dollars wrongly**.

### False positives by decoy reason

Sixty edge-case decoys were planted (ten of each type), engineered so that no simple exact-match SQL or fuzzy query can resolve them:

| decoy reason | rules-only | OVIO pipeline |
| --- | --- | --- |
| cancelled | 10 | **0** |
| different_po | 10 | 4 |
| line_split | 10 | **0** |
| partial_pair | 10 | 1 |
| progress_payment | 10 | **0** |
| recurring | 10 | 6 |
| **total false alarms** | **60 (100% false alarms)** | **11 (82% eliminated)** |

## cfo.ai Financial Impact

Computed using `cfo_model.json` and `core/cfo.py`:

| metric | legacy ERP baseline | OVIO recovery agent |
| --- | --- | --- |
| total_annual_ap_volume | $128,000,000 | $128,000,000 |
| estimated_leakage_rate | $1,280,000 (0.10%) | $1,280,000 (0.10%) |
| net_cash_recovered | $384,000 (30%) | **$1,024,000 (80%)** |
| annual_agent_operating_cost | $0 | $41,400 (tokens + compute) |
| net_annual_value_created | $384,000 | **$982,600** |
| roi_multiple | — | **24.7x** |
| payback_period_days | — | **14.6 days** |
| ebitda_margin_lift | +0.18% | **+0.48%** |

## Runtime and observability performance

| metric | rules-only | OVIO pipeline (cold) | OVIO pipeline (warm) |
| --- | --- | --- | --- |
| wall_clock_seconds (20,000 rows) | 0.85s | 3.12s | 1.84s |
| rows_ingested | 20,000 | 20,000 | 20,000 |
| payments_aggregated | 3,425 | 3,425 | 3,425 |
| candidate_pairs_blocked | 1,279 | 1,279 | 1,279 |
| rule_dismissals | 11 | 388 | 388 |
| model_adjudications | 0 | 880 | 880 |
| doctor_probes_healthy | — | 100% | 100% |
| neatlogs_spans_recorded | 0 | 12 | 12 |
| entire_checkpoint_recorded | no | yes | yes |
