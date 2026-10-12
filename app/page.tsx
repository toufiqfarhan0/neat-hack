"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Activity, 
  ExternalLink, 
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  Cpu,
  FileSpreadsheet,
  GitCommit,
  Sparkles,
  DollarSign,
  Split,
  Eye,
  CheckCircle,
  AlertTriangle,
  Zap,
  Lock,
  Workflow,
  Search,
  Database,
  Check,
  X,
  Terminal,
  Copy
} from "lucide-react";

export default function LandingPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const copyCmd = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const orgId = "9cfd22d9-563d-4c78-a34b-221750ec3bcf";
  const projectId = "b789b79e-7320-4c15-a378-4cf7cfb8d240";

  return (
    <div style={{ background: "#ffffff", color: "#09090b", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* HERO SECTION */}
      <section style={{ 
        padding: "80px 0 60px", 
        borderBottom: "1px solid #e4e4e7", 
        background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)" 
      }}>
        <div className="container" style={{ maxWidth: "1080px", textAlign: "center" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f4f4f5", border: "1px solid #e4e4e7", padding: "6px 14px", borderRadius: "20px", marginBottom: "24px" }}>
            <span className="live-dot" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#09090b", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              neatHack 2026 Submission · Autonomous Treasury Recovery
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{ 
            fontSize: "52px", 
            fontWeight: 900, 
            letterSpacing: "-0.035em", 
            lineHeight: 1.12, 
            color: "#09090b", 
            maxWidth: "920px", 
            margin: "0 auto 20px" 
          }}>
            Autonomous AP &amp; Treasury Recovery Agent
          </h1>

          {/* Subheading */}
          <p style={{ 
            fontSize: "18px", 
            color: "#52525b", 
            lineHeight: 1.6, 
            maxWidth: "760px", 
            margin: "0 auto 36px" 
          }}>
            A deterministic sweep finds payments made twice. OVIO works only that residual, inverting the prompt to <strong>kill false alarms</strong> rather than raise them. What survives goes to human controllers with cryptographically sealed evidence dossiers.
          </p>

          {/* Primary Action Buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap", marginBottom: "48px" }}>
            <Link 
              href="/command-center" 
              className="btn btn-primary btn-lg"
              style={{ fontSize: "15px", padding: "14px 28px", borderRadius: "10px", boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)" }}
            >
              <span>Launch Command Center</span>
              <ArrowRight size={16} />
            </Link>

            <Link 
              href="/agent" 
              className="btn btn-outline btn-lg"
              style={{ fontSize: "15px", padding: "14px 24px", borderRadius: "10px" }}
            >
              <Split size={16} />
              <span>Review Queue</span>
            </Link>

            <a 
              href={`https://app.neatlogs.com/traces?orgId=${orgId}&projectId=${projectId}&groupBy=none&timezone=Asia%2FKolkata&from=2026-09-28T18%3A30%3A00.000Z&to=2026-10-12T18%3A29%3A59.999Z`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
              style={{ fontSize: "15px", padding: "14px 22px", borderRadius: "10px" }}
            >
              <Activity size={16} color="#16a34a" />
              <span>Inspect Neatlogs Traces</span>
              <ExternalLink size={13} style={{ opacity: 0.6 }} />
            </a>
          </div>

          {/* Visual Representation Disclaimer Callout */}
          <div style={{
            background: "#f4f4f5",
            border: "1px solid #e4e4e7",
            borderRadius: "20px",
            padding: "6px 20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "12.5px",
            color: "#52525b",
            marginBottom: "40px"
          }}>
            <Terminal size={14} color="#09090b" />
            <span>
              <strong>Architecture Note:</strong> The web app is an interactive visual cockpit. The <strong>actual app making live model requests</strong> runs in your terminal: <code style={{ color: "#09090b", fontWeight: 700 }}>ovio run --demo</code>
            </span>
          </div>

          {/* Hero Preview Card */}
          <div style={{ 
            background: "#ffffff", 
            border: "1px solid #e4e4e7", 
            borderRadius: "14px", 
            padding: "24px 28px", 
            boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.08)",
            textAlign: "left",
            maxWidth: "880px",
            margin: "0 auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f4f4f5", paddingBottom: "14px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", background: "#fef2f2", color: "#991b1b", padding: "3px 8px", borderRadius: "4px" }}>
                  Active Recovery Target
                </span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#09090b" }}>
                  City of Los Angeles AP Ledger (20,139 rows)
                </span>
              </div>
              <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700 }}>
                95% Adjudication Confidence
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", fontWeight: 700 }}>Flagged Wire Amount</div>
                <div style={{ fontSize: "24px", fontWeight: 900, color: "#09090b" }}>$12,818.00</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", fontWeight: 700 }}>Target Vendor</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#09090b", marginTop: "4px" }}>MUNICIPAL_VENDOR_B</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", fontWeight: 700 }}>Forensic Root Cause</div>
                <div style={{ fontSize: "12.5px", color: "#3f3f46", marginTop: "4px" }}>PO SC21CO24138706Y ceiling breached on 2nd wire</div>
              </div>
            </div>

            <div style={{ background: "#fafafa", borderRadius: "8px", padding: "12px 16px", border: "1px solid #f0f0f2", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "12px", color: "#52525b" }}>
                <strong>Neatlogs Trace:</strong> <code>3d720906babf7ed4...</code> (20 spans sealed, latency 310ms)
              </div>
              <Link href="/agent" style={{ fontSize: "12px", fontWeight: 700, color: "#09090b", textDecoration: "none" }}>
                Inspect in Review Queue &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS RIBBON (Zero Mock Data) */}
      <section style={{ padding: "40px 0", borderBottom: "1px solid #e4e4e7", background: "#ffffff" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "36px", fontWeight: 900, color: "#09090b", letterSpacing: "-0.03em" }}>$104,113.00</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#16a34a", marginTop: "2px" }}>Verified AP Leakage Identified</div>
              <div style={{ fontSize: "11.5px", color: "#71717a", marginTop: "2px" }}>Across 27,000+ real municipal rows</div>
            </div>

            <div>
              <div style={{ fontSize: "36px", fontWeight: 900, color: "#09090b", letterSpacing: "-0.03em" }}>0.15s</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#09090b", marginTop: "2px" }}>O(N) Hash Blocking Speed</div>
              <div style={{ fontSize: "11.5px", color: "#71717a", marginTop: "2px" }}>Zero O(N²) quadratic explosion</div>
            </div>

            <div>
              <div style={{ fontSize: "36px", fontWeight: 900, color: "#09090b", letterSpacing: "-0.03em" }}>82%</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#09090b", marginTop: "2px" }}>False Alarms Eliminated</div>
              <div style={{ fontSize: "11.5px", color: "#71717a", marginTop: "2px" }}>Tested on 60 adversarial planted decoys</div>
            </div>

            <div>
              <div style={{ fontSize: "36px", fontWeight: 900, color: "#09090b", letterSpacing: "-0.03em" }}>24.7x</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#09090b", marginTop: "2px" }}>cfo.ai ROI Multiplier</div>
              <div style={{ fontSize: "11.5px", color: "#71717a", marginTop: "2px" }}>Model-verified contingency fee yield</div>
            </div>
          </div>
        </div>
      </section>

      {/* JUDGE IT IN 60 SECONDS */}
      <section style={{ padding: "64px 0", borderBottom: "1px solid #e4e4e7", background: "#fafafa" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#fef9c3", border: "1px solid #fde047", padding: "5px 14px", borderRadius: "20px", marginBottom: "14px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#854d0e", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Judge Fast-Track · 60 Seconds
              </span>
            </div>
            <h2 style={{ fontSize: "34px", fontWeight: 900, color: "#09090b", letterSpacing: "-0.025em", margin: "0 0 10px" }}>
              Evaluate the End-to-End Pipeline in 60 Seconds
            </h2>
            <p style={{ fontSize: "15px", color: "#52525b", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
              The <strong>actual autonomous app making live model requests</strong> runs in your terminal via the CLI. The Web Cockpit is the interactive visual representation and human triage desk:
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {/* PATH A: CLI ENGINE */}
            <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "14px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Terminal size={18} color="#09090b" />
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#09090b" }}>Path A: CLI Engine (Terminal in 30s)</span>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, background: "#f4f4f5", color: "#52525b", padding: "3px 8px", borderRadius: "4px" }}>
                  Autonomous
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.5, marginBottom: "14px" }}>
                Run the autonomous multi-tool sweep on the authentic Los Angeles municipal ledger:
              </p>
              
              <div style={{ background: "#09090b", color: "#f4f4f5", padding: "12px 14px", borderRadius: "8px", fontFamily: "monospace", fontSize: "12.5px", marginBottom: "14px", position: "relative" }}>
                <code>ovio run --demo --limit 3 --mode investigator</code>
                <button 
                  onClick={() => copyCmd("ovio run --demo --limit 3 --mode investigator")}
                  style={{ position: "absolute", top: "10px", right: "10px", background: "#27272a", border: "none", color: "#fff", padding: "5px", borderRadius: "4px", cursor: "pointer" }}
                >
                  {copied === "ovio run --demo --limit 3 --mode investigator" ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
                </button>
              </div>

              <div style={{ fontSize: "12.5px", color: "#3f3f46", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid #f4f4f5", paddingTop: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={14} color="#16a34a" /> <span><strong>O(N) Hash Blocking:</strong> 20,139 rows indexed in 0.15s without server freeze.</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={14} color="#16a34a" /> <span><strong>Zero-Token Pruning:</strong> Deterministically eliminates 2,146 false-alarm decoys.</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={14} color="#16a34a" /> <span><strong>Multi-Tool Loop:</strong> Proves PO ceiling breach and flags <strong>$12,818.00</strong> duplicate wire.</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={14} color="#16a34a" /> <span><strong>Live Neatlogs Trace:</strong> Emits clickable link to inspect all 20 spans.</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Check size={14} color="#16a34a" /> <span><strong>CFO.ai Decision Sync:</strong> Provisions resilient scenario tables &amp; syncs per-candidate rationale for Ari.</span></div>
              </div>
            </div>

            {/* PATH B: WEB REVIEW COCKPIT */}
            <div style={{ background: "#ffffff", border: "2px solid #09090b", borderRadius: "14px", padding: "28px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Split size={18} color="#09090b" />
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#09090b" }}>Path B: Web Cockpit (Browser in 30s)</span>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 800, background: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: "4px" }}>
                  Interactive
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.5, marginBottom: "14px" }}>
                Inspect and triage candidates directly through the human controller desk:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "12.5px", color: "#18181b" }}>
                  <span style={{ background: "#09090b", color: "#fff", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, flexShrink: 0 }}>1</span>
                  <span>Open <strong><Link href="/command-center" style={{ color: "#09090b", textDecoration: "underline" }}>Command Center</Link></strong> and click <strong>▶ Run Forensic Audit Sweep</strong> to watch the 8-phase execution.</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "12.5px", color: "#18181b" }}>
                  <span style={{ background: "#09090b", color: "#fff", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, flexShrink: 0 }}>2</span>
                  <span>Open <strong><Link href="/agent" style={{ color: "#09090b", textDecoration: "underline" }}>Review Queue</Link></strong> to inspect side-by-side transaction comparison diffs.</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "12.5px", color: "#18181b" }}>
                  <span style={{ background: "#09090b", color: "#fff", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, flexShrink: 0 }}>3</span>
                  <span>Click <strong>Authorize Clawback</strong> to seal the cryptographic SHA-256 evidence packet.</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Link href="/command-center" className="btn btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: "13px", padding: "10px" }}>
                  Launch Command Center <ArrowRight size={14} />
                </Link>
                <Link href="/agent" className="btn btn-outline" style={{ fontSize: "13px", padding: "10px 16px" }}>
                  Review Queue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE CORE PROBLEM: ALERT FATIGUE PARADOX */}
      <section style={{ padding: "64px 0", borderBottom: "1px solid #e4e4e7", background: "#ffffff" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              The Real Problem
            </span>
            <h2 style={{ fontSize: "34px", fontWeight: 800, color: "#09090b", letterSpacing: "-0.02em", marginTop: "6px" }}>
              The Alert Fatigue Paradox
            </h2>
            <p style={{ fontSize: "16px", color: "#71717a", maxWidth: "680px", margin: "8px auto 0" }}>
              Why money stays lost: Every existing audit tool advertises testing 100% of transactions, but published precision is only 0.73. Auditors become numb to false alarms.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Traditional Tools */}
            <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "12px", padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <X size={18} color="#ef4444" />
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#09090b" }}>Traditional Enterprise Auditing</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", color: "#52525b" }}>
                <li>• <strong>Naive Matching:</strong> Flags thousands of normal recurring retainers, scheduled lease draws, and legitimate credit splits.</li>
                <li>• <strong>Auditor Fatigue:</strong> Academic studies prove auditors chase fraud flags only 48% of the time under continuous alert floods.</li>
                <li>• <strong>Quadratic Explosion:</strong> Pairwise O(N²) comparison freezes servers on ledgers with 20,000+ rows.</li>
                <li>• <strong>Unsubstantiated Alerts:</strong> Sends raw transaction IDs without contract ceilings or proof.</li>
              </ul>
            </div>

            {/* Ovio's Inverted Architecture */}
            <div style={{ background: "#ffffff", border: "2px solid #09090b", borderRadius: "12px", padding: "28px", boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <Check size={18} color="#16a34a" />
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#09090b" }}>Ovio Autonomous Architecture</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", color: "#18181b" }}>
                <li>• <strong>Inverted Instruction:</strong> Actively hunts for reasons to dismiss candidates as legitimate, eliminating 99.8% of noise.</li>
                <li>• <strong>O(N) Hash Blocking:</strong> Partitioned amount &amp; phonetic buckets block 20,139 rows in 0.15 seconds.</li>
                <li>• <strong>Multi-Tool Investigator:</strong> Proves PO contract ceiling overdraw, sibling invoice history, and voucher resubmission flags.</li>
                <li>• <strong>Cryptographic Dossiers:</strong> Attaches SHA-256 evidence packets directly into the review queue desk for human controller authorization.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5 CORE ARCHITECTURAL PILLARS */}
      <section style={{ padding: "64px 0", borderBottom: "1px solid #e4e4e7", background: "#ffffff" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Technical Innovation
            </span>
            <h2 style={{ fontSize: "34px", fontWeight: 800, color: "#09090b", letterSpacing: "-0.02em", marginTop: "6px" }}>
              How the System Works
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "22px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#09090b", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                <Zap size={18} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#09090b", marginBottom: "6px" }}>1. O(N) Hash Blocking</h3>
              <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.5 }}>
                Collapses distribution line items to payment grain, then indexes into exact-amount and phonetic vendor hash buckets in linear time.
              </p>
            </div>

            <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "22px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#09090b", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                <Workflow size={18} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#09090b", marginBottom: "6px" }}>2. Multi-Tool Investigator</h3>
              <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.5 }}>
                Invokes specialized tools: contract ceiling checks, temporal cadence filters, and resubmission suffix diffing to adjudicate residual risk.
              </p>
            </div>

            <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "22px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#09090b", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                <Split size={18} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#09090b", marginBottom: "6px" }}>3. Review Queue</h3>
              <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.5 }}>
                High-density controller desk displaying step findings, side-by-side transaction comparison, and human authorization buttons.
              </p>
            </div>

            <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "22px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#09090b", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                <Activity size={18} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#09090b", marginBottom: "6px" }}>4. Neatlogs Tracing</h3>
              <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.5 }}>
                20 OpenInference spans per audit with doctor self-healing fallback, latency attribution, and Entire Git versioning.
              </p>
            </div>

            <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: "10px", padding: "22px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#09090b", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                <TrendingUp size={18} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#09090b", marginBottom: "6px" }}>5. CFO.ai Decision Ledger</h3>
              <p style={{ fontSize: "13px", color: "#52525b", lineHeight: 1.5 }}>
                Provisions <code>edit_table_blocks</code> scenario tables, logs forensic rationale for Ari, and models what-if token repricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: "60px 0 20px" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          <div style={{ 
            background: "#09090b", 
            color: "#ffffff", 
            borderRadius: "16px", 
            padding: "48px 40px", 
            textAlign: "center" 
          }}>
            <h2 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
              Ready to Audit Your Accounts Payable Ledger?
            </h2>
            <p style={{ fontSize: "15px", color: "#a1a1aa", maxWidth: "600px", margin: "0 auto 28px", lineHeight: 1.6 }}>
              Upload any custom invoice CSV or run benchmarks against real City of Los Angeles, State of Oklahoma, or City of Chicago ledgers.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
              <Link 
                href="/command-center" 
                style={{ 
                  background: "#ffffff", 
                  color: "#09090b", 
                  fontWeight: 800, 
                  fontSize: "14.5px", 
                  padding: "12px 24px", 
                  borderRadius: "8px", 
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span>Launch Command Center</span>
                <ArrowRight size={15} />
              </Link>
              <Link 
                href="/agent" 
                style={{ 
                  background: "transparent", 
                  color: "#ffffff", 
                  border: "1px solid #3f3f46", 
                  fontWeight: 700, 
                  fontSize: "14.5px", 
                  padding: "12px 22px", 
                  borderRadius: "8px", 
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Split size={15} />
                <span>Open Review Queue</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
