# Exercise Setup, Time, and External Runs

Use this guide before starting an exercise. Setup problems should not consume the challenge time or be confused with exercise difficulty.

## Time Meaning

The duration in each README is a target for active challenge work after dependencies, required tools, and the starter application are ready. The first attempt may take longer while learning the competency. Evidence preparation and external model queues also vary by environment.

## Base Setup

Unless the local README says otherwise, prepare:

- Git and a GitHub account able to create branches and pull requests.
- Node.js `22.12` to `24` and npm.
- A coding agent that can open the repository and report its model, tools, permissions, and run conditions.
- Dependencies installed with `npm ci` inside the exercise application.

Run the starter smoke or integrity command before timing the challenge. Use the exercise's `npm run verify:exercise` only after completing the work.

On Windows, use a short checkout path such as `C:\work\exercises`. If Git reports a filename-length error, run `git config core.longpaths true` inside this checkout. This is particularly relevant to the nested Java source paths.

## Additional Prerequisites

| Exercise type | Prepare before timing |
|---|---|
| Browser and accessibility | Playwright Chromium and any named browser or MCP integration. Use the local setup check when supplied. |
| Semgrep review | Python 3 and Semgrep installed with `python -m pip install semgrep`; confirm with `semgrep --version`. |
| Java or full-stack provider | A supported JDK. Use the committed Maven wrapper where supplied. The brownfield onboarding starter uses JDK 21 directly through npm scripts; it does not need Maven. |
| Multi-agent worktrees | Git worktree support and enough disk space for parallel working directories. |
| Diagram or knowledge-graph tools | The named service and its authentication when the tool is the competency being tested. |
| Model evaluation and benchmarking | Access to one fixed model/runtime, permission to record run metadata, and enough quota for every first-attempt run. |

A tool or skill is mandatory when the README explicitly requires it, including comparisons with and without it. Alternatives marked optional are not required. If no tool or skill is specified, choose one that meets the exercise's output and evidence requirements.

## Required Agent Sessions

Prepare the full session count before starting a multi-agent exercise. These are separate coding-agent sessions, not hidden API calls:

| Exercise | Minimum fresh sessions |
|---|---:|
| 3.1 Session Handover from Claude to Codex | 1 preparation session using Handoff, then 1 fresh Codex continuation; the prior Claude session is a supplied training snapshot |
| 3.2 Generate AGENTS.md for a Brownfield Repository | 2 implementation sessions under identical conditions, without and with onboarding |
| 7.4 Extract a Domain Model from the Entire Repository | A discovery session plus 1 fresh agent session that answers business questions using only the submitted business documents |
| 6.1 Parallel Worktree Conflict Rescue | 3 implementation sessions, one per lane |
| 6.2 Specialist Review Merge Gate | 8 review-only sessions: 4 baseline reviews and 4 fresh rechecks |
| 9.3 Code Review Skill Hardening | 6 review sessions: 3 without the skill and 3 fresh sessions with the skill |

The integration owner checks and combines the outputs. Do not reuse one session across required lanes, specialists, or rechecks.

For 3.3, prepare Graphify using the exercise's setup guide before timing the challenge. For 7.4, prepare Domain Analysis from Tech Leads Club and Domain Modeling from Matt Pocock using the exercise's setup guide. Record each skill's revision and use. Apply only business-domain analysis: the glossary and domain document must not contain architecture or implementation recommendations. Diagram exercises use Mermaid parsing locally and do not require a hosted diagram account.

For 3.1, install Matt Pocock's Handoff skill before the timer. For 7.1 and 7.3, install Design Doc Mermaid; Draw.io and Excalidraw are optional visual copies in 7.3, not replacements for checked Mermaid files. For 7.2, install Acquire Codebase Knowledge and its Python 3.8+ dependency. Its investigation produces one consolidated design document for this challenge, not seven final reports. Each setup guide explains installation, output differences, and the required skill-use evidence.

## Repeated Model Runs

Exercises with repeated agent decisions or benchmarks can require many calls. Read the run matrix before starting, calculate the required calls, and confirm quota and cost with your provider. Record the exact model, runtime, sampling settings or defaults, and raw result required by the local evidence template.

Provider queue and response time is not part of the active challenge target. Record the actual elapsed time because it is still part of the benchmark and completion effort.

| Exercise | Minimum measured model runs |
|---|---:|
| 5.2 Skill Trigger Boundary Evals | 120 decisions: 20 requests x 3 runs x before and after |
| 5.3 Skill Benchmark and Package Gate | 36 runs: 4 tasks x 3 lanes x 3 runs |
| 12.3 Trace-Backed Workflow Optimizer | 48 runs: 8 cases x 3 runs x baseline and candidate |

Estimate cost before starting from the provider's current input and output token rates. Use the largest allowed response and the full run count as the approval ceiling. The repository does not publish a fixed currency estimate because model prices and prompt sizes change.

Do not silently replace failed provider calls, selectively rerun weak results, or mix models. If the provider fails, record the failed run and restart the complete comparable set under one environment.

Exercises 9.3 and 10.2 do not make provider API calls during verification. Exercise 9.3 uses six interactive coding-agent sessions, and Exercise 10.2 uses a protected offline pack of 36 recorded measurements.
