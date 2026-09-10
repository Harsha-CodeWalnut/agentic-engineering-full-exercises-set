package com.codewalnut.support;

import java.time.Instant;

/** Historical support-admin export. Not a customer-facing workspace boundary. */
public final class LegacyExport {
    private LegacyExport() {}

    public static String exportAll(Repository repository) {
        return Instant.now() + ":" + repository.cases().toString();
    }
}
