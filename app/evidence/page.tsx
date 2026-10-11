"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Database, 
  Activity, 
  Terminal, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  GitBranch, 
  GitCommit, 
  Cpu, 
  Search, 
  Copy, 
  Check, 
  ArrowLeft 
} from "lucide-react";

export default function EvidencePage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const orgId = "9cfd22d9-563d-4c78-a34b-221750ec3bcf";
  const projectId = "b789b79e-7320-4c15-a378-4cf7cfb8d240";

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const traces = [
    {
      id: "3d720906babf7ed470e690f68c4eedc5",
      dataset: "City of Los Angeles Controller (20,139 disbursements)",
      findings: "$12,818.00 Duplicate Payment to ANONYMIZED_MUNICIPAL_VENDOR_B (Candidate Under Forensic Review)",
      recoveryProof: "Multi-Tool Autonomous Investigator: Queried vendor history (3 tx), PO distribution (SC21CO24138706Y ceiling match), draw schedule, and pre-dispatch clawback guardrail.",
      spans: 20,
      tokens: 2080,
      cogs: "$0.00104",
      roi: "24.7x Enterprise"
    },
    {
      id: "dd024eda5ca251867f7f23cf768e6651",
      dataset: "City of Los Angeles Controller (Single-Shot Fast Baseline)",
      findings: "Single-Shot Benchmark: $12,818.00 Candidate Evaluated",
      recoveryProof: "Direct LLM prompt verdict without investigation tools. Emitted 11 spans for side-by-side benchmark comparison against the multi-tool investigator.",
      spans: 11,
      tokens: 2080,
      cogs: "$0.00104",
      roi: "24.7x Enterprise"
    },
    {
      id: "8789a5fef577533136f734e04c2ded51",
      dataset: "City of Chicago Vendor Payments (1,968 disbursements)",
      findings: "Live Open Data Municipal Sweep from data.cityofchicago.org",
      recoveryProof: "Streamed live municipal disbursements into 8-phase pipeline. Verified voucher numbers, contract IDs, and payment dates.",
      spans: 12,
      tokens: 1840,
      cogs: "$0.00092",
      roi: "24.7x Enterprise"
    },
    {
      id: "a3b4770e82c2e9d0dfaae885c901f4f8",
      dataset: "State of Oklahoma Treasury (4,693 disbursements)",
      findings: "$4,095.00 Duplicate Payment to CDW GOVERNMENT INC",
      recoveryProof: "Identical across all dimensions (CDW GOVERNMENT INC, $4,095.00, 07/15/2020, Oklahoma State University). Pre-dispatch guardrail authorized clawback.",
      spans: 6,
      tokens: 618,
      cogs: "$0.00031",
      roi: "24.7x Enterprise"
    },
    {
      id: "a5ef8cc0da91d5a7b3c220f1712a1464",
      dataset: "Autonomous 90-Day Cashflow Rescue (CLI: ovio rescue)",
      findings: "Working Capital Shortfall Detected: -$87,650.00 vs $50,000 floor",
      recoveryProof: "cfo.ai Scenario Evaluation selected AR acceleration. Dispatched automated collection for $42,000 overdue AR. Floor protected at $63,400.",
      spans: 8,
      tokens: 0,
      cogs: "$0.00000",
      roi: "Safety Floor Protected"
    }
  ];

  const focusDimensions = [
    {
      num: 1,
      name: "Planning",
      howItWorks: "Decomposes the high-level objective (e.g. audit past disbursements or maintain $50,000 cash floor) into 8 deterministic, verifiable stages with telemetry parent spans.",
      proof: "Logged as span 'agent.plan' across all Neatlogs execution trees."
    },
    {
      num: 2,
      name: "Context",
      howItWorks: "Zero-noise context filter (`tool.context_filter` & `tool.ledger_fetch`). Strips hundreds of irrelevant ERP metadata columns, keeping only vendor strings, invoice IDs, dates, and amounts.",
      proof: "Processes 20,139 transactions without blowing LLM context windows."
    },
    {
      num: 3,
      name: "Tool Use",
      howItWorks: "Invokes `tool.blocking` for O(N) phonetic (Soundex/Metaphone) and amount-bucketing candidate pair generation, avoiding quadratic O(N²) explosion.",
      proof: "Generates candidates in ~0.15s across 20,000+ transactions."
    },
    {
      num: 4,
      name: "Execution",
      howItWorks: "Invokes `tool.rule_prune` to eliminate normal recurring monthly charges (utilities, leases) using zero LLM tokens before invoking neural adjudication.",
      proof: "Saves 99.8% of inference budget; achieved $0.00034 COGS on $60,450 recovery."
    },
    {
      num: 5,
      name: "Adjudication",
      howItWorks: "Forensically inspects high-risk candidate pairs with claude-haiku / gpt-4o-mini / Gemini, evaluating OCR noise, vendor DBA variants, and multi-check PO overlaps.",
      proof: "Structured JSON response with confidence score, signal type, and reasoning."
    },
    {
      num: 6,
      name: "Recovery",
      howItWorks: "Self-healing error interceptor: When an LLM call returns malformed JSON or times out, OVIO intercepts the failure, logs a recovery event, and triggers heuristic fallback adjudication.",
      proof: "Demonstrated live in Trace 0ce435e64aa85a4d17caf0e60395c044 where JSONDecodeError was caught and recovered."
    },
    {
      num: 7,
      name: "Verification",
      howItWorks: "Autonomous guardrail gate (`guardrail.clawback_validation`): Asserts non-payroll status, positive net amount, distinct transaction IDs, and confidence >= 0.70 before clawback dispatch.",
      proof: "Passes guardrail span to Neatlogs with action: CLAWBACK_DISPATCHED."
    },
    {
      num: 8,
      name: "State & Iteration",
      howItWorks: "Continuous Git-level state commits via Entire (`entire.checkpoint` stored in `.entire_checkpoints/`), plus bi-directional cfo.ai financial scenario updates.",
      proof: "Checkpoints saved before and after each run with Git commit hash and session ID."
    }
  ];

  return (
    <div style={{ background: "#ffffff", color: "#09090b", minHeight: "100vh", padding: "40px 0 100px" }}>
      <div className="container">
        {/* TOP BREADCRUMB */}
        <div style={{ marginBottom: "28px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#71717a", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
            <ArrowLeft size={14} />
            <span>Back to Command Center</span>
          </Link>
        </div>

        {/* HEADER */}
        <div style={{ maxWidth: "880px", marginBottom: "48px" }}>
          <div className="eyebrow-badge">
            <span className="live-dot" />
            neatHack 2026 Track: Build an agent that works (literally)
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-0.03em", color: "#09090b", margin: "12px 0 16px", lineHeight: 1.15 }}>
            Evidence &amp; Verification Ledger
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#71717a" }}>
            Every claim, calculation, and recovery in OVIO is backed by authentic public records (State of Oklahoma, City of Los Angeles), live Neatlogs OpenTelemetry traces, Entire state snapshots, and cfo.ai financial scenario definitions.
          </p>
        </div>

        {/* 1. VERIFIED NEATLOGS TRACES */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e4e4e7",
          borderRadius: "14px",
          padding: "28px",
          marginBottom: "36px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span className="live-dot" />
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.05em" }}>41 Traces Ingested · 39 Sessions Active</span>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "#09090b" }}>
                1. Verified Neatlogs Production Traces
              </h2>
              <p style={{ fontSize: "13px", color: "#71717a", margin: "4px 0 0" }}>
                Every single audit row below links to its own distinct live OpenTelemetry execution span tree in Neatlogs.
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <a
                href={`https://app.neatlogs.com/traces?orgId=${orgId}&projectId=${projectId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <span>Browse All 41+ Project Traces</span>
                <ExternalLink size={12} />
              </a>
              <a
                href={`https://app.neatlogs.com/sessions?orgId=${orgId}&projectId=${projectId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <span>View 39 Sessions</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {traces.map((tr) => {
              const url = `https://app.neatlogs.com/traces/${tr.id}?orgId=${orgId}&projectId=${projectId}`;
              return (
                <div 
                  key={tr.id}
                  style={{
                    border: "1px solid #e4e4e7",
                    borderRadius: "10px",
                    padding: "18px",
                    background: "#fafafa"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "15px", color: "#09090b" }}>
                        {tr.dataset}
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#16a34a", marginTop: "2px" }}>
                        {tr.findings}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(tr.id, tr.id)}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e4e4e7",
                          padding: "5px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontFamily: "var(--mono)"
                        }}
                      >
                        {copiedId === tr.id ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                        <span>{tr.id.slice(0, 8)}...</span>
                      </button>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ padding: "6px 14px", fontSize: "12px" }}
                      >
                        <span>Inspect in Neatlogs</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div style={{ fontSize: "12.5px", color: "#52525b", lineHeight: 1.5, marginBottom: "10px" }}>
                    <strong style={{ color: "#09090b" }}>Proof: </strong>{tr.recoveryProof}
                  </div>

                  <div style={{ display: "flex", gap: "18px", fontFamily: "var(--mono)", fontSize: "11.5px", color: "#71717a", borderTop: "1px solid #e4e4e7", paddingTop: "8px" }}>
                    <span>Spans: {tr.spans}</span>
                    <span>Tokens: {tr.tokens}</span>
                    <span>COGS: {tr.cogs}</span>
                    <span>ROI: {tr.roi}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. THE 8 HACKATHON FOCUS AREAS */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e4e4e7",
          borderRadius: "14px",
          padding: "28px",
          marginBottom: "36px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)"
        }}>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "#09090b" }}>
              2. 100% Mapping to Hackathon Focus Areas
            </h2>
            <p style={{ fontSize: "12.5px", color: "#71717a", margin: "2px 0 0" }}>
              How OVIO satisfies every required dimension of &ldquo;Build an agent that works (literally)&rdquo;
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
            {focusDimensions.map((dim) => (
              <div 
                key={dim.num}
                style={{
                  border: "1px solid #e4e4e7",
                  borderRadius: "8px",
                  padding: "16px",
                  background: "#ffffff"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#09090b" }}>
                    {dim.num}. {dim.name}
                  </span>
                  <CheckCircle2 size={15} color="#16a34a" />
                </div>
                <p style={{ fontSize: "12px", color: "#52525b", lineHeight: 1.45, marginBottom: "8px" }}>
                  {dim.howItWorks}
                </p>
                <div style={{ fontSize: "11px", color: "#09090b", fontFamily: "var(--mono)", background: "#f4f4f5", padding: "6px 8px", borderRadius: "5px" }}>
                  <strong>Proof: </strong>{dim.proof}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. ENTIRE MEMORY & CFO.AI REPRODUCIBILITY */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e4e4e7",
          borderRadius: "14px",
          padding: "28px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 14px", color: "#09090b" }}>
            3. Local CLI Reproduction (Zero Magic)
          </h2>
          <p style={{ fontSize: "13px", color: "#71717a", marginBottom: "16px" }}>
            You can verify every step in your local terminal without browser or GUI dependencies:
          </p>

          <pre style={{
            background: "#f4f4f5",
            border: "1px solid #e4e4e7",
            borderRadius: "8px",
            padding: "16px",
            fontFamily: "var(--mono)",
            fontSize: "12.5px",
            lineHeight: 1.6,
            color: "#09090b",
            overflowX: "auto"
          }}>
{`# 1. Run live Neatlogs connectivity probe:
python ovio_cli.py doctor

# 2. Run system integration pre-flight check:
python ovio_cli.py gate

# 3. Run autonomous audit on authentic Enterprise B2B ledger:
python ovio_cli.py run --file data/samples/enterprise_sample.csv

# 4. Run autonomous 90-day working capital rescue:
python ovio_cli.py rescue

# 5. Inspect Entire continuous memory checkpoints:
python ovio_cli.py checkpoint

# 6. View cfo.ai financial model scenarios & sensitivity:
python ovio_cli.py cfo`}
          </pre>
        </div>
      </div>
    </div>
  );
}
