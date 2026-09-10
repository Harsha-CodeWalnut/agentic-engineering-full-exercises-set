package com.codewalnut.support;

import java.util.List;

public record Repository(List<CaseItem> cases, List<Membership> memberships) {
    public Repository {
        cases = List.copyOf(cases);
        memberships = List.copyOf(memberships);
    }
}
