package com.task_manager_api.backend.core;

import java.util.UUID;

public interface Identifiable {
    void setId(UUID id);
    UUID getId();
}
