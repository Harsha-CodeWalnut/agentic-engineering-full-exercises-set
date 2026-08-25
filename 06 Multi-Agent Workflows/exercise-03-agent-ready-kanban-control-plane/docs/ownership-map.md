# Ownership Map

| Requested path | Final reservation | Waiting card | Action taken |
|---|---|---|---|
| `src/utils/scoring.ts` | none | ESC-122 | ESC-120 merged; ESC-122 collision released. |
| `src/components/SeverityBadge.tsx` | none | ESC-122 | Released after ESC-120 integration. |
| `tests/esc-120/` | none | none | Lane-owned regression test merged with ESC-120. |
| `src/services/workflowApi.ts` | none | ESC-118 | Released until reproduction exists. |
| `src/services/exportApi.ts` | none | none | Released because ESC-121 is cancelled. |

After integration there are no active reservations. ESC-118 stays needs-info, ESC-121 stays cancelled, ESC-122 stays blocked by `RULE-ESC-122`, and ESC-120 is merged with released paths.
