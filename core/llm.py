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

Respond strictly in valid JSON with this exact structure:
{
  "is_duplicate": true | false,
  "confidence": 0.0 - 1.0,
  "explanation_type": "cancelled" | "line_split" | "progress_payment" | "recurring" | "different_po" | "partial_pair" | "true_duplicate",
  "reasoning": "Clear 2-sentence explanation of the treasury finding",
  "recommended_action": "ESCALATE_FOR_CLAWBACK" | "DISMISS"
}
"""


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
                max_tokens=300,
            )

            raw_text = response.choices[0].message.content or "{}"
            # Extract JSON substring if wrapped in markdown code blocks
            clean_text = raw_text.strip()
            if clean_text.startswith("```"):
                lines = clean_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                clean_text = "\n".join(lines).strip()

            parsed = json.loads(clean_text)

            # Record token usage
            usage = getattr(response, "usage", None)
            tokens_in = usage.prompt_tokens if usage else 220
            tokens_out = usage.completion_tokens if usage else 85
            record_token_usage(tokens_in=tokens_in, tokens_out=tokens_out, model=model_name)

            parsed["candidate_id"] = candidate_id
            parsed["model_used"] = model_name
            parsed["tokens_in"] = tokens_in
            parsed["tokens_out"] = tokens_out
            parsed["status"] = "ADJUDICATED"
            span["output"] = parsed
            return parsed

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
                "explanation_type": "true_duplicate" if (is_same_invoice and is_same_amount) else "partial_pair",
                "reasoning": f"Heuristic fallback after {type(err).__name__}: Matched canonical invoice & exact dollar amount.",
                "recommended_action": "ESCALATE_FOR_CLAWBACK" if (is_same_invoice and is_same_amount) else "DISMISS",
                "model_used": "heuristic_fallback_engine",
                "tokens_in": 0,
                "tokens_out": 0,
                "recovery_event": recovery,
                "status": "RECOVERED_HEURISTIC"
            }
            return fallback_verdict
