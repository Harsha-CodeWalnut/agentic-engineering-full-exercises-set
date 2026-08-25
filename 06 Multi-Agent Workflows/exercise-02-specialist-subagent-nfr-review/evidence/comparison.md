# Comparison

Same baseline SHA `94687b092fe695b5ce2f6a8848f8c26180bd09b5`, same four specialist commands, and the same protected performance scenario.

| Topic | Before (risky starter) | After (remediation `94ddbb5`) |
|---|---|---|
| Findings | 5 blockers: SEC-01, SEC-02, A11Y-01, PERF-01, TEST-01 | All five rechecked pass |
| Decisions | Not yet triaged | All five `fix`; merge_decision `approve` |
| Security | Live HTML notes; API always approves | Text notes; NOT_AUTHORIZED / MISSING_EVIDENCE |
| Accessibility | Clickable div rows | Native buttons with aria-pressed |
| Performance | 173.894ms, result 41, no useMemo | 0.048ms, result 41, memoized one-pass 72 |
| Testability | `window.setTimeout` | Injected wait, no window, ApprovalError |
| Merge outcome | Specialist gates fail | All four after commands exit 0; approve merge |
