package com.clearpath.backend.controller.phase1;

import com.clearpath.backend.service.phase1.AIService;
import com.clearpath.backend.dto.phase1.CheatsheetRequest;
import com.clearpath.backend.dto.phase1.CheatsheetUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cheatsheet")
public class CheatsheetController {

    @Autowired
    private AIService aiService;

    @PostMapping("/generate")
    public Map<String, Object> generate(@RequestBody CheatsheetRequest request) {

        Map<String, String> session = request.getSession();

        if (session == null || session.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "No session data provided");
            return error;
        }

        // Use the 3-agent pipeline via chat method
        String result = aiService.chat(session,
                "Based on my completed decision tree, generate my personalized cheatsheet for getting an Ontario driver's license. Include: steps to follow, documents to bring, requirements to check, where to go, and costs.",
                null);
        Map<String, Object> response = new HashMap<>();
        response.put("cheatsheet", result);
        response.put("session", session);
        return response;
    }

    @PostMapping("/update")
    public Map<String, Object> update(@RequestBody CheatsheetUpdateRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Coming soon.");
        return response;
    }
}