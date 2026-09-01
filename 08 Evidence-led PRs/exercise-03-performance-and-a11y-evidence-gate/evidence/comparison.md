# Performance and Accessibility Evidence

Source SHA: 0d826991ec491eecc0b29688311a87634be9848d

Route: /

Release decision: PASSED

## Before and after

| Metric | Protected baseline | After, pessimistic | Required |
| --- | ---: | ---: | ---: |
| Performance | 0.82 | 1.00 | >= 0.90 |
| Accessibility | 0.91 | 1.00 | = 1.00 |
| LCP | 3380 ms | 1356 ms | <= 2500 ms |
| Axe violations | 1 | 0 | = 0 |

## Comparable environment

- Lighthouse runs: 3
- Aggregation: pessimistic
- Chrome major: 152
- Form factor: mobile
- Throttling: simulate
- Axe browser: chrome 152.0.7977.65
- Production route: /

## Raw artifact trace

| Artifact | SHA-256 | Performance | Accessibility | LCP |
| --- | --- | ---: | ---: | ---: |
| run-1.json | 81330a0b724cc6fcbe3dc3acbd37b54a335cab4ed78b1cfe998bbdb5d169c22c | 1.00 | 1.00 | 1356 ms |
| run-2.json | 1d2b81191c1f3a66583e102d225673cb8516395f9964b8ff5ebbae74e127b347 | 1.00 | 1.00 | 1355 ms |
| run-3.json | 24f98fbe95534979ab937cb81a2cc2910ee3bb4e6251bd2ecd5f7a490b8f3197 | 1.00 | 1.00 | 1353 ms |

Axe artifact SHA-256: c3db2b926f946d956f0ba88523bccd2e41e48d8d64497964ad70ac0c845943c5

## Failure-path proof

The protected verifier changes one Lighthouse run below the performance threshold and injects one axe violation. The submitted gate must write a failed decision and return non-zero for both cases.

## Residual risk

Lighthouse results can vary across hardware even with pessimistic aggregation. Automated axe checks do not replace keyboard, screen-reader, zoom, or usability review. Re-run this gate in the review environment and complete focused manual accessibility checks before release.
