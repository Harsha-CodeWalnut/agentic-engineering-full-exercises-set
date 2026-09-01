# Before: visual-only dashboard quality check

### Run

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Implementation commit: first-attempt working tree vs starting commit, saved as `evidence/before.patch`
- Agent and model: Cursor Grok 4.6
- Tools and permissions: file read/edit, shell, git; workspace write and command execution
- Time limit: 45 minutes
- Human hints: 0
- Retries: 0
- Patch: `evidence/before.patch`

| Proof | Run 1 | Run 2 | Run 3 | Gate value |
|---|---:|---:|---:|---:|
| Performance | not captured | not captured | not captured | none |
| Accessibility | not captured | not captured | not captured | none |
| LCP in ms | not captured | not captured | not captured | none |

- Axe violations: not scanned; icon button used `title="Download"` instead of an accessible name
- Accessible-name result: fail (`button-name` remains)
- Production build SHA: not recorded
- Browser environment: none
- Gate exit code: gate not implemented
- Deliberate Lighthouse failure exit code: not run
- Deliberate axe failure exit code: not run
- Files changed: 2
- Lines added and removed: `+6 / -1`

The 3200 ms main-thread block in `src/main.tsx` was left in place. There is no three-run production Lighthouse gate and no worst-case threshold.
