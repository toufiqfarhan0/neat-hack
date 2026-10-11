'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Terminal, 
  Code, 
  Database, 
  ShieldCheck, 
  Activity, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  FileText,
  DollarSign
} from 'lucide-react';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'models' | 'sponsors' | 'cli' | 'evidence'>('quickstart');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#09090b' }}>
      
      {/* Docs Header */}
      <div style={{ borderBottom: '1px solid #e4e4e7', paddingBottom: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717a', fontSize: '13px', marginBottom: '10px' }}>
          <BookOpen size={16} /> <span>OVIO Documentation</span> <ChevronRight size={14} /> <span style={{ color: '#09090b', fontWeight: 600 }}>{activeTab.toUpperCase()}</span>
        </div>
        <h1 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 10px 0' }}>
          Technical Reference & Operational Guide
        </h1>
        <p style={{ fontSize: '15px', color: '#71717a', margin: 0, maxWidth: '800px', lineHeight: '1.6' }}>
          Complete developer manual, data schemas, CLI commands, sponsor integrations (Neatlogs, Entire, cfo.ai), and academic citations.
        </p>
      </div>

      {/* Docs Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e4e4e7', paddingBottom: '12px', marginBottom: '32px', overflowX: 'auto' }}>
        {[
          { id: 'quickstart', label: '1. Quickstart & Setup', icon: Terminal },
          { id: 'models', label: '2. Schemas & Models', icon: Code },
          { id: 'sponsors', label: '3. Sponsor Integrations', icon: Activity },
          { id: 'cli', label: '4. CLI Reference', icon: Terminal },
          { id: 'evidence', label: '5. Academic Citations', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: isActive ? '1px solid #09090b' : '1px solid #e4e4e7',
                background: isActive ? '#09090b' : '#fafafa',
                color: isActive ? '#ffffff' : '#09090b',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Quickstart & Setup */}
      {activeTab === 'quickstart' && (
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>Getting Started with OVIO</h2>
          <p style={{ fontSize: '14px', color: '#52525b', lineHeight: '1.6', marginBottom: '24px' }}>
            OVIO requires <strong>no external API keys</strong> to run out of the box. All benchmark datasets and replay caches are committed directly to the repository.
          </p>

          <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px 0' }}>1. Local Web App Quickstart</h3>
            <div style={{ background: '#09090b', color: '#f4f4f5', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', position: 'relative', marginBottom: '12px' }}>
              <pre style={{ margin: 0 }}>{`git clone https://github.com/toufiqfarhan0/neat-hack\ncd neat-hack\nnpm install\nnpm run dev`}</pre>
              <button 
                onClick={() => copyToClipboard('git clone https://github.com/toufiqfarhan0/neat-hack\ncd neat-hack\nnpm install\nnpm run dev')}
                style={{ position: 'absolute', top: '12px', right: '12px', background: '#27272a', border: 'none', color: '#fff', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
              >
                {copiedCmd?.includes('npm run dev') ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#71717a', margin: 0 }}>
              Navigate to <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" style={{ color: '#09090b', fontWeight: 600 }}>http://localhost:3000</a> and click <strong>▶ Run Autonomous Audit Sweep →</strong>.
            </p>
          </div>

          <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px 0' }}>2. Python CLI & Test Suite</h3>
            <div style={{ background: '#09090b', color: '#f4f4f5', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', position: 'relative', marginBottom: '12px' }}>
              <pre style={{ margin: 0 }}>{`pip install -r requirements.txt\npython ovio_cli.py run --demo\npytest`}</pre>
              <button 
                onClick={() => copyToClipboard('pip install -r requirements.txt\npython ovio_cli.py run --demo\npytest')}
                style={{ position: 'absolute', top: '12px', right: '12px', background: '#27272a', border: 'none', color: '#fff', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
              >
                {copiedCmd?.includes('pytest') ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#71717a', margin: 0 }}>
              Runs the 20,000-row Los Angeles audit sweep and validates all 4 test suites with 100% passing results.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Schemas & Models */}
      {activeTab === 'models' && (
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>Core AP Data Models & Schemas</h2>
          <p style={{ fontSize: '14px', color: '#52525b', lineHeight: '1.6', marginBottom: '24px' }}>
            OVIO models Accounts Payable disbursements at the transaction grain rather than the invoice-distribution line grain.
          </p>

          <div style={{ background: '#09090b', color: '#f4f4f5', borderRadius: '10px', padding: '20px', fontFamily: 'monospace', fontSize: '13px', marginBottom: '24px' }}>
            <div style={{ color: '#a1a1aa', marginBottom: '8px' }}># core/ledger.py — Ingested Payment Record</div>
            <pre style={{ margin: 0 }}>{`{
  "transaction_id": "TX-94821",
  "vendor_name_raw": "CDW GOVERNMENT INC",
  "vendor_canonical": "CDWGOVERNMENT",
  "invoice_number_raw": "INV-849102",
  "invoice_canonical": "849102",
  "amount": Decimal("14250.00"),
  "payment_date": "2024-03-15",
  "department": "INFORMATION TECHNOLOGY",
  "po_number": "PO-40912",
  "line_count": 14,
  "line_amounts": [Decimal("1000.00"), Decimal("13250.00")]
}`}</pre>
          </div>

          <div style={{ background: '#09090b', color: '#f4f4f5', borderRadius: '10px', padding: '20px', fontFamily: 'monospace', fontSize: '13px' }}>
            <div style={{ color: '#a1a1aa', marginBottom: '8px' }}># core/llm.py — Adjudication Verdict Schema</div>
            <pre style={{ margin: 0 }}>{`{
  "verdict": "escalate" | "dismiss",
  "confidence": 0.94,
  "explanation_type": "accidental_duplicate" | "progress_draw" | "cancelled" | "recurring",
  "rationale": "Exact matching PO, identical dollar sum, issued across 48h with no credit memo offset.",
  "recommended_action": "clawback_hold"
}`}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: Sponsor Integrations */}
      {activeTab === 'sponsors' && (
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>Deep Sponsor Synergy</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {/* Neatlogs */}
            <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span className="live-dot" />
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>1. Neatlogs (Autonomous Observability, Traces Hub &amp; Evals)</h3>
              </div>
              <p style={{ fontSize: '13.5px', color: '#52525b', lineHeight: '1.6', marginBottom: '14px' }}>
                OVIO implements full hierarchical OpenInference tracing conforming to the <a href="https://docs.neatlogs.com/docs" target="_blank" rel="noopener noreferrer" style={{ color: '#09090b', fontWeight: 600, textDecoration: 'underline' }}>official Neatlogs documentation</a>. Every run is anchored by a semantic root (<code style={{ background: '#e4e4e7', padding: '2px 6px', borderRadius: '4px' }}>WORKFLOW</code>) nesting child tools, LLM calls, pre-dispatch guardrails, and evaluators.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600 }}>TOTAL PROJECT TRACES</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#09090b' }}>41 Traces</div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600 }}>AGENT SESSIONS</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#09090b' }}>39 Sessions</div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600 }}>WORKFLOWS</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#09090b' }}>3 Workflows</div>
                </div>
              </div>

              <ul style={{ fontSize: '13px', color: '#52525b', lineHeight: '1.7', marginBottom: '16px' }}>
                <li><strong>All Traces Explorer:</strong> <a href="https://app.neatlogs.com/traces?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240" target="_blank" rel="noopener noreferrer" style={{ color: '#09090b', fontWeight: 700 }}>Browse All 41+ Traces in Neatlogs Dashboard ↗</a></li>
                <li><strong>Sessions &amp; Replays:</strong> <a href="https://app.neatlogs.com/sessions?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240" target="_blank" rel="noopener noreferrer" style={{ color: '#09090b', fontWeight: 700 }}>View 39 Multi-Step Agent Sessions ↗</a></li>
                <li><strong>Multi-Tool Investigator Trace (20 Spans):</strong> <a href="https://app.neatlogs.com/traces/3d720906babf7ed470e690f68c4eedc5?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240" target="_blank" rel="noopener noreferrer" style={{ color: '#09090b', fontWeight: 700 }}>Inspect Trace 3d720906 (4 Tools + Guardrail) ↗</a></li>
                <li><strong>Single-Shot Baseline Trace (11 Spans):</strong> <a href="https://app.neatlogs.com/traces/dd024eda5ca251867f7f23cf768e6651?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240" target="_blank" rel="noopener noreferrer" style={{ color: '#09090b', fontWeight: 700 }}>Inspect Baseline Trace dd024eda ↗</a></li>
                <li><strong>Diagnostic Self-Healing Probe:</strong> <code style={{ background: '#e4e4e7', padding: '2px 4px', borderRadius: '4px' }}>ovio-doctor-probe</code> proactively verifies collector reachability, network latency, and JSON schema recovery.</li>
              </ul>
            </div>

            {/* Entire.io */}
            <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <ShieldCheck size={20} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>2. Entire.io (Continuous Git Checkpoints)</h3>
              </div>
              <p style={{ fontSize: '13.5px', color: '#52525b', lineHeight: '1.6', marginBottom: '14px' }}>
                Every single commit carries an authentic <code style={{ background: '#e4e4e7', padding: '2px 6px', borderRadius: '4px' }}>Entire-Checkpoint</code> trailer, capturing active session turns, prompts, tool calls, and diffs to the cloud mirror.
              </p>
              <ul style={{ fontSize: '13px', color: '#52525b', lineHeight: '1.6', marginBottom: '14px' }}>
                <li><strong>Active Antigravity Session:</strong> <code style={{ background: '#e4e4e7', padding: '2px 4px', borderRadius: '4px' }}>45f215bc-78e0-4e7b-bedf-b112d4595a4b</code> (58+ turns, 9,000+ lines).</li>
                <li><strong>25 Checkpointed Commits on main:</strong> Synced cleanly to GitHub and Entire.</li>
                <li><strong>Submission Link:</strong> <a href="https://entire.io/gh/toufiqfarhan0/neat-hack/commit/a25253e53612ee2ce7ba7256d5747bac49e6214b" target="_blank" rel="noopener noreferrer" style={{ color: '#09090b', fontWeight: 600 }}>Open Checkpoint on Entire.io ↗</a></li>
              </ul>
            </div>

            {/* cfo.ai */}
            <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Database size={20} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>3. cfo.ai (Financial Modeling & Unit Economics)</h3>
              </div>
              <p style={{ fontSize: '13.5px', color: '#52525b', lineHeight: '1.6', marginBottom: '14px' }}>
                OVIO computes real cash impact using dynamic financial drivers in <code style={{ background: '#e4e4e7', padding: '2px 6px', borderRadius: '4px' }}>cfo_model.json</code> and <code style={{ background: '#e4e4e7', padding: '2px 6px', borderRadius: '4px' }}>business/drivers.csv</code>.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#71717a' }}>NET CASH RECOVERED</div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>$1,024,000</div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#71717a' }}>ROI MULTIPLE</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a' }}>24.7x</div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#71717a' }}>PAYBACK PERIOD</div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>14.6 Days</div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#71717a' }}>EBITDA LIFT</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a' }}>+0.48%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: CLI Reference */}
      {activeTab === 'cli' && (
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>Typer CLI Command Reference</h2>
          <p style={{ fontSize: '14px', color: '#52525b', lineHeight: '1.6', marginBottom: '24px' }}>
            OVIO includes a high-performance Typer command-line interface with colorized Rich output.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>1. Run Full Demo Sweep</div>
              <div style={{ background: '#09090b', color: '#f4f4f5', padding: '10px 14px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '12.5px', marginBottom: '8px' }}>
                python ovio_cli.py run --demo
              </div>
              <div style={{ fontSize: '13px', color: '#71717a' }}>
                Sweeps 20,000 Los Angeles payment records with O(N) blocking, rule pruning, and model adjudication.
              </div>
            </div>

            <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>2. Run on Custom Ledger CSV</div>
              <div style={{ background: '#09090b', color: '#f4f4f5', padding: '10px 14px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '12.5px', marginBottom: '8px' }}>
                python ovio_cli.py run --file data/samples/chicago_sample.csv --min-amount 500 --limit 5
              </div>
              <div style={{ fontSize: '13px', color: '#71717a' }}>
                Runs recovery audit on custom CSV with minimum dollar threshold and adjudication concurrency limit.
              </div>
            </div>

            <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>3. Neatlogs Doctor Self-Healing Probe</div>
              <div style={{ background: '#09090b', color: '#f4f4f5', padding: '10px 14px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '12.5px', marginBottom: '8px' }}>
                python ovio_cli.py doctor
              </div>
              <div style={{ fontSize: '13px', color: '#71717a' }}>
                Emits live latency probe to Neatlogs, tests collector reachability, and verifies schema health.
              </div>
            </div>

            <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>4. Pre-Flight Integration Gate</div>
              <div style={{ background: '#09090b', color: '#f4f4f5', padding: '10px 14px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '12.5px', marginBottom: '8px' }}>
                python ovio_cli.py gate
              </div>
              <div style={{ fontSize: '13px', color: '#71717a' }}>
                Validates dataset existence, Neatlogs SDK wrappers, LiteLLM resilience, and Entire checkpoints.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Academic Evidence & Footnotes */}
      {activeTab === 'evidence' && (
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>Primary Sources & Academic Evidence</h2>
          <p style={{ fontSize: '14px', color: '#52525b', lineHeight: '1.6', marginBottom: '24px' }}>
            Every claim regarding the false positive bottleneck, auditor skepticism degradation, and duplicate dollar leakage traces directly to peer-reviewed literature and government inspector general reports.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                1. Continuous Auditing Exception Prioritization
              </div>
              <p style={{ fontSize: '13px', color: '#52525b', margin: '0 0 6px 0' }}>
                Svanberg et al., <em>Addressing the Exception Prioritization Problem in Continuous Auditing Systems With Thresholding</em>, Intelligent Systems in Accounting, Finance and Management 32(4), 2025.
              </p>
              <div style={{ fontSize: '12px', color: '#71717a' }}>
                Proves published exception detection precision is only 0.73 with 0.18 recall, noting most surfaced alerts are false alarms.
              </div>
            </div>

            <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                2. Full Population Testing & Auditor Skepticism Reduction
              </div>
              <p style={{ fontSize: '13px', color: '#52525b', margin: '0 0 6px 0' }}>
                Li, Brazel and Gold, <em>An Unintended Consequence of Full Population Testing on Auditors' Professional Skepticism</em>, Foundation for Auditing Research working paper 2021B01, 2024.
              </p>
              <div style={{ fontSize: '12px', color: '#71717a' }}>
                125 auditors controlled experiment: auditors with full population testing investigated fraud red flags 48% of the time, vs 65% when sampling.
              </div>
            </div>

            <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                3. Amtrak Office of Inspector General
              </div>
              <p style={{ fontSize: '13px', color: '#52525b', margin: '0 0 6px 0' }}>
                Amtrak OIG, <em>Enhanced Controls Needed To Avoid Duplicate Payments</em>, Report OIG-A-2013-018, 2013.
              </p>
              <div style={{ fontSize: '12px', color: '#71717a' }}>
                Audited 100% of 1.9 million disbursements ($14.1B) and found 0.09% duplicate rate requiring multi-stage controls.
              </div>
            </div>

            <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                4. UK National Fraud Initiative Report
              </div>
              <p style={{ fontSize: '13px', color: '#52525b', margin: '0 0 6px 0' }}>
                Public Sector Fraud Authority, <em>National Fraud Initiative Report 2022-2024</em>, UK Cabinet Office, 2025.
              </p>
              <div style={{ fontSize: '12px', color: '#71717a' }}>
                Identified 819 duplicate vendor disbursements worth £11 million and recovered £10.3 million across local authorities.
              </div>
            </div>

            <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                5. Comptroller & Auditor General of India
              </div>
              <p style={{ fontSize: '13px', color: '#52525b', margin: '0 0 6px 0' }}>
                Comptroller and Auditor General of India, <em>Report No. 3 of 2025</em>, Government of Karnataka, paragraph 3.5.
              </p>
              <div style={{ fontSize: '12px', color: '#71717a' }}>
                "Double payment to contractors for an item of work due to incorrect estimates and measurements", accepted by government.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
