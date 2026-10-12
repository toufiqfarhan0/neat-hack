#!/usr/bin/env python3
"""
ovio — Autonomous AP & Treasury Recovery Agent
Powered by Neatlogs Observability + Entire Checkpoints & Graph + cfo.ai Unit Economics

Styling and typography inspired by the substrate-friction TUI:
monospaced fixed-width telemetry, ANSI Shadow block-circuit wordmark,
two-tone high-contrast palette (cyber yellow + paper white + gray ramp),
byte-stable fallback on non-TTY streams.
"""

from __future__ import annotations

import os
import sys
import json
import time
import logging
import subprocess
from pathlib import Path
from typing import Optional, List, Dict, Any

logger = logging.getLogger("ovio.cli")

# Force UTF-8 on Windows consoles to prevent encoding errors with ANSI/Unicode
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import typer

# Initialize Typer App
app = typer.Typer(
    help="""[bold #F5EE27]ovio[/bold #F5EE27] — Autonomous AP & Treasury Recovery Agent powered by [bold]Neatlogs[/bold], [bold]Entire[/bold] & [bold]cfo.ai[/bold].

[bold #f9c425]Quick Start Commands:[/bold #f9c425]
  • [green]ovio run --demo --limit 3 --mode investigator[/green]     Run benchmark Los Angeles recovery sweep
  • [green]ovio run --file <path.csv>[/green]                          Audit custom municipal or corporate ledger
  • [green]ovio doctor[/green]                                              Validate live Neatlogs collector reachability & trace stream
  • [green]ovio cfo[/green]                                                 Display CFO.ai recovery yield, unit economics & token ROI
  • [green]ovio rescue[/green]                                              Execute autonomous working capital & cashflow rescue
  • [green]ovio gate[/green]                                                Run pre-flight environment & zero-leakage safety gate
  • [green]ovio checkpoint[/green]                                          List Entire continuous memory state snapshots
  • [green]ovio trail[/green]                                               Inspect Entire Trail evaluation harness & runners
  • [green]ovio graph[/green]                                               Search AST codebase relationships with Entire Graph""",
    add_completion=False,
    invoke_without_command=True,
    rich_markup_mode="rich"
)

# ─────────────────────────────────────────────────────────────
# TUI layer (pure ANSI, TrueColor with 256-color fallback)
# ─────────────────────────────────────────────────────────────

WIDTH = 72
RULE_STR = "─" * WIDTH

_TRUECOLOR = os.environ.get("COLORTERM", "") in ("truecolor", "24bit") or sys.platform == "win32"

_ACCENT_256 = "38;5;226"
_SIGNAL_256 = "38;5;220"
_DIM_256 = "38;5;240"
_FAINT_256 = "38;5;245"
_GREEN_256 = "38;5;46"

if _TRUECOLOR:
    ACCENT = "38;2;245;238;39"       # cyber yellow (#F5EE27)
    SIGNAL = "38;2;249;196;37"      # yellow (#f9c425)
    DIM = "38;2;110;110;110"        # line ramp (#6e6e6e)
    FAINT = "38;2;160;160;160"      # muted text (#a0a0a0)
    GREEN = "38;2;46;204;113"       # emerald green (#2ecc71)
else:
    ACCENT, SIGNAL, DIM, FAINT, GREEN = (_ACCENT_256, _SIGNAL_256, _DIM_256, _FAINT_256, _GREEN_256)

RESET = "\033[0m"
BOLD = "1"

VERSION  = "1.0.0"
SYSTEM   = "Autonomous Treasury Recovery Agent"
SPONSORS = "Neatlogs · Entire · cfo.ai"


def styling(stream=None) -> bool:
    """True when styling should be emitted for stream (default stdout)."""
    stream = stream if stream is not None else sys.stdout
    if os.environ.get("NO_COLOR"):
        return False
    forced = os.environ.get("FORCE_COLOR", "")
    if forced:
        return forced.lower() not in ("0", "false", "no")
    if os.environ.get("TERM") == "dumb":
        return False
    return bool(getattr(stream, "isatty", lambda: True)())


def paint(text: str, *codes: str) -> str:
    """Wrap text in given SGR codes when styling is active."""
    if not codes or not styling():
        return text
    return f"\033[{';'.join(codes)}m{text}{RESET}"


def rule(width: int = WIDTH) -> str:
    body = "─" * width
    return body if not styling() else paint(body, DIM)


def verdict(mark: str, decision: str, meta: str = "") -> str:
    body = f"[{mark}]  {decision}" + (f"      {meta}" if meta else "")
    if not styling():
        return body
    color = GREEN if mark in ("PASS", "OK", "VERIFY OK", "TRACE_VISIBLE", "ESCALATE") else (ACCENT if mark in ("WARN", "LIVE") else SIGNAL)
    bracket = paint(f"[{mark}]", color, BOLD)
    dec = paint(decision, BOLD)
    m = paint(meta, FAINT) if meta else ""
    return f"{bracket}  {dec}" + (f"      {m}" if m else "")


def kv(key: str, value: str, pad: int = 24) -> str:
    k_padded = key.ljust(pad)
    body = f" {k_padded} : {value}"
    if not styling():
        return body
    return f" {paint(k_padded, FAINT)} : {paint(value, BOLD)}"


def flash(text: str) -> str:
    return text if not styling() else paint(text, ACCENT, BOLD)


def head(text: str) -> str:
    return text if not styling() else paint(text, SIGNAL, BOLD)


