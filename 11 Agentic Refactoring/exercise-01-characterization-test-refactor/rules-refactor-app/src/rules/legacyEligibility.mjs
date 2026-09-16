export function evaluateRenewalEligibility(account) {
  if (account.supportOverride === true) {
    return {
      status: "eligible",
      discountPercent: 0,
      reason: "legacy-support-override",
    };
  }

  const tier = account.tier;

  if (tier === "enterprise" && account.monthsActive >= 12) {
    if (account.latePayments < 2) {
      return {
        status: "eligible",
        discountPercent: 15,
        reason: "enterprise-tenure",
      };
    }

    return {
      status: "manual-review",
      discountPercent: 0,
      reason: "payment-history",
    };
  }

  if (tier === "pro" && account.monthsActive >= 6 && account.latePayments === 0) {
    return {
      status: "eligible",
      discountPercent: 10,
      reason: "pro-tenure",
    };
  }

  return {
    status: "ineligible",
    discountPercent: 0,
    reason: "plan-not-supported",
  };
}
