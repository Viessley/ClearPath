package com.clearpath.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cheatsheet")
public class CheatsheetController {

    @Autowired
    private GuideLibrary guideLibrary;

    @Autowired
    private AIService aiService;

    @PostMapping("/generate")
    public Map<String, Object> generate(@RequestBody CheatsheetRequest request) {

        Map<String, String> session = request.getSession();
        String aiSummary = request.getAiSummary();

        // example data
        Map<String, Object> cheatsheet = new HashMap<>();
        cheatsheet.put("profile", buildProfile(session));
        cheatsheet.put("steps", buildSteps(session));
        cheatsheet.put("aiNotes", aiSummary);

        return cheatsheet;
    }

    @PostMapping("/update")
    public Map<String, Object> update(@RequestBody CheatsheetUpdateRequest request) {

        Map<String, String> session = request.getSession();
        List<Map<String, Object>> completedSteps = request.getCompletedSteps();
        String newSituation = request.getNewSituation();
        
        // placeholder
        Map<String, Object> response = new HashMap<>();
        response.put("updatedSteps", "COMING_SOON");
        response.put("message", "AI will re-plan your remaining steps based on your new situation.");
        return response;
    }

    private Map<String, Object> buildProfile(Map<String, String> session) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("status", session.getOrDefault("P1Q2", "Unknown"));
        profile.put("permitStatus", session.getOrDefault("P1Q2.1IS", "Unknown"));
        profile.put("country", session.getOrDefault("P1Q3.1", "Unknown"));
        return profile;
    }

    private List<Map<String, Object>> buildSteps(Map<String, String> session) {

        Map<String, Object> step1 = new HashMap<>();
        step1.put("stepId", "S1");
        step1.put("title", "Book your G1 Test");
        step1.put("completed", false);
        step1.put("guide", guideLibrary.getGuide("GUIDE_DRIVETEST_BOOKING"));

        Map<String, Object> step2 = new HashMap<>();
        step2.put("stepId", "S2");
        step2.put("title", "Go to DriveTest Centre");
        step2.put("completed", false);
        step2.put("guide", guideLibrary.getGuide("GUIDE_DRIVETEST_WALKTHROUGH"));

        return List.of(step1, step2);
    }
}