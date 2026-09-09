# After: field-based risk router

- Starting commit: e83928ed3c4d34fd51039c65b3d86373687cb259
- Implementation commit: 4dc431858ae24bea05e63e7e5d8f49201c64f4c6
- Agent and model: Codex (GPT-5)
- Tools and permissions: Codex desktop, local workspace-write shell, Git, Node.js 22.12.0, and protected offline scorer
- Time limit: 60 minutes
- Human hints: 0
- Retries: 0
- Patch SHA-256: 30665a96b0401bfbdcddcc68c19653884e1550764fefafb53435c822ce19e708

The implementation routes only from the structured `risk`, `ambiguity`, and `scope` fields. It applies clarification and safety precedence before considering cheaper lanes, ignores case IDs and wording, and defaults unrecognized combinations to `clarify`. Protected and learner routing checks passed before this source commit was recorded.

- Protected pack SHA-256: a854cf95252f93d1338ed1223ab6d9ae926c4d812a6951b18f5856c4a62ebe9e
- Measurement condition: three response-bound runs per eligible case-and-tier lane from the same protected synthetic benchmark pack
- Protected observations reconciled: 36 of 36
- Total expected cost: USD 0.048863
- Total expected latency: 11,520 ms
- Quality-floor failures: 4 first-call observations triggered escalation; 0 case-mean quality gate failures after pricing the policy
- Safety failures: 0 on every selected route
- Clarification count: 2
- All-reasoning savings: 51.2312861801 percent

The expected totals include one paired retry whenever a selected observation misses its quality floor or safety check. Fast escalates to balanced, balanced escalates to reasoning, and reasoning may retry reasoning once. No retry is averaged away and no clarification incurs model cost.
