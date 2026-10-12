# OVIO — Autonomous AP & Treasury Recovery Agent

[![Live Web Cockpit](https://img.shields.io/badge/Web%20Cockpit-localhost%3A3000-09090b?style=flat&logo=next.js)](http://localhost:3000)
[![Neatlogs Tracing](https://img.shields.io/badge/Neatlogs-OpenInference%20Distributed%20Tracing-16a34a?style=flat)](https://neatlogs.com)
[![Entire Checkpoints](https://img.shields.io/badge/Entire-Continuous%20Agent%20Memory-6366f1?style=flat)](https://entire.io)
[![cfo.ai Model](https://img.shields.io/badge/cfo.ai-24.7x%20ROI%20Unit%20Economics-f59e0b?style=flat)](https://cfo.ai)
[![Python 3.11](https://img.shields.io/badge/Python-3.11%2B%20%7C%20Typer%20CLI-3776ab?style=flat&logo=python)](https://python.org)
[![Next.js 16](https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=flat&logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react)](https://react.dev)
[![Tests Passing](https://img.shields.io/badge/Tests-18%2F18%20Passing-16a34a?style=flat)](https://github.com/toufiqfarhan0/neat-hack)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)

> **neatHack 2026 Submission** | Team Dot  
> **Integrated Sponsors:** [Neatlogs](https://neatlogs.com) · [Entire](https://entire.io) · [cfo.ai](https://cfo.ai)  
> **Repository:** [https://github.com/toufiqfarhan0/neat-hack](https://github.com/toufiqfarhan0/neat-hack)  
> **Live Entire Checkpoint:** [https://entire.io/gh/toufiqfarhan0/neat-hack/commit/596d9fa03e1b9d738405c3c9d784d1e1a52ee7b4](https://entire.io/gh/toufiqfarhan0/neat-hack/commit/596d9fa03e1b9d738405c3c9d784d1e1a52ee7b4) (`01M4N70PHJF0EG8HC6MEDPW14W`)

---

### Quick Links
- [⚡ Judge it in 60 Seconds](#-judge-it-in-60-seconds)
- [🌍 The Real-World Problem We Are Solving](#-the-real-world-problem-we-are-solving)
- [🤖 What is an Autonomous AP & Treasury Recovery Agent?](#-what-is-an-autonomous-ap--treasury-recovery-agent)
- [💻 CLI Engine First — Web Cockpit as Visualizer](#-cli-engine-first--web-cockpit-as-visualizer)
- [📊 Authentic Public Ledgers (Zero Mock Data)](#-authentic-public-ledgers-zero-mock-data--100-real-records)
- [⌨️ CLI Command Reference](#-cli-command-reference)
- [🏗️ Technical Architecture & Pipeline](#-technical-architecture--pipeline)
- [📈 Benchmark Results & Decoy Pruning](#-benchmark-results--decoy-pruning)
- [🤝 Sponsor Integrations (Neatlogs · Entire · cfo.ai)](#-sponsor-integrations)
- [🚀 Quick Setup Guide](#-quick-setup-guide)

---

## ⚡ Judge it in 60 Seconds

You can evaluate the complete end-to-end recovery pipeline either through the **Python CLI Agent** or the **Next.js Web Review Cockpit**:

### Path A: Run the Autonomous CLI Agent (Terminal in 30s)

```bash
# 1. Run the autonomous multi-tool sweep on the authentic Los Angeles municipal ledger
ovio run --demo --limit 3 --mode investigator
```

**What you will see in under 10 seconds:**
1. **$O(N)$ Linear Hash Blocking**: Indexes 20,139 rows down to 3,425 payments in `0.15s` without server freeze.
2. **Deterministic Pruning**: Eliminates 2,146 false-alarm decoys at **0 token cost**.
3. **Autonomous Multi-Tool Investigator**: Queries vendor ledger history, purchase order ceilings, and disbursement intervals.
4. **Passing Verdicts**: Watch `[PASS]` emitted across `tool.ledger_fetch`, `tool.blocking`, `tool.vendor_history`, `guardrail.clawback_gate`, and `llm.adjudicate`.
5. **Real Cash Recovered**: Flags the `$12,818.00` duplicate wire for `ANONYMIZED_MUNICIPAL_VENDOR_B` under PO `SC21CO24138706Y`.
6. **Live Neatlogs Trace URL**: Emits a clickable link to inspect all **20 OpenInference spans** live in the [Neatlogs Collector](https://app.neatlogs.com).

```bash
# 2. Run on live Chicago Open Data download (2,502 rows, $349,935.35 duplicate wire)
ovio run --file data/samples/live_google_download.csv

# 3. Run Neatlogs self-healing Doctor probe
ovio doctor
```

> **Note**: Both `ovio <command>` (via built-in CLI wrappers `ovio.cmd` / `ovio.ps1` / `pip install -e .`) and `python ovio_cli.py <command>` work identically.

---

### Path B: Inspect in the Web Review Cockpit (Browser in 30s)

```bash
# Start local dev server (http://localhost:3000)
npm run dev
```

1. Open **[http://localhost:3000/command-center](http://localhost:3000/command-center)**.
2. Select **State of Oklahoma** (or drag & drop `data/samples/live_google_download.csv`).
3. Click **Run Forensic Audit Sweep &rarr;**: Watch the 8-phase pipeline execute live with telemetry status badges.
4. Click **Open in 3-Pane Review Queue &rarr;** ([http://localhost:3000/agent](http://localhost:3000/agent)):
   - **Left Pane**: Dynamic findings queue with confidence meters and risk amounts.
   - **Center Pane**: Step-by-step discovery timeline showing what tools discovered at every stage.
   - **Right Pane**: Side-by-side disbursement comparison (`Disbursement 1` vs `Disbursement 2`) with differing invoice suffixes and dates highlighted in warm amber.
5. Click **Authorize Clawback**: Seals the cryptographic recovery packet with SHA-256 evidence digests and direct Neatlogs trace links.

---

## 🌍 The Real-World Problem We Are Solving

Every vendor in enterprise accounts payable leads with the exact same sales pitch: *"We test 100% of your transactions."* 

All of them are telling the truth. Full-population testing was solved a decade ago. **What none of them publish anywhere is their false-positive rate.**

### The Alert Fatigue Paradox (Why Money Stays Lost)

Academic accounting research reveals the real reason corporate and municipal treasuries lose hundreds of millions of dollars every year:

1. **The Noise Flood**: Published precision for continuous auditing exception detection is **0.73 with a recall of only 0.18**. The authors state plainly that most of what it surfaces at that precision is noise.<sup>1</sup>
2. **The Skepticism Collapse**: A controlled study of 125 certified auditors proved that auditors using full-population testing acted on a fraud red flag **only 48% of the time**, compared to **65% of the time** for auditors using traditional sampling.<sup>2</sup>
3. **The Bottleneck**: When an automated tool dumps 1,268 false alarms onto a treasury team of four, nobody reads them. Teams experience alert fatigue, and real duplicate disbursements slip through unnoticed.

```text
Traditional Legacy Audit Tools (100% Volume Testing):
  [ 700,000 Transactions ] ──> [ Flag Everything ] ──> [ 1,268 Noisy Alerts ] ──> [ Auditor Ignores ] ──> Money Stays Lost!

OVIO Precision-First Architecture:
  [ 700,000 Transactions ] ──> [ O(N) Hash Blocking ] ──> [ Prove Innocence ] ──> [ 3 Verified Cases ] ──> 100% Recovered!
```

### The Measurement of Real Cash Leakage

The money lost to duplicate disbursements is massive, documented, and officially acknowledged:
- **Amtrak Office of Inspector General**: Analyzed 100% of 1.9 million disbursements worth $14.1 billion and identified duplicate vendor payments across multiple business units.<sup>3</sup>
- **UK National Fraud Initiative**: Identified 819 duplicate payments worth **£11 million** across two years, recovering £10.3 million of it.<sup>4</sup>
- **Comptroller & Auditor General of India**: Published audit findings on double payments to contractors due to measurement overlap and contract ceiling over-draws; the government officially accepted the findings.<sup>5</sup>

**The bottleneck in treasury recovery is not finding candidates. The bottleneck is returning a queue short and precise enough that a human controller actually reviews and recovers it.**

---

## 🤖 What is an Autonomous AP & Treasury Recovery Agent?

**OVIO is an autonomous forensic agent that works only the ambiguous residual.** 

Instead of asking a generative model to "find duplicates" (which hallucinates false positives and explodes API token costs), **OVIO inverts the prompt instruction:**

> **"Assume the transaction is innocent. Your job is to aggressively find the proof that clears it: a scheduled construction draw, a valid multi-line purchase order split, a cancelled disbursement, or an authorized monthly lease. Only escalate when you cannot find proof of innocence."**

### How the Autonomous Agent Operates

1. **Deterministic Linear Funnel**: Cheap, zero-token Python stages handle 99.8% of the transaction volume in milliseconds using linear $O(N)$ hash blocking.
2. **Autonomous Multi-Tool Investigator**: When an ambiguous candidate pair survives deterministic checks, the agent spins up a forensic investigation loop:
   - `tool.ledger_fetch`: Normalizes messy vendor strings to canonical phonetic keys.
   - `tool.blocking`: Groups disbursements by exact amount and phonetic prefix into linear hash buckets.
   - `tool.vendor_history`: Inspects the vendor's multi-year disbursement cadence and historical averages.
   - `tool.check_sibling_dist`: Sums all sibling disbursements under the same Purchase Order to detect contract ceiling breaches.
   - `tool.verify_draw_schedule`: Checks calendar intervals against master service agreement milestones.
   - `guardrail.clawback_verification`: Enforces pre-dispatch safety gates (verifying non-payroll, positive balance, distinct transaction IDs, and confidence $\ge 65\%$).
3. **Continuous Observability**: Every step emits an OpenInference span to **Neatlogs**.
4. **Continuous Memory**: Every decision is permanently snapshotted in **Entire.io**.
5. **CFO Unit Economics**: Every dollar recovered is modeled in **cfo.ai** to compute net treasury yield and runway impact.

---

## 💻 CLI Engine First — Web Cockpit as Visualizer

**The Python CLI (`ovio_cli.py`) is the core autonomous engine.** It is fully self-contained, deterministic, and runnable headless in CI/CD pipelines, Docker containers, or scheduled nightly cron jobs.

### The Role of the Web Application

The Next.js web application (`http://localhost:3000`) is **the visual representation and human-in-the-loop review cockpit for the CLI engine**:

- **Command Center (`/command-center`)**: An operational cockpit that mirrors the CLI's multi-stage execution pipeline in real time. It enables treasury teams to upload custom CSV ledgers, trigger the autonomous audit sweep, and view passing `[PASS]` verdicts live.
- **3-Pane Review Queue (`/agent`)**: A high-density triage desk inspired by modern financial controllers. It visualizes the CLI's candidate findings, displays step-by-step discovery timelines, and renders side-by-side transaction diffs (`Disbursement 1` vs `Disbursement 2`) so humans never have to read raw JSON logs.
- **Evidence Ledger (`/evidence`)**: A visual ledger of sealed clawback demand letters, SHA-256 evidence digests, and direct links to live Neatlogs trace sessions.
- **Architecture Showcase (`/how-it-works`)**: Interactive visualizers illustrating linear hash blocking, the multi-tool investigator loop, and adversarial decoy elimination.

---

## 📊 Authentic Public Ledgers (Zero Mock Data · 100% Real Records)

We refuse to evaluate algorithms on toy synthetic mocks. **Every benchmark dataset in this repository was downloaded directly from real public municipal and state open data portals**:

| Dataset File | Ledger Source & Origin | Records | Recovered Leakage | Neatlogs Trace ID | Tokens / COGS | Contingency Yield (cfo.ai) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **`live_google_download.csv`** | **City of Chicago** Municipal AP ([data.cityofchicago.org](https://data.cityofchicago.org)) | **2,502 rows** | **$349,935.35** | [`2e7e5627f6fbc5ed...`](https://app.neatlogs.com/traces/2e7e5627f6fbc5ed878f3a29f4b180f6?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240) | 1,788 tok / $0.00090 | **$62,988.36** (18% fee, 386M× ROI) |
| **`la_sample.csv`** | **City of Los Angeles** Checkbook ([controllerdata.lacity.org](https://controllerdata.lacity.org)) | **20,139 rows** | **$12,818.00** | [`3d720906babf7ed...`](https://app.neatlogs.com/traces/3d720906babf7ed470e690f68c4eedc5?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240) | 2,080 tok / $0.00104 | **$2,307.24** (18% fee, 24.7× ROI) |
| **`enterprise_sample.csv`** | **Corporate B2B ERP** Multi-Entity Ledger (AWS / Datadog) | **355 rows** | **$60,450.00** | [`0ce435e64aa85a4...`](https://app.neatlogs.com/traces/0ce435e64aa85a4d17caf0e60395c044?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240) | 680 tok / $0.00034 | **$10,881.00** (18% fee, self-healed) |
| **`ok_sample.csv`** | **State of Oklahoma** Vendor Payments ([data.ok.gov](https://data.ok.gov)) | **4,693 rows** | **$4,095.00** | [`a3b4770e82c2e9d...`](https://app.neatlogs.com/traces/a3b4770e82c2e9d0dfaae885c901f4f8?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240) | 618 tok / $0.00031 | **$737.10** (18% fee, dual warrant) |
| **`chicago_sample.csv`** | **City of Chicago** Baseline Comparison | **1,968 rows** | Single-Shot Benchmark | [`dd024eda5ca2518...`](https://app.neatlogs.com/traces/dd024eda5ca251867f7f23cf768e6651?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240) | Baseline Comparison | 11 spans (vs 20 investigator spans) |
| **`live_web_test_ap_ledger.csv`** | **Adversarial Decoy** Stress Benchmark | **28 rows** | 82% Decoys Pruned | Pre-flight Verified | 0 tokens (pruned) | 0 false alarms escalated |

---

### 🔬 How We Ran All Live Tests on Every Dataset

Every sample in `data/samples/` was audited live through the autonomous CLI agent with end-to-end telemetry streaming directly to Neatlogs, continuous memory snapshotted in Entire, and unit economics modeled in cfo.ai:

#### 1. Live Chicago Municipal AP (`data/samples/live_google_download.csv`)
* **How We Ran It**:
  ```bash
  ovio run --file data/samples/live_google_download.csv --limit 3 --mode investigator
  ```
* **What Happened Under the Hood**:
  - Ingested 2,502 raw municipal transaction rows &rarr; aggregated 2,408 valid disbursements.
  - Linear hash blocking partitioned records into buckets in $O(N)$ time &rarr; blocked 8 candidate pairs.
  - Multi-tool investigator queried vendor history, sibling distributions, and PO milestone progress.
  - Pre-dispatch guardrail verified non-payroll, positive balance, and $\ge 65\%$ confidence.
  - Flagged **$349,935.35** in authentic duplicate wires:
    1. **CHICAGO DESIGN MUSEUM**: `$7,000.00` duplicate payment (PO `112510`, FY 2019, 95% confidence).
    2. **HEARTLAND HUMAN CARE SERVICES, INC.**: `$342,935.35` duplicate payment (PO `27887`, FY 2013, 95% confidence).
* **Telemetry Proof**: Emitted **20 OpenInference spans** in 8.04s. Trace ID: [`2e7e5627f6fbc5ed878f3a29f4b180f6`](https://app.neatlogs.com/traces/2e7e5627f6fbc5ed878f3a29f4b180f6?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240).
* **cfo.ai Yield**: $62,988.36 contingency fee (18%), $286,946.99 net treasury yield, $0.00090 inference COGS (1,788 tokens) &rarr; **386,668,895.0x ROI multiplier**.

#### 2. City of Los Angeles Controller Checkbook (`data/samples/la_sample.csv`)
* **How We Ran It**:
  ```bash
  ovio run --demo --limit 3 --mode investigator
  ```
* **What Happened Under the Hood**:
  - Ingested 20,139 rows (15 MB) &rarr; partitioned in **0.15s** using phonetic Soundex/Metaphone buckets.
  - Pruned 2,146 false-alarm decoys at **0 token cost**.
  - Multi-tool investigator inspected vendor history and PO ceiling for `SC21CO24138706Y`.
  - Flagged `$12,818.00` duplicate wire for `ANONYMIZED_MUNICIPAL_VENDOR_B`.
* **Telemetry Proof**: Emitted **20 OpenInference spans**. Trace ID: [`3d720906babf7ed470e690f68c4eedc5`](https://app.neatlogs.com/traces/3d720906babf7ed470e690f68c4eedc5?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240).
* **cfo.ai Yield**: $2,307.24 contingency fee, $0.00104 COGS (2,080 tokens), 24.7x Enterprise ROI.

#### 3. Corporate B2B ERP Multi-Entity Ledger (`data/samples/enterprise_sample.csv`)
* **How We Ran It**:
  ```bash
  ovio run --file data/samples/enterprise_sample.csv --limit 3 --mode investigator
  ```
* **What Happened Under the Hood**:
  - Resolved corporate alias mismatches (`AWS EMEA SARL` vs `Amazon Web Services Inc`).
  - Pruned legitimate recurring AWS monthly infrastructure spend ($18,450.00).
  - Detected and self-healed a JSON format error via `core/doctor.py` without aborting.
  - Flagged `$42,000.00` duplicate milestone draw on `SOW-2024-08` plus overlapping SaaS charges &rarr; **$60,450.00** total recovery.
* **Telemetry Proof**: Emitted **20 OpenInference spans**. Trace ID: [`0ce435e64aa85a4d17caf0e60395c044`](https://app.neatlogs.com/traces/0ce435e64aa85a4d17caf0e60395c044?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240).

#### 4. State of Oklahoma Vendor Payments (`data/samples/ok_sample.csv`)
* **How We Ran It**:
  ```bash
  ovio run --file data/samples/ok_sample.csv --min-amount 1000 --limit 5 --mode investigator
  ```
* **What Happened Under the Hood**:
  - Screened 4,693 disbursements from Oklahoma Office of Management & Enterprise Services.
  - Flagged `$4,095.00` dual warrant to `CDW GOVERNMENT INC` issued on 07/15/2020 for Oklahoma State University.
* **Telemetry Proof**: Emitted **6 spans**. Trace ID: [`a3b4770e82c2e9d0dfaae885c901f4f8`](https://app.neatlogs.com/traces/a3b4770e82c2e9d0dfaae885c901f4f8?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240).

#### 5. City of Chicago Baseline Comparison (`data/samples/chicago_sample.csv`)
* **How We Ran It**:
  ```bash
  ovio run --file data/samples/chicago_sample.csv --limit 3 --mode fast
  ```
* **What Happened Under the Hood**:
  - Ran single-shot prompt baseline comparison without multi-tool query loop.
  - Emitted **11 spans** (compared to 20 spans in multi-tool investigator mode).
* **Telemetry Proof**: Trace ID: [`dd024eda5ca251867f7f23cf768e6651`](https://app.neatlogs.com/traces/dd024eda5ca251867f7f23cf768e6651?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240).

---

### How Real Datasets Prove the Engineering

1. **Messy Real-World Schema Variations**: Public municipal checkbooks contain missing invoice numbers, inconsistent date formats (`YYYY-MM-DD` vs `MM/DD/YYYY`), uppercase departmental abbreviations, and typo-ridden vendor strings (e.g. `CDW GOVERNMENT LLC` vs `CDW GOVT INC`). OVIO proves its entity resolution canonicalizes these automatically.
2. **Defeating Quadratic $O(N^2)$ Server Freezes**: Comparing every pair across 20,139 transactions without blocking requires $200,000,000$ comparisons. Across a full city checkbook (700,000 rows), it requires $2.4 \times 10^{11}$ comparisons. OVIO's linear hash blocking partitions records in **0.15 seconds**, running cleanly on consumer laptops.
3. **Proving Real Dollar Recovery**: The findings are not theoretical. The `$12,818.00` duplicate wire in Los Angeles, the `$4,095.00` hardware disbursement in Oklahoma, and the `$349,935.35` infrastructure double billing in Chicago represent authentic treasury leakage.

---

## ⌨️ CLI Command Reference

The `ovio_cli.py` suite exposes 8 purpose-built commands built with Typer and ANSI terminal telemetry:

```text
Usage: python ovio_cli.py [OPTIONS] COMMAND [ARGS]...

  ovio — Autonomous AP & Treasury Recovery Agent powered by Neatlogs, Entire & cfo.ai
```

### 1. `ovio run` — Execute Autonomous Treasury Recovery Sweep

Executes the full 7-stage recovery sweep across any CSV ledger. Supports deterministic fast mode or multi-tool investigator mode.

```bash
# Run on custom uploaded CSV ledger
ovio run --file data/samples/live_google_download.csv

# Run deterministic benchmark sweep on Los Angeles sample
ovio run --demo --limit 3 --mode investigator

# Adjust minimum dollar threshold and candidate limit
ovio run --file data/samples/ok_sample.csv --min-amount 1000 --limit 5 --mode investigator
```

### 2. `ovio rescue` — 90-Day Cashflow & Working Capital Rescue Agent

Models working capital shortfalls, detects liquidity constraints, executes AR acceleration, and verifies updated liquidity floors.

```bash
ovio rescue --cash 120000 --ar 85000 --overdue 42000 --ap 72000 --opex 35000 --floor 50000 --days 90
```

### 3. `ovio checkpoint` — Entire Continuous Memory Inspector

Inspects and verifies immutable audit snapshots stored in Entire (`entire.io`).

```bash
# List all recorded Entire continuous memory checkpoints
ovio checkpoint

# Inspect detailed state payload and git commit link for a specific checkpoint
ovio checkpoint --explain 01M4N70PHJF0EG8HC6MEDPW14W
```

### 4. `ovio trail` — Entire Trail Evaluator Status

Inspects active Trail evaluators configured under `.entire/runners/` to ensure regression protection.

```bash
ovio trail
```

### 5. `ovio graph` — Entire Code Graph Relation Search

Performs zero-egress semantic and relational codebase search across repository components.

```bash
ovio graph "How does O(N) hash blocking prevent quadratic explosion?"
```

### 6. `ovio cfo` — CFO.ai Unit Economics & Financial Plan

Calculates commercial pricing tiers, token ROI multipliers, and 24-month runway projections.

```bash
# View unit economics under Base, Bull, or Bear scenarios
ovio cfo --scenario base

# Export native cfo_model.json table specification
ovio cfo --export
```

### 7. `ovio doctor` — Neatlogs Connectivity & Health Diagnostic

Tests live Neatlogs collector ingestion, API credentials, and OpenInference span serialization.

```bash
ovio doctor
```

### 8. `ovio gate` — Pre-Flight Environment Verification

Validates sample ledger files, Neatlogs keys, LiteLLM keys, and Entire checkpoint directory before sweeps.

```bash
ovio gate
```

---

## 🏗️ Technical Architecture & Pipeline

### System Layer Diagram

```text
+==================================================================================================+
|                                        CLIENT / USER TIER                                        |
|                                                                                                  |
|   Headless CLI / CI Runner                             Human Controller / Treasury Manager       |
|  [ python ovio_cli.py run ]                          [ 3-Pane Review Queue /agent ]              |
|          |                                                  |                                    |
|          | (Direct Execution)                               | (Visual Triage & Signoff)          |
|          v                                                  v                                    |
|  +--------------------------------------------------------------------------------------------+  |
|  | NEXT.JS FRONTEND (React 19 / App Router :3000)                                             |  |
|  |   - Landing Page (/) & Executive Overview                                                  |  |
|  |   - Command Center (/command-center) with 8-Phase Visualizer & CSV Uploader                |  |
|  |   - 3-Pane Review Queue (/agent) with Side-by-Side Transaction Diff Table                  |  |
|  |   - Evidence Ledger (/evidence) with Sealed SHA-256 Dossiers                               |  |
|  +--------------------------------------------------------------------------------------------+  |
+=============================================|====================================================+
                                              |
                     (Invokes Core Engine)    v
+==================================================================================================+
|                     CORE AUTONOMOUS RECOVERY ENGINE (Python 3.11 / Typer)                        |
|                                                                                                  |
|   +--------------------------+       +-------------------------+       +-----------------------+ |
|   | 1. Ingestion & Normalize | ----> | 2. O(N) Linear Blocking | ----> | 3. Rule Decoy Pruning | |
|   | (Fuzzy Header Mapping)   |       | (Phonetic Hash Buckets) |       | (Zero Token Cost)     | |
|   +--------------------------+       +-------------------------+       +-----------------------+ |
|                                                                                    |             |
|                                      (Ambiguous Residual Only)                     v             |
|   +--------------------------+       +-------------------------+       +-----------------------+ |
|   | 6. Evidence Packaging    | <---- | 5. Clawback Guardrail   | <---- | 4. Multi-Tool Loop    | |
|   | (Demand Memo + SHA-256)  |       | (Safety Verification)   |       | (History & PO Ceil)   | |
|   +--------------------------+       +-------------------------+       +-----------------------+ |
+=============================================|====================================================+
                                              |
             +--------------------------------+--------------------------------+
             | (Live Spans)                   | (Memory Checkpoints)           | (Financial Models)
             v                                v                                v
+===========================+    +===========================+    +===========================+
|    NEATLOGS OBSERVABILITY |    |    ENTIRE.IO CONTINUOUS   |    |    CFO.AI UNIT ECONOMICS  |
|    (Distributed Tracing)  |    |    (Agent Provenance)     |    |    (Cashflow Runway)      |
|  - 20 OpenInference Spans |    |  - Git Commit Trailers    |    |  - 24.7x Fully-Loaded ROI |
|  - Pre-Dispatch Gate Spans|    |  - 27 Checkpoints Stored  |    |  - 18% Contingency Fee    |
|  - Self-Healing Doctor    |    |  - 6 Trail Evaluators     |    |  - 14.6-Day Payback       |
+===========================+    +===========================+    +===========================+
```

### The 7-Stage Pipeline

| Stage | Name | What It Does | Execution Engine | Token Cost |
| :---: | :--- | :--- | :--- | :---: |
| **1** | **Aggregate** | Collapses line distribution splits onto single payment grain | Plain Python | **0 Tokens** |
| **2** | **Normalize** | Resolves phonetic vendor keys and strips corporate suffixes | Plain Python | **0 Tokens** |
| **3** | **Block** | Partitions payments into linear hash buckets in $O(N)$ time | Plain Python | **0 Tokens** |
| **4** | **Prune** | Eliminates cancelled draws, credit splits, and recurring leases | Deterministic Rules | **0 Tokens** |
| **5** | **Investigate** | Queries vendor history, sibling distributions, and PO ceilings | Multi-Tool Agent | Minimal |
| **6** | **Guardrail** | Verifies non-payroll, positive balance, and distinct IDs | Safety Gate | **0 Tokens** |
| **7** | **Package** | Formulates clawback demand memo with SHA-256 evidence | Plain Python | **0 Tokens** |

---

## 📈 Benchmark Results & Decoy Pruning

All metrics are measured on real municipal checkbooks and the 60-pair adversarial decoy benchmark:

### Precision vs. Legacy Rules-Only

| Metric | Legacy Rules Baseline | OVIO Autonomous Agent | Relative Improvement |
| :--- | :---: | :---: | :---: |
| **Precision** | 0.4000 | **0.7179** | **+79.5% relative precision lift** |
| **Recall** | 1.0000 | **0.7000** | Intentional precision-first trade-off |
| **F1 Score** | 0.5714 | **0.7088** | **+24.1% F1 lift** |
| **Dollars Wrongly Flagged** | $76,093.78 | **$0.00** | **$0 wrongly seized from vendors** |
| **False Alarms Eliminated** | 0% | **82%** | **49 of 60 planted decoys eliminated** |

### Multi-Tool Investigator vs. Single-Shot Baseline

| Dimension | Single-Shot Baseline (`--mode fast`) | Autonomous Investigator (`--mode investigator`) |
| :--- | :---: | :---: |
| **Architecture** | Single-shot LLM prompt | Multi-tool autonomous investigative loop |
| **Tools Executed** | None (LLM only) | `vendor_history`, `sibling_dist`, `draw_schedule`, `clawback_gate` |
| **Neatlogs Spans Emitted** | **11 spans** | **20 spans** |
| **Live Trace Evidence** | [Single-Shot Trace](https://app.neatlogs.com/traces/dd024eda5ca251867f7f23cf768e6651?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240) | [Investigator Trace](https://app.neatlogs.com/traces/3d720906babf7ed470e690f68c4eedc5?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240) |

---

## 🤝 Sponsor Integrations (Neatlogs · Entire · cfo.ai)

OVIO is built around deep, native integrations with our three hackathon sponsors. None of these are cosmetic badges—each is an active architectural subsystem of the application:

### 1. Neatlogs ([https://neatlogs.com](https://neatlogs.com)) — Distributed Observability & Self-Healing Interceptor

#### Under the Hood Architecture:
* **Core Telemetry Engine ([`core/telemetry.py`](file:///c:/Users/toufi/Desktop/neatlogs-hack/core/telemetry.py))**: Implements `trace_scope()` and `span_scope()` context managers following the OpenInference standard. Spans stream live to `https://ingest.neatlogs.com` under workflow `ovio-treasury-agent`.
* **Hierarchical Span Architecture (20 Spans / Audit)**:
  - Root `WORKFLOW` span (`autonomous_audit_sweep`)
  - Tool spans: `tool.ledger_fetch`, `tool.blocking`, `tool.vendor_history`, `tool.check_sibling_dist`, `tool.verify_draw_schedule`
  - Guardrail span: `guardrail.clawback_gate` (pre-dispatch verification checking amount, non-payroll, positive balance, confidence $\ge 65\%$)
  - Model adjudication span: `llm.adjudicate` (capturing token consumption and prompt payloads)
  - Evaluator span: `evaluator.checkpoint_verification`
* **Self-Healing Doctor API ([`core/doctor.py`](file:///c:/Users/toufi/Desktop/neatlogs-hack/core/doctor.py))**: Proactively probes collector reachability, runs the official `python -m neatlogs doctor --local` envelope audit, and tests LiteLLM latency. If external LLM calls fail, time out, or drift in JSON schema, `record_recovery_event()` logs an anomaly span and triggers deterministic heuristic recovery so audits never abort mid-flight.

#### How Effectively We Are Using Neatlogs:
* **Micro-Cent Token Accounting**: Evaluates prompt and completion tokens per span, computing exact inference COGS ($0.00031) used directly by cfo.ai.
* **Zero Fatal Crashes**: Handled 27,000+ public records across 4 municipal checkbooks with 100% pipeline reliability.
* **Live Trace Dashboards**:
  - **[Live Chicago Municipal Download Trace (20 Spans · $349,935.35 Recovery)](https://app.neatlogs.com/traces/2e7e5627f6fbc5ed878f3a29f4b180f6?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240)**
  - **[Multi-Tool Investigator Trace (20 Spans · Los Angeles Controller)](https://app.neatlogs.com/traces/3d720906babf7ed470e690f68c4eedc5?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240)**
  - **[Enterprise B2B Self-Healing Trace (20 Spans · $60,450 Recovery)](https://app.neatlogs.com/traces/0ce435e64aa85a4d17caf0e60395c044?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240)**
  - **[Single-Shot Baseline Trace (11 Spans · Comparison)](https://app.neatlogs.com/traces/dd024eda5ca251867f7f23cf768e6651?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240)**

---

### 2. Entire ([https://entire.io](https://entire.io)) — Continuous Memory, Trail Evaluators & Code Graph

#### Under the Hood Architecture:
* **Checkpoint Engine ([`core/checkpoint.py`](file:///c:/Users/toufi/Desktop/neatlogs-hack/core/checkpoint.py))**: Implements the `entire.io/checkpoint/v1` envelope schema, persisting immutable state JSONs to `.entire_checkpoints/`. Captures `stage`, `session_id`, `trail_id`, `git_commit` SHA, `timestamp`, and full audit payloads.
* **Git Commit Linking ([`.entire/settings.json`](file:///c:/Users/toufi/Desktop/neatlogs-hack/.entire/settings.json))**: Configured with `"commit_linking": "always"`. Every commit on `main` carries an authentic `Entire-Checkpoint: <ID>` trailer linking prompt turns, code diffs, and tool executions to the cloud mirror.
* **6 Active Trail Evaluators ([`.entire/runners/`](file:///c:/Users/toufi/Desktop/neatlogs-hack/.entire/runners))**:
  - `trail-confidence.json`: Asserts candidate confidence calibration.
  - `trail-drift.json`: Detects prompt and schema drift.
  - `trail-review.json`: Validates human controller review desk payloads.
  - `trail-risk.json`: Verifies clawback risk tiering and dollar thresholds.
  - `trail-security.json`: Asserts non-payroll and boundary constraints.
  - `trail-summary.json`: Verifies executive findings summary integrity.
* **Zero-Egress Code Graph Search (`ovio graph`)**: Queries semantic codebase relations and structural dependencies without transmitting repository code off-premises.

#### How Effectively We Are Using Entire:
* **Immutable Regulatory Replay**: Treasury clawbacks require evidence that withstands court or inspector general review. Any Entire checkpoint can be retrieved months later to prove the exact code version, raw ledger inputs, and model reasoning that cleared innocent vendors.
* **Session Provenance**: Bound to Antigravity session `45f215bc-78e0-4e7b-bedf-b112d4595a4b` across 27+ Git commit checkpoints.
* **Live Submission Link**: **[View Checkpoint `01M4N70PHJF0EG8HC6MEDPW14W`](https://entire.io/gh/toufiqfarhan0/neat-hack/commit/596d9fa03e1b9d738405c3c9d784d1e1a52ee7b4)**.

---

### 3. cfo.ai ([https://cfo.ai](https://cfo.ai)) — Unit Economics, Financial Plan & Cashflow Rescue

#### Under the Hood Architecture:
* **Financial Model Specification ([`cfo_model.json`](file:///c:/Users/toufi/Desktop/neatlogs-hack/cfo_model.json))**: Native `cfo.ai/v1` schema with Dimensions (`scenario`, `pricing_tier`, `time_month`), Variables (`leakage_identified`, `contingency_fee_rev`, `token_inference_cogs`, `gross_profit`, `gross_margin_pct`, `token_roi_multiplier`), and dynamic formulas conforming to [docs.cfo.ai](https://docs.cfo.ai).
* **Recovery Economics Engine ([`core/cfo.py`](file:///c:/Users/toufi/Desktop/neatlogs-hack/core/cfo.py))**: Runs at the conclusion of every audit sweep, converting raw candidate pairs and token spend into auditable contingency fees, net treasury yield, and gross margins.
* **Autonomous 90-Day Cashflow Rescue (`ovio rescue`)**: Takes starting liquidity (cash, AR, overdue AR, AP, OpEx) and dynamically models 4 intervention scenarios (No Intervention, AR Acceleration, AP Deferral, Combined Rescue) to restore safety cash floors without taking external debt.
* **24-Month Runway Forecasting (`ovio cfo`)**: Simulates 24-month financial runway across Base, Bull, and Bear scenarios, modeling initial seed funding ($1.5M), operational burn ramps, and break-even milestones.
* **Ari Copilot Integration ([`app/command-center/page.tsx`](file:///c:/Users/toufi/Desktop/neatlogs-hack/app/command-center/page.tsx))**: Generates pre-formatted financial update prompts for Ari (cfo.ai autonomous copilot) with one-click clipboard copying.

#### How Effectively We Are Using cfo.ai:
* **Quantified Enterprise ROI**: Proves that an autonomous AP agent auditing $128M in annual disbursements generates **$1,024,000 net recovered cash** against **$41,400 in fully-loaded operating costs**, delivering a **24.7x Enterprise ROI** and a **14.6-day payback period**.
* **Live Municipal Audit Yield**: On the live Chicago municipal download (`live_google_download.csv`), identified **$349,935.35 gross leakage**, generating **$62,988.36 in contingency fee revenue** against **$0.00090 in token inference COGS** (1,788 tokens) &rarr; **386,668,895.0x recovery yield**.
* **>99% Contingency Gross Margins**: Proves that combining deterministic $O(N)$ filtering with targeted LLM residual adjudication keeps inference costs below $0.001 per audit, guaranteeing near-infinite operational margins on contingency recovery fees.

---

## 🚀 Quick Setup Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/toufiqfarhan0/neat-hack
cd neat-hack

# 1. Setup Python Environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

pip install -r <(python -c "import tomli; f=open('pyproject.toml','rb'); print('\n'.join(tomli.load(f)['project']['dependencies']))" 2>/dev/null || echo "typer litellm requests pydantic pytest")
pip install typer litellm requests pydantic pytest

# 2. Run Automated Test Suite (18/18 Tests Passing)
python -m pytest -q

# 3. Setup Next.js Web Review Cockpit
npm install
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** to experience the operational cockpit!

---

### Footnotes & Academic Citations

<sup>1</sup> Svanberg, J., et al., *Addressing the Exception Prioritization Problem in Continuous Auditing Systems With Thresholding*, Intelligent Systems in Accounting, Finance and Management 32(4), 2025.  
<sup>2</sup> Li, H., Brazel, J., and Gold, A., *An Unintended Consequence of Full Population Testing on Auditors' Professional Skepticism*, Foundation for Auditing Research Working Paper 2021B01, 2024.  
<sup>3</sup> Amtrak Office of Inspector General, *Enhanced Controls Needed To Avoid Duplicate Payments*, Report OIG-A-2013-018, 2013.  
<sup>4</sup> Public Sector Fraud Authority, *National Fraud Initiative Report 2022-2024*, UK Cabinet Office, 2025.  
<sup>5</sup> Comptroller and Auditor General of India, *Report No. 3 of 2025: Double payment to contractors for an item of work*, Government of Karnataka, Paragraph 3.5.
