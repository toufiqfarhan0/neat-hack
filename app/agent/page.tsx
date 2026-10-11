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
  Sliders,
  DollarSign,
  MessageSquare,
  Bot,
  User,
  Send,
  CornerDownLeft,
  ChevronRight,
  Split,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle
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
  left: Transaction;
  right: Transaction;
  traceId: string;
}

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

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  findingId?: string;
  toolsInvoked?: string[];
}

export default function AgentWorkspacePage() {
  const [viewMode, setViewMode] = useState<"queue" | "chat">("queue");
  const [findings, setFindings] = useState<Finding[]>(INITIAL_FINDINGS);
  const [selectedFindingId, setSelectedFindingId] = useState<string>("la-parks-12818");
  const [chatInput, setChatInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "agent",
      text: "Hello! I am Ovio, your autonomous treasury recovery agent. I can audit raw AP disbursement ledgers, detect duplicate vendor wires, and model financial runway. How can I assist you today?",
      timestamp: "15:45",
      toolsInvoked: ["entire.brain.brief", "neatlogs.collector.init"]
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const selectedFinding = findings.find(f => f.id === selectedFindingId) || findings[0];

  const handleDecision = (id: string, decision: "confirmed" | "dismissed" | "escalated") => {
    setFindings(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, decision };
      }
      return f;
    }));
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      let matchedFindingId: string | undefined = undefined;
      const lower = query.toLowerCase();

      if (lower.includes("la") || lower.includes("los angeles") || lower.includes("parks")) {
        replyText = "Investigated City of Los Angeles ledger (20,139 disbursements). Identified $12,818.00 double disbursement for ANONYMIZED_MUNICIPAL_VENDOR_B. Both wires cleared under PO SC21CO24138706Y. Multi-tool verification confirmed PO ceiling was breached.";
        matchedFindingId = "la-parks-12818";
      } else if (lower.includes("oklahoma") || lower.includes("cdw") || lower.includes("4095")) {
        replyText = "Scanned State of Oklahoma public ledger (4,693 payments). Detected exact double billing for CDW GOVERNMENT INC ($4,095.00) under invoice XJ89210. Disbursed simultaneously by Oklahoma State Univ and OMES.";
        matchedFindingId = "ok-cdw-4095";
      } else if (lower.includes("deloitte") || lower.includes("enterprise") || lower.includes("saas")) {
        replyText = "Audited Enterprise B2B SaaS ledger. Discovered $42,000.00 duplicate invoice from Deloitte Consulting for 'ERP Migration Milestone 2' submitted to both Engineering and Corporate Finance.";
        matchedFindingId = "ent-deloitte-42000";
      } else if (lower.includes("chicago") || lower.includes("transit")) {
        replyText = "Analyzed City of Chicago payments. Flagged Chicago Transit Contractor ($45,200.00). Escalated to human review due to ambiguous dual-department voucher descriptions.";
        matchedFindingId = "chi-transit-45200";
      } else if (lower.includes("decoy") || lower.includes("fleet") || lower.includes("enterprise rent")) {
        replyText = "Tested against planted decoy benchmark. Evaluated Enterprise Rent-A-Car ($2,263.84). The agent successfully recognized monthly recurring lease schedule and ruled it innocent (Zero false positive).";
        matchedFindingId = "decoy-recurr-2263";
      } else {
        replyText = `Executed autonomous sweep on active AP ledger. Grouped disbursements in O(N) time and evaluated high-risk candidates with claude-haiku. Inspect the highlighted candidate in the review queue below:`;
        matchedFindingId = selectedFindingId;
      }

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "agent",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        findingId: matchedFindingId,
        toolsInvoked: ["tool.ledger_fetch", "tool.blocking", "tool.vendor_history", "guardrail.clawback_validation"]
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
      if (matchedFindingId) {
        setSelectedFindingId(matchedFindingId);
      }
    }, 900);
  };

  const totalAtRisk = findings
    .filter(f => f.verdict !== "DISMISSED_INNOCENT" && f.decision !== "dismissed")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const confirmedCount = findings.filter(f => f.decision === "confirmed").length;
  const dismissedCount = findings.filter(f => f.decision === "dismissed").length;

  return (
    <div style={{ background: "#ffffff", color: "#09090b", minHeight: "100vh" }}>
      {/* TOP HEADER STATUS & VIEW TOGGLE (Reckon + ChatGPT hybrid) */}
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
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", fontFamily: "var(--mono)", color: "#71717a" }}>
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
        </div>

        {/* View Mode Toggle Pill (ChatGPT Chat vs Reckon 3-Pane Queue) */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e4e4e7",
          borderRadius: "8px",
          padding: "3px",
          display: "inline-flex",
          gap: "4px"
        }}>
          <button
            type="button"
            onClick={() => setViewMode("queue")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: viewMode === "queue" ? "#000000" : "transparent",
              color: viewMode === "queue" ? "#ffffff" : "#71717a"
            }}
          >
            <Split size={14} />
            <span>3-Pane Queue (Reckon)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("chat")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: viewMode === "chat" ? "#000000" : "transparent",
              color: viewMode === "chat" ? "#ffffff" : "#71717a"
            }}
          >
            <Bot size={14} />
            <span>AI Copilot (ChatGPT)</span>
          </button>
        </div>
      </div>

      {/* MODE 1: RECKON-STYLE 3-PANE INSPECTOR */}
      {viewMode === "queue" && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "320px 380px 1fr",
          minHeight: "calc(100vh - 120px)",
          borderBottom: "1px solid #e4e4e7"
        }}>
          {/* PANE 1: CANDIDATE QUEUE (Left Sidebar) */}
          <div style={{
            borderRight: "1px solid #e4e4e7",
            background: "#fafafa",
            overflowY: "auto",
            maxHeight: "calc(100vh - 120px)"
          }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e4e4e7", background: "#ffffff" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Pending Review Queue ({findings.length})
              </div>
              <div style={{ fontSize: "12px", color: "#a1a1aa", marginTop: "2px" }}>
                Ranked by clawback confidence &amp; dollar magnitude
              </div>
            </div>

            <div>
              {findings.map((f) => {
                const isSelected = f.id === selectedFindingId;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFindingId(f.id)}
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      textAlign: "left",
                      border: "none",
                      borderBottom: "1px solid #e4e4e7",
                      borderLeft: isSelected ? "4px solid #000000" : "4px solid transparent",
                      background: isSelected ? "#ffffff" : "transparent",
                      cursor: "pointer",
                      display: "block",
                      transition: "background 0.1s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                      <span style={{ fontSize: "16px", fontWeight: 800, color: "#09090b", fontFamily: "var(--mono)" }}>
                        ${f.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                      <span style={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontFamily: "var(--mono)",
                        background: f.decision === "confirmed" ? "#dcfce7" : (f.decision === "dismissed" ? "#f4f4f5" : (f.confidence >= 90 ? "#fee2e2" : "#fef9c3")),
                        color: f.decision === "confirmed" ? "#166534" : (f.decision === "dismissed" ? "#71717a" : (f.confidence >= 90 ? "#991b1b" : "#854d0e"))
                      }}>
                        {f.decision ? f.decision.toUpperCase() : `${f.confidence}% CONF`}
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

          {/* PANE 2: FINDING REASONING & ACTIONS (Middle Pane) */}
          <div style={{
            borderRight: "1px solid #e4e4e7",
            background: "#ffffff",
            padding: "28px",
            overflowY: "auto",
            maxHeight: "calc(100vh - 120px)"
          }}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                At Risk / Clawback Target
              </div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#09090b", fontFamily: "var(--mono)", marginTop: "2px" }}>
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

            {/* Reasoning Text */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: "6px" }}>
                Forensic Reasoning
              </div>
              <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: "#27272a", margin: 0 }}>
                {selectedFinding.reasoning}
              </p>
            </div>

            {/* Evidence Tags */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#71717a", textTransform: "uppercase", marginBottom: "8px" }}>
                Evidence Key Comparison
              </div>
              <div style={{ display: "grid", gap: "6px", fontSize: "12px", fontFamily: "var(--mono)" }}>
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

            {/* Human In The Loop Decision Buttons (Reckon Pattern) */}
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

          {/* PANE 3: SIDE-BY-SIDE TRANSACTION COMPARISON TABLE (Reckon Comparison.tsx) */}
          <div style={{
            background: "#fafafa",
            padding: "24px 28px",
            overflowY: "auto",
            maxHeight: "calc(100vh - 120px)"
          }}>
            <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#09090b" }}>
                Side-by-Side Disbursement Comparison
              </div>
              <span style={{ fontSize: "11px", color: "#71717a", fontFamily: "var(--mono)" }}>
                Highlighted cells indicate differing values
              </span>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "8px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
                <thead>
                  <tr style={{ background: "#f4f4f5", borderBottom: "1px solid #e4e4e7", textAlign: "left" }}>
                    <th style={{ padding: "10px 14px", width: "140px", color: "#71717a", fontWeight: 600 }}>Field</th>
                    <th style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "#09090b", fontWeight: 700 }}>
                      Disbursement 1 ({selectedFinding.left.transaction_id})
                    </th>
                    <th style={{ padding: "10px 14px", fontFamily: "var(--mono)", color: "#09090b", fontWeight: 700 }}>
                      Disbursement 2 ({selectedFinding.right.transaction_id})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Vendor Name", val1: selectedFinding.left.vendor_name, val2: selectedFinding.right.vendor_name },
                    { label: "Amount", val1: `$${selectedFinding.left.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, val2: `$${selectedFinding.right.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, mono: true },
                    { label: "Invoice Number", val1: selectedFinding.left.invoice_number, val2: selectedFinding.right.invoice_number, mono: true },
                    { label: "Invoice Date", val1: selectedFinding.left.invoice_date, val2: selectedFinding.right.invoice_date, mono: true },
                    { label: "Payment Date", val1: selectedFinding.left.payment_date, val2: selectedFinding.right.payment_date, mono: true },
                    { label: "PO Number", val1: selectedFinding.left.po_number, val2: selectedFinding.right.po_number, mono: true },
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
                          fontFamily: row.mono ? "var(--mono)" : "inherit",
                          color: "#09090b",
                          fontWeight: differs ? 700 : 400
                        }}>
                          {row.val1}
                        </td>
                        <td style={{
                          padding: "10px 14px",
                          fontFamily: row.mono ? "var(--mono)" : "inherit",
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
          </div>
        </div>
      )}

      {/* MODE 2: CHATGPT-STYLE CONVERSATIONAL COPILOT */}
      {viewMode === "chat" && (
        <div style={{
          maxWidth: "860px",
          margin: "0 auto",
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "30px 20px 40px"
        }}>
          {/* Messages Stream */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px", marginBottom: "24px" }}>
            {messages.map((m) => {
              const isUser = m.sender === "user";
              const finding = m.findingId ? findings.find(f => f.id === m.findingId) : null;

              return (
                <div key={m.id} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: isUser ? "#09090b" : "#f4f4f5",
                    color: isUser ? "#ffffff" : "#09090b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    border: "1px solid #e4e4e7"
                  }}>
                    {isUser ? <User size={15} /> : <Bot size={16} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#09090b" }}>
                        {isUser ? "You" : "Ovio Treasury Agent"}
                      </span>
                      <span style={{ fontSize: "11px", color: "#a1a1aa" }}>{m.timestamp}</span>
                    </div>

                    <div style={{ fontSize: "14.5px", lineHeight: 1.6, color: "#27272a" }}>
                      {m.text}
                    </div>

                    {/* Tools Invoked Badges */}
                    {m.toolsInvoked && m.toolsInvoked.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
                        {m.toolsInvoked.map((t, idx) => (
                          <span key={idx} style={{
                            fontSize: "10.5px",
                            fontFamily: "var(--mono)",
                            padding: "2px 7px",
                            borderRadius: "4px",
                            background: "#f4f4f5",
                            color: "#52525b",
                            border: "1px solid #e4e4e7"
                          }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Inline Interactive Card if Finding Matched */}
                    {finding && (
                      <div style={{
                        marginTop: "16px",
                        background: "#fafafa",
                        border: "1px solid #e4e4e7",
                        borderRadius: "10px",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px"
                      }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <span style={{ fontSize: "15px", fontWeight: 800, color: "#09090b", fontFamily: "var(--mono)" }}>
                              ${finding.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                            <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#fef2f2", color: "#991b1b" }}>
                              {finding.confidence}% CONFIDENCE
                            </span>
                          </div>
                          <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#09090b" }}>
                            {finding.vendor}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "#71717a", marginTop: "2px" }}>
                            {finding.dataset}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFindingId(finding.id);
                              setViewMode("queue");
                            }}
                            className="btn btn-primary btn-sm"
                          >
                            <Eye size={13} />
                            <span>Inspect 3-Pane Diff</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#f4f4f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #e4e4e7"
                }}>
                  <Bot size={16} />
                </div>
                <div style={{ fontSize: "13px", color: "#71717a", fontStyle: "italic" }}>
                  Ovio is running O(N) hash blocking and adjudicating disbursements...
                </div>
              </div>
            )}
          </div>

          {/* Prompt Chips & Input Bar */}
          <div>
            {/* Quick Prompt Chips */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
              <button
                type="button"
                onClick={() => handleSendMessage("Audit the City of Los Angeles ledger for Parks & Rec double payments")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  background: "#f4f4f5",
                  border: "1px solid #e4e4e7",
                  color: "#09090b",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                LA Parks &amp; Rec Audit ($12.8K)
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage("Check State of Oklahoma public ledger for CDW Government duplicate bills")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  background: "#f4f4f5",
                  border: "1px solid #e4e4e7",
                  color: "#09090b",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                Oklahoma CDW Hardware ($4.1K)
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage("Test against planted decoy benchmark (Enterprise Rent-A-Car recurring lease)")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  background: "#f4f4f5",
                  border: "1px solid #e4e4e7",
                  color: "#09090b",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                Test 60 Planted Decoys
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage("Calculate 90-day cashflow rescue plan for $50k liquidity floor")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  background: "#f4f4f5",
                  border: "1px solid #e4e4e7",
                  color: "#09090b",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                90-Day Cashflow Rescue
              </button>
            </div>

            {/* Input Bar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              background: "#ffffff",
              border: "1px solid #09090b",
              borderRadius: "12px",
              padding: "10px 14px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)"
            }}>
              <input
                type="text"
                placeholder="Ask Ovio to audit a ledger, explain a candidate, or model cash runway..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  color: "#09090b",
                  background: "transparent"
                }}
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#09090b",
                  color: "#ffffff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