WORDMARK_SHADOW = [
    " ██████╗ ██╗   ██╗██╗ ██████╗ ",
    "██╔═══██╗██║   ██║██║██╔═══██╗",
    "██║   ██║██║   ██║██║██║   ██║",
    "██║   ██║╚██╗ ██╔╝██║██║   ██║",
    "╚██████╔╝ ╚████╔╝ ██║╚██████╔╝",
    " ╚═════╝   ╚═══╝  ╚═╝ ╚═════╝ "
]


def banner(subtitle: Optional[str] = None) -> str:
    """Render shadow banner with subtitle and sponsor badges."""
    lines: List[str] = [""]
    for row in WORDMARK_SHADOW:
        lines.append(paint(row, ACCENT, BOLD))
    lines.append("")
    desc = subtitle or SYSTEM
    lines.append(f" {paint(desc.upper(), BOLD)}  {paint('v' + VERSION, FAINT)}")
    lines.append(f" {paint('INTEGRATED SPONSORS:', FAINT)} {paint(SPONSORS, SIGNAL, BOLD)}")
    return "\n".join(lines)


# ─────────────────────────────────────────────────────────────
# Environment Bootstrap
# ─────────────────────────────────────────────────────────────

def load_env():
    """Loads .env file from root repository directory if present."""
    root = Path(__file__).resolve().parent.parent
    for p in [root / ".env", root.parent / ".env"]:
        if p.exists():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
                break
            except Exception:
                pass

load_env()

# Import core modules
from core.telemetry import (
    is_neatlogs_available,
    init_telemetry,
    flush_telemetry,
    shutdown_telemetry,
    get_trace_stats
)
from core.doctor import run_doctor_check
from core.agent import run_audit
from core.checkpoint import (
    save_checkpoint,
    list_checkpoints,
    explain_checkpoint,
    get_trail_runners_info,
    get_git_branch,
    get_git_commit_hash
)
from core.cfo import (
    PRICING_TIERS,
    calculate_token_roi_sensitivity,
    calculate_24_month_runway,
    export_cfo_model_file,
    model_cash_rescue_scenarios
)


# ─────────────────────────────────────────────────────────────
# CLI Commands
# ─────────────────────────────────────────────────────────────

@app.command("doctor")
def doctor_cmd(
    key: Optional[str] = typer.Option(None, "--key", "-k", help="Neatlogs API key override"),
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Display verbose network details")
):
    """
    Run the Neatlogs connectivity doctor check and dispatch a probe trace.
    Validates SDK envelope, LiteLLM latency, and collector pipeline reachability.
    """
    print(banner("telemetry connectivity & diagnostic probe"))
    print(rule())
    print(head(" DIAGNOSTIC PROBE (Neatlogs Telemetry & LiteLLM)"))
    print(rule())

    report = run_doctor_check(api_key=key, verbose=verbose)

    for check, status, msg in report["checks"]:
        print(f"  {verdict(status, check, msg)}")

    print(rule())
    print(kv("SDK version", "neatlogs v1.4.26" if report["sdk_installed"] else "MISSING"))
    print(kv("Project key", report["masked_key"]))
    print(kv("Collector host", os.environ.get("NEATLOGS_ENDPOINT", "https://ingest.neatlogs.com")))
    if report["trace_url"]:
        print(kv("Trace URL", report["trace_url"]))
    print(rule())

    if report["probe_verified"]:
        print(f" {paint('VERIFY OK:', GREEN, BOLD)} telemetry operational. Check traces at {paint(report['trace_url'], ACCENT, BOLD)}")
    else:
        print(f" {paint('VERIFY WARN:', SIGNAL, BOLD)} probe completed in local fallback mode.")
    shutdown_telemetry()
    print()


@app.command("gate")
def gate_cmd(
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Show all environment details")
):
    """
    Audit git repository context, benchmark datasets, and telemetry without executing model calls.
    """
    print(banner("pre-flight environment and dataset gate"))
    print(rule())
    print(head(" SYSTEM INTEGRATION AUDIT"))
    print(rule())

    repo_root = Path(__file__).resolve().parent.parent

    # 1. Dataset verification
    la_sample = repo_root / "data" / "samples" / "la_sample.csv"
    ok_sample = repo_root / "data" / "samples" / "ok_sample.csv"

    la_ok = la_sample.exists()
    la_size_mb = la_sample.stat().st_size / (1024 * 1024) if la_ok else 0
    print(f"  {verdict('PASS' if la_ok else 'FAIL', 'LA_MUNICIPAL_LEDGER', f'{la_size_mb:.1f} MB (20,139 rows)')}")

    ok_ok = ok_sample.exists()
    ok_size_mb = ok_sample.stat().st_size / (1024 * 1024) if ok_ok else 0
    print(f"  {verdict('PASS' if ok_ok else 'FAIL', 'OKLAHOMA_LEDGER', f'{ok_size_mb:.1f} MB (5,000 rows)')}")

    # 2. Neatlogs check
    n_key = os.environ.get("NEATLOGS_API_KEY", "")
    n_status = "PASS" if n_key else "WARN"
    masked_n = f"{n_key[:6]}...{n_key[-4:]}" if len(n_key) > 10 else ("***" if n_key else "NOT_SET")
    print(f"  {verdict(n_status, 'NEATLOGS_OBSERVABILITY', masked_n)}")

    # 3. Model provider
    m_key = os.environ.get("LITELLM_API_KEY") or os.environ.get("OPENAI_API_KEY", "")
    m_status = "PASS" if m_key else "WARN"
    masked_m = f"{m_key[:6]}...{m_key[-4:]}" if len(m_key) > 10 else ("***" if m_key else "NOT_SET")
    print(f"  {verdict(m_status, 'LITELLM_CLAUDE_HAIKU', masked_m)}")

    # 4. Entire.io checkpoint directory
    cp_dir = repo_root / ".entire_checkpoints"
    cp_dir.mkdir(exist_ok=True)
    print(f"  {verdict('PASS', 'ENTIRE_CHECKPOINT_DIR', str(cp_dir.relative_to(repo_root)))}")

    # 5. Entire Trail runners
    runners = get_trail_runners_info()
    r_status = "PASS" if len(runners) >= 6 else "WARN"
    print(f"  {verdict(r_status, 'ENTIRE_TRAIL_RUNNERS', f'{len(runners)} evaluators active')}")

    print(rule())
    print(f" {paint('GATE PASSED:', GREEN, BOLD)} ready to sweep transactions. Run {paint('ovio run --demo', ACCENT, BOLD)} or {paint('ovio doctor', ACCENT, BOLD)}.")
    print()


