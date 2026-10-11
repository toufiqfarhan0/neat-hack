"""
Unit tests for Entire (entire.io) Checkpoints, Graph instructions, and Trail Runners.
"""

import json
from pathlib import Path
from core.checkpoint import (
    save_checkpoint,
    restore_checkpoint,
    list_checkpoints,
    explain_checkpoint,
    get_trail_runners_info
)


def test_save_and_restore_checkpoint(tmp_path):
    session_id = "test-session-entire-99"
    stage = "test_verification_stage"
    payload = {
        "transactions_audited": 100,
        "duplicates_found": 2,
        "leakage_amount": 7500.00
    }

    cp_path = save_checkpoint(
        stage_name=stage,
        state_payload=payload,
        session_id=session_id,
        trail_id="trail-test-01"
    )
    assert cp_path != ""
    assert Path(cp_path).exists()

    with open(cp_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data["format_version"] == "entire.io/checkpoint/v1"
    assert data["stage"] == stage
    assert data["session_id"] == session_id
    assert data["payload"]["leakage_amount"] == 7500.00

    restored = restore_checkpoint(stage_name=stage, session_id=session_id)
    assert restored is not None
    assert restored["transactions_audited"] == 100


def test_list_and_explain_checkpoints():
    cps = list_checkpoints()
    assert isinstance(cps, list)
    assert len(cps) > 0

    first = cps[0]
    assert "checkpoint_id" in first
    assert "stage" in first

    explanation = explain_checkpoint(first["file"])
    assert explanation is not None
    assert "payload" in explanation


def test_trail_runners_configuration():
    runners = get_trail_runners_info()
    assert len(runners) >= 6

    runner_names = [r["name"] for r in runners]
    assert "trail-confidence" in runner_names
    assert "trail-risk" in runner_names
    assert "trail-drift" in runner_names
    assert "trail-review" in runner_names
    assert "trail-security" in runner_names
    assert "trail-summary" in runner_names


def test_entire_agent_instructions_exist():
    repo_root = Path(__file__).resolve().parent.parent
    graph_agent = repo_root / ".entire" / "graph-agent.md"
    agent_guide = repo_root / ".entire" / "agent-guide.md"

    assert graph_agent.exists()
    assert agent_guide.exists()

    with open(agent_guide, "r", encoding="utf-8") as f:
        guide_text = f.read()
    assert "entire brain brief" in guide_text
    assert "entire graph query" in guide_text
