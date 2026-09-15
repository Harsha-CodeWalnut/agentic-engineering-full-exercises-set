RUN_NONCE: 20fff9d4-7073-4f10-9123-599585609dd9

Review this code change against every acceptance rule below. Return one JSON object containing runNonce, sessionId, mergeDecision, and findings. Each finding needs an arbitrary unique id, severity, file, an exact added-line anchor, the acceptance-rule text it evaluates as requirement, behavior, impact, reproduction, recommendation, and blocking. Do not invent a blocker when the diff conforms.

Acceptance rules:
- The helper returns due-date order without mutating its input array.

Diff:
diff --git a/src/utils/sort.ts b/src/utils/sort.ts
--- a/src/utils/sort.ts
+++ b/src/utils/sort.ts
@@ -1,3 +1,3 @@
 export function byDueDate(items) {
-  return items.slice().sort((a, b) => a.dueInDays - b.dueInDays);
+  return [...items].sort((a, b) => a.dueInDays - b.dueInDays);
 }
