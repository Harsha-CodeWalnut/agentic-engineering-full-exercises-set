package com.codewalnut.support;

import java.time.Instant;

public record CaseItem(String id, String workspace, String status, Instant openedAt) {}
