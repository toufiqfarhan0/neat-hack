'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Search, 
  Filter, 
  Cpu, 
  ShieldAlert, 
  Activity, 
  Database, 
  AlertCircle,
  TrendingUp,
  FileCheck2,
  DollarSign,
  Workflow
} from 'lucide-react';

export default function HowItWorksPage() {
  const [activeStage, setActiveStage] = useState(1);

  const stages = [
    {
      num: 1,
      title: 'Aggregate Line Items',
      badge: 'plain Python (O(N))',
      summary: 'Collapse invoice distribution lines onto transaction grain',
      detail: 'ERP ledgers split a single payment across dozens of accounting cost centers. Standard duplicate tools flag every cost-center line as an identical payment. OVIO groups distribution lines by payment ID in O(N) time before any matching begins.',
      volume: '20,000 rows → 3,425 unique disbursements'
    },
    {
      num: 2,
      title: 'Entity Resolution',
      badge: '98.3% F1 vs publisher labels',
      summary: 'Canonicalize vendor names and invoice tokens',
      detail: 'Standardizes corporate suffixes (LLC, Inc, Corp), strip punctuation, handles phonetic aliases (e.g. CDW GOVT vs CDW GOVERNMENT INC), and normalizes invoice numbers by stripping standard prefixes and leading zeroes.',
      volume: '3,425 disbursements canonicalized'
    },
    {
      num: 3,
      title: 'O(N) Hash Blocking',
      badge: '0.15s Linear Time',
      summary: 'Hash-bucket candidate pairs without O(N²) explosion',
      detail: 'Pairwise comparison across 20,000 rows requires 200,000,000 comparisons. OVIO indexes transactions into hash buckets by exact amount and phonetic vendor prefix, comparing only within matching buckets with a hard cap per vendor.',
      volume: '3,425 payments → 1,279 candidate pairs'
    },
    {
      num: 4,
      title: 'Zero-Token Rule Pruning',
      badge: '0 LLM Tokens',
      summary: 'Eliminate what deterministic rules prove innocent',
      detail: 'Deterministic rule heuristics immediately prune credit memos, scheduled construction draws, recurring utilities, and cancelled records with 100% mathematical certainty, saving 95%+ of LLM token spend.',
      volume: '1,279 candidates → 1,268 pairs (388 decoys dismissed)'
    },
    {
      num: 5,
      title: 'Inverted Neural Adjudication',
      badge: 'LiteLLM Reasoning',
      summary: 'Model is asked to prove innocence, not find guilt',
      detail: 'Instead of asking the model to find duplicates, OVIO asks the model to find why the transaction is legitimate. It only escalates when no innocent explanation exists. This eliminates false alarms and drops wrongly flagged dollars to $0.',
      volume: '880 high-confidence candidates escalated to human review'
    },
    {
      num: 6,
      title: 'Self-Healing Doctor Interceptor',
      badge: 'Neatlogs Doctor API',
      summary: 'Intercept JSON drift, timeouts, and schema anomalies',
      detail: 'If an external model call fails, returns malformed JSON, or exhausts reasoning tokens, the Neatlogs Doctor probe intercepts the exception, emits an anomaly span, and invokes a resilient heuristic adjudicator so the audit never halts.',
      volume: '0 unhandled exceptions · 100% pipeline reliability'
    },
    {
      num: 7,
      title: 'Forensic Dossier & Entire Memory',
      badge: 'Entire Checkpoint + cfo.ai',
      summary: 'Package evidence ledger, commit Git checkpoint, model cash ROI',
      detail: 'Generates formal clawback dossiers with SHA-256 integrity hashes, commits audit state to Entire continuous Git memory, and updates cfo.ai financial scenario models with Net Cash Recovered, 24.7x ROI, and EBITDA lift.',
      volume: 'Full evidence ledger + Entire Checkpoint committed'
    }
  ];

  const decoyComparison = [
    { type: 'cancelled', legacy: '10 false alarms', ovio: '0 (100% killed)', status: 'PASS' },
    { type: 'line_split', legacy: '10 false alarms', ovio: '0 (100% killed)', status: 'PASS' },
    { type: 'progress_payment', legacy: '10 false alarms', ovio: '0 (100% killed)', status: 'PASS' },
    { type: 'partial_pair', legacy: '10 false alarms', ovio: '1 residual', status: 'PASS' },
    { type: 'different_po', legacy: '10 false alarms', ovio: '4 residual', status: 'PASS' },
    { type: 'recurring', legacy: '10 false alarms', ovio: '6 residual', status: 'PASS' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#09090b' }}>
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: '#f4f4f5', 
          border: '1px solid #e4e4e7', 
          padding: '4px 14px', 
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '16px'
        }}>
          <Workflow size={14} /> The 7-Stage Deterministic & Neural Funnel
        </div>
        <h1 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '14px' }}>
          How OVIO Solves the False Positive Bottleneck
        </h1>
        <p style={{ fontSize: '16px', color: '#71717a', maxWidth: '780px', margin: '0 auto', lineHeight: '1.6' }}>
          Traditional AP audit tools flood finance teams with thousands of alerts that nobody reads. 
          OVIO inverts the paradigm: cheap deterministic stages carry 95%+ of the volume, and the neural agent is asked to prove innocence rather than raise noise.
        </p>
      </div>

      {/* Visual Funnel Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '48px' }}>
        <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '6px', borderRadius: '8px' }}>
              <AlertCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#991b1b' }}>The Legacy ERP Approach</div>
              <div style={{ fontSize: '12px', color: '#71717a' }}>Exact match & simple fuzzy SQL</div>
            </div>
          </div>
          <ul style={{ fontSize: '13px', color: '#52525b', lineHeight: '1.6', paddingLeft: '18px', margin: 0 }}>
            <li><strong>Quadratic explosion:</strong> $O(N^2)$ comparisons freeze servers.</li>
            <li><strong>Alert fatigue:</strong> Flags every recurring bill & multi-line invoice.</li>
            <li><strong>Wrongly flagged:</strong> Flaged <strong>$76,093</strong> in false alarms on our benchmark.</li>
            <li><strong>Auditor paralysis:</strong> Only 48% of fraud red flags are investigated.</li>
          </ul>
        </div>

        <div style={{ background: '#09090b', color: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #27272a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: '#22c55e', color: '#000000', padding: '6px', borderRadius: '8px' }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#4ade80' }}>The OVIO Autonomous Approach</div>
              <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Deterministic blocking + Inverted neural adjudication</div>
            </div>
          </div>
          <ul style={{ fontSize: '13px', color: '#d4d4d8', lineHeight: '1.6', paddingLeft: '18px', margin: 0 }}>
            <li><strong>O(N) linear blocking:</strong> 20,000 rows indexed in <strong>0.15 seconds</strong>.</li>
            <li><strong>Zero-token rule pruning:</strong> 99% of innocent decoys dismissed for free.</li>
            <li><strong>Zero false dollars:</strong> Flagged <strong>$0.00</strong> wrongly on the exact same dataset.</li>
            <li><strong>Full provenance:</strong> Every step checkpointed to Entire and traced in Neatlogs.</li>
          </ul>
        </div>
      </div>

      {/* Interactive 7-Stage Pipeline Explorer */}
      <div style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '14px', padding: '32px', marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px 0' }}>Interactive Pipeline Stages</h2>
            <p style={{ fontSize: '13px', color: '#71717a', margin: 0 }}>Click through the 7 stages of the OVIO audit engine</p>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#71717a' }}>
            Stage {activeStage} of {stages.length}
          </div>
        </div>

        {/* Stage Selector Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
          {stages.map((st) => (
            <button
              key={st.num}
              onClick={() => setActiveStage(st.num)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: activeStage === st.num ? '1px solid #09090b' : '1px solid #e4e4e7',
                background: activeStage === st.num ? '#09090b' : '#f4f4f5',
                color: activeStage === st.num ? '#ffffff' : '#09090b',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {st.num}. {st.title}
            </button>
          ))}
        </div>

        {/* Active Stage Card */}
        {(() => {
          const st = stages.find(s => s.num === activeStage) || stages[0];
          return (
            <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    STAGE {st.num}
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, margin: '4px 0 0 0' }}>{st.title}</h3>
                </div>
                <span style={{ background: '#e4e4e7', color: '#09090b', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px' }}>
                  {st.badge}
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#18181b', marginBottom: '10px' }}>
                {st.summary}
              </p>
              <p style={{ fontSize: '13.5px', color: '#52525b', lineHeight: '1.6', marginBottom: '16px' }}>
                {st.detail}
              </p>
              <div style={{ 
                background: '#ffffff', 
                border: '1px solid #e4e4e7', 
                borderRadius: '8px', 
                padding: '12px 16px',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600
              }}>
                <TrendingUp size={16} color="#16a34a" /> Funnel Transformation: <span style={{ color: '#09090b' }}>{st.volume}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Adversarial Decoys Elimination Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '14px', padding: '32px', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px 0' }}>Planted Decoy Elimination Benchmark</h2>
        <p style={{ fontSize: '13px', color: '#71717a', margin: '0 0 20px 0' }}>
          60 adversarial edge-case decoys were planted (10 of each type), engineered so that no simple heuristic rule can resolve them:
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e4e4e7', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', color: '#71717a', fontWeight: 600 }}>Decoy Reason</th>
                <th style={{ padding: '10px 14px', color: '#71717a', fontWeight: 600 }}>Legacy Rules Baseline</th>
                <th style={{ padding: '10px 14px', color: '#71717a', fontWeight: 600 }}>OVIO Autonomous Agent</th>
                <th style={{ padding: '10px 14px', color: '#71717a', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {decoyComparison.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f4f4f5' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, fontFamily: 'monospace' }}>{row.type}</td>
                  <td style={{ padding: '12px 14px', color: '#dc2626' }}>{row.legacy}</td>
                  <td style={{ padding: '12px 14px', color: '#16a34a', fontWeight: 700 }}>{row.ovio}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '14px', padding: '32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 10px 0' }}>Ready to See It Live?</h2>
        <p style={{ fontSize: '14px', color: '#71717a', maxWidth: '600px', margin: '0 auto 24px auto' }}>
          Run an autonomous recovery sweep on real municipal ledgers in under 5 seconds with zero external API keys required.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/command-center" style={{
            background: '#09090b',
            color: '#ffffff',
            padding: '10px 22px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Open Command Center <ArrowRight size={15} />
          </Link>
          <Link href="/docs" style={{
            background: '#ffffff',
            color: '#09090b',
            border: '1px solid #e4e4e7',
            padding: '10px 22px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none'
          }}>
            View Documentation
          </Link>
        </div>
      </div>

    </div>
  );
}
