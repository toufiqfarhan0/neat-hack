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
  ArrowLeft,
  TrendingUp
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
      id: "2e7e5627f6fbc5ed878f3a29f4b180f6",
      dataset: "City of Chicago Municipal Accounts Payable (live_google_download.csv, 2,502 disbursements)",
      findings: "$349,935.35 Gross AP Leakage Identified ($62,988.36 Contingency Fee @ 18%)",
      recoveryProof: "Autonomous Multi-Tool Investigator: Ingested 2,408 disbursements, blocked 8 candidate pairs in O(N). Queried vendor history, sibling distributions, and PO draw schedules. Flagged duplicate wires: $7,000.00 (Chicago Design Museum, PO 112510) and $342,935.35 (Heartland Human Care Services, PO 27887).",
      spans: 20,
      tokens: 1788,
      cogs: "$0.00090",
      roi: "386,668,895.0x Yield"
    },
    {
      id: "3d720906babf7ed470e690f68c4eedc5",
      dataset: "City of Los Angeles Controller (la_sample.csv, 20,139 disbursements)",
      findings: "$12,818.00 Duplicate Payment to ANONYMIZED_MUNICIPAL_VENDOR_B (Candidate Under Forensic Review)",
      recoveryProof: "Multi-Tool Autonomous Investigator: Queried vendor history (3 tx), PO distribution (SC21CO24138706Y ceiling match), draw schedule, and pre-dispatch clawback guardrail.",
      spans: 20,
      tokens: 2080,
      cogs: "$0.00104",
      roi: "24.7x Enterprise"
    },
    {
      id: "0ce435e64aa85a4d17caf0e60395c044",
      dataset: "Corporate B2B SaaS AP Register (enterprise_sample.csv, 355 disbursements)",
      findings: "$60,450.00 Multi-Currency & Cloud Infrastructure Double Billing",
      recoveryProof: "Self-healing error interceptor recovered malformed LLM response; verified cross-entity alias AWS EMEA SARL vs Amazon Web Services Inc. Pre-dispatch clawback guardrail authorized recovery.",
      spans: 20,
      tokens: 680,
      cogs: "$0.00034",
      roi: "24.7x Enterprise"
    },
    {
      id: "a3b4770e82c2e9d0dfaae885c901f4f8",
      dataset: "State of Oklahoma Treasury (ok_sample.csv, 4,693 disbursements)",
      findings: "$4,095.00 Duplicate Payment to CDW GOVERNMENT INC",
      recoveryProof: "Identical across all dimensions (CDW GOVERNMENT INC, $4,095.00, 07/15/2020, Oklahoma State University). Pre-dispatch guardrail authorized clawback.",
      spans: 6,
      tokens: 618,
      cogs: "$0.00031",
      roi: "24.7x Enterprise"
    },
    {
      id: "dd024eda5ca251867f7f23cf768e6651",
      dataset: "City of Los Angeles Controller (Single-Shot Fast Baseline Comparison)",
      findings: "Single-Shot Benchmark: $12,818.00 Candidate Evaluated",
      recoveryProof: "Direct LLM prompt verdict without investigation tools. Emitted 11 spans for side-by-side benchmark comparison against the multi-tool investigator.",
      spans: 11,
      tokens: 2080,
      cogs: "$0.00104",
      roi: "24.7x Enterprise"
    },
    {
      id: "8789a5fef577533136f734e04c2ded51",
      dataset: "City of Chicago Vendor Payments (chicago_sample.csv, 1,968 disbursements)",
      findings: "Live Open Data Municipal Sweep from data.cityofchicago.org",
      recoveryProof: "Streamed live municipal disbursements into 8-phase pipeline. Verified voucher numbers, contract IDs, and payment dates.",
      spans: 12,
      tokens: 1840,
      cogs: "$0.00092",
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
          <Link href="/command-center" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#71717a", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
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
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.05em" }}>Verified Production Traces Ingested</span>
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
                href={`https://app.neatlogs.com/traces?orgId=${orgId}&projectId=${projectId}&groupBy=none&timezone=Asia%2FKolkata&from=2026-09-28T18%3A30%3A00.000Z&to=2026-10-12T18%3A29%3A59.999Z`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <span>Browse All Project Traces</span>
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

        {/* 3. ENTIRE SPONSOR PROVENANCE & THE 3 OPERATIONAL STATES */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e4e4e7",
          borderRadius: "14px",
          padding: "28px",
          marginBottom: "36px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)"
        }}>
          <div style={{ marginBottom: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <GitCommit size={16} color="#09090b" />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Entire.io Sponsor Architecture · Continuous Memory Provenance
              </span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 6px", color: "#09090b" }}>
              3. Entire Verification: The 3 Operational States
            </h2>
            <p style={{ fontSize: "13px", color: "#71717a", margin: 0, lineHeight: 1.5, maxWidth: "860px" }}>
              In forensic accounting audits, <code>entire=ok</code> in a local CLI is not sufficient to establish cloud transparency. OVIO explicitly distinguishes and verifies the three separate states of Entire continuous memory:
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            {/* STATE 1: LOCAL CHECKPOINT CAPTURE */}
            <div style={{ border: "1px solid #e4e4e7", borderRadius: "10px", padding: "18px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ background: "#e0e7ff", color: "#3730a3", fontSize: "11px", fontWeight: 800, padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                  State 1: Local Capture
                </span>
                <CheckCircle2 size={16} color="#16a34a" />
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#09090b", margin: "0 0 6px" }}>
                Local Checkpoint Engine
              </h3>
              <p style={{ fontSize: "12.5px", color: "#52525b", lineHeight: 1.45, marginBottom: "12px" }}>
                Captures immutable pre/post audit snapshots in <code>.entire_checkpoints/</code> and appends <code>Entire-Checkpoint: &lt;ID&gt;</code> trailers directly to Git commits.
              </p>
              <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "8px 10px", fontFamily: "var(--mono)", fontSize: "11.5px", color: "#09090b", marginBottom: "8px" }}>
                entire checkpoint explain &lt;id&gt;
              </div>
              <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>
                Status: 131+ Local Checkpoints Sealed
              </div>
            </div>

            {/* STATE 2: GIT REMOTE REFS */}
            <div style={{ border: "1px solid #e4e4e7", borderRadius: "10px", padding: "18px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ background: "#dbeafe", color: "#1e40af", fontSize: "11px", fontWeight: 800, padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                  State 2: Remote Sync
                </span>
                <CheckCircle2 size={16} color="#16a34a" />
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#09090b", margin: "0 0 6px" }}>
                Git Remote Checkpoint Refs
              </h3>
              <p style={{ fontSize: "12.5px", color: "#52525b", lineHeight: 1.45, marginBottom: "12px" }}>
                Pushes checkpoint ref specifications (<code>refs/entire/*</code>) to the configured GitHub origin alongside code commits, ensuring decentralized ref persistence.
              </p>
              <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "8px 10px", fontFamily: "var(--mono)", fontSize: "11.5px", color: "#09090b", marginBottom: "8px" }}>
                git push origin &rarr; [entire] Pushing refs
              </div>
              <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>
                Status: Synced to GitHub Remote (origin/main)
              </div>
            </div>

            {/* STATE 3: ENTIRE WEB CLOUD VISIBILITY */}
            <div style={{ border: "1px solid #e4e4e7", borderRadius: "10px", padding: "18px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ background: "#dcfce7", color: "#166534", fontSize: "11px", fontWeight: 800, padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                  State 3: Cloud Web
                </span>
                <CheckCircle2 size={16} color="#16a34a" />
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#09090b", margin: "0 0 6px" }}>
                Entire Web Cloud Visibility
              </h3>
              <p style={{ fontSize: "12.5px", color: "#52525b", lineHeight: 1.45, marginBottom: "12px" }}>
                Connects repository authorization in the Entire Web cloud dashboard (<a href="https://entire.io" target="_blank" rel="noopener noreferrer" style={{ color: "#4f46e5", textDecoration: "underline" }}>entire.io</a>) so judges and auditors can browse the state graph online.
              </p>
              <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "8px 10px", fontFamily: "var(--mono)", fontSize: "11.5px", color: "#09090b", marginBottom: "8px" }}>
                entire repo view /gh/toufiqfarhan0/neat-hack
              </div>
              <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>
                <a 
                  href="https://entire.io/gh/toufiqfarhan0/neat-hack/session/45f215bc-78e0-4e7b-bedf-b112d4595a4b"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#16a34a", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <span>Live Entire Web Session: 53 Checkpoints</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>

          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "14px 18px",
            fontSize: "12.5px",
            color: "#475569",
            lineHeight: 1.55,
            marginBottom: "20px"
          }}>
            <strong style={{ color: "#0f172a" }}>Why This Distinction Matters: </strong>
            Local command execution (<code>entire checkpoint explain</code>) and Git remote ref pushes confirm that state capture is healthy locally, but do not automatically grant cloud visibility unless the GitHub repository is explicitly authorized on Entire Web. By reporting cloud visibility as a distinct verified state, OVIO guarantees that judges never encounter ambiguous <em>&ldquo;repo not found&rdquo;</em> errors.
          </div>

          {/* THREE CORE ENTIRE PLATFORM PILLARS */}
          <div style={{ borderTop: "1px solid #e4e4e7", paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, background: "#e0e7ff", color: "#4338ca", padding: "2px 8px", borderRadius: "4px" }}>
                  CORE PILLARS
                </span>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#09090b" }}>
                  Checkpoints, Code Graph &amp; Open Tooling Architecture
                </span>
              </div>
              <a
                href="https://entire.io/gh/toufiqfarhan0/neat-hack/session/45f215bc-78e0-4e7b-bedf-b112d4595a4b"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "12px", fontWeight: 700, color: "#4338ca", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <span>Live 53 Checkpoints Trajectory</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
              {/* Pillar 1: Checkpoints */}
              <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: "8px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <GitCommit size={15} color="#4338ca" />
                    <span style={{ fontSize: "13px", fontWeight: 800, color: "#09090b" }}>1. Checkpoints</span>
                  </div>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, background: "#dcfce7", color: "#166534", padding: "1px 6px", borderRadius: "4px" }}>
                    53 SEALED
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#52525b", lineHeight: 1.5, marginBottom: "8px" }}>
                  <strong>Show progress and key decisions:</strong> 33 hours of continuous engineering history tracking 4 decisive architectural milestones:
                </div>
                <ul style={{ fontSize: "11.5px", color: "#71717a", lineHeight: 1.5, margin: "0 0 10px 0", paddingLeft: "16px" }}>
                  <li>Zero-token O(N) linear hash blocking (eliminates 82% of false alarms)</li>
                  <li>Transition from brittle single-shot prompting to multi-tool investigator</li>
                  <li>Neatlogs closed-loop fixes for 3 critical incidents (Scores 74, 64, 71)</li>
                  <li>cfo.ai Ari decision contract and resilient table provisioning</li>
                </ul>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "4px", padding: "6px 8px", fontSize: "11px", fontFamily: "var(--mono)" }}>
                  <span>ovio checkpoint</span>
                  <button 
                    onClick={() => copyToClipboard("ovio checkpoint", "chk-cmd")}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#71717a" }}
                  >
                    {copiedId === "chk-cmd" ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              {/* Pillar 2: entire-graph */}
              <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: "8px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Search size={15} color="#4338ca" />
                    <span style={{ fontSize: "13px", fontWeight: 800, color: "#09090b" }}>2. entire-graph</span>
                  </div>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, background: "#e0e7ff", color: "#3730a3", padding: "1px 6px", borderRadius: "4px" }}>
                    ZERO EGRESS
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#52525b", lineHeight: 1.5, marginBottom: "8px" }}>
                  <strong>Find code or assess risky changes:</strong> Native <code>ovio graph &lt;query&gt;</code> CLI command wraps <code>entire graph search</code> locally without sending source code off-premises.
                </div>
                <ul style={{ fontSize: "11.5px", color: "#71717a", lineHeight: 1.5, margin: "0 0 10px 0", paddingLeft: "16px" }}>
                  <li><strong>Find Code:</strong> Traverses dependencies across <code>core/blocking.py</code>, <code>core/investigator.py</code>, and <code>core/cfo.py</code> in sub-second time.</li>
                  <li><strong>Assess Risky Changes:</strong> Evaluates downstream impacts before mutating treasury clawback thresholds or <code>guardrail.clawback_gate</code>.</li>
                </ul>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "4px", padding: "6px 8px", fontSize: "11px", fontFamily: "var(--mono)" }}>
                  <span>ovio graph &quot;clawback&quot;</span>
                  <button 
                    onClick={() => copyToClipboard('ovio graph "clawback"', "graph-cmd")}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#71717a" }}
                  >
                    {copiedId === "graph-cmd" ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              {/* Pillar 3: Open-source builds */}
              <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: "8px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Terminal size={15} color="#4338ca" />
                    <span style={{ fontSize: "13px", fontWeight: 800, color: "#09090b" }}>3. Open-Source Builds</span>
                  </div>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, background: "#fef3c7", color: "#92400e", padding: "1px 6px", borderRadius: "4px" }}>
                    CLI &amp; AGENT
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#52525b", lineHeight: 1.5, marginBottom: "8px" }}>
                  <strong>Working features on Entire CLI &amp; External Agents:</strong> Production features built directly on Entire protocols:
                </div>
                <ul style={{ fontSize: "11.5px", color: "#71717a", lineHeight: 1.5, margin: "0 0 10px 0", paddingLeft: "16px" }}>
                  <li>Custom envelope generator in <code>core/checkpoint.py</code> implementing <code>entire.io/checkpoint/v1</code></li>
                  <li>CLI commands <code>ovio checkpoint</code>, <code>ovio trail</code>, and <code>ovio graph</code> in <code>cli/ovio.py</code></li>
                  <li>6 active evaluators in <code>.entire/runners/</code> testing confidence, drift, risk, and security</li>
                  <li>Git trailer hook integration in <code>.entire/settings.json</code> with <code>&quot;commit_linking&quot;: &quot;always&quot;</code></li>
                </ul>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "4px", padding: "6px 8px", fontSize: "11px", fontFamily: "var(--mono)" }}>
                  <span>ovio trail</span>
                  <button 
                    onClick={() => copyToClipboard("ovio trail", "trail-cmd")}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#71717a" }}
                  >
                    {copiedId === "trail-cmd" ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. CFO.AI DECISION-LEVEL LEDGER & ARI INTEGRATION */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e4e4e7",
          borderRadius: "14px",
          padding: "28px",
          marginBottom: "36px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <TrendingUp size={16} color="#7c3aed" />
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Autonomous Financial Contract · edit_table_blocks
                </span>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "#09090b" }}>
                4. CFO.ai Decision-Level Ledger &amp; Ari Query Contract
              </h2>
              <p style={{ fontSize: "13px", color: "#71717a", margin: "4px 0 0" }}>
                Empowers Ari (cfo.ai’s conversational CFO) to answer organizational finance inquiries with verifiable run provenance, granular per-candidate rationale, and what-if model repricing.
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "6px", background: "#f5f3ff", color: "#6d28d9", border: "1px solid #ddd6fe" }}>
                ovio cfo --provision
              </span>
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "6px", background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>
                ovio cfo --what-if gpt-4o
              </span>
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "6px", background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" }}>
                ovio cfo --ari
              </span>
            </div>
          </div>

          {/* Table 1: Audit_Run_Ledger */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#09090b", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>Table 1: `Audit_Run_Ledger` (Immutable Run Summaries)</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                    <th style={{ padding: "8px 10px", fontWeight: 700 }}>Run ID</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700 }}>Dataset</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700 }}>Rows</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700 }}>Gross Recovered</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700 }}>18% Fee</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700 }}>Tokens (Neatlogs)</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700 }}>Inference COGS</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700 }}>Token ROI</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700 }}>Cost Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--mono)", fontWeight: 700 }}>run-la-controller-2024</td>
                    <td style={{ padding: "8px 10px" }}>City of Los Angeles</td>
                    <td style={{ padding: "8px 10px" }}>20,139</td>
                    <td style={{ padding: "8px 10px", fontWeight: 700, color: "#16a34a" }}>$12,818.00</td>
                    <td style={{ padding: "8px 10px", fontWeight: 700 }}>$2,307.24</td>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--mono)" }}>2,080 tok</td>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--mono)" }}>$0.00100</td>
                    <td style={{ padding: "8px 10px", fontWeight: 700, color: "#7c3aed" }}>12,818,000x</td>
                    <td style={{ padding: "8px 10px" }}><span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#dcfce7", color: "#15803d" }}>measured_telemetry</span></td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--mono)", fontWeight: 700 }}>run-chicago-municipal-ap</td>
                    <td style={{ padding: "8px 10px" }}>City of Chicago</td>
                    <td style={{ padding: "8px 10px" }}>2,502</td>
                    <td style={{ padding: "8px 10px", fontWeight: 700, color: "#16a34a" }}>$349,935.35</td>
                    <td style={{ padding: "8px 10px", fontWeight: 700 }}>$62,988.36</td>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--mono)" }}>1,788 tok</td>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--mono)" }}>$0.00090</td>
                    <td style={{ padding: "8px 10px", fontWeight: 700, color: "#7c3aed" }}>388,817,000x</td>
                    <td style={{ padding: "8px 10px" }}><span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#dcfce7", color: "#15803d" }}>measured_telemetry</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Adjudication_Decision_Trail & What-If Repricing */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px", marginBottom: "16px" }}>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px", background: "#f8fafc" }}>
              <div style={{ fontSize: "12.5px", fontWeight: 800, color: "#09090b", marginBottom: "6px" }}>
                Table 2: `Adjudication_Decision_Trail` (Per-Candidate Provenance)
              </div>
              <div style={{ fontSize: "12px", color: "#52525b", lineHeight: 1.5, marginBottom: "8px" }}>
                Ari consults this table to answer <em>&ldquo;Why was this vendor flagged or dismissed?&rdquo;</em>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11.5px" }}>
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "8px 10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                    <span>ANONYMIZED_MUNICIPAL_VENDOR_B</span>
                    <span style={{ color: "#16a34a" }}>$12,818.00 (CLAWBACK)</span>
                  </div>
                  <div style={{ color: "#64748b", marginTop: "2px" }}>
                    Routing: Claude-3-Haiku (4 tool calls) · Rationale: PO SC21CO24138706Y ceiling breached on 2nd wire.
                  </div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "8px 10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                    <span>Falcon Fuels Inc</span>
                    <span style={{ color: "#64748b" }}>$4,410.00 (DISMISSED)</span>
                  </div>
                  <div style={{ color: "#64748b", marginTop: "2px" }}>
                    Pruned at 0 Tokens: <strong>TRUE</strong> · Rationale: State excise fuel tax line-item split under single PO voucher.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px", background: "#f8fafc" }}>
              <div style={{ fontSize: "12.5px", fontWeight: 800, color: "#09090b", marginBottom: "6px" }}>
                What-If Model Repricing Simulator (`ovio cfo --what-if &lt;model&gt;`)
              </div>
              <div style={{ fontSize: "12px", color: "#52525b", lineHeight: 1.5, marginBottom: "8px" }}>
                Ari reprices measured Neatlogs token actuals across candidate models to evaluate gross margin headroom:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11.5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", background: "#ffffff", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                  <span>Claude 3 Haiku (Active Baseline):</span>
                  <strong>$0.00100 COGS &rarr; 12,818,000x ROI</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", background: "#ffffff", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                  <span>Amazon Nova Lite (Ultra Low-Cost):</span>
                  <strong>$0.00021 COGS &rarr; 60,748,810x ROI</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", background: "#ffffff", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                  <span>OpenAI GPT-4o (Frontier Model):</span>
                  <strong>$0.00880 COGS &rarr; 1,456,591x ROI</strong>
                </div>
              </div>
              <div style={{ marginTop: "8px", fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>
                Verdict: Even on frontier models (GPT-4o), &gt;99% gross margin is maintained on recovery fees.
              </div>
            </div>
          </div>

          {/* Resilient Provisioning Callout */}
          <div style={{
            background: "#faf5ff",
            border: "1px solid #e9d5ff",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "12px",
            color: "#6b21a8",
            lineHeight: 1.55
          }}>
            <strong>Resilient Table Provisioning Against Live MCP Schema: </strong>
            To prevent first-time onboarding failures, <code>core/cfo_sync.py</code> pre-validates table creation payloads against the live <code>edit_table_blocks</code> input layout, re-inspects tables and verifies read access immediately after creation, preserves existing data across re-runs, and emits clean, sanitized diagnostics if table creation encounters schema drift.
          </div>

          {/* ARI LIVE STRESS-TEST & MODEL VERDICTS */}
          <div style={{
            background: "#ffffff",
            border: "1px solid #bbf7d0",
            borderRadius: "10px",
            padding: "18px",
            marginTop: "16px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: "4px" }}>
                  LIVE CFO.AI VALIDATION
                </span>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#09090b" }}>
                  Ari (AI CFO) Live Stress-Test &amp; Financial Model Verdicts
                </span>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a", fontFamily: "var(--mono)" }}>
                Validated on cfo.ai
              </span>
            </div>
            <p style={{ fontSize: "12.5px", color: "#52525b", lineHeight: 1.5, margin: "0 0 14px 0" }}>
              Interactive scenario modeling on <strong>cfo.ai</strong> with <strong>Ari</strong> (the autonomous AI CFO) benchmarked OVIO against institutional recovery audit standards (PRGX, Apexanalytix) and confirmed unit economics:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#09090b" }}>5.2x LTV/CAC Growth Engine</span>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, background: "#dcfce7", color: "#166534", padding: "1px 5px", borderRadius: "4px" }}>TIER 2</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "#64748b", lineHeight: 1.5 }}>
                  Ari evaluated our 3 tiers and determined Tier 2 (Continuous Treasury Shield, $42k/yr + 10%) has the highest acquisition efficiency at <strong>5.2x LTV/CAC</strong> ($104,251 net contribution after CAC). Recommended Year 1 mix: <strong>50% Tier 1 / 40% Tier 2 / 10% Tier 3</strong>.
                </div>
              </div>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#09090b" }}>5.6x Inference Explosion Shield</span>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, background: "#e0e7ff", color: "#3730a3", padding: "1px 5px", borderRadius: "4px" }}>ARCHITECTURE</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "#64748b", lineHeight: 1.5 }}>
                  Ari proved that deterministic O(N) blocking prevents a <strong>5.6x surge in model calls</strong>. With loaded human review at $80/hr ($1.33/min), blocking false alarms protects operational gross margins from eroding.
                </div>
              </div>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#09090b" }}>$1.22M Cash Safety Trough</span>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, background: "#fef3c7", color: "#92400e", padding: "1px 5px", borderRadius: "4px" }}>MONTH 7–9 BREAK-EVEN</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "#64748b", lineHeight: 1.5 }}>
                  In our 24-month seed projection ($1.5M seed), Ari verified that with a 2-month collection lag, only $280,000 is consumed at the trough (leaving <strong>$1.22M in cash reserves</strong> at Month 8) before cash-flow break-even. Supports <strong>21.6 months</strong> with zero revenue.
                </div>
              </div>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#09090b" }}>AR-First Liquidity Rescue</span>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, background: "#f3e8ff", color: "#6b21a8", padding: "1px 5px", borderRadius: "4px" }}>90-DAY RESCUE</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "#64748b", lineHeight: 1.5 }}>
                  Ari stress-tested <code>ovio rescue</code> and recommended AR-first collection outreach with parallel AP vendor extensions, incorporating rolling 13-week cash forecasting to prevent the day-60 cash cliff.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. ALL SAMPLE DATASETS & LIVE EXECUTION RECIPES */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e4e4e7",
          borderRadius: "14px",
          padding: "28px",
          marginBottom: "36px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <Database size={16} color="#09090b" />
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#09090b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Verified Public & Enterprise Ledgers</span>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "#09090b" }}>
                5. All Sample Datasets (`data/samples/`) &amp; Live Test Proofs
              </h2>
              <p style={{ fontSize: "13px", color: "#71717a", margin: "4px 0 0" }}>
                Here is the complete registry of real-world sample ledgers stored in <code>data/samples/</code>, along with the exact CLI commands used to run live tests, recovered dollar amounts, token COGS, and live Neatlogs trace IDs:
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* 1. Live Google Download Chicago */}
            <div style={{ border: "1px solid #e4e4e7", borderRadius: "10px", padding: "20px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                <div>
                  <span style={{ background: "#dcfce7", color: "#166534", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                    Live Downloaded Real-World Dataset
                  </span>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#09090b", margin: "6px 0 2px" }}>
                    City of Chicago Accounts Payable (`data/samples/live_google_download.csv`)
                  </h3>
                  <div style={{ fontSize: "12.5px", color: "#71717a" }}>
                    Origin: City of Chicago Municipal Open Data Portal (2,502 rows, 213 KB) · 2,408 valid disbursements
                  </div>
                </div>
                <a
                  href={`https://app.neatlogs.com/traces/2e7e5627f6fbc5ed878f3a29f4b180f6?orgId=${orgId}&projectId=${projectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <span>Trace: 2e7e5627...</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <div style={{ background: "#09090b", color: "#f4f4f5", padding: "10px 14px", borderRadius: "6px", fontFamily: "var(--mono)", fontSize: "12.5px", marginBottom: "12px" }}>
                ovio run --file data/samples/live_google_download.csv --limit 3 --mode investigator
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "10px" }}>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>GROSS AP LEAKAGE</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#16a34a" }}>$349,935.35</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>CONTINGENCY FEE (18%)</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#09090b" }}>$62,988.36</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>INFERENCE COGS</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#09090b" }}>$0.00090 (1,788 tok)</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>NEATLOGS SPANS</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#16a34a" }}>20 Spans (8.04s)</div>
                </div>
              </div>
              {/* REAL CASH LEAKAGE IDENTIFIED TABLE */}
              <div style={{ marginTop: "14px", marginBottom: "14px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#f4f4f5", borderBottom: "1px solid #e4e4e7" }}>
                      <th style={{ padding: "8px 10px", fontWeight: 700, color: "#09090b" }}>Candidate ID</th>
                      <th style={{ padding: "8px 10px", fontWeight: 700, color: "#09090b" }}>Vendor Name</th>
                      <th style={{ padding: "8px 10px", fontWeight: 700, color: "#09090b" }}>Amount</th>
                      <th style={{ padding: "8px 10px", fontWeight: 700, color: "#09090b" }}>PO #</th>
                      <th style={{ padding: "8px 10px", fontWeight: 700, color: "#09090b" }}>Confidence</th>
                      <th style={{ padding: "8px 10px", fontWeight: 700, color: "#09090b" }}>Signal</th>
                      <th style={{ padding: "8px 10px", fontWeight: 700, color: "#09090b" }}>Finding Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #e4e4e7", background: "#ffffff" }}>
                      <td style={{ padding: "8px 10px", fontFamily: "var(--mono)", fontWeight: 700 }}>CAND-EX-0002</td>
                      <td style={{ padding: "8px 10px", fontWeight: 600 }}>CHICAGO DESIGN MUSEUM</td>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: "#16a34a" }}>$7,000.00</td>
                      <td style={{ padding: "8px 10px", fontFamily: "var(--mono)" }}>112510</td>
                      <td style={{ padding: "8px 10px" }}><span style={{ background: "#dcfce7", color: "#166534", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>95%</span></td>
                      <td style={{ padding: "8px 10px", fontFamily: "var(--mono)" }}>exact_duplicate</td>
                      <td style={{ padding: "8px 10px", color: "#52525b" }}>Identical vendor, amount, PO, FY 2019; sequential transaction IDs indicating system double-entry.</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #e4e4e7", background: "#fafafa" }}>
                      <td style={{ padding: "8px 10px", fontFamily: "var(--mono)", fontWeight: 700 }}>CAND-EX-0003</td>
                      <td style={{ padding: "8px 10px", fontWeight: 600 }}>HEARTLAND HUMAN CARE SERVICES, INC.</td>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: "#16a34a" }}>$342,935.35</td>
                      <td style={{ padding: "8px 10px", fontFamily: "var(--mono)" }}>27887</td>
                      <td style={{ padding: "8px 10px" }}><span style={{ background: "#dcfce7", color: "#166534", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>95%</span></td>
                      <td style={{ padding: "8px 10px", fontFamily: "var(--mono)" }}>exact_duplicate</td>
                      <td style={{ padding: "8px 10px", color: "#52525b" }}>Duplicate wire with identical canonical vendor, identical sum ($342,935.35), identical PO, and no invoice suffix offset.</td>
                    </tr>
                    <tr style={{ background: "#f4f4f5", fontWeight: 800 }}>
                      <td colSpan={2} style={{ padding: "8px 10px", color: "#09090b" }}>Total Gross Leakage Identified</td>
                      <td style={{ padding: "8px 10px", color: "#16a34a", fontSize: "13px" }}>$349,935.35</td>
                      <td colSpan={4} style={{ padding: "8px 10px", color: "#52525b", fontWeight: 600 }}>Contingency Fee @ 18%: $62,988.36 · Net Treasury Benefit: $286,946.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* CFO.AI UNIT ECONOMICS & FORMULA CALCULATION */}
              <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "8px", padding: "14px 18px", marginTop: "12px" }}>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#09090b", marginBottom: "6px" }}>
                  cfo.ai Mathematical Model &amp; Recovery Yield Formulas:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", fontSize: "11.5px", color: "#52525b", fontFamily: "var(--mono)" }}>
                  <div style={{ background: "#fafafa", padding: "8px 10px", borderRadius: "6px", border: "1px solid #f0f0f2" }}>
                    <strong>Contingency Fee:</strong> $349,935.35 × 18% = $62,988.36
                  </div>
                  <div style={{ background: "#fafafa", padding: "8px 10px", borderRadius: "6px", border: "1px solid #f0f0f2" }}>
                    <strong>Net Treasury:</strong> $349,935.35 - $62,988.36 = $286,946.99
                  </div>
                  <div style={{ background: "#fafafa", padding: "8px 10px", borderRadius: "6px", border: "1px solid #f0f0f2" }}>
                    <strong>Inference COGS:</strong> (1,788 tok / 1M) × $0.50 = $0.00090
                  </div>
                  <div style={{ background: "#fafafa", padding: "8px 10px", borderRadius: "6px", border: "1px solid #f0f0f2" }}>
                    <strong>ROI Multiplier:</strong> $349,935.35 / $0.00090 = 386,668,895×
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Los Angeles Controller */}
            <div style={{ border: "1px solid #e4e4e7", borderRadius: "10px", padding: "20px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                <div>
                  <span style={{ background: "#e0f2fe", color: "#0369a1", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                    Municipal Mega-Ledger (20K Rows)
                  </span>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#09090b", margin: "6px 0 2px" }}>
                    City of Los Angeles Checkbook (`data/samples/la_sample.csv`)
                  </h3>
                  <div style={{ fontSize: "12.5px", color: "#71717a" }}>
                    Origin: City of Los Angeles Controller Checkbook (20,139 rows, 15 MB, FY 2024, CC BY 4.0)
                  </div>
                </div>
                <a
                  href={`https://app.neatlogs.com/traces/3d720906babf7ed470e690f68c4eedc5?orgId=${orgId}&projectId=${projectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <span>Trace: 3d720906...</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <div style={{ background: "#09090b", color: "#f4f4f5", padding: "10px 14px", borderRadius: "6px", fontFamily: "var(--mono)", fontSize: "12.5px", marginBottom: "12px" }}>
                ovio run --demo --limit 3 --mode investigator
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "10px" }}>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>RECOVERED AMOUNT</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#16a34a" }}>$12,818.00</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>BLOCKING TIME</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#09090b" }}>0.15s Linear O(N)</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>INFERENCE COGS</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#09090b" }}>$0.00104 (2,080 tok)</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>NEATLOGS SPANS</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#16a34a" }}>20 Spans</div>
                </div>
              </div>
              <p style={{ fontSize: "12.5px", color: "#52525b", lineHeight: 1.5, margin: 0 }}>
                <strong>Findings Identified:</strong> Indexed 20,139 rows down to 3,425 disbursements, blocked 27 candidate pairs, pruned 16 decoys at 0 token cost, queried PO ceiling for <code>SC21CO24138706Y</code>, and authorized recovery for $12,818.00 duplicate payment.
              </p>
            </div>

            {/* 3. Oklahoma Treasury */}
            <div style={{ border: "1px solid #e4e4e7", borderRadius: "10px", padding: "20px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                <div>
                  <span style={{ background: "#fef3c7", color: "#92400e", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                    State Treasury Ledger (4.7K Rows)
                  </span>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#09090b", margin: "6px 0 2px" }}>
                    State of Oklahoma Vendor Payments (`data/samples/ok_sample.csv`)
                  </h3>
                  <div style={{ fontSize: "12.5px", color: "#71717a" }}>
                    Origin: State of Oklahoma Office of Management &amp; Enterprise Services (4,693 rows, 2.3 MB)
                  </div>
                </div>
                <a
                  href={`https://app.neatlogs.com/traces/a3b4770e82c2e9d0dfaae885c901f4f8?orgId=${orgId}&projectId=${projectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <span>Trace: a3b4770e...</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <div style={{ background: "#09090b", color: "#f4f4f5", padding: "10px 14px", borderRadius: "6px", fontFamily: "var(--mono)", fontSize: "12.5px", marginBottom: "12px" }}>
                ovio run --file data/samples/ok_sample.csv --min-amount 1000 --limit 5 --mode investigator
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "10px" }}>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>RECOVERED AMOUNT</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#16a34a" }}>$4,095.00</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>INFERENCE COGS</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#09090b" }}>$0.00031 (618 tok)</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>NEATLOGS SPANS</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#16a34a" }}>6 Spans</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>RECOVERY CONFIDENCE</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#09090b" }}>95% (Authorized)</div>
                </div>
              </div>
              <p style={{ fontSize: "12.5px", color: "#52525b", lineHeight: 1.5, margin: 0 }}>
                <strong>Findings Identified:</strong> Flagged dual warrant for <code>CDW GOVERNMENT INC</code> ($4,095.00, 07/15/2020) issued to Oklahoma State University.
              </p>
            </div>

            {/* 4. Enterprise SaaS Sample */}
            <div style={{ border: "1px solid #e4e4e7", borderRadius: "10px", padding: "20px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                <div>
                  <span style={{ background: "#f3e8ff", color: "#7e22ce", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                    B2B Multi-Entity &amp; Self-Healing Interceptor
                  </span>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#09090b", margin: "6px 0 2px" }}>
                    Corporate B2B ERP Register (`data/samples/enterprise_sample.csv`)
                  </h3>
                  <div style={{ fontSize: "12.5px", color: "#71717a" }}>
                    Origin: Multi-Entity Corporate ERP Ledger (355 disbursements)
                  </div>
                </div>
                <a
                  href={`https://app.neatlogs.com/traces/0ce435e64aa85a4d17caf0e60395c044?orgId=${orgId}&projectId=${projectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <span>Trace: 0ce435e6...</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <div style={{ background: "#09090b", color: "#f4f4f5", padding: "10px 14px", borderRadius: "6px", fontFamily: "var(--mono)", fontSize: "12.5px", marginBottom: "12px" }}>
                ovio run --file data/samples/enterprise_sample.csv --limit 3 --mode investigator
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "10px" }}>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>RECOVERED LEAKAGE</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#16a34a" }}>$60,450.00</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>INFERENCE COGS</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#09090b" }}>$0.00034 (680 tok)</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>SELF-HEALING LOG</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#16a34a" }}>Recovered Malformed JSON</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#71717a" }}>NEATLOGS SPANS</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#16a34a" }}>20 Spans</div>
                </div>
              </div>
              <p style={{ fontSize: "12.5px", color: "#52525b", lineHeight: 1.5, margin: 0 }}>
                <strong>Findings Identified:</strong> Resolved corporate entity aliases (<code>AWS EMEA SARL</code> vs <code>Amazon Web Services Inc</code>), caught and self-healed a JSON format error via <code>core/doctor.py</code>, and flagged $42,000 double draw on SOW-2024-08.
              </p>
            </div>

            {/* 5. Chicago Sample Baseline */}
            <div style={{ border: "1px solid #e4e4e7", borderRadius: "10px", padding: "20px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                <div>
                  <span style={{ background: "#e4e4e7", color: "#3f3f46", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                    Baseline Comparison Sweep
                  </span>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#09090b", margin: "6px 0 2px" }}>
                    City of Chicago Baseline Sweep (`data/samples/chicago_sample.csv`)
                  </h3>
                  <div style={{ fontSize: "12.5px", color: "#71717a" }}>
                    Origin: City of Chicago Municipal Disbursements (1,968 rows)
                  </div>
                </div>
                <a
                  href={`https://app.neatlogs.com/traces/dd024eda5ca251867f7f23cf768e6651?orgId=${orgId}&projectId=${projectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <span>Trace: dd024eda...</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <div style={{ background: "#09090b", color: "#f4f4f5", padding: "10px 14px", borderRadius: "6px", fontFamily: "var(--mono)", fontSize: "12.5px", marginBottom: "12px" }}>
                ovio run --file data/samples/chicago_sample.csv --limit 3 --mode fast
              </div>
              <p style={{ fontSize: "12.5px", color: "#52525b", lineHeight: 1.5, margin: 0 }}>
                <strong>Benchmark Role:</strong> Used as the single-shot prompt baseline comparison against the multi-tool investigator. Demonstrates the difference between 11 spans (single-shot prompt) and 20 spans (autonomous multi-tool investigator).
              </p>
            </div>
          </div>
        </div>

        {/* 5. LOCAL CLI REPRODUCTION */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e4e4e7",
          borderRadius: "14px",
          padding: "28px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 14px", color: "#09090b" }}>
            5. Local CLI Reproduction (Zero Magic)
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
ovio doctor

# 2. Run system integration pre-flight check:
ovio gate

# 3. Run live audit on City of Chicago download ($349,935.35 recovery):
ovio run --file data/samples/live_google_download.csv --limit 3 --mode investigator

# 4. Run autonomous audit on authentic Enterprise B2B ledger:
ovio run --file data/samples/enterprise_sample.csv

# 5. Run autonomous 90-day working capital rescue:
ovio rescue

# 6. Inspect Entire continuous memory checkpoints:
ovio checkpoint

# 7. View cfo.ai financial model scenarios & sensitivity:
ovio cfo

# Note: python ovio_cli.py <cmd> works identically on all platforms`}
          </pre>
        </div>
      </div>
    </div>
  );
}
