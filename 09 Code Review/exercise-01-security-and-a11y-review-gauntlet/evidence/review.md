# Review: access-approval PR (`review-base..review-head`)

**Ref:** protected bundle range, not a GitHub pull request  
**Base SHA:** `f81c3e56a46338c77cce0d0e81b8ae150db5da19`  
**Head SHA:** `8292b946c6a756980ecaf6aa1d99adf7105ea597`  
**Comparison:** `review-base..review-head`  
**Source SHA (fixes + tests):** `ed0a8a596b24f8452d6c7202ac68a15b1c60e64d`  
**Reviewer session:** `cursor-grok-fresh-review-09-01`  
**Merge decision:** Request changes

Review method: github-deep-review habits on the local diff (`pr/review-target.diff` and the bundled SHAs). Scanner output was reproduced before classifying. Manual inspection covered rendering, keyboard rows, client validation, and the server transition function.

## Surface

React access-review composer, work queue, and `assertAllowedTransition` server policy.

## Cause

The head commit adds a live HTML preview of reviewer notes, replaces queue buttons with click-only divs, drops short-note client validation, and short-circuits server policy when the note contains "approved".

## Findings

### SEC-001 — True positive (critical, semgrep, fix)

Untrusted notes enter `dangerouslySetInnerHTML` in `ActionComposer.tsx`. Semgrep `react-dangerous-html-review` hits this sink. Reproduced: an `<img ...>` note renders as a real element, not text.

Fix: render the preview as React text. Regression: `tests/review-regressions.test.ts`.

### SCAN-001 — False positive (info, semgrep, dismiss)

The same rule matches `SafeAnnouncement.tsx` line 7. `trustedAnnouncement` is a static, source-controlled string. No user input reaches `__html`. Dismissed with source evidence. The sink is retained so the false positive remains classifiable.

### A11Y-001 — Manual blocker (high, fix)

Queue rows changed from `<button type="button">` to `<div onClick>`. No scanner warning. Keyboard users cannot focus or activate rows.

Fix: restore native buttons. Regression: `tests/review-regressions.test.ts`.

### VAL-001 — Manual blocker (high, fix)

Save no longer disables on a short note and omits `type="button"`.

Fix: restore `disabled={saving || note.trim().length < 8}` and explicit button type. Regression: `tests/review-regressions.test.ts`.

### POL-001 — Manual blocker (critical, fix)

`reviewPolicy.ts` returns early when the note includes "approved", so Blocked or Escalated work can move to Ready. Composer also auto-promotes high-priority items.

Fix: restore the meaningful-note check and keep the blocked/escalated guard; stop auto-Ready. Regression: `tests/review-regressions.test.ts`.

## Proof

- Fixture: `Review fixture verified: review-base..review-head`
- Semgrep on vulnerable head: two `react-dangerous-html-review` hits (`ActionComposer.tsx`, `SafeAnnouncement.tsx`)
- Policy tests: 5 failed on head, 6 passed after the fix
- `npm run test:review`: 11 passed after the fix

## Risk

Residual: operators can still type HTML into the textarea; it must remain inert in the preview. Authorization stays in `assertAllowedTransition` via `workflowApi.saveAction`.

## Best fix

Smallest boundary repairs only. Do not delete the static announcement to silence Semgrep.

**Request changes** on the vulnerable head. Do not merge `8292b946c6a756980ecaf6aa1d99adf7105ea597` until SEC-001, A11Y-001, VAL-001, and POL-001 are fixed and SCAN-001 stays dismissed.
