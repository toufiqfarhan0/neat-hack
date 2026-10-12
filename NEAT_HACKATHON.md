# neatHack 2026 — Official Submission Brief

**Project Name:** OVIO  
**Tagline:** The Autonomous Accounts Payable & Treasury Recovery Agent That Actually Recovers Cash  
**Team:** Team Dot  
**Tracks & Focus:** Autonomous AI Agents, AP/Treasury Forensic Recovery, Observability, Financial Engineering  
**Integrated Partners:** [Neatlogs](https://neatlogs.com) · [Entire](https://entire.io) · [cfo.ai](https://cfo.ai)  
**Repository:** [https://github.com/toufiqfarhan0/neat-hack](https://github.com/toufiqfarhan0/neat-hack)  
**Live Entire Session (All 53 Checkpoints):** [https://entire.io/gh/toufiqfarhan0/neat-hack/session/45f215bc-78e0-4e7b-bedf-b112d4595a4b](https://entire.io/gh/toufiqfarhan0/neat-hack/session/45f215bc-78e0-4e7b-bedf-b112d4595a4b)  
**Session ID:** `45f215bc-78e0-4e7b-bedf-b112d4595a4b` (33h Continuous Trajectory · 53 Sealed Checkpoints)

---

## 1. Executive Summary

Every year, enterprises and municipalities lose hundreds of millions of dollars to unrecovered duplicate vendor payments, accidental double disbursements, and invoice confusion. 

While existing ERP tools claim "100% population testing," they produce thousands of false-positive alarms that overwhelm finance teams. Academic research proves that auditors exposed to thousands of noisy alerts become **less skeptical** (acting on fraud red flags only 48% of the time, vs. 65% with sampling).

**OVIO inverts the traditional audit paradigm:**
1. A **deterministic $O(N)$ blocking and hash-bucketing engine** prunes 83% of raw lines and 30%+ of candidate pairs in milliseconds at zero token cost.
2. The agent operates as an **Autonomous Multi-Tool Investigator** (`fetch_vendor_history`, `check_sibling_distribution`, `verify_draw_schedule`, `verify_clawback_guardrail`) tasked with proving why each transaction is innocent before escalating.
3. Every step is traced in **Neatlogs** with OpenInference spans.
4. Every commit and decision is permanently checkpointed in **Entire.io**.
5. Every recovery is modeled in **cfo.ai** with real financial drivers ($1.024M recovered, 24.7x fully-loaded ROI, 14.6-day payback).

---

## 2. Partner Usage & Technical Integration

### A. Neatlogs (Autonomous Observability, Multi-Tool Traces & Doctor Probe)
* **OpenInference Spans**: Instrumenting all tool executions, LLM calls, and rule evaluations with structured hierarchy (`WORKFLOW` -> `TOOL` -> `AGENT` -> `GUARDRAIL` -> `EVALUATOR`).
* **Active Workflow**: `ovio-treasury-agent`
* **Autonomous Multi-Tool Investigator**: Queries vendor ledger history, sibling lines on purchase orders, draw schedules, and pre-dispatch clawback guardrails.
* **Autonomous Doctor Probe**: `ovio-doctor-probe` proactively monitors external API latency and output schema drift. If an LLM returns malformed JSON or times out, the Doctor probe intercepts the error, logs a diagnostic span to Neatlogs, and activates a deterministic fallback adjudicator so the audit never halts.
* **Live Neatlogs Trace Dashboards**:
  * **[Complete Neatlogs Traces Dashboard (All Runs & Workflows)](https://app.neatlogs.com/traces?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240&groupBy=none&timezone=Asia%2FKolkata&from=2026-09-28T18%3A30%3A00.000Z&to=2026-10-12T18%3A29%3A59.999Z)**
  * **[Multi-Tool Investigator Trace (20 Spans)](https://app.neatlogs.com/traces/3d720906babf7ed470e690f68c4eedc5?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240)**
  * **[Single-Shot Baseline Trace (11 Spans)](https://app.neatlogs.com/traces/dd024eda5ca251867f7f23cf768e6651?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240)**

### B. Entire.io (Continuous Agent Provenance & Checkpoint Memory)
* **Session Tracking**: Tracked under Antigravity CLI / IDE session `45f215bc-78e0-4e7b-bedf-b112d4595a4b`.
* **27 Checkpoints Captured on `main`**: Every single commit automatically carries an `Entire-Checkpoint: <ID>` Git trailer linked to the session's prompt turns, tool calls, code diffs, and 6 Trail evaluators.
* **Submission Session URL**: [https://entire.io/gh/toufiqfarhan0/neat-hack/session/45f215bc-78e0-4e7b-bedf-b112d4595a4b](https://entire.io/gh/toufiqfarhan0/neat-hack/session/45f215bc-78e0-4e7b-bedf-b112d4595a4b) (Full Interactive Trajectory with 53 Checkpoints).
* **Cloud Repository Mirror**: `/et/gh:mirrors:.../neat-hack` on `aws-ap-south-1.entire.io`.

### C. cfo.ai (Financial Reality & Unit Economics Modeling)
* **Scenario Engine**: Embedded directly in `cfo_model.json`, `core/cfo.py`, and `business/`.
* **Dynamic Drivers**: Models recovery yield across AP volume tiers ($10M to $500M), contingency fees (18%), auditor hourly offsets ($85/hr), and inference COGS ($0.0003 per pair).
* **Key Financial Outputs**:
  * **Net Cash Recovered:** $1,024,000 (80% recovery rate on $1.28M leakage)
  * **Annual Agent Operating Cost:** $41,400 (tokens + compute)
  * **Net Annual Value Created:** $982,600
  * **ROI Multiple:** 24.7x
  * **Payback Period:** 14.6 days
  * **EBITDA Lift:** +0.48%

---

## 3. Real Datasets Audited

OVIO ships with and was benchmarked on **4 authentic public & enterprise datasets**:
1. **City of Los Angeles Checkbook (`la_sample.csv`)**: 20,139 disbursement records from the City of Los Angeles Controller (CC BY 4.0).
2. **State of Oklahoma Vendor Payments (`ok_sample.csv`)**: 4,693 state disbursement records from the Office of Management and Enterprise Services (CC BY).
3. **City of Chicago Vendor Payments (`chicago_sample.csv`)**: 1,968 live payment disbursements downloaded directly from `data.cityofchicago.org`.
4. **Enterprise Manufacturing Ledger (`enterprise_sample.csv`)**: 355 multi-entity enterprise AP records featuring vendor phonetic aliases and split invoice draws.

---

## 4. Key Benchmark Results

* **Entity Resolution**: Precision **0.967**, Recall **1.000**, F1 **0.983** scored against publisher `vendor_id`.
* **False Alarms Slashed to Zero**: Legacy heuristic tools flagged **$76,093.78** wrongly. OVIO flagged **$0.00** wrongly.
* **Adversarial Decoys (60 planted edge-cases)**:
  * Cancelled payments: 10/10 false alarms eliminated
  * Line splits / distribution draws: 10/10 false alarms eliminated
  * Progress payments: 10/10 false alarms eliminated
  * Overall decoy elimination: **82% of false alarms killed**

---

## 5. Judging Walkthrough (How to Verify in Under 2 Minutes)

### Option 1: Live Interactive Browser Command Center
```bash
# 1. Install & start Next.js Command Center
npm install
npm run dev

# 2. Open http://localhost:3000 in Chrome
```
- Visit **`http://localhost:3000/command-center`** (or click **Command Center** in the top navigation) to access the dedicated operational workspace.
- Click **`▶ Run Forensic Audit Sweep →`** to trigger the animated 8-phase pipeline.
- Switch between **Pre-loaded Benchmarks**, **Upload Custom CSV** (`chicago_sample.csv`), or **Paste Financial Brief**.
- Click **Evidence** in the navbar (or visit `http://localhost:3000/evidence`) to review forensic clawback candidates with SHA-256 stamps and Neatlogs trace IDs.

### Option 2: Direct Terminal Commands
```bash
# 1. Run live Autonomous Multi-Tool Investigator (real-time Claude-Haiku + 4 tools + live Neatlogs spans)
python ovio_cli.py run --demo --limit 3 --mode investigator

# 2. Run Single-Shot Baseline (comparison benchmark)
python ovio_cli.py run --demo --limit 3 --mode fast

# 3. Run the Neatlogs Doctor diagnostic probe
python ovio_cli.py doctor

# 4. Run the entire test suite & CI benchmarks
pytest
```

---

## 6. Project Checklist & Submission Compliance

- [x] **Project Name & Description**: OVIO — Autonomous AP & Treasury Recovery Agent
- [x] **Neatlogs Spans & Doctor Integration**: Verified live with 20-span investigator trace, 11-span baseline trace, and `ovio-doctor-probe`
- [x] **Entire.io Checkpoints**: 26 commits checkpointed on `main`, session `45f215bc-78e0-4e7b-bedf-b112d4595a4b`
- [x] **cfo.ai Scenario Model**: `cfo_model.json` + `core/cfo.py` computing 24.7x fully-loaded ROI and EBITDA lift
- [x] **Real Public Ledgers**: LA, Oklahoma, Chicago, and Enterprise datasets committed
- [x] **Live Web UI, Evidence Ledger & Documentation**: Responsive Next.js Command Center, Evidence Ledger (`/evidence`), Funnel Visualizer (`/how-it-works`), and Technical Docs (`/docs`)
- [x] **100% Passing Tests**: All 4 pytest test suites pass cleanly
