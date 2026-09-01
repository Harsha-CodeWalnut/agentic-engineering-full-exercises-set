# After: pessimistic performance and accessibility release gate

### Run

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Implementation commit: `0d826991ec491eecc0b29688311a87634be9848d`
- Agent and model: Cursor Grok 4.6
- Tools and permissions: file read/edit, shell, git, Chrome via Playwright; workspace write and command execution
- Time limit: 45 minutes
- Human hints: 0
- Retries: 0
- Patch: `evidence/after.patch`

| Proof | Run 1 | Run 2 | Run 3 | Gate value |
|---|---:|---:|---:|---:|
| Performance | 1.00 | 1.00 | 1.00 | Worst 1.00 |
| Accessibility | 1.00 | 1.00 | 1.00 | Worst 1.00 |
| LCP in ms | 1356 | 1355 | 1353 | Worst 1356 |

- Axe violations: 0
- Accessible-name result: pass (`aria-label="Download evidence"`)
- Production build SHA: implementation `0d826991ec491eecc0b29688311a87634be9848d`; reports captured after that commit
- Browser environment: Chrome 152, mobile, simulate throttling, route `/`
- Gate exit code: 0 for submitted reports
- Deliberate Lighthouse failure exit code: non-zero (`performance below minimum`)
- Deliberate axe failure exit code: non-zero (`axe violations above maximum`)
- Files changed: 4
- Lines added and removed: `+150 / -7`

`src/main.tsx` no longer blocks the main thread. `lighthouserc.json` runs three production audits with pessimistic assertions. `scripts/quality-gate.mjs` writes `quality-summary.json` before exiting.
