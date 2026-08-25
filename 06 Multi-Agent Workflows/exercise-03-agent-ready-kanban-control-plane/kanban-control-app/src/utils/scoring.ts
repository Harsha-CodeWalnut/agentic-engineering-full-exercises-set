import type { Incident, Severity } from "../data/incidents";

export function calculateSeverity(incident: Incident): Severity {
  return incident.inheritedSeverity ?? incident.declaredSeverity;
}
