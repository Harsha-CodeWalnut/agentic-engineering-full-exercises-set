# Review Eval Report

- Agent and model: codex-cli / gpt-5.6-luna
- Adapter SHA-256: `8cc5a2230bee6ba25fae08ca15bdee4e9965465ba2e5157483601fd648129b71`
- Starting SHA: `63f5e8f1b35cdc3937b7e1c35873d32c78607aa0`
- Baseline source SHA: `611707e0597970bf5ca0c993c4caf07da6d43b0f`
- Skill source SHA: `3310130c3bc573963c6b4b17ebc402c216aa0bb7`
- Time limit and permissions: 10 minutes / repository-read / sandbox-read-only
- Runner SHA-256: `8b612cb4ac227704b0b05e4b8179926dc378ce76b817a5d822e11011e62cbaae`
- Raw results: six nonce-bound run and transcript pairs under `evidence/runs/` and `evidence/transcripts/`

| Lane | Historical coverage | Security coverage | Precision | Clean control |
|---|---:|---:|---:|---:|
| Baseline | 100% | 100% | 100% | approved |
| Skill-assisted | 100% | 100% | 100% | approved |

## Analysis

The Baseline lane missed no protected acceptance rules. It reported five supported blockers for the historical regression, two supported blockers for the security regression, and no finding for the clean control. No labels were disputed because every blocker matched an exact supplied rule and exact added-line anchor.

The Skill-assisted lane produced the same coverage totals and clean-control decision. Its seven blockers were all supported, giving 100% precision. The skill neither inflated the finding count nor converted the safe change into a false blocker. Historical coverage, security coverage, precision, and clean control therefore have zero negative regression versus baseline.

The baseline ceiling means this run cannot claim a numerical coverage improvement. The useful evidence is that the reusable workflow preserves perfect detection and precision while requiring explicit reproduction, severity, code anchor selection, rule mapping, and dismissal of unsupported claims. A future evaluation with harder unseen cases would be needed to quantify incremental recall.

## Decision

Adopt. The generated scorecard passes historical Coverage, security Coverage, Precision, Clean control, and no-regression gates. This decision follows the protected scorer and does not overstate a measured lift that did not occur.
