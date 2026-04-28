package com.clearpath.backend.controller.phase1;

import com.clearpath.backend.service.phase1.AIService;
import com.clearpath.backend.service.phase1.DecisionTreeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/drivers-license")
public class DriversLicenseController {

    @Autowired
    private DecisionTreeService decisionTreeService;

    @Autowired
    private AIService aiService;

    @GetMapping("/start")
    public Map<String, Object> start() {
        return decisionTreeService.getQuestion("P1Q1");
    }

    @GetMapping("/answer")
    public Map<String, Object> answer(@RequestParam String questionId,
                                      @RequestParam String value) {
        return decisionTreeService.handleAnswer(questionId, value);
    }

    @PostMapping("/ai/chat")
    public Map<String, Object> aiChat(@RequestBody Map<String, Object> body) {
        Map<String, String> session = (Map<String, String>) body.get("session");
        String userMessage = (String) body.get("userMessage");
        String stuckAt = (String) body.get("stuckAt");
        String systemHint = (String) body.get("systemHint");

        String aiResponse = aiService.chat(session, userMessage, stuckAt, systemHint);

        Map<String, Object> response = new HashMap<>();
        response.put("type", "AI_RESPONSE");
        response.put("message", aiResponse);
        return response;
    }
}