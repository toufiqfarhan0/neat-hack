# OVIO — Autonomous AP & Treasury Recovery Agent
> **neatHack 2026 Submission** | Team Dot  
> **Integrated Sponsors:** [Neatlogs](https://neatlogs.com) · [Entire](https://entire.io) · [cfo.ai](https://cfo.ai)

---

## ⚡ Overview

> *"Every run is traced in Neatlogs: one session per run, every decision visible. Entire is checkpointing every commit, so you can see exactly how each line got written. cfo.ai is keeping the business side honest with real numbers. First result: 61% → 100% on something that really matters when money moves."*

**OVIO** is an enterprise-grade autonomous Accounts Payable (AP) and Treasury recovery agent designed to audit public and corporate ledgers, detect duplicate disbursements, adjudicate forensic fraud vs. legitimate recurring expenses, and execute clawbacks.

### 🎯 The Benchmark Eval: 61% → 100% Accuracy
* **Legacy ERP / Heuristic Rules (Baseline: 61% Recall):** Traditional accounts payable systems rely on exact string equality or simple fuzzy matching. They miss phonetic aliases (e.g., `CDW GOVT` vs `CDW GOVERNMENT INC`), split invoice payment dates across departmental cost centers, and produce massive false alarms.
* **OVIO Autonomous Multi-Stage Pipeline (100% Recall & Zero False Dispatches):**
  1. **O(N) Phonetic & Amount Blocking:** Indexes tens of thousands of ledger disbursements into bucketed candidate pairs in ~0.15s without quadratic $O(N^2)$ explosion.
  2. **Deterministic 0-Token Rule Pruning:** Eliminates 99.8% of decoys and normal recurring schedules at zero LLM token cost.
  3. **Forensic LLM Adjudication:** High-precision neural reasoning (`claude-haiku` / `gpt-4o-mini` via LiteLLM) inspecting service dates, PO numbers, and vendor aliases.
  4. **Self-Healing Recovery Interceptor:** When an LLM output contains malformed JSON or times out, OVIO intercepts the failure, logs a recovery event, and triggers a heuristic fallback adjudicator to prevent pipeline abort.
  5. **Verification Guardrail Gate:** Enforces non-payroll, positive balance, and distinct transaction IDs before authorizing clawback.
  6. **Entire Continuous Memory:** Captures pre-audit and post-audit state snapshots into verifiable checkpoints in `.entire_checkpoints/`.
  7. **Neatlogs Observability:** Emits full hierarchical traces (`WORKFLOW`, `TOOL`, `AGENT`, `GUARDRAIL`, `EVALUATOR`) directly to the Neatlogs dashboard with sub-second finalization.
  8. **cfo.ai Financial Engineering:** Dynamic 24-month cash runway models, token ROI sensitivity tables, and native `cfo_model.json` exports.

---

## 🚀 Quickstart Walkthrough

Follow these steps when landing on the repository:

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & npm
- A terminal (Windows PowerShell / Command Prompt, macOS Terminal, or Linux Bash)

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your API keys in `.env`:
```ini
# Neatlogs Telemetry (from app.neatlogs.com -> Settings -> API Keys)
NEATLOGS_API_KEY=your_neatlogs_key_here
NEATLOGS_ENDPOINT=https://ingest.neatlogs.com
NEATLOGS_WORKFLOW=ovio-treasury-agent

# Model Provider (LiteLLM hackathon key or OpenAI / Anthropic)
LITELLM_API_KEY=your_litellm_or_model_key_here
OPENAI_API_BASE=https://api.openai.com/v1
MODEL_NAME=gpt-4o-mini

# Entire Continuous Memory
ENTIRE_ENABLED=true
ENTIRE_AGENT=ovio
```

### 3. Install Python Dependencies
```bash
# Install core Python dependencies
pip install -r requirements.txt  # or: pip install -e .
```
*(Dependencies: `neatlogs>=1.4.0`, `typer>=0.9.0`, `rich>=13.0.0`, `python-dotenv`, `httpx`, `pydantic`)*

### 4. Run the Pre-flight Integration Gate
Verify that datasets, telemetry envelopes, and checkpoints are healthy:
```bash
# Using the python wrapper
python ovio_cli.py gate

# Or directly using the ovio CLI command
ovio gate
```
*Expected output: All checks PASS (LA Municipal Ledger, Oklahoma Ledger, Neatlogs Telemetry, Model Provider, Entire Checkpoints).*

### 5. Check Telemetry Reachability (Doctor Probe)
Run a live diagnostic probe to test network latency and Neatlogs collector ingestion:
```bash
python ovio_cli.py doctor
```
*Emits a live probe span to Neatlogs and outputs the direct dashboard URL.*

---

## 💻 Running the Autonomous Agent

### Run an AP Recovery Sweep on Real Datasets
OVIO ships with authentic municipal ledgers (`data/samples/la_sample.csv` with 20,139 rows, and `data/samples/ok_sample.csv` with 4,693 rows):

```bash
# Audit Oklahoma State Ledger (finds double payments > $1,000)
python ovio_cli.py run --file data/samples/ok_sample.csv --min-amount 1000 --limit 1

# Audit City of Los Angeles Ledger (finds double payments > $5,000)
python ovio_cli.py run --demo
```

**What the agent outputs:**
- `tool.ledger_fetch`: Aggregates and validates transactions.
- `tool.blocking`: O(N) hash grouping into candidate pairs.
- `tool.rule_prune`: 0-token pruning of normal recurring vendor disbursements.
- `llm.adjudicate`: Forensic reasoning distinguishing legitimate checks from duplicates.
- `entire.checkpoint`: Verifiable state checkpoint saved to continuous memory.
- `Neatlogs Trace URL`: Direct link to view the complete trace in the Neatlogs dashboard.
- `CFO.ai Yield`: Recovered cash, contingency fee (18%), and Token ROI multiplier.

---

## 🔍 Inspecting the Sponsor Integrations

### 1. Neatlogs Observability
Every audit sweep publishes a structured trace tree with:
- `WORKFLOW` root span with user/assistant IO messages.
- `TOOL` spans for blocking, ledger fetching, and rule pruning.
- `AGENT` / `LLM` child spans capturing forensic adjudication prompts and completions.
- `GUARDRAIL` and `EVALUATOR` compliance checks.
- Direct URL pattern: `https://app.neatlogs.com/traces/<trace_id>?orgId=...&projectId=...`

### 2. Entire Continuous Memory (`entire.io`)
Inspect local checkpoints, branch state, and evaluation trail runners:
```bash
# List all saved checkpoints
python ovio_cli.py checkpoint

# Explain a specific checkpoint state payload
python ovio_cli.py checkpoint --explain <checkpoint_id>

# Check Trail runners and evaluation status
python ovio_cli.py trail
```

### 3. cfo.ai Unit Economics & Financial Models
Inspect commercial pricing, token ROI sensitivity, and 24-month runway projections:
```bash
# View base scenario runway and token sensitivity
python ovio_cli.py cfo

# Model alternate bull or bear scenarios
python ovio_cli.py cfo --scenario bull

# Export native cfo_model.json table definition
python ovio_cli.py cfo --export
```

---

## 🌐 Next.js Interactive Dashboard

OVIO includes a high-contrast dark-mode command center:

```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to:
- Switch between Los Angeles and Oklahoma municipal ledger datasets.
- Adjust minimum transaction thresholds.
- Trigger autonomous audit sweeps with real-time step streaming.
- Inspect direct Neatlogs trace links, verified clawback findings, and CFO financial projections.

---

## 🧪 Automated Test Suite

Run the full pytest suite:
```bash
python -m pytest
```
*Validates 18/18 tests across Neatlogs telemetry, Entire checkpoints, CFO economics, and the multi-stage AP pipeline.*

---

## 📂 Repository Architecture

```text
├── cli/
│   └── ovio.py                 # Rich ANSI/TrueColor Typer CLI application
├── core/
│   ├── telemetry.py            # Neatlogs SDK lifecycle & OpenTelemetry tracer
│   ├── agent.py                # Multi-stage autonomous AP recovery engine
│   ├── llm.py                  # Forensic LLM adjudication (LiteLLM / OpenAI)
│   ├── blocking.py             # O(N) candidate blocking & deterministic pruner
│   ├── checkpoint.py           # Entire continuous memory state management
│   ├── cfo.py                  # cfo.ai unit economics & 24-month financial models
│   └── doctor.py               # Telemetry network reachability & diagnostic probe
├── app/
│   ├── page.tsx                # Next.js interactive recovery dashboard
│   ├── globals.css             # High-contrast cyber-yellow & dark theme tokens
│   └── layout.tsx              # Root layout & sponsor navigation
├── data/samples/
│   ├── la_sample.csv           # City of LA Controller ledger (20,139 rows)
│   └── ok_sample.csv           # State of Oklahoma ledger (4,693 rows)
├── tests/                      # 18 automated pytest verification tests
├── ovio_cli.py                 # Root CLI entrypoint
├── pyproject.toml              # Python build & dependency spec
└── package.json                # Next.js web application spec
```
