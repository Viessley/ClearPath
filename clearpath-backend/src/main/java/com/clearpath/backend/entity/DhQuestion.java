package com.clearpath.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dh_questions")
public class DhQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kb_id")
    private Integer kbId;

    @Column(name = "action_key")
    private String actionKey;

    @Column(name = "chips", columnDefinition = "TEXT")
    private String chips;

    @Column(name = "system_hint", columnDefinition = "TEXT")
    private String systemHint;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "question_id")
    private String questionId;

    @Column(name = "opener", columnDefinition = "TEXT")
    private String opener;

    public Long getId() { return id; }
    public Integer getKbId() { return kbId; }
    public String getActionKey() { return actionKey; }
    public String getChips() { return chips; }
    public String getSystemHint() { return systemHint; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getQuestionId() { return questionId; }
    public String getOpener() { return opener; }
}