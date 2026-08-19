import type { BillingEvent, TenantAccountLink } from "./billingTypes";
import { resolveBillingAccountId } from "./tenantAccountDirectory";

function recognizedAmount(event: BillingEvent): number {
  if (event.kind === "refund") {
    return -event.grossAmount;
  }
  return event.grossAmount - event.credits;
}

export function recognizedRevenueByAccount(events: BillingEvent[], links: TenantAccountLink[]) {
  return events.reduce<Record<string, number>>((totals, event) => {
    const accountId = resolveBillingAccountId(event.tenantId, links);
    totals[accountId] = (totals[accountId] ?? 0) + recognizedAmount(event);
    return totals;
  }, {});
}
