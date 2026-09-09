# Context comparison

## Same conditions

Both first-attempt sessions began from commit 499720baf853dead97eb25e59a6a852ca9100788. Both used Codex CLI 0.153.4 with gpt-5.6-sol at medium reasoning, the workspace-write sandbox, approval set to never, the same 75-minute limit, the same adapter request, the same tools, zero human hints, and zero retries. The selected-context lane additionally contained the required plan-only commit before implementation.

## Before

The unbudgeted lane loaded all six catalog documents: 2,885 exact UTF-8 bytes. It therefore received the mandatory rules and current adapter contract, plus the current error contract, a stale migration note, the UI guide, and the audit-retention policy. Four sources were stale or unnecessary for the initial question. Its patch changed the adapter and one learner test file. The protected adapter contract and 6 learner tests passed with 0 failures.

## After

The deterministic lane selected the mandatory repository rules first and the relevant current adapter contract next. It loaded 1,327 bytes, stayed below the 2,000-byte maximum, and left 673 bytes. It skipped the stale migration note and three irrelevant current documents with an explicit reason for each. It missed no mandatory source and had no unresolved tag, so it was not expanded. Its protected adapter contract and 8 learner tests passed with 0 failures.

## Proof

The ledger reproduces the selector output and accounts for every catalog source. The before patch hash is 327b6a18fd28041e221b40b82c014aeb011d3dc754b58737b0458a9ea6446227. The after patch hash is 44b246db52117a91bb513e294c096850c9d81a9b161ccc0e3158ce8bf37a9176. Both patches apply to their recorded run base and replay through the same protected acceptance runner. The plan commit f54eb0bfd7f0fbde5f8fcf76f01654b4095c5756 directly precedes the four-file implementation commit 9f3a0e170711bc67e9888335799b171805475895.

The selected lane reduced catalog context by 1,558 bytes, or 54.0%. This measurement covers exact documentation bytes; it does not claim an exact tokenizer count or monetary saving.

## Conclusion

The selected context preserved correctness while removing stale and irrelevant catalog input. The reduced-context attempt passed the same protected adapter contract and added more focused learner cases than the full-context attempt. The result supports progressive, question-driven context loading for this task.
