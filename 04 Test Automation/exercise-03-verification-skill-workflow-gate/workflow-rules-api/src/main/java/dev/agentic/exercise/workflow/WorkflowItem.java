package dev.agentic.exercise.workflow;

import com.fasterxml.jackson.annotation.JsonProperty;

public record WorkflowItem(
    String id,
    String customer,
    String status,
    int score,
    String owner,
    String note) {

  @JsonProperty("decisionState")
  public String decisionState() {
    if ("Blocked".equals(status)) {
      return "needs-evidence";
    }
    if ("In Review".equals(status)) {
      return "pending-review";
    }
    if ("Ready".equals(status)) {
      return "accepted";
    }
    throw new IllegalStateException("Unsupported workflow status: " + status);
  }
}
