# Comparison

## Fair Comparison

Both first attempts started from commit `94687b092fe695b5ce2f6a8848f8c26180bd09b5`. Both received the same incident request, agent, model, tools, permissions, 30-minute time limit, zero human hints, and attempt 1. The before session used the raw session history with the Handoff skill disabled. The after session used only `evidence/handoff.md` with the Handoff skill enabled. The after branch does not contain the before implementation commit `7f4028612bc43744b185c84c0db4ffe03fd1716d`.

## Results

Requirement selection: both sessions followed the approved 48-hour High-priority rule in `docs/current-sla-policy.md` instead of the draft 24-hour pilot. Owner preservation: both kept existing owners and did not move cases to Incident Desk. Manual escalations: both left `INC-2047-D` manual with owner Nikhil. Verification: `npm run test:incident` passed in both sessions with exit code 0 and 10 checks. The after session also recorded `npm run test:handoff` and `npm run agent:check`, both exit code 0. Files changed: 2 in each patch (`escalationPolicy.ts` and `workflowApi.ts`). Lines: before `+3 / -7`; after `+4 / -6`. The implementations differ: the after patch cites the current SLA in the policy module and saves cloned queue state before returning copies.

Context: before supplied 504 words of mixed raw session history, including stale completion claims. After supplied 687 words of verified handoff with named sources. The after agent did not receive the raw session history. The compact handoff removed the draft threshold, Incident Desk reassignment, false completion claim, scoring detour, and unrelated export error, and it named `npm run test:incident` as the incident contract.

## Conclusion

The verified handoff improved the implementation path. Both first attempts produced a correct SLA fix, so incident tests are not the difference. The after session reached that result from current policy, workflow contract, and remaining-work notes only, without the raw session history. The after patch is a different implementation: it persists cloned saved state to match the workflow contract, and it does not carry the draft-owner path. Context quality, not context size, is what changed: 687 verified words replaced 504 contradictory ones. See `evidence/before.patch` and `evidence/after.patch`.
