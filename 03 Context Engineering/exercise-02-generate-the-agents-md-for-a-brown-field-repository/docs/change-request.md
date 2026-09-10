# Workspace case summary

Add the workspace summary operation exposed by ReportController.summary(user, workspace).

An active member can see only their selected workspace's summary. Return the number of open cases and the age of its oldest open case in complete hours, measured using the supplied clock. Closed cases do not count. An empty workspace returns zero for both values. A future opening time contributes zero hours.

Deny access when the requester has no active membership in that workspace, even if they have access to another workspace. Preserve existing case-list behaviour and avoid mutating stored records. Keep the existing public operation signature.

The same request applies to both agent attempts. Documentation must teach repository practices, not provide this operation's implementation.
