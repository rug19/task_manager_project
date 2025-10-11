package com.task_manager_api.backend.service;

import com.task_manager_api.backend.core.CoreService;
import com.task_manager_api.backend.model.Activity;
import com.task_manager_api.backend.model.Group;
import com.task_manager_api.backend.repository.ActivityRepository;
import com.task_manager_api.backend.repository.GroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ActivityService extends CoreService<Activity, UUID, ActivityRepository> {

    private final GroupRepository groupRepository;


    public ActivityService(ActivityRepository repository, GroupRepository groupRepository) {
        super(repository);
        this.groupRepository = groupRepository;
    }

    // Method to move an activity to a different group
    public Activity moveActivityToGroup(UUID activityId, UUID groupId) {
        Activity activity = repository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        Group newGroup = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        activity.setGroup(newGroup);
        return repository.save(activity);
    }

    // Method to find activities by description (case insensitive)
    public List<Activity> findByDescription(String description) {
        return repository.findByDescriptionContainingIgnoreCase(description);
    }

}
