import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


def now():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def safe(value):
    return re.sub(r"[^A-Za-z0-9_-]", "_", str(value or "unknown"))


def main():
    event = json.load(sys.stdin)
    cwd = Path(event.get("cwd") or os.getcwd())
    session_id = str(event.get("session_id") or "unknown-session")
    model = str(event.get("model") or "unknown")
    timestamp = now()
    log_dir = cwd / ".agent-logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{timestamp[:10]}_{timestamp[11:19].replace(':', '-')}_{safe(session_id)}.md"
    path = log_dir / filename

    if sys.argv[1] == "prompt":
        prompt = event.get("prompt") or ""
        entry_num = 1
        if path.exists():
            entry_num = path.read_text(encoding="utf-8").count("[LOG_ENTRY type=PROMPT") + 1
        else:
            existing = sorted(log_dir.glob(f"*_{safe(session_id)}.md"))
            if existing:
                path = existing[-1]
                entry_num = path.read_text(encoding="utf-8").count("[LOG_ENTRY type=PROMPT") + 1
        if not path.exists():
            header = (
                "---\n"
                f"session_id: {session_id}\n"
                f"date: {timestamp[:10]}\n"
                "author: amank\n"
                f"model: {model}\n"
                "tool: codex-cli\n"
                f"project: {cwd.name}\n"
                "total_exchanges: 0\n"
                f"first_prompt_time: {timestamp}\n"
                f"last_prompt_time: {timestamp}\n"
                "---\n\n"
                f"# Session Log - {timestamp[:10]}\n\n"
                f"Session: `{session_id[:8]}` | Project: `{cwd.name}` | Author: `amank`\n\n"
                "---\n\n"
            )
            path.write_text(header, encoding="utf-8")
        body = (
            f"[LOG_ENTRY type=PROMPT num={entry_num} session={session_id}]\n"
            f"timestamp: {timestamp}\nmodel: {model}\n\n{prompt}\n\n\n"
        )
        with path.open("a", encoding="utf-8", newline="\n") as log:
            log.write(body)
        return

    response = event.get("last_assistant_message") or ""
    if not path.exists():
        existing = sorted(log_dir.glob(f"*_{safe(session_id)}.md"))
        if existing:
            path = existing[-1]
        else:
            return
    text = path.read_text(encoding="utf-8")
    response_num = text.count("[LOG_ENTRY type=RESPONSE") + 1
    body = (
        f"[LOG_ENTRY type=RESPONSE num={response_num} session={session_id}]\n"
        f"timestamp: {timestamp}\nmodel: {model}\n\n{response}\n\n\n"
    )
    with path.open("a", encoding="utf-8", newline="\n") as log:
        log.write(body)
    prompt_count = text.count("[LOG_ENTRY type=PROMPT")
    lines = text.splitlines(keepends=True)
    for index, line in enumerate(lines):
        if line.startswith("total_exchanges:"):
            lines[index] = f"total_exchanges: {prompt_count}\n"
        elif line.startswith("last_prompt_time:"):
            prompts = re.findall(r"timestamp: (\S+)", text)
            if prompts:
                lines[index] = f"last_prompt_time: {prompts[-1]}\n"
    path.write_text("".join(lines) + body, encoding="utf-8")


if __name__ == "__main__":
    main()
