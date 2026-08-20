# Network boundaries

| Behaviour | File | Test | Network handler | User action | Assertion |
|---|---|---|---|---|---|
| Loading | `src/App.network.test.tsx` | announces loading while GET /api/cases is pending | `server.use(http.get("/api/cases", infinite delay))` | render dashboard | `getByRole("status")` is `Loading cases...` |
| Success | `src/App.network.test.tsx` | displays a successful GET /api/cases payload | default MSW `/api/cases` | render dashboard | `Northstar Health` is visible |
| Server-empty | `src/App.network.test.tsx` | shows server-empty copy when GET /api/cases returns no cases | `HttpResponse.json([])` | render dashboard | `No cases are assigned yet.` |
| Filtered-empty | `src/App.network.test.tsx` | shows a filtered-empty message without a new request | counted `http.get("/api/cases")` | type `unknown customer` | `No cases match "unknown customer".` and `requests` is 1 |
| Request error | `src/App.network.test.tsx` | shows a request error alert when GET /api/cases fails | 503 JSON | render dashboard | alert `We could not load cases` and Retry |
| Retry | `src/App.network.test.tsx` | retries with exactly one new GET /api/cases and recovers | first 503, then Recovered Co | click Retry | loading status, `Recovered Co`, `requests` is 2 |
| Unhandled | `src/test/setup.ts` | all tests | `server.listen({ onUnhandledRequest: "error" })` | any unexpected URL | MSW fails the test |
| Handler reset | `src/test/setup.ts` | afterEach | `server.resetHandlers()` plus RTL `cleanup()` | after every test | runtime `server.use` overrides do not leak |
