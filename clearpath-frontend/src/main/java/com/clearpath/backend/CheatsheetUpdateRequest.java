package com.clearpath.backend;

import java.util.List;
import java.util.Map;

public class CheatsheetUpdateRequest {

    private List<Map<String, Object>> completedSteps;
    private String newSituation;
    private Map<String, String> session;

    public List<Map<String, Object>> getCompletedSteps() {
        return completedSteps;
    }

    public String getNewSituation() {
        return newSituation;
    }

    public Map<String, String> getSession() {
        return session;
    }

    public void setCompletedSteps(List<Map<String, Object>> completedSteps) {
        this.completedSteps = completedSteps;
    }

    public void setNewSituation(String newSituation) {
        this.newSituation = newSituation;
    }

    public void setSession(Map<String, String> session) {
        this.session = session;
    }
}