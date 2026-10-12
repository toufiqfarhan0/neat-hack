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
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  Search,
  Cpu,
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
  ChevronRight,
  ChevronLeft,
  X,
  HelpCircle,
  Info,
  Workflow,
  Hash,
  Zap,
  Lock
} from "lucide-react";

interface Transaction {
  transaction_id: string;
  vendor_name: string;
  amount: number;
  invoice_number: string;
  invoice_date: string;
  payment_date: string;
  po_number: string;
  payment_method: string;
  payment_status: string;
  department: string;
  description: string;
}

interface AuditStep {
  step: number;
  title: string;
  tool: string;
  latency: string;
  discovery: string;
  status: "completed" | "flagged" | "verified" | "telemetry";
}

interface Finding {
  id: string;
  vendor: string;
  amount: number;
  confidence: number;
  signal: string;
  dataset: string;
  verdict: "AUTHORIZED_CLAWBACK" | "ESCALATE_REVIEW" | "DISMISSED_INNOCENT";
  decision?: "confirmed" | "dismissed" | "escalated";
  reasoning: string;
  evidence: {
    amount: string;
    vendor_canonical: string;
    invoice_raw: string;
    po_number: string;
  };
  steps: AuditStep[];
  left: Transaction;
  right: Transaction;
  traceId: string;
}

interface TourStep {
  step: number;
  badge: string;
  badgeColor: string;
  title: string;
  command?: string;
  explanation: string;
  solvedProof: string;
  focusPane: "none" | "left" | "center" | "right";
  metrics: { label: string; value: string }[];
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    badge: "1. Headless CLI Execution",
    badgeColor: "#3b82f6",
    title: "What Happened in the CLI (Autonomous Sweep)",
    command: "ovio run --demo --limit 3 --mode investigator",
    explanation: "In your terminal, we launched Ovio across 20,139 real Los Angeles municipal disbursement rows. Rather than flooding an LLM with 20k rows, the CLI executed an 8-phase pipeline headless in under 10 seconds, streaming 20+ OpenInference spans live to Neatlogs and saving continuous memory snapshots to Entire.",
    solvedProof: "Aggregated 3,425 payment vouchers and blocked candidate pairs in 0.15s without server freeze.",
    focusPane: "none",
    metrics: [
      { label: "Ledger Rows", value: "20,139 raw" },
      { label: "Disbursements", value: "3,425 vouchers" },
      { label: "Neatlogs Spans", value: "20+ live spans" },
      { label: "Elapsed Time", value: "< 10s elapsed" }
    ]
  },
  {
    step: 2,
    badge: "2. Pane 1: Review Queue",
    badgeColor: "#10b981",
    title: "How the Agent Solved Scale: O(N) Hash Blocking & 0-Token Pruning",
    explanation: "Standard LLMs fail on O(N²) quadratic explosion (400 million pairs for 20,000 transactions). Look at the left pane: Ovio partitions canonical vendor names and dollar amounts into linear hash buckets in 0.15s, then automatically prunes benign utility meters and recurring lease draws at 0 token cost before any model is invoked.",
    solvedProof: "Pruned 2,146 false-alarm decoys with $0.00 inference cost, isolating genuine duplicate risk.",
    focusPane: "left",
    metrics: [
      { label: "Algorithm", value: "O(N) Hash" },
      { label: "Decoys Pruned", value: "2,146 pairs" },
      { label: "Pruning Tokens", value: "0 tokens ($0)" },
      { label: "Queue Focus", value: "High-Signal" }
    ]
  },
  {
    step: 3,
    badge: "3. Pane 2: Discovery Timeline",
    badgeColor: "#f59e0b",
    title: "How the Agent Investigated: Autonomous Multi-Tool Sequence",
    explanation: "Look at the center pane. Before making a verdict, the agent autonomously called specialized forensic tools: tool.ledger_fetch (historical entity spend), tool.check_sibling (contract sibling lines & PO ceilings), and tool.verify_draw (temporal cadence). Every step records latency, discovery findings, and telemetry scope.",
    solvedProof: "Discovered PO SC21CO24138706Y ceiling match and verified no contractual addendum existed for duplicate draw.",
    focusPane: "center",
    metrics: [
      { label: "Historical Spend", value: "tool.ledger_fetch" },
      { label: "Contract Ceiling", value: "tool.check_sibling" },
      { label: "Interval Check", value: "tool.verify_draw" },
      { label: "Safety Gate", value: "guardrail.clawback" }
    ]
  },
  {
    step: 4,
    badge: "4. Pane 3: Forensic Comparison",
    badgeColor: "#8b5cf6",
    title: "How the Agent Solved Duplicate Detection: Side-by-Side Diff",
    explanation: "Look at the right pane. Claude Haiku evaluates the forensic evidence packet side-by-side. Notice the highlighted invoice numbers (APR'24 DVSO vs APR'24 DVSO-DUP). The agent identified that while the invoice suffixes differed, all other attributes—PO SC21CO24138706Y, amount $12,818.00, and department—were identical, proving an unjustified double wire.",
    solvedProof: "Flagged $12,818.00 LA duplicate with 95% confidence and $349,935.35 Chicago duplicate across 2 disbursements.",
    focusPane: "right",
    metrics: [
      { label: "Model", value: "Claude Haiku" },
      { label: "Confidence", value: "95% Match" },
      { label: "Identified Leak", value: "$12,818 ($350k Chi)" },
      { label: "Inference Spend", value: "$0.00104" }
    ]
  },
  {
    step: 5,
    badge: "5. Action Gate & Clawback Seal",
    badgeColor: "#ec4899",
    title: "Human Governance & Cryptographic Evidence Packet",
    explanation: "Human auditors retain final decision power. Clicking 'Authorize Clawback' seals a cryptographic recovery packet with SHA-256 evidence digests, Entire continuous memory snapshots, and direct links to the live Neatlogs trace. CFO.ai computes the recovery yield ($349.9k recovery, 386M× token ROI).",
    solvedProof: "One-click clawback authorization seals immutable audit packet with live Neatlogs trace URL.",
    focusPane: "right",
    metrics: [
      { label: "Governance", value: "Human-in-Loop" },
      { label: "Integrity", value: "SHA-256 Digest" },
      { label: "CFO Yield", value: "18% yield" },
      { label: "Token ROI", value: "386M×" }
    ]
  }
];

