# PR evidence pack

Source SHA: `36b2ccae737564f84c45790465053ed99d9b1f02`

This pack is generated from the protected mixed fixture. Overall result is **failed** with **Exit code** `1` because `checkout-smoke` failed (`npm run test:smoke`, exit code `1`). Unit tests and the UI screenshot passed; they do not hide the smoke failure.

## Risk, reviewer action, and rollback

- **Risk:** High: checkout cannot complete in the smoke scenario.
- **Reviewer action:** Block merge until the smoke failure is explained and corrected.
- **Rollback:** Do not deploy; if already deployed, revert the checkout change.

Reproduce the failing pack from `pr-evidence-app`:

```bash
npm ci
npm run evidence:generate -- --sha 36b2ccae737564f84c45790465053ed99d9b1f02
```

The generator copies every fixture artifact, writes SHA-256 digests, then exits `1`. Reviewers should read `evidence/generated/summary.md` and `evidence/generated/artifacts/checkout-smoke.txt` before merging. The workflow uploads `evidence/generated` even when generation is non-zero, and it does not use `continue-on-error`.
