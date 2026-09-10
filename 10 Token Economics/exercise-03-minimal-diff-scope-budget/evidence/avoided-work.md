# Avoided work and its reason

The production requirement concerns only the export mapping in the shared helper. Checkout remains legacy-primary, delete retains its destructive legacy-danger behavior, and unknown actions retain the legacy-primary fallback. The reason to preserve these paths is behavioral compatibility, not merely reducing a file count.

The existing actionButtons.mjs consumers already delegate to the helper. Editing those shared consumers would duplicate migration logic and enlarge the regression surface. Components can continue displaying their existing action descriptions. Shared styles require no changes to satisfy the variant contract, and introducing a new dependency would add installation and review work unrelated to this mapping.

No unrelated cleanup is needed. The final avoided-work.json records these tempting paths, the proposed work that was avoided, and why each remains unchanged. The final source commit and protected-input checks provide the proof; the prose is not a substitute for the Git diff. This discipline bounds context and review scope without claiming measured API-token savings.
