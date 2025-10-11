package com.task_manager_api.backend.repository;

import com.task_manager_api.backend.model.TaskGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GroupRepository extends JpaRepository<TaskGroup, UUID> {
}
