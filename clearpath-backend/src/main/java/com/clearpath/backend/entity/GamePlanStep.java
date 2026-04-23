package com.clearpath.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_plan_steps")
public class GamePlanStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kb_id")
    private Integer kbId;

    @Column(name = "step")
    private Integer step;

    @Column(name = "title")
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "detail", columnDefinition = "TEXT")
    private String detail;

    @Column(name = "links", columnDefinition = "TEXT")
    private String links;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getKbId() { return kbId; }
    public void setKbId(Integer kbId) { this.kbId = kbId; }
    public Integer getStep() { return step; }
    public void setStep(Integer step) { this.step = step; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }
    public String getLinks() { return links; }
    public void setLinks(String links) { this.links = links; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}