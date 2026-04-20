package com.clearpath.backend.entity.quiz;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_questions")
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String question;

    @Column(name = "option_a") private String optionA;
    @Column(name = "option_b") private String optionB;
    @Column(name = "option_c") private String optionC;
    @Column(name = "option_d") private String optionD;

    @Column(name = "correct_option")
    private String correctOption;

    @Column(name = "official_rule", columnDefinition = "TEXT")
    private String officialRule;

    @Column(name = "plain_explanation", columnDefinition = "TEXT")
    private String plainExplanation;

    private Integer difficulty;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "handbook_chapter")
    private String handbookChapter;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getOptionA() { return optionA; }
    public void setOptionA(String optionA) { this.optionA = optionA; }
    public String getOptionB() { return optionB; }
    public void setOptionB(String optionB) { this.optionB = optionB; }
    public String getOptionC() { return optionC; }
    public void setOptionC(String optionC) { this.optionC = optionC; }
    public String getOptionD() { return optionD; }
    public void setOptionD(String optionD) { this.optionD = optionD; }
    public String getCorrectOption() { return correctOption; }
    public void setCorrectOption(String correctOption) { this.correctOption = correctOption; }
    public String getOfficialRule() { return officialRule; }
    public void setOfficialRule(String officialRule) { this.officialRule = officialRule; }
    public String getPlainExplanation() { return plainExplanation; }
    public void setPlainExplanation(String plainExplanation) { this.plainExplanation = plainExplanation; }
    public Integer getDifficulty() { return difficulty; }
    public void setDifficulty(Integer difficulty) { this.difficulty = difficulty; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getHandbookChapter() { return handbookChapter; }
    public void setHandbookChapter(String handbookChapter) { this.handbookChapter = handbookChapter; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}