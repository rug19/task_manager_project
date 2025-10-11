package com.task_manager_api.backend.controller;
import com.task_manager_api.backend.core.CoreController;
import com.task_manager_api.backend.model.TaskGroup;
import com.task_manager_api.backend.service.GroupService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/groups")
public class GroupController extends CoreController<TaskGroup, GroupService> {
    public GroupController(GroupService service) {
        super(service);
    }
}
