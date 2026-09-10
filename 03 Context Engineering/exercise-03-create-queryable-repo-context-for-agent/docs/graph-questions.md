# Repository questions

Use these questions before indexing and again with the graph. Record the exact query or traversal, output, source check and unresolved parts.

1. Architecture: which entry points produce recognized-revenue summaries?
2. Dependencies: which shared calculation and account mapping do those entry points depend on?
3. Data flow: trace an event from tenant to billing-account dashboard total and scheduled snapshot.
4. Business rules: how do refunds and credits affect recognized revenue, and how does gross volume differ?
5. Ownership: who owns the current metric decision and who owns its consumers? How do older notes differ?
6. Change impact: which consumers and tests need checking if the recognized-revenue rule changes?

Demonstrate one fresh agent using the graph and one human-run CLI query. Report empty, inferred or unsupported graph results honestly and verify them against original source files.
