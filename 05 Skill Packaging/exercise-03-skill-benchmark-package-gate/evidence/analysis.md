# Training failures and held-out decision

## Training failures that motivated the skill change

The starter skill produces polished sections but does not require source citations, fact versus inference labels, a recovery boundary, or preserved follow-up state.

Training eval 1 failed because reports treated 09:11 retry disablement as recovery instead of the 09:24 healthy probes, and they omitted event and impact identifiers. Training eval 2 failed because reports picked one cause, dropped the conflicting notes, and closed the still-open Reliability review.

The candidate skill therefore requires a cited source on each claim, records recovery only at the final healthy signal, labels unresolved notes as inference or uncertainty, and keeps proposed or open follow-up work open. Fixture IDs and eval filenames were not copied into the skill.

## Held-out comparison

Held-out evals 3 and 4 were graded only after the skill was frozen. Candidate held-out quality is 1.00 versus 0.00 without a skill and 0.20 with the starter. Every critical held-out assertion passed on all six candidate runs. Held-out pass-rate variance is 0.00; there was no outlier run.

Mean tokens fell from 1410 (no-skill) and 1292 (starter) to 982. Mean elapsed time fell from 48.4s and 44.1s to 31.8s. Token and elapsed ratios versus no-skill are 0.697x and 0.658x, inside the 1.50x and 2.00x ceilings.

## Adoption

Adoption: package. Quality-improvement mode applies because both baselines are below 95 percent. The candidate beats each baseline by at least 10 percentage points, preserves critical accuracy, and does not add cost.
