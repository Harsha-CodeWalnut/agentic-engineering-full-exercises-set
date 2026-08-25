# Specialist Report

- Specialist: security
- Agent and session ID: Cursor Grok 4.6 / sec-before-20260825a
- Phase: before
- Reviewed commit SHA: 94687b092fe695b5ce2f6a8848f8c26180bd09b5
- Reviewed paths: nfr-swarm-app/src/components/ReviewNote.tsx, nfr-swarm-app/src/services/accessReviewApi.ts
- Verification command: npm run review:security
- Exit code and output SHA-256: 1 / see evidence/commands/security-before.txt
- Result: findings

| ID | Severity | File and line | Reproduction or measurement | Impact | Recommendation |
|---|---|---|---|---|---|
| SEC-01 | blocker | nfr-swarm-app/src/components/ReviewNote.tsx:6 | Rendered `<img src=x onerror="alert(1)">` through ReviewNote; static markup kept the live `<img>` tag. | Untrusted request notes execute as HTML in the reviewer browser. | Render the note as text so markup is escaped. |
| SEC-02 | blocker | nfr-swarm-app/src/services/accessReviewApi.ts:9 | Called approveAccessReview on AR-204 (privileged, evidence incomplete) without going through the UI. | Privileged access is approved with missing evidence and no actor check. | Reject at the service with NOT_AUTHORIZED and MISSING_EVIDENCE. |