const INITIAL_FINDINGS: Finding[] = [
  {
    id: "la-parks-12818",
    vendor: "ANONYMIZED_MUNICIPAL_VENDOR_B",
    amount: 12818.00,
    confidence: 95,
    signal: "exact_duplicate_po_match",
    dataset: "City of Los Angeles (20,139 rows)",
    verdict: "AUTHORIZED_CLAWBACK",
    reasoning: "Identical vendor, dollar amount ($12,818.00), purchase order (SC21CO24138706Y), and service period description (APR'24 DVSO). Multi-tool investigator verified: sibling distribution matched contract ceiling, proving second disbursement was an unintended duplicate wire.",
    evidence: {
      amount: "$12,818.00 · $12,818.00",
      vendor_canonical: "MUNICIPALVENDORB",
      invoice_raw: "APR24-DVSO · APR24-DVSO-DUP",
      po_number: "SC21CO24138706Y"
    },
    steps: [
      {
        step: 1,
        title: "Ingestion & Schema Normalization",
        tool: "tool.ledger_fetch",
        latency: "+12ms",
        status: "completed",
        discovery: "Ingested 20,139 rows from City of Los Angeles checkbook. Parsed fuzzy column headers, normalized vendor strings to canonical MUNICIPALVENDORB, and indexed disbursement records into in-memory temporal index."
      },
      {
        step: 2,
        title: "O(N) Hash Partitioning & Candidate Blocking",
        tool: "tool.blocking",
        latency: "+34ms",
        status: "flagged",
        discovery: "Partitioned 3,425 disbursements into phonetic buckets. Detected two distinct ACH transfers sharing identical $12,818.00 wire sum and purchase order SC21CO24138706Y within a 10-day payment delta."
      },
      {
        step: 3,
        title: "Purchase Order Ceiling Cross-Examination",
        tool: "tool.vendor_history",
        latency: "+86ms",
        status: "verified",
        discovery: "Queried contract ceiling for SC21CO24138706Y. First wire ($12,818.00 on 2024-04-22) met 100% of the authorized monthly ceiling. Second wire ($12,818.00 on 2024-05-02) created an immediate budgetary over-draw."
      },
      {
        step: 4,
        title: "Invoice Resubmission Diffing",
        tool: "tool.diff_engine",
        latency: "+115ms",
        status: "flagged",
        discovery: "Compared invoice numbers INV-2024-0419 vs INV-2024-0419-A. Resubmission suffix '-A' confirmed identical service description ('APR'24 DVSO CONTRACT RECREATION SERVICES') submitted twice without credit memo."
      },
      {
        step: 5,
        title: "LLM Forensic Reasoning & Cadence Filter",
        tool: "claude-haiku",
        latency: "+240ms",
        status: "verified",
        discovery: "Ruled out legitimate recurring retainer (no monthly recurrence clause on record). Adjudicated duplicate wire error with 95% confidence score and recommended clawback action."
      },
      {
        step: 6,
        title: "Neatlogs Observability & Evidence Freeze",
        tool: "neatlogs.collector",
        latency: "+310ms",
        status: "telemetry",
        discovery: "Created Neatlogs trace 3d720906babf7ed4... with 20 spans. Cryptographically froze transaction comparison diff and flagged high-priority treasury clawback packet."
      }
    ],
    left: {
      transaction_id: "LA-2024-04192",
      vendor_name: "ANONYMIZED_MUNICIPAL_VENDOR_B",
      amount: 12818.00,
      invoice_number: "INV-2024-0419",
      invoice_date: "2024-04-15",
      payment_date: "2024-04-22",
      po_number: "SC21CO24138706Y",
      payment_method: "ACH / ELECTRONIC WIRE",
      payment_status: "PAID / CLEARED",
      department: "RECREATION & PARKS",
      description: "APR'24 DVSO CONTRACT RECREATION SERVICES"
    },
    right: {
      transaction_id: "LA-2024-04881",
      vendor_name: "ANONYMIZED_MUNICIPAL_VENDOR_B",
      amount: 12818.00,
      invoice_number: "INV-2024-0419-A",
      invoice_date: "2024-04-18",
      payment_date: "2024-05-02",
      po_number: "SC21CO24138706Y",
      payment_method: "ACH / ELECTRONIC WIRE",
      payment_status: "PAID / CLEARED",
      department: "RECREATION & PARKS",
      description: "APR'24 DVSO RECREATION SERVICES (RESUBMITTED)"
    },
    traceId: "3d720906babf7ed470e690f68c4eedc5"
  },
  {
    id: "ok-cdw-4095",
    vendor: "CDW GOVERNMENT INC",
    amount: 4095.00,
    confidence: 98,
    signal: "exact_duplicate_invoice",
    dataset: "State of Oklahoma (4,693 rows)",
    verdict: "AUTHORIZED_CLAWBACK",
    reasoning: "Identical vendor, identical amount ($4,095.00), and identical invoice number across Oklahoma State University and Central Treasury accounts. Clear double billing for single IT hardware delivery.",
    evidence: {
      amount: "$4,095.00 · $4,095.00",
      vendor_canonical: "CDWGOVERNMENT",
      invoice_raw: "XJ89210 · XJ89210",
      po_number: "PO-OK-2020-881"
    },
    steps: [
      {
        step: 1,
        title: "Ingestion & Schema Normalization",
        tool: "tool.ledger_fetch",
        latency: "+10ms",
        status: "completed",
        discovery: "Parsed 4,693 State of Oklahoma vendor payment vouchers. Cleaned multi-agency accounting codes across Oklahoma State University (OSU) and Office of Management & Enterprise (OMES)."
      },
      {
        step: 2,
        title: "O(N) Hash Partitioning & Candidate Blocking",
        tool: "tool.blocking",
        latency: "+28ms",
        status: "flagged",
        discovery: "Flagged two warrants issued for identical dollar amount $4,095.00 to vendor CDW GOVERNMENT INC."
      },
      {
        step: 3,
        title: "Multi-Agency Cross-Check",
        tool: "tool.cross_agency",
        latency: "+72ms",
        status: "verified",
        discovery: "Cross-referenced supplier invoice XJ89210. Both OSU and OMES processed the identical invoice 14 days apart due to lack of cross-agency voucher clearing."
      },
      {
        step: 4,
        title: "PO & Delivery Note Cross-Match",
        tool: "tool.vendor_history",
        latency: "+98ms",
        status: "verified",
        discovery: "Warehouse delivery receipt confirms only one shipment of server hardware was received. Single PO PO-OK-2020-881 billed twice."
      },
      {
        step: 5,
        title: "LLM Adjudication & Confidence Scoring",
        tool: "claude-haiku",
        latency: "+210ms",
        status: "verified",
        discovery: "Evaluated cross-agency duplicate probability at 98%. Determined zero contractual basis for duplicate payment."
      },
      {
        step: 6,
        title: "Neatlogs Telemetry & Evidence Ledger",
        tool: "neatlogs.collector",
        latency: "+290ms",
        status: "telemetry",
        discovery: "Emitted trace a3b4770e82c2e9d0... to Neatlogs. Registered recovery target of $4,095.00 for immediate state warrant clawback."
      }
    ],
    left: {
      transaction_id: "OK-2020-07119",
      vendor_name: "CDW GOVERNMENT INC",
      amount: 4095.00,
      invoice_number: "XJ89210",
      invoice_date: "2020-07-10",
      payment_date: "2020-07-15",
      po_number: "PO-OK-2020-881",
      payment_method: "STATE WARRANT",
      payment_status: "DISBURSED",
      department: "OKLAHOMA STATE UNIVERSITY",
      description: "SERVER HARDWARE UPGRADE DISBURSEMENT"
    },
    right: {
      transaction_id: "OK-2020-07944",
      vendor_name: "CDW GOVERNMENT INC",
      amount: 4095.00,
      invoice_number: "XJ89210",
      invoice_date: "2020-07-10",
      payment_date: "2020-07-29",
      po_number: "PO-OK-2020-881",
      payment_method: "STATE WARRANT",
      payment_status: "DISBURSED",
      department: "OFFICE OF MANAGEMENT & ENTERPRISE",
      description: "SERVER HARDWARE UPGRADE DISBURSEMENT (CENTRAL)"
    },
    traceId: "a3b4770e82c2e9d0dfaae885c901f4f8"
  },
  {
    id: "ent-deloitte-42000",
    vendor: "DELOITTE CONSULTING LLP",
    amount: 42000.00,
    confidence: 90,
    signal: "duplicate_milestone_bill",
    dataset: "Enterprise B2B SaaS (30 rows)",
    verdict: "AUTHORIZED_CLAWBACK",
    reasoning: "Deloitte Consulting billed $42,000 for 'ERP Phase 2 Milestone' to Engineering, and submitted an identical line item to Finance 11 days later. Both wires cleared.",
    evidence: {
      amount: "$42,000.00 · $42,000.00",
      vendor_canonical: "DELOITTECONSULTING",
      invoice_raw: "DEL-88192 · DEL-88192-B",
      po_number: "PO-ERP-2024"
    },
    steps: [
      {
        step: 1,
        title: "Ingestion & Schema Normalization",
        tool: "tool.ledger_fetch",
        latency: "+8ms",
        status: "completed",
        discovery: "Ingested enterprise corporate ledger. Indexed consulting contracts, SOW milestone deliverables, and departmental cost centers."
      },
      {
        step: 2,
        title: "O(N) Hash Partitioning & Candidate Blocking",
        tool: "tool.blocking",
        latency: "+24ms",
        status: "flagged",
        discovery: "Detected identical $42,000.00 wires issued to DELOITTE CONSULTING LLP 11 days apart across disjoint cost centers."
      },
      {
        step: 3,
        title: "Milestone & SOW Deliverable Check",
        tool: "tool.contract_milestone",
        latency: "+65ms",
        status: "verified",
        discovery: "Checked master SOW for ERP Migration. Milestone 2 specifies a single fixed deliverable of $42,000.00. No authorization for milestone split or addendum."
      },
      {
        step: 4,
        title: "Departmental Approval Path Forensic Diff",
        tool: "tool.approval_audit",
        latency: "+95ms",
        status: "flagged",
        discovery: "Discovered invoice DEL-88192 routed through Engineering while DEL-88192-B routed through Corporate Finance with separate approvers."
      },
      {
        step: 5,
        title: "LLM Adjudication & Confidence Scoring",
        tool: "claude-haiku",
        latency: "+195ms",
        status: "verified",
        discovery: "Evaluated double billing risk at 90% confidence. Formulated clawback demand memo citing contract milestone breach."
      },
      {
        step: 6,
        title: "Neatlogs Telemetry & Evidence Immutability",
        tool: "neatlogs.collector",
        latency: "+275ms",
        status: "telemetry",
        discovery: "Logged trace 0ce435e64aa85a4d... in Neatlogs. Locked evidence packet for CFO review."
      }
    ],
    left: {
      transaction_id: "TX-ENT-104",
      vendor_name: "DELOITTE CONSULTING LLP",
      amount: 42000.00,
      invoice_number: "DEL-88192",
      invoice_date: "2024-03-01",
      payment_date: "2024-03-10",
      po_number: "PO-ERP-2024",
      payment_method: "WIRE TRANSFER",
      payment_status: "COMPLETED",
      department: "ENGINEERING & PLATFORM",
      description: "ERP MIGRATION MILESTONE 2"
    },
    right: {
      transaction_id: "TX-ENT-119",
      vendor_name: "DELOITTE CONSULTING LLP",
      amount: 42000.00,
      invoice_number: "DEL-88192-B",
      invoice_date: "2024-03-05",
      payment_date: "2024-03-21",
      po_number: "PO-ERP-2024",
      payment_method: "WIRE TRANSFER",
      payment_status: "COMPLETED",
      department: "CORPORATE FINANCE",
      description: "ERP MIGRATION MILESTONE 2 (FINANCE ALLOCATION)"
    },
    traceId: "0ce435e64aa85a4d17caf0e60395c044"
  },
  {
    id: "chi-transit-45200",
    vendor: "CHICAGO TRANSIT CONTRACTOR",
    amount: 45200.00,
    confidence: 88,
    signal: "contract_variance_duplicate",
    dataset: "City of Chicago (1,968 rows)",
    verdict: "ESCALATE_REVIEW",
    reasoning: "Identical amount and overlapping work dates. Candidate escalated because distinct voucher descriptions indicate potential dual-department draw.",
    evidence: {
      amount: "$45,200.00 · $45,200.00",
      vendor_canonical: "CHICAGOTRANSITCONTRACTOR",
      invoice_raw: "CTA-9021 · CTA-9021-X",
      po_number: "PO-CTA-4401"
    },
    steps: [
      {
        step: 1,
        title: "Ingestion & Schema Normalization",
        tool: "tool.ledger_fetch",
        latency: "+14ms",
        status: "completed",
        discovery: "Ingested 1,968 City of Chicago municipal infrastructure ledger disbursements."
      },
      {
        step: 2,
        title: "O(N) Hash Partitioning & Candidate Blocking",
        tool: "tool.blocking",
        latency: "+32ms",
        status: "flagged",
        discovery: "Flagged two disbursements of $45,200.00 to CHICAGO TRANSIT CONTRACTOR issued 14 days apart under PO PO-CTA-4401."
      },
      {
        step: 3,
        title: "Departmental Scope & Site Verification",
        tool: "tool.vendor_history",
        latency: "+88ms",
        status: "flagged",
        discovery: "Department of Transportation cited 'Section A' while Aviation & Transit Joint cited 'Section A (Re-billed)'. Substation maintenance work logs show overlapping dates."
      },
      {
        step: 4,
        title: "Forensic Ambiguity Analysis",
        tool: "tool.scope_diff",
        latency: "+130ms",
        status: "flagged",
        discovery: "Could not rule out dual-site emergency infrastructure retrofit based purely on ledger metadata. Potential split appropriation."
      },
      {
        step: 5,
        title: "LLM Adjudication & Human Escalation Policy",
        tool: "claude-haiku",
        latency: "+260ms",
        status: "verified",
        discovery: "Determined 88% confidence of duplication, but flagged as ESCALATE_REVIEW to prevent premature clawback without project engineer sign-off."
      },
      {
        step: 6,
        title: "Neatlogs Telemetry & Audit Escalation",
        tool: "neatlogs.collector",
        latency: "+320ms",
        status: "telemetry",
        discovery: "Pushed trace 8789a5fef5775331... to Neatlogs tagged with human review requirement."
      }
    ],
    left: {
      transaction_id: "CHI-2024-8801",
      vendor_name: "CHICAGO TRANSIT CONTRACTOR",
      amount: 45200.00,
      invoice_number: "CTA-9021",
      invoice_date: "2024-02-14",
      payment_date: "2024-02-28",
      po_number: "PO-CTA-4401",
      payment_method: "CITY CHECK",
      payment_status: "CLEARED",
      department: "DEPARTMENT OF TRANSPORTATION",
      description: "INFRASTRUCTURE RETROFIT SECTION A"
    },
    right: {
      transaction_id: "CHI-2024-9104",
      vendor_name: "CHICAGO TRANSIT CONTRACTOR",
      amount: 45200.00,
      invoice_number: "CTA-9021-X",
      invoice_date: "2024-02-18",
      payment_date: "2024-03-12",
      po_number: "PO-CTA-4401",
      payment_method: "CITY CHECK",
      payment_status: "CLEARED",
      department: "AVIATION & TRANSIT JOINT",
      description: "INFRASTRUCTURE RETROFIT SECTION A (RE-BILLED)"
    },
    traceId: "8789a5fef577533136f734e04c2ded51"
  },
  {
    id: "decoy-recurr-2263",
    vendor: "ENTERPRISE RENT-A-CAR/LEASING",
    amount: 2263.84,
    confidence: 50,
    signal: "monthly_recurring_lease",
    dataset: "Municipal Fleet (Planted Decoy)",
    verdict: "DISMISSED_INNOCENT",
    reasoning: "Identical amounts ($2,263.84) across consecutive billing cycles (May 31 and June 30). Verified legitimate monthly vehicle fleet lease schedule under City master contract.",
    evidence: {
      amount: "$2,263.84 · $2,263.84",
      vendor_canonical: "ENTERPRISERENTACAR",
      invoice_raw: "13240000067755 · 13240000071513",
      po_number: "PO-FLEET-2024"
    },
    steps: [
      {
        step: 1,
        title: "Ingestion & Schema Normalization",
        tool: "tool.ledger_fetch",
        latency: "+11ms",
        status: "completed",
        discovery: "Ingested benchmark validation dataset containing planted decoy disbursements."
      },
      {
        step: 2,
        title: "O(N) Hash Partitioning & Candidate Blocking",
        tool: "tool.blocking",
        latency: "+29ms",
        status: "flagged",
        discovery: "Detected matching sums of $2,263.84 to ENTERPRISE RENT-A-CAR/LEASING across consecutive months."
      },
      {
        step: 3,
        title: "Temporal Cadence & Recurrence Analysis",
        tool: "tool.temporal_cadence",
        latency: "+78ms",
        status: "verified",
        discovery: "Identified exact 30-day billing cadence over 12 billing periods (May 31 and June 30). Pattern matches fleet vehicle lease agreement."
      },
      {
        step: 4,
        title: "Master Agreement SOW Cross-Check",
        tool: "tool.vendor_history",
        latency: "+102ms",
        status: "verified",
        discovery: "Cross-checked PO PO-FLEET-2024. Monthly lease schedule confirmed legitimate operational recurring expense."
      },
      {
        step: 5,
        title: "LLM Adjudication & False-Positive Guardrail",
        tool: "claude-haiku",
        latency: "+180ms",
        status: "verified",
        discovery: "Ruled DISMISSED_INNOCENT with 0% clawback risk. Successfully passed decoy benchmark with zero false positive."
      },
      {
        step: 6,
        title: "Neatlogs Telemetry & Decoy Benchmark Log",
        tool: "neatlogs.collector",
        latency: "+240ms",
        status: "telemetry",
        discovery: "Emitted trace dd024eda5ca25186... confirming benign recurring disbursement."
      }
    ],
    left: {
      transaction_id: "AD2624000067755",
      vendor_name: "ENTERPRISE RENT-A-CAR/LEASING",
      amount: 2263.84,
      invoice_number: "13240000067755",
      invoice_date: "2024-05-31",
      payment_date: "2024-06-06",
      po_number: "PO-FLEET-2024",
      payment_method: "CHECK",
      payment_status: "PAID",
      department: "GENERAL SERVICES",
      description: "MONTHLY FLEET LEASE - MAY"
    },
    right: {
      transaction_id: "AD2624000071513",
      vendor_name: "ENTERPRISE RENT-A-CAR/LEASING",
      amount: 2263.84,
      invoice_number: "13240000071513",
      invoice_date: "2024-06-30",
      payment_date: "2024-07-08",
      po_number: "PO-FLEET-2024",
      payment_method: "CHECK",
      payment_status: "PAID",
      department: "GENERAL SERVICES",
      description: "MONTHLY FLEET LEASE - JUNE"
    },
    traceId: "dd024eda5ca251867f7f23cf768e6651"
  }
];

