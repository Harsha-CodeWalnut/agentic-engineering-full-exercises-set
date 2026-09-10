package com.codewalnut.support;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

public final class ContractChecks {
    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
    private static void denied(Runnable action) {
        try { action.run(); } catch (SecurityException expected) { return; }
        throw new AssertionError("Cross-workspace or inactive membership was accepted");
    }
    public static void main(String[] args) {
        var now = Instant.parse("2026-09-01T12:00:00Z");
        var repository = new Repository(List.of(
            new CaseItem("a", "red", "open", now.minusSeconds(9000)),
            new CaseItem("b", "red", "closed", now.minusSeconds(900000)),
            new CaseItem("c", "blue", "open", now.minusSeconds(9000000)),
            new CaseItem("d", "red", "open", now.plusSeconds(3600))),
            List.of(new Membership("sam", "red", true), new Membership("sam", "blue", false),
                new Membership("alex", "blue", true), new Membership("sam", "empty", true)));
        var cases = new CaseService(repository);
        check(cases.visibleCases("sam", "red").size() == 3, "existing scoped case listing changed");
        denied(() -> cases.visibleCases("sam", "blue"));
        denied(() -> cases.visibleCases("alex", "red"));
        try { cases.visibleCases("sam", "red").clear(); throw new AssertionError("Mutable result"); }
        catch (UnsupportedOperationException expected) { /* Immutable public result. */ }
        System.out.println("PASS existing workspace access and immutable case listing");
        if (args.length == 0 || !args[0].equals("acceptance")) return;
        var controller = new ReportController(cases, Clock.fixed(now, ZoneOffset.UTC));
        check(controller.summary("sam", "red").equals(new Summary(2, 2)), "summary scope, status or clock is wrong");
        check(controller.summary("sam", "empty").equals(new Summary(0, 0)), "empty workspace must return zeros");
        check(controller.summary("alex", "blue").equals(new Summary(1, 2500)), "workspace summary must use its own cases");
        denied(() -> controller.summary("sam", "blue"));
        denied(() -> controller.summary("unknown", "red"));
        check(repository.cases().size() == 4, "summary mutated the repository");
        System.out.println("PASS summary acceptance, active membership, time calculation and no mutation");
    }
}
