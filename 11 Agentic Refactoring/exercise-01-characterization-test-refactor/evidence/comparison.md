# Controlled Attempt Comparison

## Same conditions

Both runs started from `fb48d936ec2e6e205478614a4af4d2550662f650` and used fresh Codex delegated-agent sessions with the same fixed request, inherited model configuration, tools, permissions, ten-minute limit, zero human hints, and zero retries. The controlled difference was the after run's participant-created characterization commit `3c8f5a2ead88d80486fe38ac5b44b1fcccb76e2b`.

## Before

The unconstrained implementation is commit `07d226264070300c375ea7c0a5c6eeaa49584197`. Its patch SHA-256 is `ca5fbae1e73b26aabe7ed767ffbe036c3280aa3180de09315a4a2c9555ad6188`. It changed only `legacyEligibility.mjs`, added 15 lines, removed 17, and changed zero of twelve protected outputs.

## After

The characterization-first implementation is commit `de514bd6446e81cf37a3852c4cbc30b42d960a3b`. Its run base is the characterization commit, and its patch SHA-256 is `a3aec06590b3fd36aac8db9b60dc73c35ce86147cbc2bf881209d58dffe8fe63`. It changed only `legacyEligibility.mjs`, added 36 lines, removed 20, and changed zero protected outputs.

## Proof

Both output snapshots have SHA-256 `9485e152e5d4da6a7085fdb5f7f7cd444c100a68b039667cfebd373fc5089b6b` and compare byte-for-byte equal. Statuses, discounts, result fields, exact reason strings, negative-value validation gaps, support-override precedence, and tenure boundaries are unchanged. The characterization test uses only the public export and consumes every case in the protected fixture without hardcoding a case count. Git history proves the source-only refactor commit directly follows the characterization commit, while later commits are evidence-only.

## Conclusion

Both first attempts preserved public behavior, but the after workflow adds independent pre-committed observations, mutation-sensitive public characterization, exact history proof, and automatically captured verification. The patches differ structurally, so this run does not rely on the identical-patch allowance.
