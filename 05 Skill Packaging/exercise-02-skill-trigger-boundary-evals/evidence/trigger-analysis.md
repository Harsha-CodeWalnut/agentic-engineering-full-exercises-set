# Training trigger analysis

Training false positives from the original description, which selected `change-review` for every request:

| Case | Failed boundary | Why it fired |
|---|---|---|
| `train-release` | release notes | "Summarize changes" matched customer release communication |
| `train-incident` | incident report | A summary request was treated as change feedback |
| `train-implementation` | implementation | Applying reviewer comments was treated as review |
| `train-debugging` | debugging | Reproducing and fixing a failure was treated as review |
| `train-pr-summary` | pull request writing | Writing a PR description is a summary of changes, not an inspection |
| `train-review-advice` | general guidance | Explaining how to review was treated as doing a review |

Training false negatives: none. Every true review request already activated.

Description change made in response: name the artifacts under review (diff, branch, commit, pull request, patch), require defect or merge-risk findings, and add explicit non-use text for implementing, debugging, release notes, incidents, design documents, approved-change summaries, and review-practice advice. Training case wording was not copied into the description. Held-out prompts were not used for tuning.
