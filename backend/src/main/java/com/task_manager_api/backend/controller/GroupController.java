package com.task_manager_api.backend.controller;
import com.task_manager_api.backend.core.CoreController;
import com.task_manager_api.backend.model.Group;
import com.task_manager_api.backend.service.GroupService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
public class GroupController extends CoreController<Group, GroupService> {
    public GroupController(GroupService service) {
        super(service);
    }
}
