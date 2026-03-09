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

        // Step 3: Send to AI and parse response
        CheatsheetResponse cheatsheet = aiService.generateCheatsheet(prompt);
        if (cheatsheet == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "AI service failed to generate cheatsheet");
            return error;
        }

        // Step 4: Return cheatsheet
        Map<String, Object> response = new HashMap<>();
        response.put("profile", cheatsheet.getProfile());
        response.put("steps", cheatsheet.getSteps());
        response.put("warnings", cheatsheet.getWarnings());
        response.put("aiNotes", cheatsheet.getAiNotes());
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