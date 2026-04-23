package com.clearpath.backend.controller;

import com.clearpath.backend.entity.GamePlanStep;
import com.clearpath.backend.repository.GamePlanStepRepository;
import com.clearpath.backend.service.phase1.KnowledgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/game-plan")
public class GamePlanController {

    @Autowired
    private GamePlanStepRepository gamePlanStepRepository;

    @Autowired
    private KnowledgeService knowledgeService;

    @PostMapping
    public List<GamePlanStep> getGamePlan(@RequestBody Map<String, String> session) {
        Integer kbId = knowledgeService.resolveKbId(session);
        if (kbId == null) return List.of();
        return gamePlanStepRepository.findByKbIdOrderByStepAsc(kbId);
    }
}