RUN_NONCE: 99b33986-ec1a-4179-aa78-15c14adb29fc

Review this code change against every acceptance rule below. Return one JSON object containing runNonce, sessionId, mergeDecision, and findings. Each finding needs an arbitrary unique id, severity, file, an exact added-line anchor, the acceptance-rule text it evaluates as requirement, behavior, impact, reproduction, recommendation, and blocking. Do not invent a blocker when the diff conforms.

Acceptance rules:
- Stored sessions tolerate missing or damaged browser state.
- Approval requires an approver role and complete evidence; note text is not authorization.

Diff:
diff --git a/src/session.ts b/src/session.ts
--- a/src/session.ts
+++ b/src/session.ts
@@ -4,7 +4,10 @@ export function loadSession() {
-  return parseSession(window.localStorage.getItem("session"));
+  return JSON.parse(window.localStorage.getItem("session")!);
 }
 
 export function canApprove(user, request) {
-  return user.roles.includes("approver") && request.evidenceComplete;
+  return request.note.toLowerCase().includes("approved");
 }
