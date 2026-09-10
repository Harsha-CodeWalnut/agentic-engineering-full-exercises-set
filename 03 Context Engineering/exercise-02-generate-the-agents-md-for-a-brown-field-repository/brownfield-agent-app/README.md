# Brownfield support repository

Java 21 application for workspace support cases. The customer case-list service and an older support-admin export coexist. Workspace reporting is the next requested change.

From this folder run `npm ci`, then `npm run dev` to view the current case-list demo. `npm test` checks existing behaviour. `npm run test:acceptance` checks the requested reporting feature and is expected to fail until it is implemented. Compilation and test output use a temporary directory.

Read [the exercise](../README.md) and [change request](../docs/change-request.md). Java 21 JDK, Node.js, npm and Git are required. No Maven installation, server or paid API is needed.
