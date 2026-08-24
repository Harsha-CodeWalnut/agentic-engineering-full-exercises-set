---
name: release-notes
description: Use when the user asks for customer release notes, a changelog, or a publishable release summary from a Git comparison range with traces and verification status. Do not use for code review, incident reports, engineering summaries, refactors, telemetry cleanup, or test-only writeups.
compatibility: Requires Git and Node.js to run scripts/extract-release.mjs against a local repository.
---

# Release notes

Extract Git facts, then load only the policy this range needs.

## Extract

```bash
node scripts/extract-release.mjs --repo <path> --base <ref> --head <ref>
```

Trust that JSON. Do not widen the range.

## Load

Always read `references/publication-policy.md`.

When verification is required, read `references/evidence-policy.md`.

When the range has a breaking change, read `references/migration-policy.md`.

Hotfix without a contract change skips migration policy. Internal-only with nothing to publish loads publication policy only.

## Draft

Follow loaded policy. Exclude internal-only work. If nothing is publishable, say so and cite Git; do not invent `## Customer-facing changes`.
