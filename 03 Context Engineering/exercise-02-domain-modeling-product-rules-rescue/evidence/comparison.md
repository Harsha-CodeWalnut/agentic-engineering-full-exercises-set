# Comparison

## Fair Comparison

Both first attempts started from commit `94687b092fe695b5ce2f6a8848f8c26180bd09b5`. Both used the same production request, agent, model, tools, permissions, 30-minute time limit, zero human hints, and attempt 1. The before session used the supplied repository with the Domain Modeling skill disabled. The after session used only `CONTEXT.md` with the Domain Modeling skill enabled. The after branch does not contain the before implementation commit `4fec3255df23b53dfceef29a2cfe91f082cc3be0`.

## Results

Vocabulary: after kept billing customer, user, workspace, membership, role, and data residency distinct and named `eligibleWorkspace` and `authorizedAdministrator` in code. Source selection: after followed `docs/current-access-policy.md` via `CONTEXT.md` and did not encode the Growth or account-owner draft. Authorization: both blocked Growth, restricted data residency, suspended memberships, members, cross-workspace admins, other users' memberships, and billing owners without membership. Verification: `npm run test:rules` passed in both sessions with exit code 0 and 8 checks. After also recorded `npm run test:domain` and `npm run agent:check`, both exit code 0. Context: before searched the full supplied repository, including superseded notes. After received 368 words of canonical terms. Files changed: 1 in each patch (`aiHistoryExportPolicy.ts`). Lines: before `+15 / -5`; after `+18 / -5`. The patches differ.

## Conclusion

The domain model improved the implementation path. Both first attempts produced a correct authorization function, so the eight rule checks are not the difference. The after session reached that result from precise vocabulary only, without the previous implementation or extra explanation. It mapped the glossary onto named conditions instead of a boolean chain that still happened to match current policy. See `evidence/before.patch` and `evidence/after.patch`.
