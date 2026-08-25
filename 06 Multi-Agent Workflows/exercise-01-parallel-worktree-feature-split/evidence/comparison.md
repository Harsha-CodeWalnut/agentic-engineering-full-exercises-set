# Comparison

Both the starter and the integrated product were measured from the same base SHA `94687b092fe695b5ce2f6a8848f8c26180bd09b5`, the same prompt, and the same three-lane ownership map.

| Topic | Planned / starter | Actual integrated result |
|---|---|---|
| Lane isolation | Three branches from one parent, owned paths only | Lanes A, B, and C each have one parent (`94687b092fe695b5ce2f6a8848f8c26180bd09b5`) and change only their owned files plus a `tests/lane-*` test |
| Shared types | A and C request promotion; no lane edits `src/types.ts` | Lane commits do not touch `src/types.ts`. `FilterPreset` and `EvidenceBundle` land in one later commit `9a3f736fc8d5476aba1b3fabd854338d662fc0e0` |
| Conflicts | Controlled conflict on shared types, not on owned files | `--no-ff` merges of B, A, C produced no content conflict. The type conflict was deferred and resolved once after Lane C |
| Merge history | B, then A, then C, then one shared-type commit | `be2538d` (B), `3fe66c9` (A), `effd619` (C), `9a3f736` (shared types). Lane blobs are unchanged by their merge commits |
| Worktrees | Three linked checkouts, then cleanup | `worktree-list-before.txt` records all three lane worktrees at their handoff SHAs. After verification they were removed |
| Final behavior | Saved High-priority Blocked preset, Due today metric, Export JSON | `npm run test:integrated` exit 0: 6 files, 9 tests passed. Starter focused checks at the base SHA all failed (see `evidence/commands/base-focused.txt`) |

Lane A remains independently testable with a local-then-promoted `FilterPreset`. Lane B needed no shared type. Lane C remains independently testable with a local-then-promoted `EvidenceBundle`. Rollback is `git revert` of the shared-type commit, then the three merge commits, or of an individual lane commit before merge.
