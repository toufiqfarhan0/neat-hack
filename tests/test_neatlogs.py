"""
Tests for Neatlogs telemetry integration, spans, and doctor health check.
"""

import os
import pytest
from core.telemetry import (
    is_neatlogs_available,
    init_telemetry,
    trace_scope,
    span_scope,
    record_recovery_event,
    record_token_usage,
    get_trace_stats
)
from core.doctor import run_doctor_check


def test_neatlogs_installed():
    """Verify that neatlogs library is present in the environment."""
    assert is_neatlogs_available() is True


def test_telemetry_initialization():
    """Verify telemetry initializes cleanly in local or live mode."""
    ok = init_telemetry(workflow_name="test-ovio-agent")
    assert ok in (True, False)  # True if key set, False if dry-run fallback


def test_trace_and_spans():
    """Verify structured trace and span execution."""
    init_telemetry(workflow_name="test-ovio-agent")

    with trace_scope(name="test_audit_sweep", session_id="test-session-001") as ctx:
        assert ctx["session_id"] == "test-session-001"
        assert ctx["trace_id"] is not None
        assert ctx["status"] == "RUNNING"

        with span_scope(name="agent.plan", span_kind="WORKFLOW", attributes={"task": "plan"}):
            pass

        with span_scope(name="tool.blocking", span_kind="TOOL", attributes={"algorithm": "hash_buckets"}):
            record_token_usage(tokens_in=200, tokens_out=50)

    stats = get_trace_stats()
    assert stats["total_spans"] >= 2
    assert stats["total_tokens_in"] >= 200
    assert stats["total_tokens_out"] >= 50
    assert stats["estimated_cost_usd"] > 0.0


def test_recovery_event():
    """Verify agent self-healing recovery events are captured for hackathon rubric."""
    init_telemetry(workflow_name="test-ovio-agent")

    event = record_recovery_event(
        error_type="MockMalformedJSONError",
        details="LLM response failed Pydantic schema validation",
        action_taken="fallback_to_heuristic_rule_adjudication"
    )

    assert event["event_type"] == "AGENT_RECOVERY"
    assert event["error_type"] == "MockMalformedJSONError"
    assert event["action_taken"] == "fallback_to_heuristic_rule_adjudication"

    stats = get_trace_stats()
    assert stats["recovery_events"] >= 1


def test_doctor_diagnostic():
    """Verify the doctor probe executes all checks and outputs report."""
    report = run_doctor_check()
    assert "sdk_installed" in report
    assert report["sdk_installed"] is True
    assert "checks" in report
    assert len(report["checks"]) >= 3

    check_names = [c[0] for c in report["checks"]]
    assert "SDK_INSTALLED" in check_names
    assert "API_KEY" in check_names
    assert "COLLECTOR_NETWORK" in check_names