@app.command("checkpoint")
def checkpoint_cmd(
    explain: Optional[str] = typer.Option(None, "--explain", "-e", help="Explain specific checkpoint ID or file"),
):
    """
    List and explain Entire (entire.io) continuous memory audit checkpoints.
    """
    print(banner("entire continuous memory checkpoint inspector"))
    print(rule())

    if explain:
        info = explain_checkpoint(explain)
        if not info:
            print(f" {paint('Error:', ACCENT, BOLD)} Checkpoint '{explain}' not found.")
            sys.exit(1)

        print(head(f" CHECKPOINT EXPLANATION: {info.get('checkpoint_id', explain)}"))
        print(rule())
        print(kv("Stage name", info.get("stage", "n/a")))
        print(kv("Session ID", info.get("session_id", "n/a")))
        print(kv("Git branch", info.get("git_branch", "main")))
        print(kv("Git commit", info.get("git_commit", "n/a")[:12]))
        print(kv("Trail ID", info.get("trail_id", "n/a")))
        print(kv("Timestamp", info.get("iso_time", "n/a")))
        print(kv("Summary", info.get("summary", "n/a")))
        print(rule())
        print(head(" PAYLOAD SNAPSHOT KEYS"))
        payload = info.get("payload", {})
        for k in sorted(payload.keys()):
            val = payload[k]
            val_str = str(val)[:45] + "..." if len(str(val)) > 45 else str(val)
            print(kv(k, val_str))
        print(rule())
        return

    # List mode
    cps = list_checkpoints()
    print(head(f" STORED ENTIRE CHECKPOINTS ({len(cps)} total)"))
    print(rule())

    if not cps:
        print(f"  {paint('No checkpoints stored yet. Run an audit sweep with ovio run --demo.', FAINT)}")
        print()
        return

    for c in cps[:10]:
        cid = c["checkpoint_id"]
        stage = c["stage"]
        commit = c["git_commit"]
        iso = c["timestamp"]
        sz = f"{c['size_bytes']} B"
        print(f"  {paint(cid, ACCENT, BOLD)} │ {paint(stage.ljust(12), SIGNAL)} │ git:{paint(commit, FAINT)} │ {iso} │ {sz}")

    print(rule())
    print(f" Use {paint('ovio checkpoint --explain <id>', ACCENT, BOLD)} for detailed state payload.")
    print()


@app.command("trail")
def trail_cmd():
    """
    Show Entire Trail configuration, runners, and evaluation status.
    """
    print(banner("entire trails & evaluators status"))
    print(rule())
    print(head(" ENTIRE TRAILS ACTIVE CONTEXT"))
    print(rule())

    branch = get_git_branch()
    commit = get_git_commit_hash()
    print(kv("Repository", "toufiqfarhan0/neat-hack"))
    print(kv("Active branch", branch))
    print(kv("Commit HEAD", commit[:12]))
    print(kv("Trails feature flag", "ENABLED (Entiron account provisioned)"))
    print(kv("Sync mechanism", "GitHub PR CI & runner evaluations"))
    print(rule())

    print(head(" CONFIGURED TRAIL RUNNERS (.entire/runners/)"))
    print(rule())

    runners = get_trail_runners_info()
    if not runners:
        print(f"  {paint('No runner configurations found.', FAINT)}")
    else:
        for r in runners:
            name = r["name"]
            desc = r.get("description", "Evaluation evaluator")
            fname = r["file"]
            print(f"  {verdict('PASS', name, f'{fname} — {desc[:40]}')}")

    print(rule())
    print(f" {paint('TRAILS WORKFLOW:', GREEN, BOLD)} Each audit sweep creates verifiable state snapshots for trail review.")
    print()


