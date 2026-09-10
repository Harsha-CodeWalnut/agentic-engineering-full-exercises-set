package com.codewalnut.support;

import java.util.List;

public final class CaseService {
    private final Repository repository;

    public CaseService(Repository repository) {
        this.repository = repository;
    }

    public List<CaseItem> visibleCases(String user, String workspace) {
        boolean allowed = repository.memberships().stream().anyMatch(
            m -> m.user().equals(user) && m.workspace().equals(workspace) && m.active());
        if (!allowed) throw new SecurityException("Active workspace membership required");
        return repository.cases().stream().filter(c -> c.workspace().equals(workspace)).toList();
    }
}
