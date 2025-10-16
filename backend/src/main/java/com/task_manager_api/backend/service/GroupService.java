package com.task_manager_api.backend.service;

import com.task_manager_api.backend.core.CoreService;

import com.task_manager_api.backend.model.TaskGroup;
import com.task_manager_api.backend.repository.GroupRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GroupService extends CoreService<TaskGroup, UUID, GroupRepository> {
    public GroupService(GroupRepository repository) {
        super(repository);
    }

    public TaskGroup updateTitle(UUID id, String newTitle) {
        TaskGroup group = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Grupo não encontrado"));
        group.setTitle(newTitle);
        return repository.save(group);
    }
}
