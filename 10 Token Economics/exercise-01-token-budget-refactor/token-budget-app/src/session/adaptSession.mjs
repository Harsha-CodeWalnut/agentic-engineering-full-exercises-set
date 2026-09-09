export class SessionAdapterError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "SessionAdapterError";
    this.code = code;
  }
}

function validIsoTimestamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) return false;
  const parsed = Date.parse(value);
  const canonical = value.includes(".") ? value : value.replace("Z", ".000Z");
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === canonical;
}

function validNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function requireUserId(input) {
  if (!input || !validNonEmptyString(input.userId)) {
    throw new SessionAdapterError("SESSION_USER_REQUIRED", "Session userId is required");
  }

  return input.userId;
}

function requireExpiresAt(value) {
  if (!validIsoTimestamp(value)) {
    throw new SessionAdapterError("SESSION_EXPIRY_INVALID", "Session expiresAt must be an ISO timestamp");
  }

  return value;
}

function normalizeRoles(value) {
  if (!Array.isArray(value) || value.some((role) => !validNonEmptyString(role))) {
    throw new SessionAdapterError("SESSION_ROLES_INVALID", "Session roles must be an array of non-empty strings");
  }

  return [...new Set(value)];
}

export function adaptSession(input) {
  const userId = requireUserId(input);
  const expiresAt = requireExpiresAt(input.expiresAt);
  const roles = normalizeRoles(input.roles);

  return { userId, roles, expiresAt };
}
