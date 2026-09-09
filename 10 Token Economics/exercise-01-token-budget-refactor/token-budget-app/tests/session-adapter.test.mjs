import assert from "node:assert/strict";
import test from "node:test";

import { adaptSession, SessionAdapterError } from "../src/session/adaptSession.mjs";

function assertSessionError(input, code, message) {
  assert.throws(
    () => adaptSession(input),
    (error) =>
      error instanceof SessionAdapterError &&
      error.name === "SessionAdapterError" &&
      error.code === code &&
      error.message === message,
  );
}

test("returns only public fields and preserves serialized session values", () => {
  const result = adaptSession({
    userId: "user-17",
    roles: ["agent", "reviewer"],
    expiresAt: "2026-08-14T10:30:00.000Z",
    ignored: "value",
  });

  assert.deepEqual(result, {
    userId: "user-17",
    roles: ["agent", "reviewer"],
    expiresAt: "2026-08-14T10:30:00.000Z",
  });
  assert.equal(
    JSON.stringify(result),
    '{"userId":"user-17","roles":["agent","reviewer"],"expiresAt":"2026-08-14T10:30:00.000Z"}',
  );
});

test("deduplicates roles by first occurrence while preserving order", () => {
  const result = adaptSession({
    userId: "user-17",
    roles: ["reviewer", "agent", "reviewer", "admin", "agent"],
    expiresAt: "2026-08-14T10:30:00Z",
  });

  assert.deepEqual(result.roles, ["reviewer", "agent", "admin"]);
});

test("accepts an empty roles array and preserves an ISO timestamp without milliseconds", () => {
  const result = adaptSession({
    userId: "user-18",
    roles: [],
    expiresAt: "2026-08-14T10:30:00Z",
  });

  assert.deepEqual(result, {
    userId: "user-18",
    roles: [],
    expiresAt: "2026-08-14T10:30:00Z",
  });
});

test("rejects a missing userId before validating expiry or roles", () => {
  assertSessionError(
    { roles: [null], expiresAt: "bad" },
    "SESSION_USER_REQUIRED",
    "Session userId is required",
  );
});

test("rejects an invalid expiry before validating roles", () => {
  assertSessionError(
    { userId: "user-19", roles: "admin", expiresAt: "bad" },
    "SESSION_EXPIRY_INVALID",
    "Session expiresAt must be an ISO timestamp",
  );
});

test("rejects roles that are not an array of non-empty strings", () => {
  const expiresAt = "2026-08-14T10:30:00Z";

  for (const roles of ["admin", [""], ["   "], [null], [1]]) {
    assertSessionError(
      { userId: "user-19", roles, expiresAt },
      "SESSION_ROLES_INVALID",
      "Session roles must be an array of non-empty strings",
    );
  }
});

test("rejects timestamps that are not canonical UTC ISO strings", () => {
  for (const expiresAt of [
    "tomorrow",
    "2026-02-30T10:30:00Z",
    "2026-08-14T10:30:00+00:00",
    "2026-08-14T10:30:00.00Z",
  ]) {
    assertSessionError(
      { userId: "user-19", roles: [], expiresAt },
      "SESSION_EXPIRY_INVALID",
      "Session expiresAt must be an ISO timestamp",
    );
  }
});

test("returns synchronously", () => {
  const result = adaptSession({
    userId: "user-20",
    roles: [],
    expiresAt: "2026-08-14T10:30:00Z",
  });

  assert.equal(result instanceof Promise, false);
});
