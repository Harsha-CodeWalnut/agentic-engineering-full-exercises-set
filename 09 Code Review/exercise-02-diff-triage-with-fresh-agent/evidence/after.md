# After: focused cache repairs

- Remediation SHA: `bbf2a4cf0131908689948b521608f3af05d260aa`
- Recheck agent and model: Cursor Grok 4.6
- Patch: `evidence/after.patch`

### Recheck commands

| Check | Exit code | Result |
|---|---:|---|
| `npm run test:cache` | 0 | 9 passed; filter changes do not clear persisted workflow data |
| `npm run triage:verify` | 0 | Source SHA bound; fresh context; four cache blockers; evidence-only history |
| `npm run agent:check` | 0 | integrity, lint, format, typecheck, build |
| `npm run verify:exercise` | 0 | 42 protected inputs; 9 cache tests; 8 submission files |

### Classification

- Fixed: CACHE-001, CACHE-002, CACHE-003, CACHE-004
- Dismissed: CLAIM-001 (`saveAction` returns a new object; it does not mutate `workItems`)
- Files in sourceSha: 3 (`App.tsx`, `workflowApi.ts`, `tests/cache-regressions.test.ts`)
- Lines added and removed: `+132 / -16`
