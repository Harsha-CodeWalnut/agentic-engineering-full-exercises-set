# Contradictions

Recorded against `docs/legacy-workflow-description.md` and the progress projection in `workflow-reconstruction-app/src/workflow.tsx`. Diagrams follow `nextStepFor` and the protected scenario traces, not the disputed claims.

## LEG-01

Claim: all requests move from manager approval directly to data-owner approval, so the high risk security route is absent.

Source: `workflow-reconstruction-app/src/workflow.tsx:71-77` (`EDGE: WF-03`). High-risk `manager-approved` requests enter `security-review` before data-owner review. The protected `highRisk` trace is `draft → submitted → manager-approved → security-review → data-owner-review → provisioning → provisioned`.

Decision: the state and approval diagrams show the high risk branch to `security_review`. The legacy skip is not copied.

## LEG-02

Claim: security review happens outside this application and does not affect routing.

Source: `workflow-reconstruction-app/src/workflow.tsx:71-95`. Security is an in-application status, actor, and required hop on the high-risk path (`Policy engine` then `Security`).

Decision: the approval sequence keeps Security as an application participant under `alt High risk`. Routing is not drawn as an external sidecar.

## LEG-03

Claim: provisioning failures retry automatically until access is granted.

Source: `workflow-reconstruction-app/src/workflow.tsx:108-131`. Unhealthy provisioning goes to `failed-provisioning`, then `rollback-requested`. There is no `failed-provisioning → provisioning` automatic retry edge. The UI retry button only flips `provisioningHealthy`; advancing still requests rollback.

Decision: diagrams omit automatic retry and show rollback after failure.

## LEG-04

Claim: rollback and identity-administrator actions are outside the application, so the only completed workflow state is provisioned.

Source: `workflow-reconstruction-app/src/workflow.tsx:125-140`. `Identity admin` removes partial access and closes rollback into `rolled-back`. The failure trace ends at `rolled-back`.

Decision: the state diagram ends both `provisioned` and `rolled_back` at `[*]`. The failure sequence includes IdentityAdmin completing rolled-back.

## CODE-01

Claim: the workflow map progress display is a faithful history of stages the request entered.

Source: `workflow-reconstruction-app/src/workflow.tsx:19` `completedStagesByStatus` for `data-owner-review` always includes `security-review`. On the normal path, `nextStepFor` never enters security, but `buildFlowSteps` still marks `security-review` complete.

Decision: diagrams follow `nextStepFor` and traces, not the progress projection. The UI conflict is recorded here and is remaining ambiguity, not silently resolved.
