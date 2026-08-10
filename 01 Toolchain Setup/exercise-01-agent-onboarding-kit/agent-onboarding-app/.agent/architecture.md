# Architecture

## Application purpose

The Case Routing Console is a client-side React application for support triage.
It filters sample cases by status, sorts them by calculated risk, and shows a
recommended engineering owner and next action. There is no server, persistence,
authentication, or external API in this repository.

## Runtime flow

1. `src/main.tsx` locates the root element and mounts `App` in React strict mode.
2. `src/App.tsx` reads `sampleCases` and `queuePolicy`, maintains the selected
   status filter, and delegates routing and sorting to the service layer.
3. `src/services/caseRouter.ts` calculates risk and returns a `RoutingHint`.
4. The UI renders the sorted cases and policy description using `src/styles.css`.

## Directory ownership

| Path | Responsibility | Boundary |
| --- | --- | --- |
| `src/main.tsx` | Browser entry point | Mount the application; no domain logic |
| `src/App.tsx` | UI state and presentation | Filter and render; delegate routing decisions |
| `src/types.ts` | Domain contracts | Shared status, segment, severity, case, policy, and hint types |
| `src/data/cases.ts` | Sample data and runtime queue policy | Data/configuration, not routing algorithms |
| `src/services/caseRouter.ts` | Risk scoring, routing, sorting, policy text | Domain decisions, no React presentation |
| `src/styles.css` | Global and component styling | Preserve responsive and accessible presentation |
| `docs/support-notes.md` | Operational expectations | Human-authored workflow context |
| `scripts/` | Lightweight repository checks | Validation only; not runtime application code |
| `lab-contract.json` | Exercise contract and verification criteria | Exercise metadata, not application configuration |

## Domain and ownership model

- `SupportCase.status` uses support workflow labels: `new`, `triaged`, `waiting`,
  and `blocked`.
- `SupportCase.ownerTeam` and `RoutingHint.owner` use engineering ownership
  labels such as `billing-integrations`, `identity`, `growth`, and
  `support-platform`.
- `QueuePolicy` controls staleness, critical revenue risk, fallback ownership,
  and restricted tags.
- A `RoutingHint` is derived data containing an owner, action, and numeric risk
  score. It should not be stored in the sample case records.

## Current routing policy

- Severity weights are low `1`, medium `2`, high `4`, and critical `7`.
- A stale case adds `2`; critical revenue risk adds `3`.
- Cases are stale at 18 hours and revenue-critical at USD 75,000.
- Restricted tags are `billing-export` and `vip-contract`.
- Restricted or revenue-critical cases stay with their named owner.
- Low-severity, self-serve cases route to the `growth` lifecycle queue.
- Other cases use their named owner, falling back to `support-platform`.

## Known design risk

The queue policy is represented twice: `queuePolicy` in `src/data/cases.ts` and
`defaultPolicyMirror` in `src/services/caseRouter.ts`. Displayed routing uses the
first, while triage sorting uses the second. Drift can therefore produce an
incorrect ordering even when the card's routing hint looks correct. Keep both in
sync unless a scoped change deliberately establishes one source of truth.
