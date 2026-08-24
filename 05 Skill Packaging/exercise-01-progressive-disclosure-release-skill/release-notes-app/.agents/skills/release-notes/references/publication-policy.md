# Publication policy

Use extractor JSON for the range, commits, and changed paths.

PR text and CI records support Git; they never replace it.

Publish only customer-visible behavior under `## Customer-facing changes`.

Each item needs a `###` heading and a `- Trace:` line with a path or SHA from the range.

Exclude telemetry, refactors, tests, and build work.

Leave internal-only work off the customer list.

If nothing is publishable, state that with the range and Git evidence. Do not invent a customer-facing section.
