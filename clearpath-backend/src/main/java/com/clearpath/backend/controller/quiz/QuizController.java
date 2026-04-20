package com.clearpath.backend.controller.quiz;

import com.clearpath.backend.entity.quiz.QuizQuestion;
import com.clearpath.backend.service.quiz.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    // Get questions — type: "road_rule" | "road_sign" | null (both)
    @GetMapping("/questions")
    public List<QuizQuestion> getQuestions(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "10") int limit) {
        return quizService.getQuestions(userId, type, limit);
    }

    // Submit answer
    @PostMapping("/answer")
    public Map<String, Object> submitAnswer(@RequestBody Map<String, Object> body) {
        Long userId = body.get("userId") != null ? Long.valueOf(body.get("userId").toString()) : null;
        Long questionId = Long.valueOf(body.get("questionId").toString());
        String selectedOption = body.get("selectedOption").toString();

        boolean correct = quizService.submitAnswer(userId, questionId, selectedOption);

        Map<String, Object> response = new HashMap<>();
        response.put("correct", correct);
        return response;
    }

    // See answer without answering
    @PostMapping("/see-answer")
    public Map<String, Object> seeAnswer(@RequestBody Map<String, Object> body) {
        Long userId = body.get("userId") != null ? Long.valueOf(body.get("userId").toString()) : null;
        Long questionId = Long.valueOf(body.get("questionId").toString());

        quizService.seeAnswer(userId, questionId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "recorded");
        return response;
    }

    // Get user progress
    @GetMapping("/progress")
    public Map<String, Object> getProgress(@RequestParam Long userId) {
        Map<String, Object> response = new HashMap<>();
        response.put("mastered", quizService.getMasteredCount(userId));
        response.put("total", quizService.getTotalCount());
        return response;
    }
}