# After trigger measurement

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Provider: Cursor
- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Runtime: Cursor agent skill catalog
- Settings: temperature runtime default
- Description SHA-256: `a1adc3bcfdc4d9e73cb603b9d788c0727364bef22b6ca30693f787c04cdeae06`
- Decisions: 60 (20 protected requests × 3 runs)
- Result file: `evidence/after-results.json`

Only the `change-review` description changed. Neighboring skills, scoring code, protected prompts, provider, agent, model, runtime, and settings were unchanged. Catalog routing selected `change-review` for evidence-backed review of a supplied code change and routed release and incident requests to their own skills.

Training majority accuracy 12/12. Held-out majority accuracy 8/8. Precision 1.00. Recall 1.00. Specificity 1.00. Unanimous decision rate 1.00.
