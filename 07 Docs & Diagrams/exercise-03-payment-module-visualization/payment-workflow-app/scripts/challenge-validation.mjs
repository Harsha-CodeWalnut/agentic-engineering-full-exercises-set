import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
function verifyArchitecture(source, failures) {
  for (const node of ["CheckoutUI", "Orchestrator", "GatewayAdapter", "LedgerRecord", "ReceiptRecord", "WebhookHandler"]) if (!source.includes(node)) failures.push(`architecture diagram is missing ${node}`);
  const actual = [...source.matchAll(/^\s*(\w+)\s*-->\s*(\w+)\s*$/gm)].map((match) => `${match[1]}->${match[2]}`);
  const expected = [
    "CheckoutUI->Orchestrator",
    "Orchestrator->GatewayAdapter",
    "Orchestrator->LedgerRecord",
    "Orchestrator->ReceiptRecord",
    "GatewayAdapter->WebhookHandler",
    "WebhookHandler->LedgerRecord",
  ];
  for (const relation of expected) if (!actual.includes(relation)) failures.push(`architecture diagram is missing ${relation}`);
}

function verifySequence(source, failures) {
  for (const actor of ["Shopper", "CheckoutUI", "Orchestrator", "GatewayAdapter", "Ledger", "ReceiptNotifier", "WebhookHandler"]) {
    if (!new RegExp(`(?:participant|actor)\\s+${actor}\\b`).test(source)) failures.push(`sequence diagram is missing ${actor}`);
  }
  for (const block of [/alt\s+Authorization approved/i, /else\s+Authorization declined/i, /alt\s+First delivery/i, /else\s+Duplicate delivery/i]) if (!block.test(source)) failures.push(`sequence diagram is missing ${block}`);
  for (const term of ["authorization", "capture", "ledger", "receipt", "invalid signature", "unknown reference", "already-handled"]) if (!source.toLowerCase().includes(term)) failures.push(`sequence diagram is missing ${term}`);
}

function verifyData(source, failures) {
  const expected = [
    "CUSTOMER ||--o{ CHECKOUT_ORDER",
    "CHECKOUT_ORDER ||--|{ ORDER_ITEM",
    "CHECKOUT_ORDER ||--|| PAYMENT_INTENT",
    "PAYMENT_METHOD ||--o{ PAYMENT_INTENT",
    "PAYMENT_INTENT ||--o{ GATEWAY_TRANSACTION",
    "PAYMENT_INTENT ||--o{ LEDGER_ENTRY",
    "GATEWAY_TRANSACTION ||--o{ WEBHOOK_EVENT",
    "CHECKOUT_ORDER ||--|| RECEIPT",
  ];
  const relationshipLines = source.split(/\r?\n/).map((line) => line.trim()).filter((line) => /^\w+\s+\S+--\S+\s+\w+\s*:/.test(line));
  for (const relation of expected) if (!relationshipLines.some((line) => line.startsWith(`${relation} :`))) failures.push(`data diagram is missing ${relation}`);
}


export function validate(root) {
 const failures=[];
 verifyArchitecture(fs.readFileSync(path.join(root,"diagrams/payment-architecture.mmd"),"utf8"),failures);
 verifySequence(fs.readFileSync(path.join(root,"diagrams/payment-sequence.mmd"),"utf8"),failures);
 verifyData(fs.readFileSync(path.join(root,"diagrams/payment-data.mmd"),"utf8"),failures);
 const flow=fs.readFileSync(path.join(root,"diagrams/payment-flow.mmd"),"utf8");
 // Match labelled Mermaid flowchart edges, not stateDiagram transition syntax.
 const required=[["received","signature_check"],["signature_check","rejected"],["signature_check","reference_check"],["reference_check","rejected"],["reference_check","duplicate_check"],["duplicate_check","already_handled"],["duplicate_check","ledger_recorded"],["ledger_recorded","handled"]];
 for(const [from,to] of required) {
   const pattern = new RegExp("^\\s*"+from+"\\s*-->(?:\\|[^|]+\\|)?\\s*"+to+"\\s*$","m");
   if(!pattern.test(flow)) failures.push("missing payment flow edge "+from+" -> "+to);
 }
 assert.deepEqual(failures,[]);
}
