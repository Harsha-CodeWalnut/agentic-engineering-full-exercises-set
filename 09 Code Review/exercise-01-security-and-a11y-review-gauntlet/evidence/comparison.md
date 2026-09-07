# Comparison

Both attempts used base SHA `f81c3e56a46338c77cce0d0e81b8ae150db5da19`, head SHA `8292b946c6a756980ecaf6aa1d99adf7105ea597`, Cursor Grok 4.6, the same tools, a 45-minute limit, and zero human hints. The variable is scanner-only merge pressure versus classified review plus boundary fixes.

## True positives

Before: Semgrep reported two HTML sinks. Only `ActionComposer.tsx` used reviewer-controlled `note` as `__html` (`SEC-001`).

After: the composer preview renders text. Learner test `givenUntrustedHtmlNote_whenComposerRenders_thenPreviewIsTextWithoutDangerouslySetInnerHTML` proves an `<img>` payload is escaped. Linked to `SEC-001`.

## False positives

Before: `SafeAnnouncement.tsx` matched the same rule.

After: the static, source-controlled string is unchanged (`SCAN-001` dismissed). Deleting it to silence Semgrep was rejected.

## Manual findings

Before: no scanner warning for queue `div` rows, dropped short-note validation, or the `approved` policy bypass.

After:

- `A11Y-001` → `WorkQueue.tsx` native `button type="button"`
- `VAL-001` → `ActionComposer.tsx` `disabled={saving \|\| note.trim().length < 8}` and `type="button"`
- `POL-001` → `reviewPolicy.ts` restores the eight-character note rule and keeps Blocked/Escalated from reaching Ready

## Server-boundary coverage

Before: `assertAllowedTransition` returned early on `approved`, so `saveAction` could mark Blocked work Ready.

After: policy tests and learner tests both reject Blocked and Escalated Ready transitions even when the note says approved.

## Tests and commands

Before: `npm run test:policy` exit 1 (5 failed). `npm run test:review` exit 1. No `tests/review-regressions.test.ts`.

After: `npm run test:review` exit 0 (11 passed). Component script confirms the sink is gone, validation is restored, buttons are native, and the static finding remains. Source SHA `ed0a8a596b24f8452d6c7202ac68a15b1c60e64d`. Patch `evidence/after.patch` is 4 files, `+136 / -18`.
