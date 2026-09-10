# Four payment views

Submit exactly these four Mermaid files:

Use Design Doc Mermaid for these checked views. Optional Draw.io or Excalidraw copies follow [setup.md](./setup.md); they are supplemental, not substitutes for these four files. No automatic native-format conversion or validation is implied.

| File | Diagram type | Question it answers |
| --- | --- | --- |
| `diagrams/payment-architecture.mmd` | `flowchart LR` | Which components and external systems interact? |
| `diagrams/payment-sequence.mmd` | `sequenceDiagram` | In what order do checkout, payment and webhook interactions happen? |
| `diagrams/payment-flow.mmd` | `flowchart TD` | Which decisions accept, reject or ignore a webhook, and what happens next? |
| `diagrams/payment-data.mmd` | `erDiagram` | How do the module's records relate to each other? |

Use source entity names for the data view and these aliases for semantic checks:

- Architecture: CheckoutUI, Orchestrator, GatewayAdapter, LedgerRecord, ReceiptRecord, WebhookHandler.
- Sequence: Shopper, CheckoutUI, Orchestrator, GatewayAdapter, Ledger, ReceiptNotifier, WebhookHandler. Use alternatives Authorization approved / Authorization declined and First delivery / Duplicate delivery.
- Flow: received, signature_check, reference_check, duplicate_check, rejected, already_handled, ledger_recorded, handled. Put labelled decisions on separate `from -->|condition| to` lines; define node shapes on separate lines.

Find the relationships and their ordering from the code. Cite every diagram relationship in `evidence/source-audit.json`. All four views must agree with the same source snapshot. The reconciler is already functional; a webhook repair is not part of this challenge. The supplied old incident and feature brief contain historical claims to audit.
