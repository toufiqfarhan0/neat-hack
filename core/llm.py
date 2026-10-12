"""
OVIO Autonomous Adjudication Engine — Powered by LiteLLM & Neatlogs Wrapping
Adjudicates high-ambiguity AP duplicate payment candidates using claude-haiku
with full Neatlogs span capture and token COGS tracking.
"""

from __future__ import annotations

import os
import json
import logging
from typing import Optional, Dict, Any, Tuple
from decimal import Decimal

from openai import OpenAI
import neatlogs

from core.telemetry import (
    record_token_usage,
    record_recovery_event,
    span_scope,
    get_active_trace_id,
)

logger = logging.getLogger("ovio.llm")

_CLIENT: Optional[OpenAI] = None
_DEFAULT_MODEL = "claude-haiku"
_LITELLM_BASE_URL = "https://litellm.vision.aivar.app/v1"


def get_llm_client() -> OpenAI:
    """Returns a singleton OpenAI client pointing to LiteLLM, wrapped with neatlogs."""
    global _CLIENT
    if _CLIENT is None:
        api_key = (
            os.environ.get("LITELLM_API_KEY")
            or os.environ.get("OPENAI_API_KEY")
            or "sk-EQZ-dALGzW_P-VqVnFUM_g"
        )
        base_url = (
            os.environ.get("OPENAI_API_BASE")
            or _LITELLM_BASE_URL
        )

        raw_client = OpenAI(
            base_url=base_url,
            api_key=api_key,
            timeout=30.0,
            max_retries=2,
        )
        try:
            _CLIENT = neatlogs.wrap(raw_client)
            logger.info("OpenAI client wrapped successfully with neatlogs telemetry.")
        except Exception as e:
            logger.warning(f"Failed to wrap client with neatlogs: {e}. Using raw client.")
            _CLIENT = raw_client

    return _CLIENT


