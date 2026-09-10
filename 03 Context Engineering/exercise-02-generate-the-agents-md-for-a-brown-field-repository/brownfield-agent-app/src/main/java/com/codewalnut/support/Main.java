package com.codewalnut.support;

import java.time.Instant;
import java.util.List;

public final class Main {
    public static void main(String[] args) {
        var repository = new Repository(
            List.of(new CaseItem("case-1", "workspace-a", "open", Instant.parse("2026-09-01T09:00:00Z"))),
            List.of(new Membership("sam", "workspace-a", true)));
        System.out.println(new CaseService(repository).visibleCases("sam", "workspace-a"));
    }
}
