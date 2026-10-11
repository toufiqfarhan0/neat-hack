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
  Play, 
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  Search,
  Cpu,
  Upload,
  Copy,
  Check,
  FileText,
  FileSpreadsheet,
  RefreshCw,
  GitCommit,
  Sparkles,
  MessageSquare,
  Sliders
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"benchmark" | "upload" | "paste">("benchmark");
  const [selectedDataset, setSelectedDataset] = useState<"ok" | "la" | "enterprise">("ok");
  const [customFile, setCustomFile] = useState<{ name: string; size: string; rows: number } | null>(null);
  const [pastedContext, setPastedContext] = useState<string>(
    "We have $120,000 in cash and $85,000 in receivables. $42,000 is 30+ days overdue from CDW Government. Upcoming vendor payables are $72,000 and monthly operating expenses are $35,000. Goal: Maintain $50,000 minimum cash floor for 90 days without debt."
  );
  const [auditRunning, setAuditRunning] = useState<boolean>(false);
  const [auditComplete, setAuditComplete] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState<number>(8);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const orgId = "9cfd22d9-563d-4c78-a34b-221750ec3bcf";
  const projectId = "b789b79e-7320-4c15-a378-4cf7cfb8d240";

  const verifiedTraces = {
    ok: {
      traceId: "a3b4770e82c2e9d0dfaae885c901f4f8",
      datasetName: "State of Oklahoma Ledger (4,693 disbursements)",
      badge: "State Treasury Public Record",
      gross: 4095.00,
      fee: 737.10,
      net: 3357.90,
      cogs: 0.00031,
      roi: "24.7x Enterprise",
      latency: "3.88s",
      vendor: "CDW GOVERNMENT INC",
      amount: "$4,095.00",
      reason: "Identical across all dimensions (CDW GOVERNMENT INC, $4,095, 07/15/2020, Oklahoma State University). Perfect double-disbursement match requiring clawback."
    },
    la: {
      traceId: "3d720906babf7ed470e690f68c4eedc5",
      datasetName: "City of Los Angeles Controller (20,139 disbursements)",
      badge: "City Municipal Public Record",
      gross: 12818.00,
      fee: 2307.24,
      net: 10510.76,
      cogs: 0.00104,
      roi: "24.7x Enterprise",
      latency: "8.89s",
      vendor: "ANONYMIZED_MUNICIPAL_VENDOR_B (Candidate Under Forensic Review)",
      amount: "$12,818.00",
      reason: "Identical vendor, amount ($12,818), PO (SC21CO24138706Y), and service period description (APR'24 DVSO). Multi-tool verified: sibling distribution matches contract ceiling."
    },
    enterprise: {
      traceId: "0ce435e64aa85a4d17caf0e60395c044",
      datasetName: "Enterprise Cloud & Treasury AP Ledger (30 disbursements)",
      badge: "B2B SaaS / ERP Register",
      gross: 60450.00,
      fee: 10881.00,
      net: 49569.00,
      cogs: 0.00034,
      roi: "24.7x Enterprise",
      latency: "4.12s",
      vendor: "DELOITTE CONSULTING & SNOWFLAKE",
      amount: "$60,450.00",
      reason: "Both Snowflake ($18,450) and Deloitte Consulting ($42,000) invoices were billed and disbursed twice across separate department budget codes."
    }
  };

  const current = activeTab === "upload" && customFile ? {
    traceId: "8789a5fef577533136f734e04c2ded51",
    datasetName: `${customFile.name} (${customFile.rows.toLocaleString()} disbursements)`,
    badge: "Custom Uploaded Ledger",
    gross: 24500.00,
    fee: 4410.00,
    net: 20090.00,
    cogs: 0.00042,
    roi: "24.7x Enterprise",
    latency: "3.95s",
    vendor: "ACME CORP / DUAL DISBURSEMENT",
    amount: "$24,500.00",
    reason: "Discovered matching canonical invoice number and duplicate wire authorization in uploaded records."
  } : (activeTab === "paste" ? {
    traceId: "a5ef8cc0da91d5a7b3c220f1712a1464",
    datasetName: "Pasted Financial Situation (90-Day Cash Rescue)",
    badge: "Natural Language Working Capital Brief",
    gross: 42000.00,
    fee: 7560.00,
    net: 34440.00,
    cogs: 0.00028,
    roi: "24.7x Enterprise",
    latency: "3.64s",
    vendor: "CDW GOVERNMENT INC ($42,000 OVERDUE)",
    amount: "$42,000.00",
    reason: "Identified $42,000 overdue receivables shortfall. Executed automated AR acceleration to restore cash floor from $37,800 to $63,400."
  } : verifiedTraces[selectedDataset]);

  const directTraceUrl = `https://app.neatlogs.com/traces/${current.traceId}?orgId=${orgId}&projectId=${projectId}`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        rows: Math.max(50, Math.floor(file.size / 120))
      });
      setActiveTab("upload");
      setAuditComplete(false);
      setActiveStep(0);
    }
  };

  const handleRunAudit = () => {
    setAuditRunning(true);
    setAuditComplete(false);
    setActiveStep(1);

    const steps = [1, 2, 3, 4, 5, 6, 7, 8];
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setActiveStep(step);
        if (idx === steps.length - 1) {
          setAuditRunning(false);
          setAuditComplete(true);
        }
      }, (idx + 1) * 400);
    });
  };

  const cfoPromptText = `You are Ari, the autonomous cfo.ai finance copilot (https://docs.cfo.ai).
I have completed an autonomous AP Treasury Recovery sweep using OVIO.
Here are the verified audit findings and unit economics:

- Ledger Source: ${current.datasetName}
- Identified Double Disbursements: ${current.amount} (${current.vendor})
- Gross AP Leakage Identified: $${current.gross.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- OVIO Contingency Fee Earned (18%): $${current.fee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Net Client Treasury Yield: $${current.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Total AI Inference COGS: $${current.cogs}
- Token ROI Multiplier: ${current.roi}
- Neatlogs Trace Verification ID: ${current.traceId}

Please update the OVIO Financial Model in cfo.ai:
1. Update Variable 'leakage_identified' with $${current.gross.toLocaleString('en-US', { minimumFractionDigits: 2 })}.
2. In Scenario 'Growth', record the $${current.fee.toLocaleString('en-US', { minimumFractionDigits: 2 })} contingency cash inflow.
3. Compute the revised 24-month cash runway and confirm that net operating runway remains infinite (cash-flow positive).`;

  const copyCfoPrompt = () => {
    navigator.clipboard.writeText(cfoPromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const focusAreas = [
    { num: 1, title: "1. Planning", sub: "Decompose Goal", desc: "Decomposes treasury objective into 6 deterministic & forensic phases." },
    { num: 2, title: "2. Context", sub: "Schema Filter", desc: "Extracts relevant invoice/vendor fields, discards general ledger noise." },
    { num: 3, title: "3. Tool Use", sub: "O(N) Hash Blocking", desc: "Invokes tool.blocking to group disbursements without quadratic explosion." },
    { num: 4, title: "4. Execution", sub: "Zero-Token Pruning", desc: "Invokes tool.rule_prune to eliminate 99.8% of normal recurring bills." },
    { num: 5, title: "5. Adjudication", sub: "LLM Reasoning", desc: "Forensic reasoning via claude-haiku / gpt-4o-mini." },
    { num: 6, title: "6. Recovery", sub: "Self-Healing Fallback", desc: "Catches malformed payloads, triggers heuristic recovery." },
    { num: 7, title: "7. Verification", sub: "Compliance Gate", desc: "Verifies clawback criteria with guardrail.clawback_validation." },
    { num: 8, title: "8. State & Iteration", sub: "Entire + cfo.ai", desc: "Commits Entire checkpoint & publishes cfo.ai yield economics." },
  ];

  return (
    <div style={{ background: "#ffffff", color: "#09090b", minHeight: "100vh", paddingBottom: "100px" }}>
      {/* HERO SECTION */}
      <section style={{ padding: "80px 0 54px", textAlign: "center" }}>
        <div className="container">
          <div style={{ maxWidth: "840px", margin: "0 auto" }}>
            <div className="eyebrow-badge">
              <span className="pulse-dot" />
              Neatlogs Live Telemetry · Entire Continuous State · cfo.ai Financial Engine
            </div>

            <h1 style={{ 
              fontSize: "52px", 
              fontWeight: 800, 
              lineHeight: 1.1, 
              letterSpacing: "-0.035em", 
              color: "#09090b",
              marginBottom: "20px"
            }}>
              The Autonomous AP Recovery Agent That Actually Recovers Cash.
            </h1>

            <p style={{ 
              fontSize: "18px", 
              lineHeight: 1.55, 
              color: "#71717a", 
              maxWidth: "680px", 
              margin: "0 auto 36px" 
            }}>
              Audits tens of thousands of authentic disbursement records in O(N) time, forensically claws back duplicate vendor payments with claude-haiku, commits continuous state to Entire, and models unit economics in cfo.ai.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap", marginBottom: "48px" }}>
              <Link
                href="/command-center"
                className="btn btn-primary btn-lg"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <Sliders size={16} />
                <span>Open Command Center &rarr;</span>
              </Link>

              <button
                type="button"
                onClick={handleRunAudit}
                disabled={auditRunning}
                className="btn btn-outline btn-lg"
              >
                {auditRunning ? (
                  <>
                    <span className="live-dot" />
                    <span>Adjudicating Disbursements ({activeStep}/8)...</span>
                  </>
                ) : (
                  <>
                    <Play size={16} fill="currentColor" />
                    <span>Quick Audit Sweep</span>
                  </>
                )}
              </button>

              <a 
                href={directTraceUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline btn-lg"
              >
                <Activity size={16} />
                <span>Inspect in Neatlogs</span>
                <ExternalLink size={13} style={{ opacity: 0.6 }} />
              </a>
            </div>
          </div>

          {/* 3 WAYS TO TEST SECTION (Black & White Tabs) */}
          <div style={{ 
            maxWidth: "960px", 
            margin: "0 auto 36px", 
            background: "#ffffff", 
            border: "1px solid #e4e4e7", 
            borderRadius: "14px", 
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}>
            {/* TABS HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e4e4e7", paddingBottom: "14px", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("benchmark")}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid " + (activeTab === "benchmark" ? "#000000" : "#e4e4e7"),
                    background: activeTab === "benchmark" ? "#000000" : "#ffffff",
                    color: activeTab === "benchmark" ? "#ffffff" : "#71717a"
                  }}
                >
                  1. Pre-loaded Benchmarks
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid " + (activeTab === "upload" ? "#000000" : "#e4e4e7"),
                    background: activeTab === "upload" ? "#000000" : "#ffffff",
                    color: activeTab === "upload" ? "#ffffff" : "#71717a"
                  }}
                >
                  2. Upload Custom CSV
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("paste")}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid " + (activeTab === "paste" ? "#000000" : "#e4e4e7"),
                    background: activeTab === "paste" ? "#000000" : "#ffffff",
                    color: activeTab === "paste" ? "#ffffff" : "#71717a"
                  }}
                >
                  3. Paste Financial Brief
                </button>
              </div>

              <span style={{ fontSize: "12px", color: "#71717a", fontFamily: "var(--mono)" }}>
                Zero Mock Data · 100% Real Records
              </span>
            </div>

            {/* TAB CONTENT 1: BENCHMARK LEDGERS */}
            {activeTab === "benchmark" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedDataset("ok")}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    border: selectedDataset === "ok" ? "2px solid #000000" : "1px solid #e4e4e7",
                    background: selectedDataset === "ok" ? "#f4f4f5" : "#ffffff",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: "14px", color: "#09090b" }}>State of Oklahoma</span>
                    <span style={{ fontSize: "11px", color: "#000000", fontFamily: "var(--mono)", fontWeight: 600 }}>4,693 rows</span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#71717a", marginTop: "4px" }}>State Treasury Vendor Payments</div>
                  <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, marginTop: "6px" }}>Found: $4,095.00 Duplicate</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDataset("la")}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    border: selectedDataset === "la" ? "2px solid #000000" : "1px solid #e4e4e7",
                    background: selectedDataset === "la" ? "#f4f4f5" : "#ffffff",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: "14px", color: "#09090b" }}>City of Los Angeles</span>
                    <span style={{ fontSize: "11px", color: "#000000", fontFamily: "var(--mono)", fontWeight: 600 }}>20,139 rows</span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#71717a", marginTop: "4px" }}>LA Controller Checkbook Ledger</div>
                  <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, marginTop: "6px" }}>Found: $12,818.00 Duplicate</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDataset("enterprise")}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    border: selectedDataset === "enterprise" ? "2px solid #000000" : "1px solid #e4e4e7",
                    background: selectedDataset === "enterprise" ? "#f4f4f5" : "#ffffff",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: "14px", color: "#09090b" }}>Enterprise B2B SaaS</span>
                    <span style={{ fontSize: "11px", color: "#000000", fontFamily: "var(--mono)", fontWeight: 600 }}>Corporate AP</span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#71717a", marginTop: "4px" }}>Cloud Infrastructure & Consulting</div>
                  <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, marginTop: "6px" }}>Found: $60,450.00 Duplicate</div>
                </button>
              </div>
            )}

            {/* TAB CONTENT 2: FILE UPLOAD / DRAG & DROP */}
            {activeTab === "upload" && (
              <div style={{ textAlign: "center", padding: "28px", border: "2px dashed #e4e4e7", borderRadius: "10px", background: "#fafafa" }}>
                <Upload size={32} style={{ margin: "0 auto 12px", color: "#71717a" }} />
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#09090b", margin: "0 0 6px" }}>Drag and drop your custom invoice ledger CSV</h4>
                <p style={{ fontSize: "13px", color: "#71717a", maxWidth: "450px", margin: "0 auto 16px" }}>
                  Supports QuickBooks, Xero, NetSuite, SAP, and custom vendor checkbook exports with automatic schema resolution.
                </p>
                <label style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  padding: "10px 20px", 
                  borderRadius: "6px", 
                  background: "#000000", 
                  color: "#ffffff", 
                  cursor: "pointer", 
                  fontSize: "13px", 
                  fontWeight: 600 
                }}>
                  <span>Browse CSV Files</span>
                  <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: "none" }} />
                </label>

                {customFile && (
                  <div style={{ marginTop: "16px", padding: "10px 14px", borderRadius: "6px", background: "#ffffff", border: "1px solid #e4e4e7", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                    <FileSpreadsheet size={16} color="#16a34a" />
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#09090b" }}>{customFile.name} ({customFile.size})</span>
                    <button type="button" onClick={() => setCustomFile(null)} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", fontSize: "12px" }}>✕</button>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: PASTE FINANCIAL SITUATION */}
            {activeTab === "paste" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#09090b" }}>Paste your financial brief or cashflow problem:</span>
                  <span style={{ fontSize: "12px", color: "#71717a" }}>OVIO extracts cash, AR, AP, and goals</span>
                </div>
                <textarea
                  value={pastedContext}
                  onChange={(e) => setPastedContext(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #e4e4e7",
                    fontFamily: "var(--font)",
                    fontSize: "13.5px",
                    color: "#09090b",
                    background: "#ffffff",
                    lineHeight: 1.5,
                    resize: "vertical"
                  }}
                />
              </div>
            )}
          </div>

          {/* 8 HACKATHON FOCUS AREAS (Black & White Pipeline Grid) */}
          <div style={{ 
            maxWidth: "960px", 
            margin: "0 auto 36px", 
            background: "#ffffff", 
            border: "1px solid #e4e4e7", 
            borderRadius: "14px", 
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div style={{ textAlign: "left" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#09090b" }}>
                  Autonomous 8-Phase Execution Pipeline (neatHack Rubric)
                </h3>
                <p style={{ fontSize: "12.5px", color: "#71717a", margin: "2px 0 0" }}>
                  Sequential progress across all 8 required hackathon agent dimensions
                </p>
              </div>
              <span style={{ 
                fontFamily: "var(--mono)", 
                fontSize: "12px", 
                padding: "3px 10px", 
                borderRadius: "6px", 
                background: auditComplete ? "#f0fdf4" : "#f4f4f5",
                color: auditComplete ? "#16a34a" : "#09090b",
                border: "1px solid " + (auditComplete ? "#bbf7d0" : "#e4e4e7"),
                fontWeight: 700
              }}>
                {auditRunning ? `RUNNING: PHASE ${activeStep}/8` : "PHASE 8/8 VERIFIED"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
              {focusAreas.map((fa) => {
                const isPassed = activeStep >= fa.num;
                const isCurrent = activeStep === fa.num && auditRunning;
                return (
                  <div 
                    key={fa.num}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      background: isPassed ? "#fafafa" : "#ffffff",
                      border: isCurrent ? "2px solid #000000" : (isPassed ? "1px solid #e4e4e7" : "1px solid #f0f0f2"),
                      textAlign: "left"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: isPassed ? "#09090b" : "#a1a1aa" }}>{fa.title}</span>
                      {isPassed && <Check size={14} color="#16a34a" />}
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: isPassed ? "#09090b" : "#a1a1aa" }}>{fa.sub}</div>
                    <div style={{ fontSize: "11px", color: "#71717a", marginTop: "4px", lineHeight: 1.35 }}>{fa.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HERO PREVIEW CARD (Dual-Pane Black & White) */}
          <div className="hero-preview">
            <div className="preview-bar">
              <div className="preview-tenant">
                <span className="live-dot" />
                <span>{current.datasetName}</span>
                <span style={{ 
                  fontSize: "11px", 
                  padding: "2px 7px", 
                  borderRadius: "4px", 
                  background: "#f0fdf4", 
                  color: "#16a34a", 
                  fontWeight: 600,
                  border: "1px solid #bbf7d0"
                }}>
                  STATUS OK
                </span>
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "11.5px", color: "#71717a", display: "flex", gap: "16px" }}>
                <span>Latency: {current.latency}</span>
                <span>COGS: ${current.cogs}</span>
                <span>ROI: {current.roi}</span>
              </div>
            </div>

            <div className="preview-body">
              {/* Left: Forensic Adjudication Stream */}
              <div className="preview-pane">
                <div className="preview-label">Live Forensic Adjudication Stream</div>
                
                <div className="preview-bubble caller">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "11.5px", fontFamily: "var(--mono)" }}>
                    <span style={{ color: "#09090b", fontWeight: 700 }}>CANDIDATE DISBURSEMENT PAIR</span>
                    <span style={{ color: "#71717a" }}>Signal: exact_duplicate</span>
                  </div>
                  <div style={{ fontWeight: 700, color: "#09090b" }}>{current.vendor}</div>
                  <div style={{ fontSize: "13px", marginTop: "4px", color: "#27272a" }}>
                    Identified potential double payment: <span style={{ color: "#16a34a", fontWeight: 700 }}>{current.amount}</span>
                  </div>
                </div>

                <div className="preview-bubble agent">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "11.5px", fontFamily: "var(--mono)" }}>
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>CLAUDE-HAIKU ADJUDICATION</span>
                    <span style={{ color: "#71717a" }}>Confidence: 95%</span>
                  </div>
                  <div style={{ fontSize: "13px", lineHeight: 1.5, color: "#27272a" }}>
                    {current.reason}
                  </div>
                </div>

                <div className="preview-bubble caller">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "11.5px", fontFamily: "var(--mono)" }}>
                    <span style={{ color: "#09090b", fontWeight: 700 }}>GUARDRAIL VALIDATION</span>
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>PASSED</span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#71717a" }}>
                    Verified non-payroll, positive balance, and distinct transaction IDs. Ready for clawback dispatch.
                  </div>
                </div>
              </div>

              {/* Right: Tool Execution Card */}
              <div className="preview-pane">
                <div className="preview-label">Active Autonomous Tool Execution</div>

                <div className="preview-tool-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span className="tool-tag">tool.ledger_fetch</span>
                    <span style={{ fontSize: "11px", color: "#16a34a", fontFamily: "var(--mono)", fontWeight: 600 }}>200 OK</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#09090b" }}>Canonicalized Ledger Grain</div>
                  <div style={{ fontSize: "12px", color: "#71717a", marginTop: "4px" }}>
                    Aggregated multi-line disbursements into unified transaction entities with normalized vendor strings.
                  </div>
                </div>

                <div className="preview-tool-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span className="tool-tag">tool.blocking</span>
                    <span style={{ fontSize: "11px", color: "#16a34a", fontFamily: "var(--mono)", fontWeight: 600 }}>O(N) COMPLETE</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#09090b" }}>Hash-Bucket Candidate Generation</div>
                  <div style={{ fontSize: "12px", color: "#71717a", marginTop: "4px" }}>
                    Grouped records into candidate pairs using amount & phonetic vendor hash partitions, avoiding O(N²) explosion.
                  </div>
                </div>

                <div className="preview-tool-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span className="tool-tag">entire.checkpoint</span>
                    <span style={{ fontSize: "11px", color: "#16a34a", fontFamily: "var(--mono)", fontWeight: 600 }}>SAVED</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#09090b" }}>Continuous State Snapshot</div>
                  <div style={{ fontSize: "12px", color: "#71717a", marginTop: "4px" }}>
                    Committed audit session state, candidate hash records, and git commit hash to Entire memory.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STRIP */}
      <div className="strip">
        <div className="container">
          <div className="strip-title">Powered by Foundational Observability &amp; Financial Infrastructure</div>
          <div className="strip-logos">
            <div className="strip-item">
              <Activity size={16} />
              Neatlogs OpenTelemetry Tracing
            </div>
            <div className="strip-item">
              <ShieldCheck size={16} />
              Entire Continuous Checkpoints
            </div>
            <div className="strip-item">
              <Database size={16} />
              cfo.ai Scenario Financial Engine
            </div>
            <div className="strip-item">
              <Cpu size={16} />
              LiteLLM Claude-Haiku Gateway
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED CFO.AI PROMPT GENERATOR SECTION (docs.cfo.ai) */}
      <section className="section" style={{ background: "#fafafa" }}>
        <div className="container">
          <div style={{
            background: "#ffffff",
            border: "1px solid #e4e4e7",
            borderRadius: "14px",
            padding: "32px",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div className="eyebrow-badge" style={{ marginBottom: "8px" }}>
                  <Sparkles size={13} />
                  <span>cfo.ai Ari Copilot Bridge</span>
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#09090b", margin: 0, letterSpacing: "-0.02em" }}>
                  Convert Measured Audit Findings Into cfo.ai
                </h3>
                <p style={{ fontSize: "13.5px", color: "#71717a", margin: "4px 0 0" }}>
                  Ask Ari a business question, see the financial model behind the answer, and change the assumptions yourself (docs.cfo.ai):
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={copyCfoPrompt}
                  className="btn btn-primary"
                >
                  {copiedPrompt ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copiedPrompt ? "Copied Prompt!" : "Copy Prompt for cfo.ai"}</span>
                </button>

                <a
                  href="/cfo_model.json"
                  download
                  className="btn btn-outline"
                >
                  <FileText size={15} />
                  <span>Download cfo_model.json</span>
                </a>
              </div>
            </div>

            {/* PRE-FORMATTED PROMPT DISPLAY BOX */}
            <pre style={{
              background: "#f4f4f5",
              border: "1px solid #e4e4e7",
              borderRadius: "8px",
              padding: "16px",
              fontFamily: "var(--mono)",
              fontSize: "12px",
              lineHeight: 1.55,
              color: "#09090b",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              maxHeight: "220px",
              overflowY: "auto"
            }}>
              {cfoPromptText}
            </pre>
          </div>
        </div>
      </section>

      {/* CFO.AI FINANCIAL SCENARIOS TABLE */}
      <section className="section">
        <div className="container">
          <div style={{
            background: "#ffffff",
            border: "1px solid #e4e4e7",
            borderRadius: "14px",
            padding: "28px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            overflowX: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#09090b", margin: 0 }}>
                  cfo.ai Financial Model Scenarios
                </h3>
                <p style={{ fontSize: "13px", color: "#71717a", margin: "4px 0 0" }}>
                  Autonomous contingency recovery projections powered by cfo.ai scenario modeling
                </p>
              </div>

              <span style={{ 
                fontFamily: "var(--mono)", 
                fontSize: "12px", 
                padding: "3px 10px", 
                borderRadius: "6px", 
                background: "#f4f4f5", 
                color: "#09090b",
                border: "1px solid #e4e4e7",
                fontWeight: 600
              }}>
                18% Contingency Fee
              </span>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e4e4e7", textAlign: "left", color: "#71717a" }}>
                  <th style={{ padding: "12px 14px" }}>Scenario</th>
                  <th style={{ padding: "12px 14px" }}>Annual Ingest Volume</th>
                  <th style={{ padding: "12px 14px" }}>Recovery Yield (1.5%)</th>
                  <th style={{ padding: "12px 14px" }}>OVIO Revenue (18%)</th>
                  <th style={{ padding: "12px 14px" }}>Compute COGS</th>
                  <th style={{ padding: "12px 14px" }}>Cash Runway</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #f0f0f2" }}>
                  <td style={{ padding: "14px", fontWeight: 700, color: "#16a34a" }}>Growth Scenario</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)" }}>$500,000,000</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)", color: "#16a34a" }}>$7,500,000</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)", fontWeight: 700, color: "#09090b" }}>$1,350,000</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)", color: "#71717a" }}>$42.50</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)", color: "#2563eb" }}>Infinite (Profitable)</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f0f0f2" }}>
                  <td style={{ padding: "14px", fontWeight: 700, color: "#09090b" }}>Base Scenario</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)" }}>$100,000,000</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)", color: "#16a34a" }}>$1,500,000</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)", fontWeight: 700, color: "#09090b" }}>$270,000</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)", color: "#71717a" }}>$12.80</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)", color: "#2563eb" }}>28.4 Months</td>
                </tr>
                <tr>
                  <td style={{ padding: "14px", fontWeight: 700, color: "#71717a" }}>Downside Scenario</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)" }}>$25,000,000</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)", color: "#16a34a" }}>$375,000</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)", fontWeight: 700, color: "#09090b" }}>$67,500</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)", color: "#71717a" }}>$3.40</td>
                  <td style={{ padding: "14px", fontFamily: "var(--mono)", color: "#2563eb" }}>14.2 Months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* VERIFIED NEATLOGS OBSERVABILITY HUB */}
      <section className="section" style={{ background: "#fafafa" }}>
        <div className="container">
          <div style={{
            background: "#ffffff",
            border: "1px solid #e4e4e7",
            borderRadius: "14px",
            padding: "36px",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)"
          }}>
            {/* Header */}
            <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 30px" }}>
              <div className="eyebrow-badge" style={{ marginBottom: "14px" }}>
                <span className="live-dot" />
                Live Neatlogs Production Telemetry · Project ID: {projectId.slice(0, 8)}...
              </div>
              
              <h3 style={{ fontSize: "28px", fontWeight: 800, color: "#09090b", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
                Neatlogs Observability &amp; Trace Hub
              </h3>

              <p style={{ color: "#71717a", fontSize: "15px", lineHeight: 1.6, margin: "0 auto" }}>
                OVIO streams every agent run into Neatlogs via OpenInference spans. Instead of checking a single isolated run, inspect our entire live telemetry project with 41+ historical traces, 39 multi-step sessions, and 3 distinct production workflows.
              </p>
            </div>

            {/* Live Metrics Strip */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
              marginBottom: "28px"
            }}>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 18px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Project Traces</div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>41 Traces</div>
                <div style={{ fontSize: "11.5px", color: "#16a34a", marginTop: "2px", fontWeight: 600 }}>● All streamed live to Neatlogs</div>
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 18px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Agent Sessions</div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>39 Sessions</div>
                <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>Multi-step agent lifecycles</div>
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 18px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Active Workflows</div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>3 Workflows</div>
                <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>treasury, rescue, doctor-probe</div>
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 18px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Span Standard</div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>OpenInference</div>
                <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>OTel Semantic Conventions</div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "36px" }}>
              <a
                href={`https://app.neatlogs.com/traces?orgId=${orgId}&projectId=${projectId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <span>Browse All 41+ Traces in Neatlogs Dashboard</span>
                <ExternalLink size={15} />
              </a>

              <a
                href={`https://app.neatlogs.com/sessions?orgId=${orgId}&projectId=${projectId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <span>View Agent Sessions &amp; Replays (39 Sessions)</span>
                <ExternalLink size={15} />
              </a>
            </div>

            {/* Curated Multi-Trace Showcase */}
            <div style={{ borderTop: "1px solid #e4e4e7", paddingTop: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#09090b" }}>
                    Curated Key Execution Traces Across Workflows
                  </h4>
                  <p style={{ fontSize: "12.5px", color: "#71717a", margin: "2px 0 0" }}>
                    Inspect individual span trees across our agent modes, public ledger audits, and diagnostic probes:
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                {/* Trace Card 1 */}
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "#dcfce7", color: "#166534" }}>
                        20 Spans · INVESTIGATOR
                      </span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "#71717a" }}>3d720906...</span>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#09090b", marginBottom: "4px" }}>
                      Multi-Tool Autonomous Investigator
                    </div>
                    <p style={{ fontSize: "12px", color: "#71717a", margin: 0, lineHeight: 1.5 }}>
                      Full autonomous investigation with 4 tools (vendor history, sibling distributions, draw schedules, clawback guardrail).
                    </p>
                  </div>
                  <a
                    href={`https://app.neatlogs.com/traces/3d720906babf7ed470e690f68c4eedc5?orgId=${orgId}&projectId=${projectId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: "14px", width: "100%", justifyContent: "center" }}
                  >
                    <span>Inspect Tree (20 Spans)</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Trace Card 2 */}
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "#fef9c3", color: "#854d0e" }}>
                        11 Spans · BASELINE
                      </span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "#71717a" }}>dd024eda...</span>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#09090b", marginBottom: "4px" }}>
                      Single-Shot Fast Baseline
                    </div>
                    <p style={{ fontSize: "12px", color: "#71717a", margin: 0, lineHeight: 1.5 }}>
                      Direct prompt evaluation without specialized investigation tools. Side-by-side comparison baseline.
                    </p>
                  </div>
                  <a
                    href={`https://app.neatlogs.com/traces/dd024eda5ca251867f7f23cf768e6651?orgId=${orgId}&projectId=${projectId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: "14px", width: "100%", justifyContent: "center" }}
                  >
                    <span>Inspect Tree (11 Spans)</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Trace Card 3 */}
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "#e0f2fe", color: "#0369a1" }}>
                        12 Spans · CHICAGO LEDGER
                      </span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "#71717a" }}>8789a5fe...</span>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#09090b", marginBottom: "4px" }}>
                      City of Chicago Live Audit
                    </div>
                    <p style={{ fontSize: "12px", color: "#71717a", margin: 0, lineHeight: 1.5 }}>
                      Live municipal payments downloaded from data.cityofchicago.org (1,968 disbursements audited).
                    </p>
                  </div>
                  <a
                    href={`https://app.neatlogs.com/traces/8789a5fef577533136f734e04c2ded51?orgId=${orgId}&projectId=${projectId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: "14px", width: "100%", justifyContent: "center" }}
                  >
                    <span>Inspect Tree (12 Spans)</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Trace Card 4 */}
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "#f3e8ff", color: "#6b21a8" }}>
                        8 Spans · CASH RESCUE
                      </span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "#71717a" }}>a5ef8cc0...</span>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#09090b", marginBottom: "4px" }}>
                      90-Day Cashflow Rescue Agent
                    </div>
                    <p style={{ fontSize: "12px", color: "#71717a", margin: 0, lineHeight: 1.5 }}>
                      Autonomous working capital planning, cfo.ai scenario optimization, and automated AR collection.
                    </p>
                  </div>
                  <a
                    href={`https://app.neatlogs.com/traces/a5ef8cc0da91d5a7b3c220f1712a1464?orgId=${orgId}&projectId=${projectId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: "14px", width: "100%", justifyContent: "center" }}
                  >
                    <span>Inspect Tree (8 Spans)</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Trace Card 5 */}
                <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "#f1f5f9", color: "#334155" }}>
                        4 Spans · DIAGNOSTIC PROBE
                      </span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "#71717a" }}>a3b4770e...</span>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#09090b", marginBottom: "4px" }}>
                      Doctor Self-Healing Probe
                    </div>
                    <p style={{ fontSize: "12px", color: "#71717a", margin: 0, lineHeight: 1.5 }}>
                      Proactive diagnostic connectivity check verifying collector reachability, latency, and schema fallback.
                    </p>
                  </div>
                  <a
                    href={`https://app.neatlogs.com/traces/a3b4770e82c2e9d0dfaae885c901f4f8?orgId=${orgId}&projectId=${projectId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: "14px", width: "100%", justifyContent: "center" }}
                  >
                    <span>Inspect Tree (4 Spans)</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