ADJUDICATION_SYSTEM_PROMPT = """You are OVIO, an Autonomous Municipal & Corporate Treasury Recovery Agent.
Your mandate is to adjudicate potential duplicate payment candidates in accounts payable ledgers.
Analyze the two transactions carefully and determine whether they represent a TRUE DUPLICATE (unjustified double disbursement) or a LEGITIMATE PAYMENT (e.g., progress payment, different purchase orders, monthly recurring subscription, distinct distribution lines).

STRICT ADJUDICATION RULES (Enforced by Treasury Policy):
1. STRICT INVOICE COMPARISON & ANTI-HALLUCINATION RULES:
   - SUBSTANTIAL SIMILARITY REQUIREMENT: Invoice numbers must be substantially similar or follow a known transcription pattern to be considered a duplicate. Valid duplicates include exact matches (e.g. "INV-1029" vs "INV-1029"), canonical prefix/suffix variants (e.g. "INV-1029" vs "1029", "AL-9921" vs "AL-9921-DUP"), or leading zero variations ("000452" vs "452").
   - TRANSCRIPTION VARIANCE CONSTRAINTS: Do not assume different invoice numbers are transcription errors or data entry variances unless they differ by at most 1-2 characters (e.g., a single typo or leading/trailing zero).
   - SUBSTANTIALLY DIFFERENT INVOICES: If invoice numbers are substantially different (e.g., "212410021D294" vs "2124424210232"), they must be treated as distinct invoices, and the transactions must be adjudicated as a LEGITIMATE PAYMENT (Is Duplicate: false), even if other fields like amount, vendor, and date match.
   - STRICT PROHIBITION ON HALLUCINATION: You MUST NOT assume, guess, or claim that completely different alphanumeric strings are "minor data entry variances", "system transcription variances", or "typos". Even if vendor, amount, PO number, date, department, and description are identical, transactions with completely different invoice numbers denote distinct authorized vouchers or split grant fundings. You MUST classify them as is_duplicate: false with explanation_type: "distinct_invoices" and recommended_action: "DISMISS".
2. LINE-ITEM SPLIT & SEPARATE CHARGE DISAMBIGUATION:
   - If transactions share vendor and amount but have distinct service/product descriptions (e.g. "Fuel Delivery Product" vs "CA State Fuel Excise Tax", or "Hardware" vs "Installation"), this is a legitimate line-split voucher under a shared PO.
   - Mark as "line_split" with is_duplicate=false and DISMISS.
3. DIFFERENT PURCHASE ORDERS:
   - If PO numbers are distinct and valid, treat as authorized separate procurements ("different_po"), is_duplicate=false, DISMISS.
4. SEQUENTIAL / RECURRING INVOICES:
   - Sequential invoice numbers (e.g. "INV-2024-01" vs "INV-2024-02") reflect scheduled recurring charges or progress draws. Mark is_duplicate=false and DISMISS.

FEW-SHOT ADJUDICATION EXAMPLES:

Example 1: Identical vendor, amount, PO, and description, but completely different invoice numbers (Legitimate distinct disbursements)
Input:
Candidate ID: CAND-EX-0003
Signal Detected: exact_duplicate
Transaction A: Vendor: CENTER FOR THE PACIFIC ASIAN FAMILY INC | Invoice #: 212410021D294 | Amount: $12818.00 | Date: 2024-06-05 | PO: SC21CO24138706Y | Description: '138706 - CPAF DVSO APR'24
Transaction B: Vendor: CENTER FOR THE PACIFIC ASIAN FAMILY INC | Invoice #: 2124424210232 | Amount: $12818.00 | Date: 2024-06-05 | PO: SC21CO24138706Y | Description: 138706 - CPAF DVSO APR'24
Output:
{
  "is_duplicate": false,
  "confidence": 0.95,
  "explanation_type": "distinct_invoices",
  "reasoning": "Invoices 212410021D294 and 2124424210232 are completely different alphanumeric strings representing distinct vouchers. They must not be conflated as transcription variances or duplicate payments.",
  "recommended_action": "DISMISS",
  "invoice_match_status": "distinct_invoices"
}

Example 2: Canonical invoice variant with exact matching amount (True duplicate disbursement)
Input:
Candidate ID: CAND-EX-0007
Signal Detected: exact_duplicate
Transaction A: Vendor: APEX LOGISTICS & COURIER LLC | Invoice #: INV-AL-9921 | Amount: $14500.00 | Date: 2026-03-12 | PO: PO-SUP-2026-081 | Description: Q1 FREIGHT CONTRACT BULK DELIVERY
Transaction B: Vendor: APEX LOGISTICS & COURIER LLC | Invoice #: INV-AL-9921-DUP | Amount: $14500.00 | Date: 2026-03-24 | PO: PO-SUP-2026-081 | Description: Q1 FREIGHT CONTRACT BULK DELIVERY (DUPLICATE RESUBMITTED)
Output:
{
  "is_duplicate": true,
  "confidence": 0.98,
  "explanation_type": "true_duplicate",
  "reasoning": "Both vouchers share canonical invoice AL-9921 and exact $14,500.00 amount, representing an unjustified duplicate billing resubmission for the same freight delivery.",
  "recommended_action": "ESCALATE_FOR_CLAWBACK",
  "invoice_match_status": "canonical_variant"
}

Example 3: Complementary line items on shared invoice (Line-item split voucher)
Input:
Candidate ID: CAND-INV-0008
Signal Detected: invoice_variant
Transaction A: Vendor: FALCON FUELS INC | Invoice #: 40240000071779 | Amount: $321537.54 | Date: 2024-06-17 | PO: CPO40240000469961 | Description: FUEL, GASOLINE
Transaction B: Vendor: FALCON FUELS INC | Invoice #: 40240000071779 | Amount: $18931.33 | Date: 2024-06-17 | PO: CPO40240000469961 | Description: TAX, CA GAS EXCISE
Output:
{
  "is_duplicate": false,
  "confidence": 0.95,
  "explanation_type": "line_split",
  "reasoning": "Both vouchers share invoice 40240000071779, with Transaction A covering base fuel and Transaction B covering California state excise tax under the same purchase order.",
  "recommended_action": "DISMISS",
  "invoice_match_status": "exact_match"
}

Respond strictly in valid JSON with this exact structure:
{"is_duplicate": boolean, "confidence": number, "explanation_type": string, "reasoning": string, "recommended_action": string, "invoice_match_status": string}

Explicit JSON Schema:
{
  "type": "object",
  "required": ["is_duplicate", "confidence", "explanation_type", "reasoning", "recommended_action", "invoice_match_status"],
  "properties": {
    "is_duplicate": {
      "type": "boolean",
      "description": "true only if this represents an unjustified double disbursement"
    },
    "confidence": {
      "type": "number",
      "minimum": 0.0,
      "maximum": 1.0,
      "description": "Forensic confidence score"
    },
    "explanation_type": {
      "type": "string",
      "enum": ["cancelled", "line_split", "progress_payment", "recurring", "different_po", "partial_pair", "true_duplicate", "distinct_invoices"]
    },
    "reasoning": {
      "type": "string",
      "description": "Factual 2-sentence forensic treasury finding citing specific invoice # and line evidence"
    },
    "recommended_action": {
      "type": "string",
      "enum": ["ESCALATE_FOR_CLAWBACK", "DISMISS"]
    },
    "invoice_match_status": {
      "type": "string",
      "enum": ["exact_match", "canonical_variant", "distinct_invoices"]
    }
  }
}

Do not include any introductory remarks, markdown code blocks, or trailing commentary. Output the raw JSON object directly.
"""


