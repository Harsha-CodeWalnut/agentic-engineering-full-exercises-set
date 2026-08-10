# Testing and verification

Run commands from `agent-onboarding-app`.

## Setup and local development

Install the locked dependencies when starting from a fresh checkout:

```bash
npm ci
```

Start the Vite development server at its printed local address:

```bash
npm run dev
```

## Individual checks

| Command | What it proves |
| --- | --- |
| `npm run lint` | Package/folder naming and lab-contract content pass repository checks |
| `npm run test` | The lab contract has concrete content and the routing service exists |
| `npm run format` | TypeScript, TSX, JavaScript module, and JSON files have no trailing whitespace |
| `npm run typecheck` | Source and Vite configuration pass strict TypeScript checking |
| `npm run build` | TypeScript and the Vite production bundle build successfully |

These repository tests are structural checks rather than unit tests of every
routing branch. Do not claim routing behavior is fully covered by `npm run test`.

## Required pre-review gate

Run the aggregate command before requesting review:

```bash
npm run agent:check
```

It runs lint, test, format, type checking, and a production build in sequence.
Report the command and its outcome in the PR.

## Manual checks by change type

For routing or policy changes, verify at least:

- restricted-tag and revenue-critical cases retain their named owner;
- stale cases receive the intended action and score adjustment;
- low-severity self-serve cases route to `growth`;
- ordinary cases retain their named owner or use the configured fallback;
- cards are sorted from highest to lowest risk;
- the displayed policy description matches configured thresholds.

For UI changes, verify all status filters with keyboard and pointer input,
confirm the visible count and cards update, and inspect a narrow and wide
viewport. Browser console errors are failures.

If dependencies cannot be installed or a check cannot run, do not silently skip
it. Record the command, failure reason, and unverified risk.
