# Comparison

Both attempts used starting commit `94687b092fe695b5ce2f6a8848f8c26180bd09b5`, the same agent and model, the same tools and permissions, a 45-minute time limit, and a genuine first attempt with zero human hints. The variable is unstructured fixture reporting versus the evidence contract and generator CLI.

## Omitted checks and changed results

Before: `evidence/pr-summary.md` listed only `unit-tests` and `ui-screenshot`, set overall result to `passed`, and said smoke coverage was skipped so the review summary stays green.

After: `evidence/generated/pr-evidence.json` contains all three fixture checks in order. `checkout-smoke` is `failed` with exit code `1`. Overall result is `failed` and overall exit code is `1`.

## Missing artifacts and digest coverage

Before copied `unit-tests.txt` and `checkout.svg` without hashes and never copied `checkout-smoke.txt`.

After copied all three artifacts into `evidence/generated/artifacts/` with SHA-256 digests matching the protected fixture bytes.

## Failure exit status

Before did not run a generator. The pack presented a green summary.

After wrote the complete pack, then exited `1`. `npm run evidence:generate -- --sha 36b2ccae737564f84c45790465053ed99d9b1f02` returns `1` for the mixed fixture and `0` for `check-results-pass.json`.

## Reviewer guidance

Before dropped risk, reviewer action, and rollback.

After preserves each check's `risk`, `reviewerAction`, and `rollback` in JSON and in `evidence/generated/summary.md`. Smoke reviewer action remains: block merge until the smoke failure is explained and corrected. Rollback remains: do not deploy.

## Workflow behavior

Before added no GitHub Actions workflow.

After adds `.github/workflows/evidence-led-pr-01.yml`: `pull_request` path filters, `contents: read` only, pinned action SHAs, `npm ci`, `${{ github.sha }}`, `if: always()` on verify and upload, no `continue-on-error`.

## Changed files

Before patch (`evidence/before.patch`): 3 files, `+28 / -0`, success-only markdown and two passing artifacts.

After patch (`evidence/after.patch`): 2 files, `+186 / -0`, generator and workflow. Generated evidence is a later evidence-only commit bound to source SHA `36b2ccae737564f84c45790465053ed99d9b1f02`.
