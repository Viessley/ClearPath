package com.clearpath.backend.controller.phase1;

import com.clearpath.backend.service.phase1.AIService;
import com.clearpath.backend.service.phase1.KnowledgeService;
import com.clearpath.backend.dto.phase1.CheatsheetRequest;
import com.clearpath.backend.dto.phase1.CheatsheetUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/cheatsheet")
public class CheatsheetController {

    @Autowired
    private KnowledgeService knowledgeService;

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

        // Query knowledge_base via KnowledgeService
        Map<String, Object> kb = knowledgeService.buildCheatsheet(session);

        // If knowledge_base returned an error, fallback to AI
        if (kb.containsKey("error")) {
            String aiResult = aiService.chat(session,
                    "Based on my completed decision tree, generate my personalized cheatsheet for getting an Ontario driver's license. Include: steps to follow, documents to bring, requirements to check, where to go, and costs.",
                    null,
                    null);
            Map<String, Object> response = new HashMap<>();
            response.put("cheatsheet", aiResult);
            response.put("session", session);
            return response;
        }

        // Build structured response with new fields
        Map<String, Object> structured = new HashMap<>();
        structured.put("overview",        kb.get("overview"));
        structured.put("steps",           kb.get("steps"));
        structured.put("documents",       kb.get("documents"));
        structured.put("fees",            kb.get("fees"));
        structured.put("cheatsheet_tips", kb.get("cheatsheetTips"));
        structured.put("what_to_prepare", kb.get("whatToPrepare"));
        structured.put("sources",         kb.get("sources"));

        Map<String, Object> response = new HashMap<>();
        response.put("structured", structured);
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