package com.clearpath.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "knowledge_base")
public class KnowledgeBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category")
    private String category;

    @Column(name = "topic")
    private String topic;

    @Column(name = "subtopic")
    private String subtopic;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "source_url")
    private String sourceUrl;

    @Column(name = "tags")
    private String tags;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @Column(name = "official_rule", columnDefinition = "TEXT")
    private String officialRule;

    @Column(name = "source_quote", columnDefinition = "TEXT")
    private String sourceQuote;

    @Column(name = "steps", columnDefinition = "TEXT")
    private String steps;

    @Column(name = "documents", columnDefinition = "TEXT")
    private String documents;

    @Column(name = "tips", columnDefinition = "TEXT")
    private String tips;

    @Column(name = "fees", columnDefinition = "TEXT")
    private String fees;

    @Column(name = "overview", columnDefinition = "TEXT")
    private String overview;

    @Column(name = "cheatsheet_tips", columnDefinition = "TEXT")
    private String cheatsheetTips;

    @Column(name = "gameplan_intel", columnDefinition = "TEXT")
    private String gameplanIntel;

    @Column(name = "what_to_prepare", columnDefinition = "TEXT")
    private String whatToPrepare;

    @Column(name = "sources", columnDefinition = "TEXT")
    private String sources;

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getSubtopic() { return subtopic; }
    public void setSubtopic(String subtopic) { this.subtopic = subtopic; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getOfficialRule() { return officialRule; }
    public void setOfficialRule(String officialRule) { this.officialRule = officialRule; }

    public String getSourceQuote() { return sourceQuote; }
    public void setSourceQuote(String sourceQuote) { this.sourceQuote = sourceQuote; }

    public String getSteps() { return steps; }
    public void setSteps(String steps) { this.steps = steps; }

    public String getDocuments() { return documents; }
    public void setDocuments(String documents) { this.documents = documents; }

    public String getTips() { return tips; }
    public void setTips(String tips) { this.tips = tips; }

    public String getFees() { return fees; }
    public void setFees(String fees) { this.fees = fees; }

    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }

    public String getCheatsheetTips() { return cheatsheetTips; }
    public void setCheatsheetTips(String cheatsheetTips) { this.cheatsheetTips = cheatsheetTips; }

    public String getGameplanIntel() { return gameplanIntel; }
    public void setGameplanIntel(String gameplanIntel) { this.gameplanIntel = gameplanIntel; }

    public String getWhatToPrepare() { return whatToPrepare; }
    public void setWhatToPrepare(String whatToPrepare) { this.whatToPrepare = whatToPrepare; }

    public String getSources() { return sources; }
    public void setSources(String sources) { this.sources = sources; }
}