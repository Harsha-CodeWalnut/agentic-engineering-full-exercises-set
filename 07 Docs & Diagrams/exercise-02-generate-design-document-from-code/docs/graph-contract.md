# Design document scope

The primary output is `docs/design-document.md`, not a generated graph. Explain the current application, its modules, dependencies, data flow, fallback behaviour, constraints, and how to verify a change.

Use Acquire Codebase Knowledge for the investigation, with the explicit single-document output override in [setup.md](./setup.md). Its scanner finds leads, not verified design decisions. Consolidate supported findings into the required sections and state unresolved questions plainly. No diagram-generation skill or seven-document submission is required.

The existing graph commands remain optional investigation tools. Their output does not establish the truth of a design claim. If used, compare it with current code and tests. No graph artifact or routing repair is required for completion.

Add useful Mermaid diagrams inside the design document only when they explain a relationship more clearly. Link important statements to source evidence and record stale claims separately. The source app already implements the intended consent boundary; inspect rather than change it.