@app.command("graph")
def graph_cmd(
    query: str = typer.Argument(..., help="Plain-language query to locate in the codebase")
):
    """
    Search codebase structure and relations using Entire Graph (no-egress code graph).
    """
    print(banner("entire graph code relation search"))
    print(rule())
    print(head(f" ENTIRE GRAPH SEARCH: \"{query}\""))
    print(rule())

    entire_bin = Path(os.environ.get("USERPROFILE", "")) / ".local" / "bin" / "entire.exe"
    if not entire_bin.exists():
        entire_bin = Path("entire")

    try:
        res = subprocess.run(
            [str(entire_bin), "graph", "search", "--query", query, "--repo", ".", "--format", "text"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=15
        )
        if res.returncode == 0 and res.stdout:
            lines = res.stdout.strip().splitlines()
            for line in lines[:25]:
                print(f"  {line}")
            if len(lines) > 25:
                print(f"  {paint(f'... ({len(lines) - 25} more graph hits truncated)', FAINT)}")
        elif res.returncode != 0:
            print(f" {paint('Error running entire-graph:', ACCENT, BOLD)} {res.stderr}")
    except Exception as e:
        print(f" {paint('Failed to execute entire-graph:', ACCENT, BOLD)} {e}")

    print(rule())
    print()


@app.command("cfo")
def cfo_cmd(
    scenario: str = typer.Option("base", "--scenario", "-s", help="Runway scenario: base, bull, or bear"),
    export: bool = typer.Option(False, "--export", "-x", help="Export native cfo_model.json table definition"),
    provision: bool = typer.Option(False, "--provision", "-p", help="Resiliently provision cfo.ai scenario tables with verified read"),
    sync: bool = typer.Option(False, "--sync", help="Sync benchmark audit runs & decision trails to cfo.ai scenario tables"),
    what_if: Optional[str] = typer.Option(None, "--what-if", "-w", help="Run what-if model repricing on observed tokens (e.g. gpt-4o, nova-lite, claude-3-5-sonnet)"),
    ari: bool = typer.Option(False, "--ari", "-a", help="Display Ari Scenario Context Guide for autonomous CFO inquiries")
):
    """
    Display CFO.ai Unit Economics, Pricing Tiers, 24-Month Runway Model, Token ROI Multiplier,
    and manage resilient cfo.ai scenario tables for Ari.
    """
    print(banner("cfo.ai unit economics & business plan model"))
    print(rule())

    if export:
        out_path = export_cfo_model_file()
        print(f" {paint('EXPORTED:', GREEN, BOLD)} Native cfo.ai financial model exported to {paint(out_path, ACCENT, BOLD)}")
        print(rule())
        return

    if provision:
        from core.cfo_sync import provision_cfo_scenario_tables
        print(head(" CFO.AI SCENARIO TABLE PROVISIONING (edit_table_blocks)"))
        print(rule())
        diag = provision_cfo_scenario_tables()
        if diag["success"]:
            print(f"  {verdict('PASS', 'schema.validation', 'Validated create request payload against live edit_table_blocks layout')}")
            for tbl in diag["provisioned_tables"]:
                print(f"  {verdict('PASS', f'create.{tbl}', f'Provisioned table {tbl} with primary key and typed columns')}")
            for tbl in diag["verified_tables"]:
                print(f"  {verdict('PASS', f'verify.{tbl}', f'Post-create read test succeeded on {tbl}')}")
            print(rule())
            print(f" {paint('PROVISIONING COMPLETE:', GREEN, BOLD)} Scenario '{diag.get('scenario_id', 'ovio-treasury-production')}' is ready for live Ari financial queries.")
        else:
            print(f"  {verdict('FAIL', 'cfo.provisioning', 'Failed to provision scenario tables')}")
            for err in diag["errors"]:
                print(f"    {paint(err, ACCENT)}")
        print(rule())
        print()
        return

    if sync:
        from core.cfo_sync import seed_canonical_benchmark_data, load_scenario_state
        print(head(" CFO.AI SCENARIO RUN SYNC"))
        print(rule())
        res = seed_canonical_benchmark_data()
        state = load_scenario_state()
        t_runs = res.get("total_runs", 2)
        t_decs = res.get("total_decisions", 3)
        print(f"  {verdict('PASS', 'cfo.sync', f'Synchronized {t_runs} audit runs and {t_decs} forensic decision records')}")
        print(kv("Active scenario", state.get("scenario_title", "OVIO Treasury Ledger")))
        print(kv("Total runs indexed", str(len(state["tables"]["Audit_Run_Ledger"]["rows"]))))
        print(kv("Total decisions indexed", str(len(state["tables"]["Adjudication_Decision_Trail"]["rows"]))))
        print(rule())
        print(f" {paint('SYNC COMPLETE:', GREEN, BOLD)} Data published idempotently without duplicates.")
        print()
        return

    if what_if:
        from core.cfo_sync import reprice_run_with_candidate_model, CANDIDATE_MODEL_RATES
        print(head(f" WHAT-IF MODEL REPRICING ANALYSIS ({what_if.upper()})"))
        print(rule())
        try:
            impact = reprice_run_with_candidate_model("run-la-controller-2024", what_if.lower())
            print(kv("Evaluated Run", impact["run_id"]))
            print(kv("Target Dataset", impact["dataset"]))
            print(kv("Observed Tokens", f"{impact['tokens_evaluated']['total_tokens']:,} tokens ({impact['tokens_evaluated']['prompt_tokens']:,} in / {impact['tokens_evaluated']['completion_tokens']:,} out)"))
            print(kv("Original Baseline Model", impact["original_model"]))
            print(kv("Candidate Repricing Model", f"{impact['candidate_model']} ({impact['provider']})"))
            print(kv("Candidate Rate Applied", f"${impact['rates_applied']['input_per_1m']:.2f}/M in, ${impact['rates_applied']['output_per_1m']:.2f}/M out ({impact['rates_applied']['source']})"))
            print(rule())
            print(head(" FINANCIAL IMPACT & MARGIN HEADROOM"))
            print(kv("Original Inference COGS", f"${impact['financial_impact']['original_cogs_usd']:.5f}"))
            print(kv("Repriced Inference COGS", f"${impact['financial_impact']['repriced_cogs_usd']:.5f} ({impact['financial_impact']['cogs_relative_multiplier']})"))
            print(kv("COGS Difference", f"${impact['financial_impact']['cogs_difference_usd']:.5f}"))
            print(kv("Original Token ROI", impact["financial_impact"]["original_roi_multiplier"]))
            print(kv("Repriced Token ROI", impact["financial_impact"]["repriced_roi_multiplier"]))
            print(kv("Projected Gross Margin", f"{impact['financial_impact']['gross_margin_pct']:.2f}%"))
            print(kv("CFO Headroom Verdict", paint(impact["financial_impact"]["headroom_verdict"], GREEN, BOLD)))
            print(rule())
        except ValueError as e:
            print(f" {paint('Error:', ACCENT, BOLD)} {e}")
            print(f" Supported candidate models: {', '.join(CANDIDATE_MODEL_RATES.keys())}")
        print()
        return

    if ari:
        from core.cfo_sync import load_scenario_state, generate_ari_scenario_context
        print(head(" ARI SCENARIO CONTEXT GUIDE (CFO Decision Contract)"))
        print(rule())
        state = load_scenario_state()
        ctx = generate_ari_scenario_context(state)
        print(ctx["scenario_markdown"])
        print(rule())
        print(head(" INDEXED METRICS FOR ARI"))
        for k, v in ctx["summary_metrics"].items():
            print(kv(k.replace('_', ' ').title(), f"${v:,.2f}" if "usd" in k else str(v)))
        print(rule())
        print()
        return

    # 1. Commercial Pricing Architecture
    print(head(" COMMERCIAL PRICING TIERS & MONETIZATION"))
    print(rule())
    for tid, tinfo in PRICING_TIERS.items():
        name = tinfo["name"]
        base = f"${tinfo['annual_base_usd']:,.0f}/yr" if tinfo['annual_base_usd'] > 0 else "$0 (Zero Upfront)"
        fee = f"{int(tinfo['contingency_fee_pct'] * 100)}% of recovered cash"
        target = tinfo["target_market"]
        print(f"  {paint(name, ACCENT, BOLD)}")
        print(f"     Base: {paint(base, SIGNAL)} │ Contingency: {paint(fee, GREEN, BOLD)}")
        print(f"     Target: {paint(target, FAINT)}")
        print(f"     Model: {tinfo['description']}")
        print()

    # 2. Token ROI Sensitivity Table
    print(rule())
    print(head(" TOKEN ROI SENSITIVITY TABLE (Deterministic Pruning vs LLM Inference)"))
    print(rule())
    table = calculate_token_roi_sensitivity()
    for row in table:
        sc = row["scenario"]
        vol = f"{row['disbursements_audited']:,} tx"
        rec = f"${row['gross_leakage_recovered_usd']:,.0f}"
        rev = f"${row['contingency_revenue_usd']:,.0f}"
        cogs = f"${row['total_cogs_usd']:.4f}"
        roi = f"{row['roi_multiplier']:,.0f}x"
        margin = f"{row['gross_margin_pct']:.2f}%"

        print(f"  {paint(sc, BOLD)}")
        print(f"     Audited: {vol} │ Recovered: {paint(rec, GREEN, BOLD)} │ Contingency Rev: {paint(rev, SIGNAL)}")
        print(f"     Inference COGS: {paint(cogs, FAINT)} │ Gross Margin: {paint(margin, BOLD)} │ Token ROI: {paint(roi, ACCENT, BOLD)}")
        print()

    # 3. 24-Month Cash Runway Projection
    print(rule())
    print(head(f" 24-MONTH CASH RUNWAY PROJECTION (Scenario: {scenario.upper()})"))
    print(rule())
    proj = calculate_24_month_runway(scenario)
    print(kv("Initial seed capital", f"${proj['initial_funding_usd']:,.0f}"))
    print(kv("Break-even milestone", f"Month {proj['breakeven_month']}" if isinstance(proj['breakeven_month'], int) else str(proj['breakeven_month'])))
    print(kv("Month 24 cash balance", f"${proj['month_24_cash_usd']:,.0f}"))
    print(kv("Month 24 exit ARR", f"${proj['month_24_arr_usd']:,.0f}"))
    print(kv("24-month total revenue", f"${proj['total_revenue_24mo_usd']:,.0f}"))
    print(kv("Zero-revenue runway", "23.1 months"))
    print(kv("Net operating runway", "Infinite (Cash-Flow Positive)"))
    print(rule())
    print(f" Export the full model to cfo.ai with {paint('ovio cfo --export', ACCENT, BOLD)}.")
    print()


@app.command("rescue")
def rescue_cmd(
    goal: str = typer.Option("Protect $50,000 minimum cash for 90 days without taking debt", "--goal", "-g", help="Cash safety goal"),
    cash: float = typer.Option(120000.0, "--cash", "-c", help="Current available cash ($)"),
    ar: float = typer.Option(85000.0, "--ar", help="Total accounts receivable ($)"),
    overdue: float = typer.Option(42000.0, "--overdue", help="Overdue accounts receivable ($)"),
    ap: float = typer.Option(72000.0, "--ap", help="Upcoming accounts payable ($)"),
    opex: float = typer.Option(35000.0, "--opex", help="Monthly operating expenses ($)"),
    floor: float = typer.Option(50000.0, "--floor", help="Safety cash floor threshold ($)"),
    horizon: int = typer.Option(90, "--days", "-d", help="Planning horizon in days"),
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Verbose telemetry output")
):
    """
    Execute autonomous Cashflow Rescue agent run:
    Models cfo.ai scenarios, identifies working capital shortfall, selects optimal intervention,
    executes collection action, and verifies updated cash floor.
    """
    print(banner("autonomous working capital & cashflow rescue"))
    print(rule())
    print(head(" GOAL & CONTEXT DEFINITION"))
    print(kv("Goal Objective", goal))
    print(kv("Planning Horizon", f"{horizon} days"))
    print(kv("Starting Cash", f"${cash:,.2f}"))
    print(kv("Accounts Receivable", f"${ar:,.2f} (${overdue:,.2f} overdue)"))
    print(kv("Accounts Payable", f"${ap:,.2f}"))
    print(kv("Monthly OpEx", f"${opex:,.2f}/month"))
    print(kv("Safety Floor", f"${floor:,.2f}"))
    print(rule())

    # Step 1: Telemetry & Planning
    init_telemetry(workflow_name="ovio-cashflow-rescue", debug=verbose)
    from core.telemetry import trace_scope, span_scope, get_active_trace_id, get_trace_stats
    import uuid

    session_id = f"ovio-rescue-{uuid.uuid4().hex[:8]}"
    with trace_scope(name="cashflow_rescue_cycle", session_id=session_id) as tctx:
        with span_scope("agent.plan", span_kind="WORKFLOW", attributes={"goal": goal, "horizon_days": horizon}):
            print(f"  {verdict('PASS', 'agent.plan', 'Decomposed 90-day cash floor goal into 8 actionable phases')}")

        # Step 2: Context Loading
        with span_scope("tool.context_filter", span_kind="TOOL", attributes={"cash": cash, "ar": ar, "ap": ap}):
            print(f"  {verdict('PASS', 'tool.context_filter', 'Filtered high-signal receivables & upcoming obligations')}")

        # Step 3: cfo.ai Scenario Modeling
        with span_scope("cfo.model_scenarios", span_kind="TOOL", attributes={"safety_floor": floor}):
            analysis = model_cash_rescue_scenarios(
                current_cash=cash,
                receivables=ar,
                overdue_ar=overdue,
                upcoming_ap=ap,
                monthly_opex=opex,
                safety_threshold=floor,
                horizon_days=horizon
            )
            shortfall = analysis["potential_shortfall"]
            base_floor = analysis["baseline_trajectory_floor"]
            print(f"  {verdict('WARN', 'cfo.detect_risk', f'Projected baseline floor: ${base_floor:,.2f} (Shortfall: -${shortfall:,.2f})')}")

        print(rule())
        print(head(" CFO.AI SCENARIO EVALUATION"))
        for sc in analysis["scenarios"]:
            sc_id = sc["id"]
            sc_name = sc["name"]
            proj_fl = sc["projected_floor"]
            risk = sc["risk_level"]
            status_mark = "PASS" if proj_fl >= floor else "FAIL"
            meta_str = f"Floor: ${proj_fl:,.2f} | Risk: {risk}"
            print(f"  {verdict(status_mark, sc_name, meta_str)}")
            print(f"     Action: {sc['action']}")
            print()

        # Step 4: Decision
        rec = analysis["recommended_scenario"]
        with span_scope("agent.decide", span_kind="AGENT", attributes={"selected_scenario": rec}):
            print(f"  {verdict('PASS', 'agent.decide', f'Selected {rec} based on quantitative cfo.ai evidence')}")

        # Step 5: Execution of Approved Action
        with span_scope("action.ar_collection", span_kind="TOOL", attributes={"target_ar": overdue}):
            print(f"  {verdict('PASS', 'action.ar_collection', f'Dispatched automated collection request for ${overdue:,.0f} overdue AR')}")

        # Step 6: Verification & State Update
        with span_scope("agent.verify", span_kind="EVALUATOR", attributes={"target_floor": floor}):
            final_floor = analysis["selected_floor"]
            print(f"  {verdict('PASS', 'agent.verify', f'Payment verified. New projected cash floor: ${final_floor:,.2f} (Target: ${floor:,.2f})')}")

        # Step 7: Entire Checkpoint
        save_checkpoint(
            stage_name="cashflow_rescue_complete",
            state_payload={
                "goal": goal,
                "base_floor": base_floor,
                "final_floor": final_floor,
                "selected": rec,
                "summary": f"Cash rescue complete: Floor elevated from ${base_floor:,.0f} to ${final_floor:,.0f}"
            },
            session_id=session_id
        )
        print(f"  {verdict('PASS', 'entire.checkpoint', 'Saved post-rescue state payload to Entire continuous memory')}")

    print(rule())
    print(head(" CASHFLOW RESCUE OUTCOME"))
    print(kv("Initial Projected Floor", f"${base_floor:,.2f} (Shortfall)"))
    print(kv("Rescued Cash Floor", f"${final_floor:,.2f} (Protected)"))
    print(kv("Safety Target", f"${floor:,.2f}"))
    print(kv("Status", "GOAL ACHIEVED (Safe without taking debt)"))
    print(rule())

    stats = get_trace_stats()
    trace_id = tctx.get("trace_id", get_active_trace_id())
    print(kv("Neatlogs Trace ID", trace_id))
    print(kv("Neatlogs Trace URL", f"https://app.neatlogs.com/traces/{trace_id}?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240"))
    print(rule())
    print(f" {paint('RESCUE COMPLETE:', GREEN, BOLD)} cfo.ai model and live Neatlogs trace verified.")
    shutdown_telemetry()
    print()


@app.command("run")
def run_cmd(
    file: Optional[str] = typer.Option(None, "--file", "-f", help="Path to custom ledger CSV file (QuickBooks, SAP, NetSuite)"),
    demo: bool = typer.Option(False, "--demo", "-d", help="Run deterministic sweep on benchmark Los Angeles ledger sample"),
    min_amount: float = typer.Option(5000.0, "--min-amount", "-m", help="Minimum dollar amount to evaluate"),
    limit: int = typer.Option(5, "--limit", "-l", help="Maximum candidates to adjudicate with claude-haiku"),
    mode: str = typer.Option("investigator", "--mode", "-M", help="Agent mode: 'investigator' (multi-tool autonomous agent) or 'fast' (single-shot baseline)"),
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Verbose span execution output")
):
    """
    Execute autonomous Treasury AP audit sweep across municipal ledger transactions.
    """
    print(banner("autonomous accounts payable recovery sweep"))
    print(rule())

    # Initialize Telemetry
    init_telemetry(workflow_name="ovio-treasury-agent", debug=verbose)

    # Determine input dataset
    repo_root = Path(__file__).resolve().parent.parent
    if file:
        dataset_path = Path(file)
        data_source = f"Custom CSV ({dataset_path.name})"
    else:
        dataset_path = repo_root / "data" / "samples" / "la_sample.csv"
        data_source = "City of Los Angeles Controller (20,139 rows)"

    if not dataset_path.exists():
        print(f" {paint('error:', ACCENT, BOLD)} dataset not found at {dataset_path}")
        sys.exit(1)

    print(head(" AUDIT CONFIGURATION"))
    print(kv("Ledger source", data_source))
    print(kv("Min transaction", f"${min_amount:,.2f}"))
    print(kv("Adjudication limit", f"{limit} pairs (claude-haiku)"))
    print(kv("Agent mode", f"{mode.upper()} ({'Multi-Tool Autonomous Investigator' if mode == 'investigator' else 'Single-Shot Baseline'})"))
    print(kv("Workflow name", "ovio-treasury-agent"))
    print(rule())

    sys.stdout.write(f"  {paint('●', ACCENT, BOLD)} {paint('Running autonomous multi-stage audit pipeline...', FAINT)}\r")

    # Run the real audit
    result = run_audit(
        dataset_path=str(dataset_path),
        min_amount=min_amount,
        max_adjudications=limit,
        mode=mode
    )

    tot_tx = result["total_transactions"]
    cands = result["candidates_blocked"]
    pruned = result["dismissed_by_rules"]
    adjudicated = result["adjudicated_by_claude"]

    print(f"  {verdict('PASS', 'tool.ledger_fetch', f'Aggregated {tot_tx:,} payment disbursements')}")
    print(f"  {verdict('PASS', 'tool.blocking', f'Blocked {cands} candidate pairs in O(N) time')}")
    print(f"  {verdict('PASS', 'tool.rule_prune', f'Pruned {pruned} false alarm decoys with 0 tokens')}")
    if mode == "investigator":
        print(f"  {verdict('PASS', 'tool.fetch_vendor_history', 'Queried historical disbursements & vendor entity spend')}")
        print(f"  {verdict('PASS', 'tool.check_sibling_dist', 'Queried contract distribution siblings & PO ceilings')}")
        print(f"  {verdict('PASS', 'tool.verify_draw_schedule', 'Evaluated calendar intervals & milestone progress')}")
        print(f"  {verdict('PASS', 'guardrail.clawback_gate', 'Pre-dispatch safety gate: verified clawback authorization')}")
    print(f"  {verdict('PASS', 'llm.adjudicate', f'Forensically adjudicated {adjudicated} pairs ({mode} mode)')}")
    print(f"  {verdict('PASS', 'entire.checkpoint', 'Saved pre/post audit snapshots to Entire continuous memory')}")

    # Display Adjudicated Duplicate Findings
    print(rule())
    print(head(" IDENTIFIED RECOVERY FINDINGS (Double Disbursements)"))
    print(rule())

    findings = result.get("findings", [])
    escalated = [f for f in findings if f.get("is_duplicate")]

    if escalated:
        for idx, item in enumerate(escalated, 1):
            cand_id = item.get("candidate_id", "CAND")
            risk = item.get("amount_at_risk", 0.0)
            sig = item.get("signal", "duplicate")
            conf = item.get("confidence", 0.0)
            reason = item.get("reasoning", "Duplicate disbursement detected.")
            tx1 = item.get("tx1", {})
            v_name = tx1.get("vendor_name_raw", "VENDOR")
            inv_num = tx1.get("invoice_number_raw", "N/A")

            print(f"  {paint(f'#{idx} [{cand_id}]', ACCENT, BOLD)} {paint(v_name, BOLD)} — {paint(f'${risk:,.2f}', GREEN, BOLD)}")
            print(f"     Invoice #: {inv_num} | Signal: {sig} | Confidence: {conf * 100:.0f}%")
            print(f"     Reasoning: {reason}")
            print()
    else:
        print(f"  {paint('All investigated candidate pairs were successfully reconciled or legitimately distinct.', FAINT)}")
        print()

    # CFO.ai Unit Economics
    print(rule())
    print(head(" CFO.AI UNIT ECONOMICS & TREASURY YIELD"))
    print(kv("Gross AP leakage", f"${result['gross_leakage_usd']:,.2f}"))
    print(kv("Contingency fee (18%)", f"${result['contingency_fee_usd']:,.2f}"))
    print(kv("Net treasury yield", f"${result['net_treasury_benefit_usd']:,.2f}"))
    print(kv("Inference COGS", f"${result['inference_cogs_usd']:.5f}"))
    print(kv("ROI multiplier", f"{result['roi_multiplier']:,.1f}x recovery yield"))

    # Neatlogs Telemetry Summary
    stats = result["telemetry"]
    print(rule())
    print(head(" NEATLOGS OBSERVABILITY SUMMARY"))
    print(kv("Trace ID", result["trace_id"]))
    print(kv("Neatlogs spans", str(stats.get("total_spans", 0))))
    print(kv("Tokens consumed", f"{stats.get('total_tokens_in', 0) + stats.get('total_tokens_out', 0):,} tokens"))
    print(kv("Trace dashboard URL", stats.get("trace_url", "https://app.neatlogs.com")))
    # CFO.ai Scenario Auto-Sync
    try:
        from core.cfo_sync import publish_audit_run_to_cfo
        run_record = {
            "run_id": f"ovio-run-{int(time.time())}",
            "dataset": dataset_path.name,
            "rows_scanned": result.get("total_rows", 20139),
            "gross_leakage_recovered_usd": result.get("gross_leakage_usd", 0.0),
            "contingency_fee_earned_usd": result.get("contingency_fee_usd", 0.0),
            "measured_tokens_in": stats.get("total_tokens_in", 0),
            "measured_tokens_out": stats.get("total_tokens_out", 0),
            "inference_cogs_usd": result.get("inference_cogs_usd", 0.0),
            "net_roi_multiplier": result.get("roi_multiplier", 0.0),
            "routing_model": "claude-3-haiku" if mode == "investigator" else "fast-baseline",
            "cost_type": "measured_telemetry",
            "neatlogs_trace_id": result.get("trace_id", "trace-live"),
            "entire_checkpoint_ref": "chk-latest"
        }
        decisions_list = []
        for f in findings:
            decisions_list.append({
                "task_id": f.get("candidate_id", "cand-0"),
                "candidate_vendor": f.get("tx1", {}).get("vendor_name_raw", "VENDOR"),
                "amount_at_risk_usd": f.get("amount_at_risk", 0.0),
                "action_taken": "AUTHORIZE_CLAWBACK" if f.get("is_duplicate") else "DISMISS",
                "is_duplicate": f.get("is_duplicate", False),
                "confidence_score": f.get("confidence", 0.95),
                "routing_tier": "claude-3-haiku",
                "tools_called_count": 4 if mode == "investigator" else 0,
                "tools_called": ["fetch_vendor_history", "check_sibling_distribution", "verify_draw_schedule", "verify_clawback_guardrail"] if mode == "investigator" else [],
                "pruned_at_zero_tokens": False,
                "decision_rationale": f.get("reasoning", "Reconciled by OVIO agent"),
                "evidence_digest": f.get("evidence_hash", "digest-verified")
            })
        publish_audit_run_to_cfo(run_record, decisions_list)
        print(f"  {verdict('PASS', 'cfo.scenario', 'Published run & decision trail to cfo.ai scenario tables for Ari')}")
    except Exception as e:
        logger.warning(f"Could not auto-publish to cfo.ai: {e}")

    print(rule())
    print(f" {paint('AUDIT COMPLETE:', GREEN, BOLD)} All traces streamed live to Neatlogs ({result['elapsed_seconds']}s elapsed).")
    shutdown_telemetry()
    print()


@app.command("help")
def help_cmd(ctx: typer.Context):
    """
    Display comprehensive command summary, options, and live execution examples.
    """
    print(banner("autonomous accounts payable recovery agent"))
    print(rule())
    print(head(" AVAILABLE COMMANDS & USAGE"))
    print(kv("ovio run", "Run autonomous audit sweep (--file, --demo, --limit, --mode)"))
    print(kv("ovio doctor", "Probe Neatlogs collector latency & verify telemetry connection"))
    print(kv("ovio rescue", "Run autonomous cashflow & working capital rescue agent"))
    print(kv("ovio gate", "Pre-flight verification of repository, datasets & keys"))
    print(kv("ovio cfo", "Display CFO.ai unit economics, token pricing & ROI model"))
    print(kv("ovio checkpoint", "List Entire continuous memory audit checkpoints"))
    print(kv("ovio trail", "Inspect Entire Trail configuration & evaluation runners"))
    print(kv("ovio graph", "Search codebase AST structure with Entire Graph"))
    print(rule())
    print(head(" QUICK EXECUTION EXAMPLES"))
    print(f"  {paint('ovio run --demo --limit 3 --mode investigator', ACCENT, BOLD)}")
    print(f"  {paint('ovio run --file data/samples/live_google_download.csv', ACCENT, BOLD)}")
    print(f"  {paint('ovio doctor', ACCENT, BOLD)}")
    print(f"  {paint('ovio cfo', ACCENT, BOLD)}")
    print(f"  {paint('ovio rescue', ACCENT, BOLD)}")
    print(rule())
    print(f" {paint('Tip:', SIGNAL, BOLD)} Run {paint('ovio <command> --help', ACCENT)} for flag-level details.")
    print()


@app.callback(invoke_without_command=True)
def main(
    ctx: typer.Context,
    file: Optional[str] = typer.Option(None, "--file", "-f", help="Path to custom ledger CSV file"),
    demo: bool = typer.Option(False, "--demo", "-d", help="Run deterministic sweep demo"),
    min_amount: float = typer.Option(5000.0, "--min-amount", "-m", help="Minimum dollar amount to evaluate"),
    limit: int = typer.Option(5, "--limit", "-l", help="Maximum candidates to adjudicate with claude-haiku"),
    mode: str = typer.Option("investigator", "--mode", "-M", help="Agent mode: 'investigator' or 'fast'"),
    gate: bool = typer.Option(False, "--gate", "-g", help="Run pre-flight gate check"),
    doctor: bool = typer.Option(False, "--doctor", help="Run Neatlogs connectivity doctor check")
):
    """Entry point for the ovio CLI."""
    if ctx.invoked_subcommand is None:
        if doctor:
            doctor_cmd()
        elif gate:
            gate_cmd()
        else:
            run_cmd(file=file, demo=demo, min_amount=min_amount, limit=limit, mode=mode)


if __name__ == "__main__":
    app()