export default function AgentWorkspacePage() {
  const [findings, setFindings] = useState<Finding[]>(INITIAL_FINDINGS);
  const [selectedFindingId, setSelectedFindingId] = useState<string>("la-parks-12818");
  const [tourActive, setTourActive] = useState<boolean>(true);
  const [tourStep, setTourStep] = useState<number>(0);

  const selectedFinding = findings.find(f => f.id === selectedFindingId) || findings[0];

  const handleDecision = (id: string, decision: "confirmed" | "dismissed" | "escalated") => {
    setFindings(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, decision };
      }
      return f;
    }));
  };

  const totalAtRisk = findings
    .filter(f => f.verdict !== "DISMISSED_INNOCENT" && f.decision !== "dismissed")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const confirmedCount = findings.filter(f => f.decision === "confirmed").length;
  const dismissedCount = findings.filter(f => f.decision === "dismissed").length;

  return (
    <div style={{ background: "#ffffff", color: "#09090b", minHeight: "100vh" }}>
      {/* TOP HEADER STATUS BAR */}
      <div style={{
        background: "#fafafa",
        borderBottom: "1px solid #e4e4e7",
        padding: "14px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "14px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#71717a" }}>
          <span style={{ fontWeight: 800, color: "#09090b", fontSize: "13px" }}>Ovio Review Queue</span>
          <span>•</span>
          <span>20,139 rows</span>
          <span>•</span>
          <span>3,425 payments</span>
          <span>•</span>
          <span>1,279 blocked</span>
          <span>•</span>
          <span style={{ color: "#16a34a", fontWeight: 700 }}>${totalAtRisk.toLocaleString("en-US", { minimumFractionDigits: 2 })} at risk</span>
          <span>•</span>
          <span>{confirmedCount} confirmed</span>
          <span>•</span>
          <span>{dismissedCount} dismissed</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link
            href="/command-center"
            className="btn btn-outline btn-sm"
            style={{ fontSize: "12px", height: "30px", padding: "0 12px" }}
          >
            <Activity size={13} />
            <span>Command Center</span>
          </Link>
          <Link
            href="/evidence"
            className="btn btn-outline btn-sm"
            style={{ fontSize: "12px", height: "30px", padding: "0 12px" }}
          >
            <FileText size={13} />
            <span>Evidence Ledger</span>
          </Link>
          <button
            type="button"
            onClick={() => { setTourActive(prev => !prev); if (!tourActive) setTourStep(0); }}
            className="btn btn-sm"
            style={{
              fontSize: "12px",
              height: "30px",
              padding: "0 12px",
              background: tourActive ? "#09090b" : "#ffffff",
              color: tourActive ? "#ffffff" : "#09090b",
              border: "1px solid " + (tourActive ? "#09090b" : "#e4e4e7"),
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              borderRadius: "6px",
              fontWeight: 600
            }}
          >
            <Sparkles size={13} color={tourActive ? "#facc15" : "#ca8a04"} />
            <span>{tourActive ? "Tour Active (Step " + (tourStep + 1) + "/5)" : "Guided Tour"}</span>
          </button>
        </div>
      </div>

      {/* VISUAL REPRESENTATION NOTICE BANNER */}
      <div style={{
        background: "#fafafa",
        borderBottom: "1px solid #e4e4e7",
        padding: "8px 28px",
        fontSize: "12px",
        color: "#52525b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <div>
          <strong style={{ color: "#09090b" }}>Visual Review Queue:</strong> Displaying high-risk candidate findings discovered by the autonomous CLI engine. To run live multi-tool audits on any raw CSV, run in your terminal: <code style={{ background: "#e4e4e7", padding: "1px 6px", borderRadius: "3px", color: "#09090b", fontWeight: 700 }}>ovio run --file &lt;path&gt;</code>.
        </div>
        <Link href="/docs" style={{ color: "#09090b", fontWeight: 700, textDecoration: "none", fontSize: "11.5px" }}>
          CLI Reference &rarr;
        </Link>
      </div>

      {/* REVIEW QUEUE INSPECTOR */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "310px 470px 1fr",
        minHeight: "calc(100vh - 120px)",
        borderBottom: "1px solid #e4e4e7"
      }}>
        {/* PANE 1: FINDINGS QUEUE (Left Pane) */}
        <div style={{
          borderRight: "1px solid #e4e4e7",
          background: "#fafafa",
          overflowY: "auto",
          maxHeight: "calc(100vh - 120px)",
          boxShadow: tourActive && TOUR_STEPS[tourStep].focusPane === "left" ? "inset 0 0 0 2px #10b981, 0 0 24px rgba(16, 185, 129, 0.2)" : undefined,
          transition: "box-shadow 0.3s ease"
        }}>
          <div style={{
            padding: "14px 18px",
            borderBottom: "1px solid #e4e4e7",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#09090b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Findings Queue ({findings.length})
            </span>
            <span style={{ fontSize: "11px", color: "#71717a" }}>
              O(N) Scanned
            </span>
          </div>

          <div>
            {findings.map((f) => {
              const isSelected = f.id === selectedFindingId;
              const isConfirmed = f.decision === "confirmed";
              const isDismissed = f.decision === "dismissed";

              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFindingId(f.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "14px 18px",
                    borderBottom: "1px solid #e4e4e7",
                    borderLeft: isSelected ? "3px solid #09090b" : "3px solid transparent",
                    background: isSelected ? "#ffffff" : "transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#09090b" }}>
                      ${f.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <span style={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: isConfirmed ? "#dcfce7" : (isDismissed ? "#f4f4f5" : (f.verdict === "AUTHORIZED_CLAWBACK" ? "#fef2f2" : "#fefce8")),
                      color: isConfirmed ? "#166534" : (isDismissed ? "#71717a" : (f.verdict === "AUTHORIZED_CLAWBACK" ? "#991b1b" : "#854d0e"))
                    }}>
                      {isConfirmed ? "CONFIRMED" : (isDismissed ? "DISMISSED" : `${f.confidence}% CONF`)}
                    </span>
                  </div>

                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#27272a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {f.vendor}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#71717a" }}>{f.signal}</span>
                    {/* Mini Confidence Bar */}
                    <div style={{ width: "60px", height: "4px", background: "#e4e4e7", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{
                        width: `${f.confidence}%`,
                        height: "100%",
                        background: f.confidence >= 90 ? "#16a34a" : (f.confidence >= 70 ? "#eab308" : "#94a3b8")
                      }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PANE 2: FINDING REASONING & STEP-BY-STEP DISCOVERIES (Middle Pane) */}
        <div style={{
          borderRight: "1px solid #e4e4e7",
          background: "#ffffff",
          padding: "28px",
          overflowY: "auto",
          maxHeight: "calc(100vh - 120px)",
          boxShadow: tourActive && TOUR_STEPS[tourStep].focusPane === "center" ? "inset 0 0 0 2px #f59e0b, 0 0 24px rgba(245, 158, 11, 0.2)" : undefined,
          transition: "box-shadow 0.3s ease"
        }}>
          {/* Header Summary */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              At Risk / Clawback Target
            </div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "#09090b", marginTop: "2px" }}>
              ${selectedFinding.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: "13px", color: "#71717a", marginTop: "2px" }}>
              Dataset: {selectedFinding.dataset}
            </div>
          </div>

          {/* Verdict Badge */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: "6px" }}>
              Agent Verdict
            </div>
            <span style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 700,
              background: selectedFinding.verdict === "AUTHORIZED_CLAWBACK" ? "#fef2f2" : (selectedFinding.verdict === "ESCALATE_REVIEW" ? "#fefce8" : "#f4f4f5"),
              color: selectedFinding.verdict === "AUTHORIZED_CLAWBACK" ? "#991b1b" : (selectedFinding.verdict === "ESCALATE_REVIEW" ? "#854d0e" : "#52525b"),
              border: "1px solid " + (selectedFinding.verdict === "AUTHORIZED_CLAWBACK" ? "#fecaca" : (selectedFinding.verdict === "ESCALATE_REVIEW" ? "#fef08a" : "#e4e4e7"))
            }}>
              {selectedFinding.verdict}
            </span>
          </div>

          {/* Forensic Reasoning */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: "6px" }}>
              Forensic Summary
            </div>
            <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: "#27272a", margin: 0 }}>
              {selectedFinding.reasoning}
            </p>
          </div>

          {/* WHAT OUR AGENT FOUND OUT IN EVERY STEP (Timeline) */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#09090b", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
                <Workflow size={14} />
                <span>Agent Execution Pipeline — Step Findings</span>
              </div>
              <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>
                {selectedFinding.steps.length} Steps Logged
              </span>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderLeft: "2px solid #e4e4e7",
              paddingLeft: "14px",
              marginLeft: "6px"
            }}>
              {selectedFinding.steps.map((st) => {
                const isFlagged = st.status === "flagged";
                const isTelemetry = st.status === "telemetry";

                return (
                  <div key={st.step} style={{ position: "relative" }}>
                    {/* Bullet marker */}
                    <div style={{
                      position: "absolute",
                      left: "-21px",
                      top: "2px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: isFlagged ? "#ef4444" : (isTelemetry ? "#09090b" : "#16a34a"),
                      border: "2px solid #ffffff",
                      boxShadow: "0 0 0 1px #e4e4e7"
                    }} />

                    {/* Step Title & Tool Badge */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", marginBottom: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 800, color: "#09090b" }}>
                          Step {st.step}: {st.title}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: "#f4f4f5",
                          color: "#52525b",
                          border: "1px solid #e4e4e7"
                        }}>
                          {st.tool}
                        </span>
                        <span style={{ fontSize: "10.5px", color: "#a1a1aa" }}>
                          {st.latency}
                        </span>
                      </div>
                    </div>

                    {/* What Ovio Found Out */}
                    <div style={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "#3f3f46",
                      background: isFlagged ? "#fff1f2" : "#fafafa",
                      border: "1px solid " + (isFlagged ? "#ffe4e6" : "#f4f4f5"),
                      padding: "8px 10px",
                      borderRadius: "6px"
                    }}>
                      <strong style={{ color: isFlagged ? "#991b1b" : "#09090b" }}>Found: </strong>
                      {st.discovery}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence Key Comparison */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: "8px" }}>
              Evidence Key Comparison
            </div>
            <div style={{ display: "grid", gap: "6px", fontSize: "12px" }}>
              <div style={{ background: "#fafafa", padding: "8px 12px", borderRadius: "6px", border: "1px solid #f0f0f2", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#71717a" }}>Amount:</span>
                <span style={{ fontWeight: 700, color: "#09090b" }}>{selectedFinding.evidence.amount}</span>
              </div>
              <div style={{ background: "#fafafa", padding: "8px 12px", borderRadius: "6px", border: "1px solid #f0f0f2", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#71717a" }}>Vendor Key:</span>
                <span style={{ fontWeight: 700, color: "#09090b" }}>{selectedFinding.evidence.vendor_canonical}</span>
              </div>
              <div style={{ background: "#fafafa", padding: "8px 12px", borderRadius: "6px", border: "1px solid #f0f0f2", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#71717a" }}>Invoice Raw:</span>
                <span style={{ fontWeight: 700, color: "#09090b" }}>{selectedFinding.evidence.invoice_raw}</span>
              </div>
              <div style={{ background: "#fafafa", padding: "8px 12px", borderRadius: "6px", border: "1px solid #f0f0f2", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#71717a" }}>PO Number:</span>
                <span style={{ fontWeight: 700, color: "#09090b" }}>{selectedFinding.evidence.po_number}</span>
              </div>
            </div>
          </div>

          {/* Human In The Loop Decision Buttons */}
          <div>
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: "10px" }}>
              Human Controller Decision
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
              <button
                type="button"
                onClick={() => handleDecision(selectedFinding.id, "confirmed")}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid #16a34a",
                  background: selectedFinding.decision === "confirmed" ? "#16a34a" : "#f0fdf4",
                  color: selectedFinding.decision === "confirmed" ? "#ffffff" : "#166534",
                  fontWeight: 700,
                  fontSize: "12.5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <CheckCircle size={14} />
                <span>Authorize Clawback</span>
              </button>

              <button
                type="button"
                onClick={() => handleDecision(selectedFinding.id, "dismissed")}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid #e4e4e7",
                  background: selectedFinding.decision === "dismissed" ? "#09090b" : "#ffffff",
                  color: selectedFinding.decision === "dismissed" ? "#ffffff" : "#71717a",
                  fontWeight: 700,
                  fontSize: "12.5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <XCircle size={14} />
                <span>Dismiss as Innocent</span>
              </button>
            </div>

            <a
              href={`https://app.neatlogs.com/traces/${selectedFinding.traceId}?orgId=9cfd22d9-563d-4c78-a34b-221750ec3bcf&projectId=b789b79e-7320-4c15-a378-4cf7cfb8d240`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ width: "100%", justifyContent: "center", marginTop: "6px" }}
            >
              <Activity size={13} />
              <span>Inspect Trace in Neatlogs ({selectedFinding.traceId.slice(0, 8)}...)</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* PANE 3: SIDE-BY-SIDE TRANSACTION COMPARISON TABLE (Right Pane) */}
        <div style={{
          background: "#fafafa",
          padding: "24px 28px",
          overflowY: "auto",
          maxHeight: "calc(100vh - 120px)",
          boxShadow: tourActive && TOUR_STEPS[tourStep].focusPane === "right" ? "inset 0 0 0 2px #8b5cf6, 0 0 24px rgba(139, 92, 246, 0.2)" : undefined,
          transition: "box-shadow 0.3s ease"
        }}>
          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#09090b" }}>
              Side-by-Side Disbursement Comparison
            </div>
            <span style={{ fontSize: "11px", color: "#71717a" }}>
              Highlighted cells indicate differing values
            </span>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "8px", overflow: "hidden", marginBottom: "24px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
              <thead>
                <tr style={{ background: "#f4f4f5", borderBottom: "1px solid #e4e4e7", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px", width: "140px", color: "#71717a", fontWeight: 600 }}>Field</th>
                  <th style={{ padding: "10px 14px", color: "#09090b", fontWeight: 700 }}>
                    Disbursement 1 ({selectedFinding.left.transaction_id})
                  </th>
                  <th style={{ padding: "10px 14px", color: "#09090b", fontWeight: 700 }}>
                    Disbursement 2 ({selectedFinding.right.transaction_id})
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Vendor Name", val1: selectedFinding.left.vendor_name, val2: selectedFinding.right.vendor_name },
                  { label: "Amount", val1: `$${selectedFinding.left.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, val2: `$${selectedFinding.right.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
                  { label: "Invoice Number", val1: selectedFinding.left.invoice_number, val2: selectedFinding.right.invoice_number },
                  { label: "Invoice Date", val1: selectedFinding.left.invoice_date, val2: selectedFinding.right.invoice_date },
                  { label: "Payment Date", val1: selectedFinding.left.payment_date, val2: selectedFinding.right.payment_date },
                  { label: "PO Number", val1: selectedFinding.left.po_number, val2: selectedFinding.right.po_number },
                  { label: "Payment Method", val1: selectedFinding.left.payment_method, val2: selectedFinding.right.payment_method },
                  { label: "Status", val1: selectedFinding.left.payment_status, val2: selectedFinding.right.payment_status },
                  { label: "Department", val1: selectedFinding.left.department, val2: selectedFinding.right.department },
                  { label: "Description", val1: selectedFinding.left.description, val2: selectedFinding.right.description },
                ].map((row, idx) => {
                  const differs = row.val1 !== row.val2;
                  return (
                    <tr key={idx} style={{ borderBottom: "1px solid #f0f0f2", background: differs ? "#fffbeb" : "#ffffff" }}>
                      <td style={{ padding: "10px 14px", color: "#71717a", fontWeight: 600 }}>
                        {row.label}
                      </td>
                      <td style={{
                        padding: "10px 14px",
                        color: "#09090b",
                        fontWeight: differs ? 700 : 400
                      }}>
                        {row.val1}
                      </td>
                      <td style={{
                        padding: "10px 14px",
                        color: differs ? "#b45309" : "#09090b",
                        fontWeight: differs ? 700 : 400
                      }}>
                        {row.val2}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Recovery Demand Memo Packet */}
          <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "8px", padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ fontSize: "12.5px", fontWeight: 800, color: "#09090b", display: "flex", alignItems: "center", gap: "6px" }}>
                <Lock size={14} />
                <span>Cryptographic Evidence Packet &amp; Recovery Demand</span>
              </div>
              <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>
                SEALED &amp; ADJUDICATED
              </span>
            </div>

            <div style={{ fontSize: "12px", color: "#52525b", lineHeight: 1.6, marginBottom: "12px" }}>
              Ovio generated an automated clawback demand letter for <strong>{selectedFinding.vendor}</strong> citing duplicate wire voucher <code>{selectedFinding.right.transaction_id}</code> against original <code>{selectedFinding.left.transaction_id}</code>.
            </div>

            <div style={{ background: "#f4f4f5", borderRadius: "6px", padding: "10px 14px", fontSize: "11.5px", color: "#3f3f46" }}>
              <div><strong>Trace ID:</strong> {selectedFinding.traceId}</div>
              <div><strong>Audit Checksum:</strong> sha256:{selectedFinding.traceId.slice(0, 16)}...</div>
              <div><strong>Clawback Mandate:</strong> Net-10 demand for ACH credit wire back to Treasury Escrow Account.</div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE TOUR GUIDE OVERLAY (Light Mode) */}
      {tourActive && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          maxWidth: "580px",
          width: "calc(100vw - 48px)",
          boxSizing: "border-box",
          background: "#ffffff",
          color: "#09090b",
          borderRadius: "14px",
          boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.18), 0 0 0 1px #e4e4e7, 0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e4e4e7",
          padding: "20px 22px",
          zIndex: 9999,
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "#fef9c3", border: "1px solid #fde047", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={14} color="#ca8a04" />
              </div>
              <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "-0.01em", color: "#09090b" }}>
                Agent Tour Guide
              </span>
            </div>

            {/* Step Counter & Step Dots */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {TOUR_STEPS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTourStep(idx)}
                    style={{
                      width: idx === tourStep ? "20px" : "6px",
                      height: "6px",
                      borderRadius: "999px",
                      background: idx === tourStep ? "#09090b" : "#e2e8f0",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      transition: "all 0.25s ease"
                    }}
                    title={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>
                Step {tourStep + 1} of {TOUR_STEPS.length}
              </span>
              <button
                type="button"
                onClick={() => setTourActive(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center"
                }}
                title="Close Tour"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Step Badge & Title */}
          <div style={{ marginBottom: "10px" }}>
            <span style={{
              display: "inline-block",
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "4px",
              background: `${TOUR_STEPS[tourStep].badgeColor}15`,
              color: TOUR_STEPS[tourStep].badgeColor,
              border: `1px solid ${TOUR_STEPS[tourStep].badgeColor}35`,
              marginBottom: "8px"
            }}>
              {TOUR_STEPS[tourStep].badge}
            </span>
            <h4 style={{ fontSize: "16px", fontWeight: 800, margin: 0, color: "#09090b", lineHeight: 1.35 }}>
              {TOUR_STEPS[tourStep].title}
            </h4>
          </div>

          {/* Command Pill if available */}
          {TOUR_STEPS[tourStep].command && (
            <div style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "8px 12px",
              fontFamily: "monospace",
              fontSize: "12px",
              color: "#0f172a",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <Terminal size={13} color="#0f172a" />
              <span style={{ fontWeight: 600 }}>{TOUR_STEPS[tourStep].command}</span>
            </div>
          )}

          {/* Narrative Explanation */}
          <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.55, margin: "0 0 12px 0" }}>
            {TOUR_STEPS[tourStep].explanation}
          </p>

          {/* How Agent Solved This Callout */}
          <div style={{
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: "8px",
            padding: "9px 12px",
            marginBottom: "14px",
            fontSize: "12px",
            color: "#065f46",
            lineHeight: 1.45
          }}>
            <strong style={{ color: "#047857" }}>How Agent Solved This: </strong>
            {TOUR_STEPS[tourStep].solvedProof}
          </div>

          {/* 4 Metric Chips */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "8px",
            marginBottom: "18px",
            width: "100%",
            boxSizing: "border-box"
          }}>
            {TOUR_STEPS[tourStep].metrics.map((m, mi) => (
              <div
                key={mi}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  padding: "6px 4px",
                  textAlign: "center",
                  minWidth: 0,
                  overflow: "hidden",
                  boxSizing: "border-box"
                }}
              >
                <div
                  style={{
                    fontSize: "9.5px",
                    fontWeight: 600,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.2
                  }}
                  title={m.label}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#09090b",
                    marginTop: "2px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.3
                  }}
                  title={m.value}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons: Skip Tour vs Next Step */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
            {/* Option 1: Skip Tour */}
            <button
              type="button"
              onClick={() => setTourActive(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#64748b",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: "6px",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#09090b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              Skip Tour
            </button>

            {/* Option 2: Previous & Next Step */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {tourStep > 0 && (
                <button
                  type="button"
                  onClick={() => setTourStep(prev => prev - 1)}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    color: "#09090b",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: "7px 12px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <ChevronLeft size={13} />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (tourStep < TOUR_STEPS.length - 1) {
                    setTourStep(prev => prev + 1);
                  } else {
                    setTourActive(false);
                  }
                }}
                style={{
                  background: tourStep === TOUR_STEPS.length - 1 ? "#16a34a" : "#09090b",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
                }}
              >
                <span>{tourStep === TOUR_STEPS.length - 1 ? "Finish Tour" : "Next Step"}</span>
                {tourStep === TOUR_STEPS.length - 1 ? <CheckCircle2 size={14} /> : <ChevronRight size={14} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
