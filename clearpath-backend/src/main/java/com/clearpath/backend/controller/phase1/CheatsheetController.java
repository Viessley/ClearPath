package com.clearpath.backend.controller.phase1;

import com.clearpath.backend.service.phase1.KnowledgeService;
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
    private KnowledgeService knowledgeService;

    @PostMapping("/generate")
    public Map<String, Object> generate(@RequestBody CheatsheetRequest request) {

        Map<String, String> session = request.getSession();

        if (session == null || session.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "No session data provided");
            return error;
        }

        return knowledgeService.buildCheatsheet(session);
    }

    @PostMapping("/update")
    public Map<String, Object> update(@RequestBody CheatsheetUpdateRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Coming soon.");
        return response;
    }
}