const FLAG_KEY = "invoice-preview-v2";

function isValidTargetingContext(context) {
  const targetingKey = context?.targetingKey;
  const accountId = context?.accountId;
  return typeof targetingKey === "string" && typeof accountId === "string"
    && targetingKey.trim() !== "" && accountId.trim() !== ""
    && targetingKey === accountId;
}

export async function loadInvoiceExperience({ flagClient, context, api, telemetry }) {
  if (!isValidTargetingContext(context)) {
    return { experience: "legacy", reason: "invalid-context" };
  }

  const evaluationContext = { targetingKey: context.targetingKey, accountId: context.accountId };
  let enabled = false;
  try {
    enabled = await flagClient.getBooleanValue(FLAG_KEY, false, evaluationContext);
  } catch {
    return { experience: "legacy", reason: "flag-evaluation-error" };
  }

  if (!enabled) {
    return { experience: "legacy", reason: "flag-disabled" };
  }

  try {
    const preview = await api.loadPreview(context.accountId);
    telemetry.emit("invoice_preview_viewed", {
      targetingKey: context.targetingKey,
      accountId: context.accountId,
      flagKey: FLAG_KEY,
    });
    return { experience: "preview", preview };
  } catch {
    return { experience: "legacy", reason: "preview-unavailable" };
  }
}
