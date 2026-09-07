# After: classified review and boundary repairs

### Run

- Remediation commit: `ed0a8a596b24f8452d6c7202ac68a15b1c60e64d`
- Recheck agent and model: Cursor Grok 4.6
- Tools and permissions: local git bundle, Semgrep 1.136.0, Node 22, vitest; workspace write and command execution
- Patch: `evidence/after.patch`

### Recheck commands

| Check | Exit code | Result |
|---|---:|---|
| `npm run test:review` | 0 | 11 tests passed; component checks passed |
| `npm run review:verify` | recorded in `evidence/commands/review-verify.txt` | protected range, five findings, git binding |
| `npm run agent:check` | recorded with `verify:exercise` | integrity, lint, format, typecheck, build |

### Classification

- Fixed finding IDs: `SEC-001`, `A11Y-001`, `VAL-001`, `POL-001`
- Dismissed IDs: `SCAN-001`
- Regression tests added: `tests/review-regressions.test.ts` (untrusted notes as text, native keyboard buttons, short-note disable, Blocked/Escalated cannot reach Ready)
- Files changed in sourceSha: 4
- Lines added and removed: `+136 / -18`

### What this attempt kept

1. `SafeAnnouncement` still uses the static HTML sink so the scanner false positive remains.
2. Server policy is the authorization boundary for Ready transitions.
3. Preview still exists, but as text children rather than an HTML sink.
