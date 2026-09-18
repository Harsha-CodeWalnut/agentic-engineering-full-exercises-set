package dev.agentic.exercise.workflow;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class WorkflowPolicyCharacterizationTest {
  static final class RecordingRepository extends WorkflowRepository {
    int saves;

    @Override
    public WorkflowItem save(WorkflowItem item) {
      saves += 1;
      return super.save(item);
    }
  }

  @Test
  void given_ready_note_with_eleven_characters_when_deciding_then_rejects_without_mutation_or_save() {
    RecordingRepository repository = new RecordingRepository();
    WorkflowService service = new WorkflowService(repository);
    WorkflowItem before = repository.findById("wf-101").orElseThrow();

    assertThatThrownBy(
            () -> service.decide(
                "wf-101", new WorkflowDecision("Ready", "Asha", "12345678901")))
        .isInstanceOf(InvalidWorkflowDecisionException.class)
        .hasMessage("Ready decisions require a longer evidence note");

    assertThat(repository.findById("wf-101").orElseThrow()).isEqualTo(before);
    assertThat(repository.saves).isZero();
  }

  @Test
  void given_ready_note_with_twelve_characters_when_deciding_then_accepts_and_saves_once() {
    RecordingRepository repository = new RecordingRepository();

    WorkflowItem result = new WorkflowService(repository)
        .decide("wf-101", new WorkflowDecision("Ready", "Asha", "123456789012"));

    assertThat(result)
        .isEqualTo(new WorkflowItem(
            "wf-101", "Atlas Co", "Ready", 91, "Asha", "123456789012"));
    assertThat(repository.saves).isEqualTo(1);
  }

  @Test
  void given_missing_workflow_and_invalid_ready_decision_when_deciding_then_not_found_precedes_policy() {
    RecordingRepository repository = new RecordingRepository();

    assertThatThrownBy(
            () -> new WorkflowService(repository)
                .decide("missing", new WorkflowDecision("Ready", "Asha", "short")))
        .isInstanceOf(WorkflowNotFoundException.class)
        .hasMessage("Workflow item not found: missing");

    assertThat(repository.saves).isZero();
  }

  @Test
  void given_unknown_status_when_deciding_then_accepts_and_saves_once() {
    RecordingRepository repository = new RecordingRepository();

    WorkflowItem result = new WorkflowService(repository)
        .decide(
            "wf-102",
            new WorkflowDecision(
                "Escalated Later", "Rina", "Legacy accepts this status"));

    assertThat(result)
        .isEqualTo(new WorkflowItem(
            "wf-102",
            "Brightline",
            "Escalated Later",
            74,
            "Rina",
            "Legacy accepts this status"));
    assertThat(repository.saves).isEqualTo(1);
  }

  @Test
  void given_blocked_decision_when_deciding_then_preserves_stable_fields_and_saves_once() {
    RecordingRepository repository = new RecordingRepository();

    WorkflowItem result = new WorkflowService(repository)
        .decide(
            "wf-101",
            new WorkflowDecision("Blocked", "Mateo", "Waiting for evidence"));

    assertThat(result.id()).isEqualTo("wf-101");
    assertThat(result.customer()).isEqualTo("Atlas Co");
    assertThat(result.score()).isEqualTo(91);
    assertThat(result.status()).isEqualTo("Blocked");
    assertThat(result.owner()).isEqualTo("Mateo");
    assertThat(result.note()).isEqualTo("Waiting for evidence");
    assertThat(repository.saves).isEqualTo(1);
  }
}
