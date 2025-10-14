package com.task_manager_api.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.task_manager_api.backend.core.Identifiable;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class TaskGroup implements Identifiable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String title;

    @JsonManagedReference
    @OneToMany(mappedBy = "taskGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Activity> activities;
}

