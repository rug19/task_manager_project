package com.task_manager_api.backend.repository;

import com.task_manager_api.backend.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    List<Activity> findByDescriptionContainingIgnoreCase(String description);
}