def _parse_plain_text_kv(raw_text: str) -> Optional[Dict[str, Any]]:
    """
    Lenient parser for plain-text key-value output when LLM omits JSON brackets.
    Handles plain-text outputs such as:
      is_duplicate: true
      confidence: 0.95
      explanation_type: true_duplicate
      reasoning: Invoice numbers and amounts match exactly.
    """
    import re
    result: Dict[str, Any] = {}

    # 1. is_duplicate
    dup_match = re.search(r"(?:is_duplicate|duplicate)\s*[:=]\s*(true|false|yes|no|1|0)", raw_text, re.IGNORECASE)
    if dup_match:
        val = dup_match.group(1).lower()
        result["is_duplicate"] = val in ("true", "yes", "1")

    # 2. confidence
    conf_match = re.search(r"confidence\s*[:=]\s*([0-9]*\.?[0-9]+%?)", raw_text, re.IGNORECASE)
    if conf_match:
        val_str = conf_match.group(1)
        try:
            if val_str.endswith("%"):
                val = float(val_str[:-1]) / 100.0
            else:
                val = float(val_str)
            result["confidence"] = max(0.0, min(1.0, val))
        except ValueError:
            pass

    # 3. explanation_type
    exp_match = re.search(r"explanation_type\s*[:=]\s*[\"']?([a-zA-Z0-9_\-]+)[\"']?", raw_text, re.IGNORECASE)
    if exp_match:
        exp = exp_match.group(1).lower().replace("-", "_")
        valid_types = {"cancelled", "line_split", "progress_payment", "recurring", "different_po", "partial_pair", "true_duplicate"}
        if exp in valid_types:
            result["explanation_type"] = exp
        else:
            result["explanation_type"] = "true_duplicate" if result.get("is_duplicate") else "different_po"

    # 4. reasoning
    reason_match = re.search(r"reasoning\s*[:=]\s*[\"']?([^\n\r]+(?:(?!\n\s*[a-zA-Z_]+[:=])\n[^\n\r]+)*)", raw_text, re.IGNORECASE)
    if reason_match:
        result["reasoning"] = reason_match.group(1).strip().strip("\"'")

    # 5. recommended_action
    act_match = re.search(r"recommended_action\s*[:=]\s*[\"']?(ESCALATE_FOR_CLAWBACK|DISMISS)[\"']?", raw_text, re.IGNORECASE)
    if act_match:
        result["recommended_action"] = act_match.group(1).upper()

    # 6. invoice_match_status
    inv_match = re.search(r"invoice_match_status\s*[:=]\s*[\"']?([a-zA-Z_]+)[\"']?", raw_text, re.IGNORECASE)
    if inv_match:
        result["invoice_match_status"] = inv_match.group(1).lower()

    if "is_duplicate" in result or "reasoning" in result or "confidence" in result:
        return result
    return None


