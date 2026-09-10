package com.codewalnut.support;

import java.time.Clock;

public final class ReportController {
    private final CaseService cases;
    private final Clock clock;

    public ReportController(CaseService cases, Clock clock) {
        this.cases = cases;
        this.clock = clock;
    }

    public Summary summary(String user, String workspace) {
        throw new UnsupportedOperationException("Workspace summary is not implemented");
    }
}
