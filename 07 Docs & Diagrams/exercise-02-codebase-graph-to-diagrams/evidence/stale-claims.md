# Stale snapshot claims

Claims are listed in `docs/graph-snapshot.md` order. The generated graph at source SHA `b994b77c09961751c61eecc026db803bc0e4f0e2` is the machine-readable record; `selectNotificationRoute` is the behavior authority.

## STALE-01

Claim: `selectNotificationRoute -> pushAvailable`

Result: supported

Graph edge `calls:b4ecdcb068fb` and Source: `src/notification/routeNotification.mjs:6` call `pushAvailable(` before any other channel. DEP-01 maps that generated edge.

## STALE-02

Claim: `selectNotificationRoute -> smsAvailable`

Result: supported

Graph edge `calls:f625212c18d7` and Source: `src/notification/routeNotification.mjs:7` call `smsAvailable(` as the first fallback after push. DEP-02 records that call.

## STALE-03

Claim: `selectNotificationRoute -> immediateRoute` for every available provider

Result: rejected

Graph edge `calls:8aa0cc10c4a0` shows `selectNotificationRoute` does call `immediateRoute`, but only for a permitted channel. SMS availability alone no longer selects SMS. Source: `src/notification/routeNotification.mjs:6-8` requires consent before the SMS immediate route.

## STALE-04

Claim: `smsAvailable -> hasSmsConsent`

Result: rejected

The generated graph has no calls edge from `smsAvailable` to `hasSmsConsent`. Source: `src/notification/routeNotification.mjs:7` — `selectNotificationRoute` calls `hasSmsConsent` (DEP-03, `calls:d718da14f1cb`). Provider status does not own consent.

## STALE-05

Claim: `emailAvailable -> hasSmsConsent`

Result: rejected

No generated call from `emailAvailable` to `hasSmsConsent`. Source: `src/notification/consentPolicy.mjs` is only reached from the router. Email availability is independent of SMS consent.

## STALE-06

Claim: `immediateRoute -> durableQueueRoute` after provider failure

Result: rejected

The generated graph has no calls edge from `immediateRoute` to `durableQueueRoute`. Source: `src/notification/routeNotification.mjs:9` — `selectNotificationRoute` calls `durableQueueRoute` directly when no permitted immediate channel exists (DEP-06).
