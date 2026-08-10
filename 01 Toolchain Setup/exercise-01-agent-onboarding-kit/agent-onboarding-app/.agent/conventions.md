# Coding conventions

## TypeScript and React

- Keep TypeScript strict. Model finite domain vocabularies with string unions and
  shared structures with interfaces in `src/types.ts`.
- Use `import type` for type-only imports.
- Use named exports for data and service functions; keep `App` as the default
  component export following the existing entry-point pattern.
- Use functional React components and hooks. Keep state minimal and calculate
  derived collections rather than duplicating them in state.
- Keep components focused on interaction and presentation. Put domain decisions
  in the service layer.
- Avoid mutating imported data. Sorting must operate on a copied array.
- Prefer descriptive domain names such as `SupportCase`, `QueuePolicy`, and
  `RoutingHint` over generic object or data names.

## Domain naming and units

- Case identifiers use `CASE-<number>`, for example `CASE-1842`.
- Support status values use `new`, `triaged`, `waiting`, and `blocked`.
- Customer segments use `enterprise`, `mid-market`, and `self-serve`.
- Severity values use `low`, `medium`, `high`, and `critical`.
- Engineering owner labels are lowercase kebab-case.
- Include units in numeric field names: `lastActivityHours`, `revenueRiskUsd`,
  `staleAfterHours`, and `criticalRevenueFloor`.
- Keep `RoutingHint` derived from a case and policy; do not add it to source data.

## Formatting and UI

- Follow the existing two-space indentation, double quotes, semicolons, and
  trailing-comma style.
- Do not leave trailing whitespace; `npm run format` checks it.
- Use semantic HTML before adding generic containers or ARIA attributes.
- Buttons must retain `type="button"`, an accessible name, a visible active
  state, and keyboard behavior.
- Reuse the existing responsive layout and visual vocabulary unless a scoped
  design change requires otherwise.

## Documentation and comments

- Document repository-specific decisions and non-obvious constraints, not syntax
  that the code already makes clear.
- Update operational documentation when commands, boundaries, or review
  requirements change.
- Keep policy descriptions accurate for users; do not let UI copy drift from
  executable behavior.
