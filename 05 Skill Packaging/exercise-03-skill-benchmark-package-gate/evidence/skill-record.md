# Skill creator record

Used the official skill-creator workflow to keep the incident-summary skill concise, add source/fact/inference/uncertainty/recovery/follow-up rules, and leave fixture identifiers out of the package.

- Source: https://github.com/anthropics/skills/tree/main/skills/skill-creator
- Source commit: 3b3fad96af16a10759d930941b4520ba0c40edae
- Installed path: 05 Skill Packaging/exercise-03-skill-benchmark-package-gate/.tooling/skill-creator/SKILL.md
- SKILL.md SHA-256: dcd4803e61e913e6fc27294184cd3a71f09f5e924ff20c8a9a20173e7b3c2bcf
- Installation: copied `skills/skill-creator` from a shallow clone of https://github.com/anthropics/skills.git at the source commit above.

## Benchmark environment

All 36 first-attempt runs used the same conditions:

- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Runtime: Cursor agent
- Tools: file read, shell
- Permissions: workspace write and command execution
- Time limit: 10 minutes
- Repository commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Attempt: 1
