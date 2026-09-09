# Before: all-reasoning baseline

- Starting commit: e83928ed3c4d34fd51039c65b3d86373687cb259
- Implementation commit: 56fa9724b94801b3e245e9d15bc90189c8a2904a
- Agent and model: Codex (GPT-5)
- Tools and permissions: Codex desktop, local workspace-write shell, Git, Node.js 22.12.0, and protected offline scorer
- Time limit: 60 minutes
- Human hints: 0
- Retries: 0
- Patch SHA-256: 6361554bba6156cea4b31c92a9c3c6c02ac982a5bf61e56bf1df49f2383de8e5

The baseline preserves the original behavior: every representative task is sent to the reasoning lane, regardless of risk, ambiguity, or scope. A focused baseline test passed 1 of 1 checks. The patch is non-empty and reproducible from the shared starting commit.

- Protected pack SHA-256: a854cf95252f93d1338ed1223ab6d9ae926c4d812a6951b18f5856c4a62ebe9e
- Measurement condition: three response-bound runs per eligible case-and-tier lane from the protected synthetic benchmark pack
- Executable benchmark cases priced: 6
- Total expected cost: USD 0.1001933333
- Total expected latency: 15,899 ms
- Quality-floor failures: 0 reasoning observations below their case floor
- Safety failures: 1 reasoning observation; its paired reasoning retry cost and latency are included
- Clarification count: 0, exposing the baseline defect for missing-risk and high-ambiguity tasks

The protected scorer defines the all-reasoning cost over the six executable cases because the two clarification cases have no eligible model observations. This is conservative: the baseline router would still try to execute those unclear tasks, but no ungrounded cost is invented for them.
