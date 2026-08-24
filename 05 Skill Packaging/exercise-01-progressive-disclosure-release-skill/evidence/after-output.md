# Release notes

## Customer-facing changes

### Checkout retry after declined cards

Customers can retry a payment after a declined card and see a clearer decline message.

- Trace: src/checkout.js
- Verification: unit tests passed (CI-881-unit); browser test passed (CI-881-e2e); screenshot missing.

### Billing export field rename

Breaking change. The exported invoice field `invoiceTotal` is now `total`. Customers must migrate consumers of the previous field to `total`.

- Trace: src/billing-export.js
- Verification: provider contract passed (CI-884-pact); migration dry run missing.
