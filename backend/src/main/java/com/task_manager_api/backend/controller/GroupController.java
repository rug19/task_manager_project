package com.task_manager_api.backend.controller;

import com.task_manager_api.backend.core.CoreController;
import com.task_manager_api.backend.model.TaskGroup;
import com.task_manager_api.backend.service.GroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
public class GroupController extends CoreController<TaskGroup, GroupService> {
    public GroupController(GroupService service, GroupService groupService) {
        super(service);
        this.groupService = groupService;
    }

    private final GroupService groupService;

    @PatchMapping("/{id}/title")
    public ResponseEntity<TaskGroup> updateTitle(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        String newTitle = body.get("title");
        TaskGroup updated = groupService.updateTitle(id, newTitle);
        return ResponseEntity.ok(updated);
    }

}
