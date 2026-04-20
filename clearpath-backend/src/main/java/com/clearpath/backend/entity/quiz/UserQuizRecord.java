package com.clearpath.backend.entity.quiz;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_quiz_records")
public class UserQuizRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "question_id")
    private Long questionId;

    @Column(name = "correct_count")
    private Integer correctCount = 0;

    @Column(name = "seen_answer_count")
    private Integer seenAnswerCount = 0;

    @Column(name = "last_seen_at")
    private LocalDateTime lastSeenAt;

    @Column(name = "next_review_at")
    private LocalDateTime nextReviewAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public Integer getCorrectCount() { return correctCount; }
    public void setCorrectCount(Integer correctCount) { this.correctCount = correctCount; }
    public Integer getSeenAnswerCount() { return seenAnswerCount; }
    public void setSeenAnswerCount(Integer seenAnswerCount) { this.seenAnswerCount = seenAnswerCount; }
    public LocalDateTime getLastSeenAt() { return lastSeenAt; }
    public void setLastSeenAt(LocalDateTime lastSeenAt) { this.lastSeenAt = lastSeenAt; }
    public LocalDateTime getNextReviewAt() { return nextReviewAt; }
    public void setNextReviewAt(LocalDateTime nextReviewAt) { this.nextReviewAt = nextReviewAt; }
}