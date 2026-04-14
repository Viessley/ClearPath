package com.clearpath.backend.dto.phase1;

import java.util.Map;

//DTO
public class CheatsheetRequest {

    private Map<String, String> session;
    private String aiSummary;

    public Map<String, String> getSession() {
        return session;
    }

    public String getAiSummary() {
        return aiSummary;
    }

    public void setSession(Map<String, String> session) {
        this.session = session;
    }

    public void setAiSummary(String aiSummary) {
        this.aiSummary = aiSummary;
    }
}
