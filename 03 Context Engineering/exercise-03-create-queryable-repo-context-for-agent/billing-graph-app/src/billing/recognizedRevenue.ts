import type { BillingEvent, TenantAccountLink } from "./billingTypes";
import { resolveBillingAccountId } from "./tenantAccountDirectory";

/** Recognized revenue follows the current metric contract, grouped by billing account. */
export function recognizedRevenueByAccount(events: BillingEvent[], links: TenantAccountLink[]) {
  return events.reduce<Record<string, number>>((totals, event) => {
    const account = resolveBillingAccountId(event.tenantId, links);
    const recognized = event.kind === "refund" ? -event.grossAmount : event.grossAmount - event.credits;
    totals[account] = (totals[account] ?? 0) + recognized;
    return totals;
  }, {});
}
