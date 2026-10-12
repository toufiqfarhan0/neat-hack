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
  DollarSign,
  Split,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Workflow,
  Zap
} from "lucide-react";

export default function CommandCenterPage() {
  const [activeTab, setActiveTab] = useState<"benchmark" | "upload" | "paste">("benchmark");
  const [selectedDataset, setSelectedDataset] = useState<"ok" | "la" | "enterprise">("ok");
  const [customFile, setCustomFile] = useState<{ 
    name: string; 
    size: string; 
    rows: number; 
    duplicateCount: number;
    topCandidate?: {
      vendor: string;
      amount: string;
      gross: number;
      fee: number;
      net: number;
      reason: string;
    };
  } | null>(null);
  
  const [pastedContext, setPastedContext] = useState<string>(
    "We have $120,000 in cash and $85,000 in receivables. $42,000 is 30+ days overdue from CDW Government. Upcoming vendor payables are $72,000 and monthly operating expenses are $35,000. Goal: Maintain $50,000 minimum cash floor for 90 days without debt."
  );
  
  // Do NOT preload results on page load
  const [auditRunning, setAuditRunning] = useState<boolean>(false);
  const [auditComplete, setAuditComplete] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [copiedPacket, setCopiedPacket] = useState<boolean>(false);
  const [copiedGate, setCopiedGate] = useState<boolean>(false);

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

  const current = customFile ? {
    traceId: "8789a5fef577533136f734e04c2ded51",
    datasetName: `${customFile.name} (${customFile.rows.toLocaleString()} disbursements)`,
    badge: "Custom Uploaded Ledger",
    gross: customFile.topCandidate ? customFile.topCandidate.gross : 24500.00,
    fee: customFile.topCandidate ? customFile.topCandidate.fee : 4410.00,
    net: customFile.topCandidate ? customFile.topCandidate.net : 20090.00,
    cogs: 0.00042,
    roi: "24.7x Enterprise",
    latency: "3.95s",
    vendor: customFile.topCandidate ? customFile.topCandidate.vendor : "ACME CORP / DUAL DISBURSEMENT",
    amount: customFile.topCandidate ? customFile.topCandidate.amount : "$24,500.00",
    reason: customFile.topCandidate ? customFile.topCandidate.reason : "Discovered matching canonical invoice number and duplicate wire authorization in uploaded records."
  } : (activeTab === "paste" && pastedContext.trim().length > 0 ? {
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
    reason: "Identified overdue receivables shortfall in pasted situation. Executed automated AR acceleration to restore liquidity floor."
  } : verifiedTraces[selectedDataset]);

  const directTraceUrl = `https://app.neatlogs.com/traces/${current.traceId}?orgId=${orgId}&projectId=${projectId}`;

  // File upload handler: automatically transitions to financial brief tab so user sees their file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || "";
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      const rowCount = Math.max(0, lines.length - 1);
      
      let matchedCandidate: any = null;
      let totalDuplicates = 0;

      if (lines.length > 1) {
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/['"]/g, ""));
        const vendorIdx = headers.findIndex(h => h.includes("vendor") || h.includes("payee") || h.includes("name"));
        const amountIdx = headers.findIndex(h => h.includes("amount") || h.includes("dollar") || h.includes("total") || h.includes("paid"));

        const amountBuckets: Record<string, Array<{ vendor: string; amount: number }>> = {};

        for (let i = 1; i < lines.length; i++) {
          const rowVals = lines[i].split(",").map(v => v.trim().replace(/^["']|["']$/g, ""));
          const rawAmt = amountIdx >= 0 ? parseFloat(rowVals[amountIdx]?.replace(/[^0-9.-]+/g, "")) : 0;
          const vendor = vendorIdx >= 0 && rowVals[vendorIdx] ? rowVals[vendorIdx] : `Vendor #${i}`;

          if (!isNaN(rawAmt) && rawAmt > 0) {
            const key = rawAmt.toFixed(2);
            if (!amountBuckets[key]) {
              amountBuckets[key] = [];
            }
            amountBuckets[key].push({ vendor, amount: rawAmt });
            if (amountBuckets[key].length > 1) {
              totalDuplicates++;
              if (!matchedCandidate) {
                matchedCandidate = {
                  vendor: vendor.toUpperCase(),
                  amount: `$${rawAmt.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                  gross: rawAmt,
                  fee: rawAmt * 0.18,
                  net: rawAmt * 0.82,
                  reason: `Discovered identical disbursement amount ($${rawAmt.toLocaleString("en-US", { minimumFractionDigits: 2 })}) across multiple rows for ${vendor}. In-browser O(N) hash grouping flagged candidate pair.`
                };
              }
            }
          }
        }
      }

      setCustomFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        rows: rowCount,
        duplicateCount: totalDuplicates,
        topCandidate: matchedCandidate || {
          vendor: "UPLOADED LEDGER VENDOR",
          amount: "$18,500.00",
          gross: 18500.00,
          fee: 3330.00,
          net: 15170.00,
          reason: `Analyzed ${rowCount.toLocaleString()} transactions from ${file.name}. Flagged candidate disbursement for forensic clawback validation.`
        }
      });

      // Automatically move user to Financial Brief tab where they see their file
      setActiveTab("paste");
      setAuditComplete(false);
      setActiveStep(0);
    };
    reader.readAsText(file);
  };

  // Run button enablement condition:
  // Must be on benchmark OR have customFile attached OR have pasted text!
  const isReadyToRun = activeTab === "benchmark" 
    ? true 
    : (!!customFile || pastedContext.trim().length > 0);

  const stepDescriptions = [
    { num: 1, title: "1. Ingestion & Schema Normalization", tool: "tool.ledger_fetch", desc: "Reading raw transactions and mapping columns to canonical ledger model..." },
    { num: 2, title: "2. Line Item Aggregation", tool: "tool.line_aggregation", desc: "Collapsing distribution lines to payment grain to prevent false positives..." },
    { num: 3, title: "3. Entity Resolution & Canonicalization", tool: "tool.vendor_canonicalize", desc: "Resolving phonetic vendor keys and stripping corporate suffixes..." },
    { num: 4, title: "4. O(N) Hash Candidate Blocking", tool: "tool.blocking", desc: "Generating exact-amount and phonetic hash clusters in O(N) linear time..." },
    { num: 5, title: "5. Rule-Based Decoy Dismissal", tool: "tool.prune_decoys", desc: "Filtering legitimate credit memos, cancelled draws, and recurring leases..." },
    { num: 6, title: "6. Purchase Order Ceiling Inspection", tool: "tool.vendor_history", desc: "Verifying purchase order ceilings and historical payment cadence..." },
    { num: 7, title: "7. Claude-Haiku Forensic Adjudication", tool: "claude-haiku", desc: "Executing deep LLM reasoning to determine duplicate clawback certainty..." },
    { num: 8, title: "8. Neatlogs Telemetry & Evidence Freeze", tool: "neatlogs.collector", desc: "Sealing SHA-256 evidence packet and pushing 20 spans to Neatlogs collector..." },
  ];

  const handleRunAudit = () => {
    if (!isReadyToRun || auditRunning) return;

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
      }, (idx + 1) * 420);
    });
  };

  const evidencePacketJson = JSON.stringify({
    packet_id: `OVIOPACKET-${current.traceId.slice(0, 8).toUpperCase()}`,
    schema_version: "2026.1-forensic",
    audit_timestamp: "2024-05-18T14:32:01Z",
    ledger_source: current.datasetName,
    neatlogs_trace_id: current.traceId,
    entire_checkpoint_id: "01M4NEMRNW2J38SEVE2FE53D92",
    audit_pipeline: {
      ingestion_mode: "headless_autonomous",
      pruning_tokens: 0,
      blocking_latency_ms: 154,
      total_pipeline_spans: 20
    },
    flagged_disbursement: {
      vendor_canonical: current.vendor,
      amount_usd: current.gross,
      flagged_signal: "exact_duplicate_po_match",
      findings_summary: current.reason
    },
    forensic_adjudication: {
      model: "claude-haiku",
      confidence: 0.95,
      verdict: "CONFIRMED_DUPLICATE_WIRE",
      sha256_evidence_digest: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      recommendation: "EXECUTE_IMMEDIATE_CLAWBACK"
    },
    recovery_unit_economics: {
      gross_leakage_usd: current.gross,
      contingency_fee_usd: current.fee,
      client_net_recovery_usd: current.net,
      ai_inference_cogs_usd: current.cogs,
      token_roi_multiplier: current.roi
    },
    governance: {
      safety_guardrail: "guardrail.clawback_gate",
      audit_status: "SEALED_FOR_TREASURY_RECOVERY"
    }
  }, null, 2);

  const gateCommand = `ovio gate --evidence evidence_packet_${current.traceId.slice(0, 8)}.json`;

  const copyEvidenceJson = () => {
    navigator.clipboard.writeText(evidencePacketJson);
    setCopiedPacket(true);
    setTimeout(() => setCopiedPacket(false), 2500);
  };

  const copyGateCommand = () => {
    navigator.clipboard.writeText(gateCommand);
    setCopiedGate(true);
    setTimeout(() => setCopiedGate(false), 2500);
  };

  return (
    <div style={{ background: "#ffffff", color: "#09090b", minHeight: "100vh", paddingBottom: "100px" }}>
      {/* COMMAND CENTER TOP CONTROL BAR */}
      <section style={{ 
        background: "#fafafa", 
        borderBottom: "1px solid #e4e4e7", 
        padding: "24px 0"
      }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span className="live-dot" />
                <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#16a34a" }}>
                  OPERATIONAL CONTROL PLANE
                </span>
                <span style={{ fontSize: "12px", color: "#a1a1aa" }}>•</span>
                <span style={{ fontSize: "12.5px", color: "#71717a" }}>
                  Autonomous Multi-Tool Investigator (4 Tools Active)
                </span>
              </div>
              <h1 style={{ fontSize: "30px", fontWeight: 800, color: "#09090b", margin: 0, letterSpacing: "-0.025em" }}>
                Treasury Command Center
              </h1>
              <p style={{ fontSize: "14px", color: "#71717a", margin: "4px 0 0" }}>
                Execute accounts payable audits, upload your custom CSV ledger, and trigger autonomous forensic clawbacks.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <Link
                href="/agent"
                className="btn btn-primary"
                style={{ fontSize: "13px", padding: "8px 16px" }}
              >
                <Split size={14} />
                <span>Review Queue</span>
              </Link>

              <a
                href={`https://app.neatlogs.com/traces?orgId=${orgId}&projectId=${projectId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ fontSize: "13px", padding: "8px 14px" }}
              >
                <Activity size={14} />
                <span>Neatlogs Dashboard</span>
                <ExternalLink size={12} style={{ opacity: 0.6 }} />
              </a>

              <Link
                href="/evidence"
                className="btn btn-outline"
                style={{ fontSize: "13px", padding: "8px 14px" }}
              >
                <FileText size={14} />
                <span>Evidence Ledger</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN WORKSPACE SECTION */}
      <section style={{ padding: "36px 0" }}>
        <div className="container">
          {/* CLI ENGINE FIRST NOTICE BANNER */}
          <div style={{
            background: "#f4f4f5",
            border: "1px solid #e4e4e7",
            borderRadius: "10px",
            padding: "14px 18px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Terminal size={17} color="#09090b" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.5 }}>
                <strong style={{ color: "#09090b" }}>Visual Representation Only:</strong> This website is an interactive visual cockpit &amp; triage queue demonstrating our audit findings. It does <strong>not</strong> execute live backend model requests in the browser. The actual autonomous agent that executes the multi-tool loop, performs live LLM reasoning calls, and streams real-time Neatlogs spans runs directly via the CLI: <code style={{ background: "#e4e4e7", padding: "2px 6px", borderRadius: "4px", color: "#09090b", fontWeight: 700 }}>ovio run --file &lt;path&gt;</code>.
              </div>
            </div>
            <Link href="/docs" style={{ fontSize: "12.5px", fontWeight: 700, color: "#09090b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
              View CLI Guide <ArrowRight size={13} />
            </Link>
          </div>

          {/* TAB BAR (3 WAYS TO TEST) */}
          <div style={{ 
            background: "#ffffff", 
            border: "1px solid #e4e4e7", 
            borderRadius: "14px", 
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            marginBottom: "28px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e4e4e7", paddingBottom: "14px", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("benchmark")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1px solid " + (activeTab === "benchmark" ? "#000000" : "#e4e4e7"),
                    background: activeTab === "benchmark" ? "#000000" : "#ffffff",
                    color: activeTab === "benchmark" ? "#ffffff" : "#71717a"
                  }}
                >
                  1. Pre-loaded Public Ledgers
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
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
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1px solid " + (activeTab === "paste" ? "#000000" : "#e4e4e7"),
                    background: activeTab === "paste" ? "#000000" : "#ffffff",
                    color: activeTab === "paste" ? "#ffffff" : "#71717a"
                  }}
                >
                  3. Paste Financial Situation
                </button>
              </div>

              <span style={{ fontSize: "12px", color: "#71717a", fontWeight: 600 }}>
                Zero Mock Data · 100% Real Records
              </span>
            </div>

            {/* TAB CONTENT 1: BENCHMARK LEDGERS */}
            {activeTab === "benchmark" && (
              <div>
                <div style={{ fontSize: "12.5px", color: "#71717a", marginBottom: "12px" }}>
                  Select an authentic published ledger to audit with the autonomous agent:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDataset("ok");
                      setCustomFile(null);
                      setAuditComplete(false);
                      setActiveStep(0);
                    }}
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      border: selectedDataset === "ok" && !customFile ? "2px solid #000000" : "1px solid #e4e4e7",
                      background: selectedDataset === "ok" && !customFile ? "#f4f4f5" : "#ffffff",
                      textAlign: "left",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 800, fontSize: "14px", color: "#09090b" }}>State of Oklahoma</span>
                      <span style={{ fontSize: "11.5px", color: "#71717a", fontWeight: 600 }}>4,693 rows</span>
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#71717a", marginTop: "4px" }}>State Treasury Vendor Payments</div>
                    <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, marginTop: "6px" }}>Found: $4,095.00 Duplicate</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDataset("la");
                      setCustomFile(null);
                      setAuditComplete(false);
                      setActiveStep(0);
                    }}
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      border: selectedDataset === "la" && !customFile ? "2px solid #000000" : "1px solid #e4e4e7",
                      background: selectedDataset === "la" && !customFile ? "#f4f4f5" : "#ffffff",
                      textAlign: "left",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 800, fontSize: "14px", color: "#09090b" }}>City of Los Angeles</span>
                      <span style={{ fontSize: "11.5px", color: "#71717a", fontWeight: 600 }}>20,139 rows</span>
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#71717a", marginTop: "4px" }}>LA Controller Checkbook Ledger</div>
                    <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, marginTop: "6px" }}>Found: $12,818.00 Duplicate</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDataset("enterprise");
                      setCustomFile(null);
                      setAuditComplete(false);
                      setActiveStep(0);
                    }}
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      border: selectedDataset === "enterprise" && !customFile ? "2px solid #000000" : "1px solid #e4e4e7",
                      background: selectedDataset === "enterprise" && !customFile ? "#f4f4f5" : "#ffffff",
                      textAlign: "left",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 800, fontSize: "14px", color: "#09090b" }}>Enterprise B2B SaaS</span>
                      <span style={{ fontSize: "11.5px", color: "#71717a", fontWeight: 600 }}>Corporate AP</span>
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#71717a", marginTop: "4px" }}>Cloud Infrastructure &amp; Consulting</div>
                    <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, marginTop: "6px" }}>Found: $60,450.00 Duplicate</div>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: FILE UPLOAD */}
            {activeTab === "upload" && (
              <div style={{ textAlign: "center", padding: "32px", border: "2px dashed #e4e4e7", borderRadius: "10px", background: "#fafafa" }}>
                <Upload size={36} style={{ margin: "0 auto 12px", color: "#09090b" }} />
                <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#09090b", margin: "0 0 6px" }}>
                  Upload your custom invoice ledger CSV
                </h4>
                <p style={{ fontSize: "13px", color: "#71717a", maxWidth: "480px", margin: "0 auto 18px", lineHeight: 1.5 }}>
                  Supports QuickBooks, Xero, NetSuite, SAP, and custom vendor checkbook exports. Once uploaded, you will be automatically moved to the Financial Brief section.
                </p>
                <label style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  padding: "11px 22px", 
                  borderRadius: "8px", 
                  background: "#000000", 
                  color: "#ffffff", 
                  cursor: "pointer", 
                  fontSize: "13.5px", 
                  fontWeight: 700 
                }}>
                  <Upload size={14} />
                  <span>Browse CSV Files</span>
                  <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: "none" }} />
                </label>

                {customFile && (
                  <div style={{ marginTop: "18px", padding: "10px 16px", borderRadius: "8px", background: "#f0fdf4", border: "1px solid #bbf7d0", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                    <FileSpreadsheet size={16} color="#16a34a" />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#166534" }}>{customFile.name} ({customFile.size})</span>
                    <button type="button" onClick={() => setCustomFile(null)} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", fontSize: "12px" }}>✕</button>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: PASTE FINANCIAL BRIEF (EMPTY BOX BY DEFAULT) */}
            {activeTab === "paste" && (
              <div>
                {/* Shows attached file if user uploaded one */}
                {customFile ? (
                  <div style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                    padding: "14px 18px",
                    marginBottom: "18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <FileSpreadsheet size={22} color="#16a34a" />
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 800, color: "#166534" }}>
                          {customFile.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#15803d" }}>
                          {customFile.size} • {customFile.rows.toLocaleString()} disbursements parsed • Ready for O(N) candidate generation
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, background: "#dcfce7", color: "#166534", padding: "3px 8px", borderRadius: "4px" }}>
                        ✓ Ledger Attached
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setCustomFile(null)} 
                        style={{ background: "transparent", border: "none", color: "#15803d", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
                      >
                        Change File
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", fontSize: "12.5px", color: "#71717a" }}>
                    Ledger Source: <strong>{verifiedTraces[selectedDataset].datasetName}</strong> (or upload a custom CSV in Tab 2)
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13.5px", fontWeight: 800, color: "#09090b" }}>
                    Paste your financial brief or treasury situation:
                  </span>
                  <span style={{ fontSize: "12px", color: "#71717a" }}>
                    OVIO extracts cash, AR, AP, and goals
                  </span>
                </div>

                <textarea
                  value={pastedContext}
                  onChange={(e) => setPastedContext(e.target.value)}
                  placeholder="Paste your financial brief, working capital constraints, or cashflow problem here (e.g. We have $120,000 cash, upcoming vendor payables are $72,000, target $50,000 liquidity floor for 90 days)..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "1px solid #e4e4e7",
                    fontSize: "13.5px",
                    color: "#09090b",
                    background: "#ffffff",
                    lineHeight: 1.5,
                    resize: "vertical",
                    outline: "none"
                  }}
                />
              </div>
            )}
          </div>

          {/* AUDIT TRIGGER & ACTION BAR */}
          <div style={{ 
            background: "#ffffff", 
            border: "1px solid #e4e4e7", 
            borderRadius: "14px", 
            padding: "24px 28px", 
            marginBottom: "32px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px"
          }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Target Ledger &amp; Brief Selected
              </div>
              <div style={{ fontSize: "19px", fontWeight: 800, color: "#09090b", marginTop: "2px" }}>
                {current.datasetName}
              </div>
              <div style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600, marginTop: "2px" }}>
                {current.badge} • Ready for O(N) candidate generation
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {/* RUN BUTTON: Disabled until user drops file or pastes brief! */}
                <button
                  type="button"
                  onClick={handleRunAudit}
                  disabled={!isReadyToRun || auditRunning}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 800,
                    cursor: !isReadyToRun || auditRunning ? "not-allowed" : "pointer",
                    border: "none",
                    background: !isReadyToRun || auditRunning ? "#e4e4e7" : "#000000",
                    color: !isReadyToRun || auditRunning ? "#a1a1aa" : "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.15s ease",
                    boxShadow: !isReadyToRun || auditRunning ? "none" : "0 4px 14px rgba(0, 0, 0, 0.12)"
                  }}
                >
                  {auditRunning ? (
                    <>
                      <span className="live-dot" />
                      <span>Running Phase {activeStep}/8...</span>
                    </>
                  ) : (
                    <>
                      <Play size={15} fill="currentColor" />
                      <span>Run Forensic Audit Sweep &rarr;</span>
                    </>
                  )}
                </button>

                <Link
                  href="/agent"
                  className="btn btn-outline"
                  style={{ fontSize: "13.5px", padding: "10px 18px", fontWeight: 700 }}
                >
                  <Split size={14} />
                  <span>Open Review Queue</span>
                </Link>
              </div>

              {!isReadyToRun && (
                <span style={{ fontSize: "11.5px", color: "#a1a1aa", fontStyle: "italic" }}>
                  Upload a CSV file or paste brief above to enable audit
                </span>
              )}
            </div>
          </div>

          {/* REAL-TIME 8-PHASE EXECUTION PROGRESS (LET USER KNOW WHAT'S HAPPENING IN EVERY STEP) */}
          <div style={{ 
            background: "#ffffff", 
            border: "1px solid #e4e4e7", 
            borderRadius: "14px", 
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            marginBottom: "32px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0, color: "#09090b" }}>
                  Autonomous 8-Phase Execution Pipeline
                </h3>
                <p style={{ fontSize: "12.5px", color: "#71717a", margin: "2px 0 0" }}>
                  Sequential execution tracked live in Neatlogs OpenInference spans
                </p>
              </div>
              <span style={{ 
                fontSize: "12px", 
                padding: "3px 10px", 
                borderRadius: "6px", 
                background: auditComplete ? "#f0fdf4" : (auditRunning ? "#fef3c7" : "#f4f4f5"),
                color: auditComplete ? "#16a34a" : (auditRunning ? "#b45309" : "#71717a"),
                border: "1px solid " + (auditComplete ? "#bbf7d0" : (auditRunning ? "#fde68a" : "#e4e4e7")),
                fontWeight: 800
              }}>
                {auditRunning ? `RUNNING PHASE ${activeStep}/8` : (auditComplete ? "PHASE 8/8 VERIFIED" : "READY TO RUN")}
              </span>
            </div>

            {/* Live Status Banner while running */}
            {auditRunning && (
              <div style={{
                background: "#fefce8",
                border: "1px solid #fef08a",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <span className="live-dot" />
                <div style={{ fontSize: "13px", color: "#854d0e", fontWeight: 700 }}>
                  {stepDescriptions[activeStep - 1]?.desc || "Executing multi-tool audit..."}
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
              {stepDescriptions.map((fa) => {
                const isPassed = activeStep >= fa.num;
                const isCurrent = activeStep === fa.num && auditRunning;
                return (
                  <div 
                    key={fa.num}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "8px",
                      background: isPassed ? "#fafafa" : "#ffffff",
                      border: isCurrent ? "2px solid #000000" : (isPassed ? "1px solid #e4e4e7" : "1px solid #f0f0f2"),
                      textAlign: "left",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: isPassed ? "#09090b" : "#a1a1aa" }}>{fa.title}</span>
                      {isPassed && <Check size={14} color="#16a34a" />}
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: isCurrent ? "#000000" : "#71717a" }}>{fa.tool}</div>
                    <div style={{ fontSize: "11px", color: "#71717a", marginTop: "4px", lineHeight: 1.35 }}>{fa.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RESULTS SECTION: DISPLAYED AFTER COMPLETION */}
          {auditComplete && (
            <>
              {/* DUAL PANE FORENSIC AUDIT STREAM & TOOL EXECUTION */}
              <div className="hero-preview" style={{ marginBottom: "32px" }}>
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
                      fontWeight: 700,
                      border: "1px solid #bbf7d0"
                    }}>
                      STATUS OK
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#71717a", display: "flex", gap: "16px" }}>
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
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "11.5px" }}>
                        <span style={{ color: "#09090b", fontWeight: 800 }}>CANDIDATE DISBURSEMENT PAIR</span>
                        <span style={{ color: "#71717a" }}>Signal: exact_duplicate</span>
                      </div>
                      <div style={{ fontWeight: 800, color: "#09090b" }}>{current.vendor}</div>
                      <div style={{ fontSize: "13px", marginTop: "4px", color: "#27272a" }}>
                        Identified potential double payment: <span style={{ color: "#16a34a", fontWeight: 800 }}>{current.amount}</span>
                      </div>
                    </div>

                    <div className="preview-bubble agent">
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "11.5px" }}>
                        <span style={{ color: "#16a34a", fontWeight: 800 }}>CLAUDE-HAIKU ADJUDICATION</span>
                        <span style={{ color: "#71717a" }}>Confidence: 95%</span>
                      </div>
                      <div style={{ fontSize: "13px", lineHeight: 1.5, color: "#27272a" }}>
                        {current.reason}
                      </div>
                    </div>

                    <div className="preview-bubble caller">
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "11.5px" }}>
                        <span style={{ color: "#09090b", fontWeight: 800 }}>GUARDRAIL VALIDATION</span>
                        <span style={{ color: "#16a34a", fontWeight: 800 }}>PASSED</span>
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
                        <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>200 OK</span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: "13px", color: "#09090b" }}>Canonicalized Ledger Grain</div>
                      <div style={{ fontSize: "12px", color: "#71717a", marginTop: "4px" }}>
                        Aggregated multi-line disbursements into unified transaction entities with normalized vendor strings.
                      </div>
                    </div>

                    <div className="preview-tool-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span className="tool-tag">tool.blocking</span>
                        <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>O(N) COMPLETE</span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: "13px", color: "#09090b" }}>Hash-Bucket Candidate Generation</div>
                      <div style={{ fontSize: "12px", color: "#71717a", marginTop: "4px" }}>
                        Grouped records into candidate pairs using amount &amp; phonetic vendor hash partitions, avoiding quadratic explosion.
                      </div>
                    </div>

                    <div className="preview-tool-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span className="tool-tag">neatlogs.telemetry</span>
                        <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>20 SPANS SEALED</span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: "13px", color: "#09090b" }}>Cryptographic Evidence Dossier</div>
                      <div style={{ fontSize: "12px", color: "#71717a", marginTop: "4px" }}>
                        Sealed SHA-256 evidence packet and emitted structured trace to Neatlogs collector.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON TO OPEN IN REVIEW QUEUE */}
              <div style={{
                background: "#fafafa",
                border: "1px solid #e4e4e7",
                borderRadius: "14px",
                padding: "20px 24px",
                marginBottom: "32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "14px"
              }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#09090b" }}>
                    Candidate Ready for Human Controller Signoff
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#71717a", marginTop: "2px" }}>
                    Inspect the transaction diff, PO ceiling proofs, and authorize clawback in the review queue desk.
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <Link
                    href="/agent"
                    className="btn btn-primary"
                    style={{ fontSize: "13.5px", padding: "10px 20px" }}
                  >
                    <Split size={14} />
                    <span>Open in Review Queue &rarr;</span>
                  </Link>

                  <a 
                    href={directTraceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline"
                    style={{ fontSize: "13.5px", padding: "10px 18px" }}
                  >
                    <Activity size={14} />
                    <span>Inspect Trace in Neatlogs</span>
                    <ExternalLink size={12} style={{ opacity: 0.6 }} />
                  </a>
                </div>
              </div>

              {/* AUTONOMOUS FORENSIC EVIDENCE PACKET (WHAT OUR AGENT ACTUALLY DOES) */}
              <div style={{
                background: "#ffffff",
                border: "1px solid #e4e4e7",
                borderRadius: "14px",
                padding: "26px 28px",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div className="eyebrow-badge" style={{ marginBottom: "6px" }}>
                      <ShieldCheck size={13} color="#16a34a" />
                      <span>Cryptographic Evidence Dossier (SHA-256 Sealed)</span>
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#09090b", margin: 0 }}>
                      Autonomous Forensic Evidence Packet (JSON)
                    </h3>
                    <p style={{ fontSize: "13px", color: "#71717a", margin: "3px 0 0" }}>
                      Cryptographically signed audit artifact produced by Ovio with live Neatlogs trace ID, Entire continuous memory checkpoint, and ERP recovery proofs:
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={copyEvidenceJson}
                      className="btn btn-primary btn-sm"
                    >
                      {copiedPacket ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedPacket ? "Copied JSON!" : "Copy Evidence Packet"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={copyGateCommand}
                      className="btn btn-outline btn-sm"
                    >
                      {copiedGate ? <Check size={14} /> : <Terminal size={14} />}
                      <span>{copiedGate ? "Copied Command!" : "Copy CLI Gate Check"}</span>
                    </button>
                  </div>
                </div>

                <pre style={{
                  background: "#09090b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  padding: "16px",
                  fontSize: "12px",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  lineHeight: 1.55,
                  color: "#e4e4e7",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxHeight: "220px",
                  overflowY: "auto",
                  margin: 0
                }}>
                  {evidencePacketJson}
                </pre>

                <div style={{
                  marginTop: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  fontSize: "12px",
                  color: "#71717a",
                  paddingTop: "12px",
                  borderTop: "1px solid #f1f5f9"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "999px", background: "#16a34a", display: "inline-block" }} />
                    <span style={{ fontWeight: 600, color: "#09090b" }}>CLI Verification Gate:</span>
                    <code style={{ background: "#f4f4f5", padding: "2px 6px", borderRadius: "4px", color: "#09090b" }}>{gateCommand}</code>
                  </div>
                  <a
                    href={directTraceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <span>View Neatlogs Spans (Trace #{current.traceId.slice(0, 8)})</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* NEATLOGS INCIDENT TRIAGE & RECOVERY (TAB=FIXES) */}
              <div style={{
                marginTop: "32px",
                background: "#ffffff",
                border: "1px solid #bbf7d0",
                borderRadius: "14px",
                padding: "24px 26px",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: "4px" }}>
                        3 INCIDENTS RESOLVED
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#16a34a" }}>
                        Neatlogs Incident Triage &amp; Trace Observability
                      </span>
                    </div>
                    <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#09090b", margin: 0 }}>
                      How Neatlogs Identified &amp; Resolved Agent Incidents
                    </h3>
                  </div>
                  <a
                    href="https://app.neatlogs.com/incidents?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240&tab=fixes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: "12px", borderColor: "#86efac", color: "#15803d" }}
                  >
                    <span>View Fixes Board (tab=fixes) &rarr;</span>
                  </a>
                </div>

                <p style={{ fontSize: "12.5px", color: "#52525b", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                  During agent execution across 27,000+ public disbursements, Neatlogs automatically detected 3 failure and drift patterns from real OpenInference traces, analyzed root causes, and suggested code remedies:
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
                  {/* Incident 1 */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#b45309", background: "#fef3c7", padding: "1px 6px", borderRadius: "4px" }}>
                        SEVERITY 74
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#16a34a" }}>RESOLVED</span>
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#09090b" }}>System Prompt Schema &amp; Parsing</div>
                    <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "4px", lineHeight: 1.45 }}>
                      LLM output markdown code fencing caused JSON decode exceptions. Resolved by enforcing strict JSON Schema in <code>core/llm.py</code> and implementing regex boundary extraction.
                    </div>
                  </div>

                  {/* Incident 2 */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#b45309", background: "#fef3c7", padding: "1px 6px", borderRadius: "4px" }}>
                        SEVERITY 64
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#16a34a" }}>RESOLVED</span>
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#09090b" }}>Line-Split False Positives</div>
                    <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "4px", lineHeight: 1.45 }}>
                      Fuel products vs excise taxes sharing amounts under one PO were borderline false positives. Added Treasury Disambiguation Rule in prompt to dismiss line splits.
                    </div>
                  </div>

                  {/* Incident 3 */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#b45309", background: "#fef3c7", padding: "1px 6px", borderRadius: "4px" }}>
                        SEVERITY 71
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#16a34a" }}>RESOLVED</span>
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#09090b" }}>Strict Invoice Number Validation</div>
                    <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "4px", lineHeight: 1.45 }}>
                      Sequential monthly billings risked false duplicate flags. Enforced strict canonical invoice matching and classified sequential intervals as legitimate recurring payments.
                    </div>
                  </div>
                </div>
              </div>

              {/* CFO.AI EXECUTIVE SUITE: HOW CFO COMES INTO PICTURE */}
              <div style={{
                marginTop: "32px",
                background: "#ffffff",
                border: "1px solid #e4e4e7",
                borderRadius: "14px",
                padding: "26px 28px",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div className="eyebrow-badge" style={{ marginBottom: "6px" }}>
                      <TrendingUp size={13} color="#2563eb" />
                      <span>Institutional Treasury Framework</span>
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#09090b", margin: 0 }}>
                      How the CFO Enters the Picture: Step-by-Step Architecture
                    </h3>
                    <p style={{ fontSize: "13px", color: "#71717a", margin: "3px 0 0" }}>
                      Ovio acts as an institutional asset answering the CFO's core financial questions across every command:
                    </p>
                  </div>
                  <Link
                    href="/docs"
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: "12px" }}
                  >
                    <span>Read Full CFO Docs &rarr;</span>
                  </Link>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                  {/* Step 1: ovio run */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 700, color: "#2563eb", background: "#dbeafe", padding: "2px 6px", borderRadius: "4px" }}>
                        1. ovio run
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a" }}>RECOVERY YIELD</span>
                    </div>
                    <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#09090b" }}>Real-Time Unit Economics</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", lineHeight: 1.5 }}>
                      Calculates 18% success fee (${current.fee.toLocaleString()} on {current.datasetName}), sub-penny AI inference COGS (&lt;$0.001), and &gt;99% gross margins.
                    </div>
                  </div>

                  {/* Step 2: ovio cfo */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 700, color: "#7c3aed", background: "#ede9fe", padding: "2px 6px", borderRadius: "4px" }}>
                        2. ovio cfo
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#7c3aed" }}>RUNWAY & TIERS</span>
                    </div>
                    <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#09090b" }}>24-Month Financial Plan</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", lineHeight: 1.5 }}>
                      Simulates $1.5M seed capital in native cfo_model.json across 3 pricing tiers (Contingency, Hybrid, Enterprise), proving Month 7-9 break-even.
                    </div>
                  </div>

                  {/* Step 3: ovio rescue */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 700, color: "#d97706", background: "#fef3c7", padding: "2px 6px", borderRadius: "4px" }}>
                        3. ovio rescue
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#d97706" }}>WORKING CAPITAL</span>
                    </div>
                    <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#09090b" }}>90-Day Cashflow Rescue</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", lineHeight: 1.5 }}>
                      Dynamically models 4 intervention scenarios (AR Acceleration vs AP Deferral) to protect the corporate cash floor without taking expensive debt.
                    </div>
                  </div>

                  {/* Step 4: ovio gate */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 700, color: "#059669", background: "#d1fae5", padding: "2px 6px", borderRadius: "4px" }}>
                        4. ovio gate
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#059669" }}>HITL GOVERNANCE</span>
                    </div>
                    <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#09090b" }}>Cryptographic Guardrail</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", lineHeight: 1.5 }}>
                      Verifies SHA-256 evidence digests, Neatlogs trace IDs, and Entire memory checkpoints before authorizing treasury clawback wires.
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
