"""
OVIO Checkpoint & Context Graph Engine — Powered by Entire (entire.io)
Provides durable checkpoint persistence, continuous memory, and state restoration
for multi-phase autonomous audit workflows and Entire Trail evaluations.
"""

from __future__ import annotations

import os
import json
import time
import logging
import subprocess
from pathlib import Path
from typing import Dict, Any, Optional, List

logger = logging.getLogger("ovio.checkpoint")

_CHECKPOINT_DIR = Path(__file__).resolve().parent.parent / ".entire_checkpoints"


def get_git_commit_hash() -> str:
    """Retrieves current Git commit hash if available, or returns local reference."""
    try:
        res = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            capture_output=True,
            text=True,
            timeout=3
        )
        if res.returncode == 0:
            return res.stdout.strip()
    except Exception:
        pass
    return "uncommitted_local_state"


def get_git_branch() -> str:
    """Retrieves current Git branch name."""
    try:
        res = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            capture_output=True,
            text=True,
            timeout=3
        )
        if res.returncode == 0:
            return res.stdout.strip()
    except Exception:
        pass
    return "main"


def save_checkpoint(
    stage_name: str,
    state_payload: Dict[str, Any],
    session_id: Optional[str] = None,
    trail_id: Optional[str] = None
) -> str:
    """
    Persists an immutable checkpoint snapshot conforming to Entire (entire.io) specifications.
    Enables atomic resumption, audit reproducibility, and trail evaluation.
    """
    _CHECKPOINT_DIR.mkdir(parents=True, exist_ok=True)
    stamp = int(time.time())
    sid = session_id or f"ovio-sess-{stamp}"
    commit_sha = get_git_commit_hash()
    branch_name = get_git_branch()

    filename = f"{stage_name}_{sid}_{stamp}.json"
    filepath = _CHECKPOINT_DIR / filename

    envelope = {
        "format_version": "entire.io/checkpoint/v1",
        "agent": "ovio-treasury-agent",
        "checkpoint_id": f"chk-{stamp}-{stage_name}",
        "stage": stage_name,
        "session_id": sid,
        "trail_id": trail_id or f"trail-{branch_name}-{stamp}",
        "git_commit": commit_sha,
        "git_branch": branch_name,
        "timestamp": stamp,
        "iso_time": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(stamp)),
        "summary": f"Audit checkpoint captured at stage '{stage_name}' for session '{sid}'",
        "payload": state_payload
    }

    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(envelope, f, indent=2, default=str)
        logger.info(f"[ENTIRE.IO CHECKPOINT] Successfully saved: {filename}")
        return str(filepath)
    except Exception as e:
        logger.warning(f"Failed to write Entire checkpoint: {e}")
        return ""


def list_checkpoints() -> List[Dict[str, Any]]:
    """
    Lists all Entire checkpoints stored in the repository.
    """
    if not _CHECKPOINT_DIR.exists():
        return []

    checkpoints = []
    for f in sorted(_CHECKPOINT_DIR.glob("*.json"), reverse=True):
        try:
            with open(f, "r", encoding="utf-8") as fp:
                data = json.load(fp)
                checkpoints.append({
                    "file": f.name,
                    "filepath": str(f),
                    "checkpoint_id": data.get("checkpoint_id", f.stem),
                    "stage": data.get("stage", "unknown"),
                    "session_id": data.get("session_id", "default"),
                    "git_commit": data.get("git_commit", "n/a")[:8],
                    "timestamp": data.get("iso_time", ""),
                    "size_bytes": f.stat().st_size
                })
        except Exception:
            continue
    return checkpoints


def explain_checkpoint(checkpoint_ref: str) -> Optional[Dict[str, Any]]:
    """
    Explains the internal decisions, state payload, and metadata for a given checkpoint ID or file.
    """
    if not _CHECKPOINT_DIR.exists():
        return None

    # Search by exact filename or checkpoint_id
    for f in _CHECKPOINT_DIR.glob("*.json"):
        if checkpoint_ref in f.name or f.stem == checkpoint_ref:
            try:
                with open(f, "r", encoding="utf-8") as fp:
                    return json.load(fp)
            except Exception:
                return None

        try:
            with open(f, "r", encoding="utf-8") as fp:
                data = json.load(fp)
                if data.get("checkpoint_id") == checkpoint_ref:
                    return data
        except Exception:
            continue
    return None


def restore_checkpoint(stage_name: str, session_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """
    Restores the most recent Entire checkpoint for the given workflow stage.
    """
    if not _CHECKPOINT_DIR.exists():
        return None

    matching = []
    for f in _CHECKPOINT_DIR.glob(f"{stage_name}_*.json"):
        matching.append(f)

    if not matching:
        return None

    matching.sort(key=lambda p: p.stat().st_mtime)
    latest_file = matching[-1]
    try:
        with open(latest_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            logger.info(f"[ENTIRE.IO CHECKPOINT] Restored from: {latest_file.name}")
            return data.get("payload")
    except Exception as e:
        logger.warning(f"Failed to read Entire checkpoint: {e}")
        return None


def get_trail_runners_info() -> List[Dict[str, Any]]:
    """
    Inspects configured trail runners in .entire/runners.
    """
    runners_dir = Path(__file__).resolve().parent.parent / ".entire" / "runners"
    if not runners_dir.exists():
        return []

    runners = []
    for f in sorted(runners_dir.glob("*.json")):
        try:
            with open(f, "r", encoding="utf-8") as fp:
                data = json.load(fp)
                runners.append({
                    "name": data.get("name", f.stem),
                    "description": data.get("description", ""),
                    "file": f.name,
                    "target": data.get("target", "trail"),
                    "evaluator": data.get("evaluator", "rule_based")
                })
        except Exception:
            runners.append({"name": f.stem, "file": f.name, "description": "Runner configuration"})
    return runners
