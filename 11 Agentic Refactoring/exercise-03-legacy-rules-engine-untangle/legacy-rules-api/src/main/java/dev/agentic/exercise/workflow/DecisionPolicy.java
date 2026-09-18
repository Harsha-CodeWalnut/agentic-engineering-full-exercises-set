package dev.agentic.exercise.workflow;

import org.springframework.stereotype.Component;

@Component
public class DecisionPolicy {
  private static final int MINIMUM_READY_EVIDENCE_LENGTH = 12;
  private static final String READY_EVIDENCE_ERROR =
      "Ready decisions require a longer evidence note";

  public void validate(WorkflowDecision decision) {
    if (hasReadyStatus(decision) && hasInsufficientEvidence(decision)) {
      rejectReadyDecision();
    }
  }

  private boolean hasReadyStatus(WorkflowDecision decision) {
    return "Ready".equals(decision.status());
  }

  private boolean hasInsufficientEvidence(WorkflowDecision decision) {
    return decision.evidenceNote().length() < MINIMUM_READY_EVIDENCE_LENGTH;
  }

  private void rejectReadyDecision() {
    throw new InvalidWorkflowDecisionException(READY_EVIDENCE_ERROR);
  }
}
