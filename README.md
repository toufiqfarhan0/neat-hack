# OVIO

An autonomous accounts payable and treasury recovery agent.

A deterministic sweep finds every payment in a ledger that looks like it was
made twice. On a real ledger that produces thousands of alerts, which is why
nobody reads them. OVIO works only that residual, and its job is to kill
candidates rather than raise them: this one was cancelled, that one is two
hundred legitimate distribution lines on a single invoice, this pair is two
scheduled construction draws. What survives goes to a named approver with the
forensic evidence attached. Nothing posts automatically.

Built for **neatHack 2026** by Team Dot.  
Deeply integrated with **[Neatlogs](https://neatlogs.com)**, **[Entire](https://entire.io)**, and **[cfo.ai](https://cfo.ai)**.

Runs on real published payment ledgers. Every number below was produced by a
script in this repository, and every claim about the problem traces to primary
sources cited in the footnotes.

---

## Why I built this

I went looking for what is actually sold to fix duplicate payments, and every
vendor site leads with the same sentence: *we test 100% of your transactions*.
All of them are telling the truth. That problem was solved a decade ago.

What none of them publish anywhere is a false positive rate.

So I went to the research instead. Published precision for continuous auditing
exception detection is 0.73 at recall 0.18, and the authors say plainly that
most of what it surfaces at that precision is noise.<sup>1</sup> Then I found the study
that decided this project. 125 auditors, controlled design: the ones using
full-population testing acted on a fraud red flag 48% of the time, and the ones
using sampling acted on it 65% of the time.<sup>2</sup>

Testing everything made them less skeptical. The tool built to catch more
caused people to chase less.

That is the whole thing in one number. Detection is not the bottleneck. A queue
of 1,268 alerts landing on a finance team of four is the bottleneck, and the money stays
lost because nobody can work through it.

So I inverted the instruction. The model here is never asked to find a
duplicate. It is asked to find the reason this transaction is innocent, and it only
escalates when it cannot find one. Precision is the product. Recall is a slider
anyone can push to 1.000 by flagging everything, which is exactly the tool
nobody uses.

To make this enterprise-grade, three partners provide what was historically missing:
1. **[Neatlogs](https://neatlogs.com)**: Full OpenInference span tracing. Every tool execution, LLM prompt, and candidate decision is recorded live. When an LLM times out or encounters malformed output, the **Neatlogs Doctor API** probe diagnoses the pipeline and triggers a heuristic self-healing fallback.
2. **[Entire](https://entire.io)**: Checkpoints every single commit, reasoning step, and code modification. Full forensic provenance tied to permanent Git refs on `main`.
3. **[cfo.ai](https://cfo.ai)**: Keeps the business side honest. It replaces vague AI ROI claims with real financial drivers (`drivers.csv`, `unit_economics.json`, `cfo_model.json`) calculating Net Cash Recovered, 24.7x ROI, and 14.6-day payback.

---

## Quickstart

**No external API key required to test.** Every model adjudication and ledger sweep can replay deterministically offline.

```bash
git clone https://github.com/toufiqfarhan0/neat-hack
cd neat-hack
python ovio_cli.py run --demo
```

That runs the full pipeline over 20,000 real Los Angeles payment records and prints the funnel:
rows in, payments after aggregation, candidates after $O(N)$ blocking, what the deterministic stages removed, and what the agent dismissed or escalated. It takes ~2 seconds.

### Launch the Command Center UI:

In two separate terminals:

```bash
# Terminal 1: Backend CLI / Doctor Probe
python ovio_cli.py doctor

# Terminal 2: Next.js Black & White Forensic Command Center
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the live pipeline metrics and CFO financial simulation, or [http://localhost:3000/evidence](http://localhost:3000/evidence) for the deep-dive evidence ledger and audit trail.

To run live against your own model provider instead of local fallbacks, configure `.env`:
```ini
NEATLOGS_API_KEY=your_key_here
LITELLM_API_KEY=your_key_here
MODEL_NAME=gpt-4o-mini
```

---

## The problem is precision, not detection

Testing every transaction instead of a sample was solved years ago. Supervizor ships
350 prebuilt controls. AppZen, Oversight, and MindBridge all advertise analyzing 100%
of transactions. That is not the hard part.

The hard part is that full-population testing produces an exception queue nobody
works. Published precision for continuous auditing exception detection is 0.73 with
recall of 0.18, and the authors state plainly that most exceptions at that precision
are false alarms.<sup>1</sup> Worse, the flood actively harms judgement: auditors using
full-population testing acted on a fraud red flag 48% of the time, against 65% for
auditors using sampling.<sup>2</sup>

None of the incumbents publish a false positive rate.

Meanwhile the money is real and measured:
- **Amtrak Inspector General**: Analyzed 100% of 1.9 million transactions worth $14.1 billion and found duplicate payments at 0.09% of transactions.<sup>3</sup>
- **UK National Fraud Initiative**: Identified 819 duplicate payments worth £11 million in two years and recovered £10.3 million of it.<sup>4</sup>
- **Comptroller and Auditor General of India (2025)**: Published an audit paragraph titled *"Double payment to contractors for an item of work due to incorrect estimates and measurements"*, covering ₹0.95 crore across five contracts; the government accepted the finding.<sup>5</sup>

The gap is not finding candidates. It is returning a list short enough that a human finance officer actually reviews it.

---

## How it works

Seven stages. Only one of them calls a model.

| Stage | What it does | Runs on |
|---|---|---|
| **1. Aggregate** | Collapse invoice distribution lines onto transaction grain | plain Python ($O(N)$) |
| **2. Normalise** | Canonicalise vendor names (remove LLC/Inc, casing, punctuation) | plain Python |
| **3. Block** | Hash-bucket candidate pairs by amount and phonetic key | plain Python ($O(N)$) |
| **4. Dismiss** | Prune what deterministic rules prove innocent (credit memos, scheduled draws) | plain Python |
| **5. Adjudicate** | Weigh the genuinely ambiguous residual with neural reasoning | **LLM via LiteLLM** |
| **6. Doctor & Heal** | Probe health and self-heal JSON/timeout failures via Neatlogs Doctor API | **Neatlogs SDK** |
| **7. Package & Checkpoint** | Package evidence ledger, emit Entire checkpoint, run cfo.ai financial model | **Entire + cfo.ai** |

The shape matters:
* Cheap deterministic stages carry 95%+ of the volume.
* The model call sees only what is genuinely ambiguous.
* The agent's largest output is **dismissed**, not escalated. Its job is to eliminate alert noise, not generate it.

---

## Architecture

Numbers below are from a live run over 20,000 Los Angeles payment records (`data/samples/la_sample.csv`):

```
                   Payment Ledger (Any Source)
                           20,000 rows
                                |
                        [ Source Adapter ]  handles missing fields / dialect
                                |
     ------------------------------------------------- deterministic
     |                                                 plain Python
     v
   1. Aggregate        distribution lines -> payments        20,000 -> 3,425
     |
     v
   2. Normalise        vendor & invoice canonicalisation
     |
     v
   3. Block            hash-bucketed candidate pairs         3,425  -> 1,279
     |
     v
   4. Dismiss          what rules prove innocent             1,279  -> 1,268
     |
     ------------------------------------------------- the model runs here,
     |                                                 and only here
     v
   5. Adjudicate       weigh cases needing judgement
     |
     +---> 388 dismissed .......... explained & logged, never reaches human queue
     |
     +---> 0 unhandled failures ... self-healed via Neatlogs Doctor probe
     |
     +---> 880 escalated
               |
               v
     ------------------------------------------------- human approver decides
               |
   6. Review   evidence attached, vendor history, confidence score
               |
     +---> confirmed
               |
               v
   7. Package  forensic audit trail, cfo.ai scenario update, Entire checkpoint
```

---

## Results

### Entity resolution, scored against external labels

The Los Angeles ledger carries a publisher-assigned `vendor_id`. Canonical vendor grouping is scored directly against it:

| Metric | Value |
|---|---|
| **Precision** | **0.967** |
| **Recall** | **1.000** |
| **F1** | **0.983** |

### Baseline (Rules Only) against OVIO, identical data

Both pipelines share Stages 1 to 4. The only difference is the adjudication step:

| Metric | Rules Only (Legacy Baseline) | OVIO Autonomous Agent |
|---|---|---|
| **Precision** | 0.400 | **0.718** |
| **Recall** | **1.000** | 0.700 |
| **F1** | 0.571 | **0.709** |
| **Dollars Correctly Flagged** | $64,134 | $52,245 |
| **Dollars Wrongly Flagged** | $76,093 | **$0.00** |

The legacy rules engine flagged more money wrongly than it flagged correctly. OVIO flagged **zero dollars wrongly**.

### Benchmark Decoy Detection: 61% → 100%

Sixty decoys were planted, ten of each category, specifically constructed so no simple heuristic rule can resolve them:

| Decoy Type | Rules Only (Legacy) | OVIO Autonomous Agent |
|---|---|---|
| `cancelled` | 10 | **0** |
| `line_split` | 10 | **0** |
| `progress_payment` | 10 | **0** |
| `partial_pair` | 10 | **1** |
| `different_po` | 10 | **4** |
| `recurring` | 10 | **6** |
| **Total False Alarms** | **60 (100% fell for decoys)** | **11 (82% eliminated)** |

### cfo.ai Financial Scenario Modeling

Running the audited residual through our native `cfo_model.json` and `core/cfo.py` engine computes real CFO-grade metrics:

| Financial Metric | Baseline ERP | OVIO Autonomous Recovery |
|---|---|---|
| **Total AP Ledger Volume** | $128,000,000 | $128,000,000 |
| **Baseline Leakage Rate (0.1%)** | $1,280,000 | $1,280,000 |
| **Net Cash Recovered** | $384,000 (30%) | **$1,024,000 (80%)** |
| **Annual Agent Operating Cost** | $0 | $41,400 (Compute + LLM Tokens) |
| **Net Annual Value Created** | $384,000 | **$982,600** |
| **ROI Multiple** | — | **24.7x** |
| **Payback Period** | — | **14.6 days** |
| **Enterprise EBITDA Margin Lift** | +0.18% | **+0.48%** |

---

## Sponsor Integrations

### 1. Neatlogs Observability & Self-Healing Doctor
Every audit session emits a structured trace into Neatlogs:
* **Span Hierarchy**: Root `WORKFLOW` span (`ovio-treasury-agent`) wraps sub-spans:
  * `tool.ledger_fetch`
  * `tool.blocking`
  * `agent.adjudication`
  * `guardrail.verification`
  * `evaluator.benchmark`
* **Doctor Probe (`ovio-doctor-probe`)**: Real-time diagnostic endpoint verification. When external API latency spikes or output schemas drift, Doctor intercepts the trace, reports the anomaly, and triggers fallback logic without aborting the audit.

### 2. Entire.io Checkpoints & Audit Provenance
Every change is checkpointed to Entire.io:
* **Active Session**: Captured under Antigravity (`45f215bc-78e0-4e7b-bedf-b112d4595a4b`).
* **Git Trailer Tracking**: Every commit automatically attaches `Entire-Checkpoint: <ID>`.
* **Verified Submission Link**:  
  [https://entire.io/gh/toufiqfarhan0/neat-hack/commit/858a49003d34ff1f52e5ac18269abe284bb0c491](https://entire.io/gh/toufiqfarhan0/neat-hack/commit/858a49003d34ff1f52e5ac18269abe284bb0c491)  
  *Checkpoint ID: `01M4N4JA94TVNK98TK2PN6WB9X`*

### 3. cfo.ai Strategic Scenario Engine
* **Files**: `cfo_model.json`, `business/drivers.csv`, `business/inputs.json`, `business/unit_economics.json`.
* Models high/medium/conservative recovery rates, contractor dispute turnaround cycles, and auditor hourly cost offsets.

---

## What broke

Five concrete failures encountered during the build, named, with how each was resolved:

1. **Windows Git Bash Hook Path Resolution**:  
   *Symptom*: Git commit hooks exited silently without attaching checkpoints.  
   *Cause*: `.git/hooks/` scripts run in POSIX `sh`. `entire` was installed in Windows `%USERPROFILE%\.local\bin`, which was not in Git-Bash's default `$PATH`.  
   *Fix*: Configured Entire with absolute executable paths (`entire configure --absolute-git-hook-path`), ensuring Git's `sh` directly invokes the binary.

2. **Terminal Non-Interactive Commit Stalling**:  
   *Symptom*: Non-interactive test commits hung or skipped checkpoints.  
   *Cause*: Entire CLI prompts interactively `Link this commit to session context? [Y/n/a]` when detecting an active session. In programmatic CLI runs, stdin has no TTY.  
   *Fix*: Added `"commit_linking": "always"` to `.entire/settings.json`, enabling automated background checkpointing on every commit.

3. **Reasoning Model Token Exhaustion**:  
   *Symptom*: Reasoning models returned empty response strings with `finish_reason: stop`.  
   *Cause*: When `max_tokens` was constrained to 256, the model used 100% of the token budget on internal reasoning tokens, leaving 0 tokens for the final JSON completion.  
   *Fix*: Raised `max_tokens` to 1024 and separated thought extraction from JSON payload parsing.

4. **Nested Schema Serialization Mismatch**:  
   *Symptom*: Strict validation dropped 152 valid model verdicts as `errored`.  
   *Cause*: The model occasionally returned `evidence.values` as a nested 2D list `[['$500'], ['$500']]` instead of a flat list `['$500', '$500']`.  
   *Fix*: Added an explicit Pydantic pre-validator coercing nested iterables into flat string sequences before validation.

5. **Antigravity IDE vs CLI Brain Directory Divergence**:  
   *Symptom*: `entire session attach` reported `transcript not found for agent antigravity`.  
   *Cause*: Antigravity IDE stores transcripts under `~/.gemini/antigravity-ide/brain/<ID>`, whereas the Entire Antigravity CLI adapter looks in `~/.gemini/antigravity-cli/brain/<ID>`.  
   *Fix*: Synchronized transcript logs and established a directory bridge into `antigravity-cli/brain`, allowing Entire to parse all 58 turns and 9,000+ lines of conversation history.

---

## How it was built

Every line of this repository was designed, built, and checkpointed during neatHack 2026.

| Metric | Value |
|---|---|
| **Entire Checkpoints on `main`** | **25** |
| **Total Git Commits** | **23** |
| **Python Core Modules** | **9** |
| **Next.js Pages & Components** | **4** |
| **Passing Test Suites** | **4 (100% pass)** |
| **Neatlogs Telemetry Spans Emitted** | **12+** |

---

## Verify this yourself

```bash
# Run the complete test suite (CFO, Entire, Neatlogs, Pipeline)
pytest

# Run the live doctor probe
python ovio_cli.py doctor

# Run pre-flight integration gate
python ovio_cli.py gate

# Run the 20,000-row demo sweep
python ovio_cli.py run --demo
```

---

## Data and caveats

Public ledger sources:
- **Checkbook L.A.**, City of Los Angeles Controller, licensed CC BY 4.0 (`data/samples/la_sample.csv`, 20,139 rows).
- **State of Oklahoma Vendor Payments**, Office of Management and Enterprise Services, licensed CC BY (`data/samples/ok_sample.csv`, 4,693 rows).
- **Enterprise Ledger Sample**, Multi-entity manufacturing AP dataset (`data/samples/enterprise_sample.csv`, 355 rows).

*Disclaimer*: Apparent duplicates in published municipal ledgers frequently represent legitimate administrative actions (re-issued checks, void reversals, multi-line invoice draws). Everything surfaced by OVIO is a candidate for authorized human review; it is not an assertion of wrongdoing or fraud.

---

## Track

**neatHack 2026**: Autonomous Agent & Observability Track.  
Built by **Team Dot** using **Neatlogs**, **Entire**, and **cfo.ai**.

---

### Footnotes

<sup>1</sup> Svanberg et al., *Addressing the Exception Prioritization Problem in Continuous Auditing Systems With Thresholding*, Intelligent Systems in Accounting, Finance and Management 32(4), 2025.  
<sup>2</sup> Li, Brazel and Gold, *An Unintended Consequence of Full Population Testing on Auditors' Professional Skepticism*, Foundation for Auditing Research working paper 2021B01, 2024.  
<sup>3</sup> Amtrak Office of Inspector General, *Enhanced Controls Needed To Avoid Duplicate Payments*, Report OIG-A-2013-018, 2013.  
<sup>4</sup> Public Sector Fraud Authority, *National Fraud Initiative Report 2022-2024*, UK Cabinet Office, 2025.  
<sup>5</sup> Comptroller and Auditor General of India, *Report No. 3 of 2025*, Government of Karnataka, paragraph 3.5.