def _extract_and_parse_json(raw_text: str) -> Dict[str, Any]:
    """
    Robust, lenient JSON parser for LLM outputs. Tolerates markdown code blocks,
    preamble commentary, and plain-text key-value fallback formats.
    """
    clean_text = raw_text.strip()
    if clean_text.startswith("```"):
        lines = clean_text.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        clean_text = "\n".join(lines).strip()

    # Direct parse attempt
    try:
        return json.loads(clean_text)
    except json.JSONDecodeError:
        pass

    # Regex extraction of outermost { ... }
    import re
    match = re.search(r"(\{.*\})", raw_text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # Lenient plain-text key-value fallback
    kv_result = _parse_plain_text_kv(raw_text)
    if kv_result is not None:
        return kv_result

    raise ValueError(f"Could not extract valid JSON or key-value format from response: {raw_text[:200]}")


def are_invoices_substantially_similar(inv1: Optional[str], inv2: Optional[str]) -> bool:
    """
    Evaluates whether two invoice identifiers are substantially similar
    (exact match, canonical variant, prefix/suffix variant, or 1-character typo).
    Returns False for completely distinct alphanumeric strings and sequential invoices.
    """
    if not inv1 or not inv2:
        return False
    s1 = "".join(c for c in str(inv1).upper() if c.isalnum())
    s2 = "".join(c for c in str(inv2).upper() if c.isalnum())
    if not s1 or not s2:
        return False
    if s1 == s2:
        return True
    # Strip leading zeros
    if s1.lstrip("0") == s2.lstrip("0"):
        return True
    # Check prefix/suffix match (e.g. "INV1029" vs "1029" or "9921" vs "9921DUP")
    if s1 in s2 or s2 in s1:
        shorter = min(len(s1), len(s2))
        longer = max(len(s1), len(s2))
        if shorter >= 4 and (longer - shorter) <= 4:
            return True

    # Sequential or indexed invoice check (e.g. INV-2024-01 vs INV-2024-02)
    import re
    m1 = re.search(r"(\d+)$", s1)
    m2 = re.search(r"(\d+)$", s2)
    if m1 and m2:
        prefix1 = s1[:m1.start()]
        prefix2 = s2[:m2.start()]
        if prefix1 == prefix2 and m1.group(1) != m2.group(1):
            return False

    # Levenshtein distance check for typographic typos
    import difflib
    matcher = difflib.SequenceMatcher(None, s1, s2)
    ratio = matcher.ratio()
    max_len = max(len(s1), len(s2))
    distance = int(round((1.0 - ratio) * max_len))
    return distance <= 1 and ratio >= 0.90


def validate_adjudication_output(
    verdict: Dict[str, Any],
    candidate_id: str = "",
    tx1: Optional[Dict[str, Any]] = None,
    tx2: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Strict validation guardrail verifying that the adjudication output contains
    all required typed fields and is never empty, preventing silent chain degradation
    and blocking LLM hallucinations on completely different invoice strings.
    """
    if not isinstance(verdict, dict):
        verdict = {}

    validated = verdict.copy()

    # 1. is_duplicate: strictly boolean
    is_dup = bool(validated.get("is_duplicate", False))
    validated["is_duplicate"] = is_dup

    # 2. confidence: float between 0.0 and 1.0
    try:
        conf = float(validated.get("confidence", 0.85 if is_dup else 0.50))
    except (ValueError, TypeError):
        conf = 0.85 if is_dup else 0.50
    validated["confidence"] = round(max(0.0, min(1.0, conf)), 2)

    # 3. explanation_type: string
    valid_types = {
        "cancelled", "line_split", "progress_payment", "recurring",
        "different_po", "partial_pair", "true_duplicate", "distinct_invoices"
    }
    exp_type = str(validated.get("explanation_type", "")).lower().replace("-", "_")
    if exp_type not in valid_types:
        exp_type = "true_duplicate" if is_dup else "different_po"
    validated["explanation_type"] = exp_type

    # 4. Anti-Hallucination Guardrail Check for Distinct Invoice Numbers:
    # If LLM marked is_duplicate=True but the transactions have completely different invoice numbers,
    # override to False and classify as distinct_invoices.
    if tx1 and tx2 and validated["is_duplicate"]:
        inv1 = tx1.get("invoice_canonical") or tx1.get("invoice_number_raw")
        inv2 = tx2.get("invoice_canonical") or tx2.get("invoice_number_raw")
        if inv1 and inv2 and not are_invoices_substantially_similar(inv1, inv2):
            logger.warning(
                f"Anti-hallucination guardrail active: LLM marked duplicate for distinct invoices {inv1} vs {inv2}. "
                "Overriding is_duplicate to False."
            )
            validated["is_duplicate"] = False
            validated["explanation_type"] = "distinct_invoices"
            validated["reasoning"] = (
                f"Invoices {inv1} and {inv2} are completely different alphanumeric strings representing distinct authorized vouchers. "
                "Reconciled as legitimate distinct disbursements."
            )
            validated["recommended_action"] = "DISMISS"
            validated["invoice_match_status"] = "distinct_invoices"
            validated["confidence"] = 0.95

    # 5. reasoning: non-empty string
    reasoning = str(validated.get("reasoning", "")).strip()
    if not reasoning:
        if validated["is_duplicate"]:
            reasoning = "Forensic audit confirmed duplicate disbursement across identical billing parameters."
        else:
            reasoning = f"Forensic audit reconciled transaction pair as legitimate {validated['explanation_type']}."
    validated["reasoning"] = reasoning

    # 6. recommended_action: strictly enum
    rec_action = str(validated.get("recommended_action", "")).upper()
    if rec_action not in ("ESCALATE_FOR_CLAWBACK", "DISMISS"):
        rec_action = "ESCALATE_FOR_CLAWBACK" if validated["is_duplicate"] else "DISMISS"
    validated["recommended_action"] = rec_action

    # 7. invoice_match_status
    inv_status = str(validated.get("invoice_match_status", "")).lower()
    if inv_status not in ("exact_match", "canonical_variant", "distinct_invoices"):
        inv_status = "exact_match" if validated["is_duplicate"] else "distinct_invoices"
    validated["invoice_match_status"] = inv_status

    if candidate_id and not validated.get("candidate_id"):
        validated["candidate_id"] = candidate_id

    return validated


def adjudicate_candidate(
    candidate_id: str,
    tx1: Dict[str, Any],
    tx2: Dict[str, Any],
    signal: str = "exact_duplicate",
) -> Dict[str, Any]:
    """
    Sends an ambiguous candidate pair to claude-haiku for forensic audit analysis.
    Uses Neatlogs span wrapping and handles fallback self-healing if connectivity degrades.
    """
    model_name = os.environ.get("MODEL_NAME", _DEFAULT_MODEL)

    prompt_user = f"""Candidate ID: {candidate_id}
Signal Detected: {signal}

Transaction A:
- ID: {tx1.get('transaction_id')}
- Vendor: {tx1.get('vendor_name_raw')} (Canonical: {tx1.get('vendor_canonical')})
- Invoice #: {tx1.get('invoice_number_raw')} (Canonical: {tx1.get('invoice_canonical')})
- Amount: ${tx1.get('amount')}
- Date: {tx1.get('payment_date')}
- PO Number: {tx1.get('po_number')}
- Department: {tx1.get('department')}
- Description: {tx1.get('description')}

Transaction B:
- ID: {tx2.get('transaction_id')}
- Vendor: {tx2.get('vendor_name_raw')} (Canonical: {tx2.get('vendor_canonical')})
- Invoice #: {tx2.get('invoice_number_raw')} (Canonical: {tx2.get('invoice_canonical')})
- Amount: ${tx2.get('amount')}
- Date: {tx2.get('payment_date')}
- PO Number: {tx2.get('po_number')}
- Department: {tx2.get('department')}
- Description: {tx2.get('description')}

Adjudicate this candidate and output JSON:"""

    with span_scope(
        name="llm.adjudicate",
        span_kind="AGENT",
        attributes={
            "candidate_id": candidate_id,
            "signal": signal,
            "model": model_name,
            "provider": "litellm-claude-haiku",
            "trace_id": get_active_trace_id(),
        }
    ) as span:
        span["input"] = {"candidate_id": candidate_id, "signal": signal, "prompt": prompt_user[:400]}
        client = get_llm_client()
        try:
            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": ADJUDICATION_SYSTEM_PROMPT},
                    {"role": "user", "content": prompt_user},
                ],
                temperature=0.0,
                max_tokens=350,
            )

            raw_text = response.choices[0].message.content or "{}"
            parsed = _extract_and_parse_json(raw_text)
            validated = validate_adjudication_output(parsed, candidate_id=candidate_id, tx1=tx1, tx2=tx2)

            # Record token usage
            usage = getattr(response, "usage", None)
            tokens_in = usage.prompt_tokens if usage else 220
            tokens_out = usage.completion_tokens if usage else 85
            record_token_usage(tokens_in=tokens_in, tokens_out=tokens_out, model=model_name)

            validated["candidate_id"] = candidate_id
            validated["model_used"] = model_name
            validated["tokens_in"] = tokens_in
            validated["tokens_out"] = tokens_out
            validated["status"] = "ADJUDICATED"
            span["output"] = validated
            return validated

        except Exception as err:
            logger.error(f"LLM adjudication error on candidate {candidate_id}: {err}")
            recovery = record_recovery_event(
                error_type=type(err).__name__,
                details=str(err),
                action_taken="fallback_to_heuristic_rule_adjudication",
                metadata={"candidate_id": candidate_id, "model": model_name}
            )

            # Deterministic fallback adjudication for self-healing
            is_same_invoice = (
                tx1.get("invoice_canonical")
                and tx1.get("invoice_canonical") == tx2.get("invoice_canonical")
            )
            is_same_amount = tx1.get("amount") == tx2.get("amount")

            fallback_verdict = {
                "candidate_id": candidate_id,
                "is_duplicate": bool(is_same_invoice and is_same_amount),
                "confidence": 0.88 if (is_same_invoice and is_same_amount) else 0.40,
                "explanation_type": "true_duplicate" if (is_same_invoice and is_same_amount) else "distinct_invoices" if not is_same_invoice else "partial_pair",
                "reasoning": f"Heuristic fallback after {type(err).__name__}: Matched canonical invoice & exact dollar amount." if (is_same_invoice and is_same_amount) else f"Heuristic fallback after {type(err).__name__}: Distinct invoices detected.",
                "recommended_action": "ESCALATE_FOR_CLAWBACK" if (is_same_invoice and is_same_amount) else "DISMISS",
                "invoice_match_status": "exact_match" if is_same_invoice else "distinct_invoices",
                "model_used": "heuristic_fallback_engine",
                "tokens_in": 0,
                "tokens_out": 0,
                "recovery_event": recovery,
                "status": "RECOVERED_HEURISTIC"
            }
            validated_fallback = validate_adjudication_output(fallback_verdict, candidate_id=candidate_id, tx1=tx1, tx2=tx2)
            span["output"] = validated_fallback
            return validated_fallback
