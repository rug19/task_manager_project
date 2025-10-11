package com.task_manager_api.backend.service;

import com.task_manager_api.backend.core.CoreService;

import com.task_manager_api.backend.model.TaskGroup;
import com.task_manager_api.backend.repository.GroupRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GroupService extends CoreService<TaskGroup, UUID, GroupRepository> {
    public GroupService(GroupRepository repository) {
        super(repository);
    }
}
