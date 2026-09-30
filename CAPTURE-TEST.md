# Capture Test

## Setup

- Tool: Codex CLI 0.159.2
- Model: GPT-6-Luna for planning and execution; the same model handles both.
- Automatic mechanism: Codex lifecycle hooks. `UserPromptSubmit` appends the submitted prompt and `Stop` appends `last_assistant_message` to the session log.
- Configuration: `.codex/hooks.json`; handler: `.codex/hooks/capture_turn.py`. Both project hooks were reviewed and trusted in the Codex CLI hook browser.
- Canary log files: `.agent-logs/2026-09-30_13-39-38_01a0f28a-bcf9-7552-9d76-fe3a0fe187ff.md` and `.agent-logs/2026-09-30_13-40-42_01a0f28b-b285-7cc3-ac1f-cc3fc20b8695.md`.

## Canary 1 — raw entries

[LOG_ENTRY type=PROMPT num=1 session=01a0f28a-bcf9-7552-9d76-fe3a0fe187ff]
timestamp: 2026-09-30T13:39:38.779Z
model: gpt-6-luna

CAPTURE TEST — 8x assignment, amank
Reply with exactly: CAPTURE CANARY RECEIVED. Do not inspect or modify files and do not run tools.

[LOG_ENTRY type=RESPONSE num=1 session=01a0f28a-bcf9-7552-9d76-fe3a0fe187ff]
timestamp: 2026-09-30T13:39:42.675Z
model: gpt-6-luna

CAPTURE CANARY RECEIVED.

## Canary 2 — raw entries

[LOG_ENTRY type=PROMPT num=1 session=01a0f28b-b285-7cc3-ac1f-cc3fc20b8695]
timestamp: 2026-09-30T13:40:42.092Z
model: gpt-6-luna

CAPTURE TEST — 8x assignment, amank
Reply with exactly: CAPTURE CANARY RECEIVED. Do not inspect or modify files and do not run tools.

[LOG_ENTRY type=RESPONSE num=1 session=01a0f28b-b285-7cc3-ac1f-cc3fc20b8695]
timestamp: 2026-09-30T13:40:45.245Z
model: gpt-6-luna

CAPTURE CANARY RECEIVED.

## First attempt that did not work

The first attempt passed the em dash through Windows PowerShell as mojibake and, without an instruction to avoid tools, the test model began exploring the repository. I interrupted it. Its prompt-only log is preserved untouched at `.agent-logs/2026-09-30_13-34-27_01a0f285-f95e-78a0-a384-aa46fe36a71d.md`. Sending UTF-8 via stdin and asking for a fixed no-tools response corrected both problems.
