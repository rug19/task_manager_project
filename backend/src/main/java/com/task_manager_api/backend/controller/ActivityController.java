package com.task_manager_api.backend.controller;

import com.task_manager_api.backend.core.CoreController;
import com.task_manager_api.backend.model.Activity;
import com.task_manager_api.backend.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/activities")
public class ActivityController extends CoreController<Activity, ActivityService> {
    public ActivityController(ActivityService service) {
        super(service);
    }

    @PutMapping("/{activityId}/move/{newGroupId}")
    public ResponseEntity<Activity> moveActivity(@PathVariable UUID activityId, @PathVariable UUID newGroupId) {
        Activity updatedActivity = service.moveActivityToGroup(activityId, newGroupId);
        return ResponseEntity.ok(updatedActivity);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Activity>> searchByDescription(@RequestParam String description) {
        List<Activity> activities = service.findByDescription(description);
        return ResponseEntity.ok(activities);
    }

}
