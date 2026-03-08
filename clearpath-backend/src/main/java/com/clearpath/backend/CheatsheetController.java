package com.clearpath.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cheatsheet")
public class CheatsheetController {

    @Autowired
    private SessionValidator sessionValidator;

    @Autowired
    private AIPromptBuilder aiPromptBuilder;

    @Autowired
    private AIService aiService;

    @PostMapping("/generate")
    public Map<String, Object> generate(@RequestBody CheatsheetRequest request) {

        Map<String, String> session = request.getSession();

        // Step 1: Validate session
        String validationError = sessionValidator.getValidationError(session);
        if (validationError != null) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", validationError);
            return error;
        }

        // Step 2: Build prompt
        String prompt = aiPromptBuilder.buildPrompt(session);

        // Step 3: Send to AI
        // TODO: parse AI response into CheatsheetResponse
        Map<String, Object> response = new HashMap<>();
        response.put("status", "validated");
        response.put("message", "Session is valid. AI integration coming soon.");
        response.put("prompt", prompt);
        return response;
    }

    @PostMapping("/update")
    public Map<String, Object> update(@RequestBody CheatsheetUpdateRequest request) {
        // TODO: implement update logic
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Coming soon.");
        return response;
    }
}