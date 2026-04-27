package com.clearpath.backend.controller.phase1;

import com.clearpath.backend.entity.DhQuestion;
import com.clearpath.backend.repository.DhQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai-support")
public class AISupportController {

    @Autowired
    private DhQuestionRepository dhQuestionRepository;

    @GetMapping("/opener")
    public Map<String, Object> getOpener(@RequestParam String questionId) {
        Map<String, Object> result = new HashMap<>();

        var opener = dhQuestionRepository.findByQuestionId(questionId);
        if (opener.isPresent()) {
            DhQuestion dh = opener.get();
            result.put("found", true);
            result.put("opener", dh.getOpener());
            result.put("chips", dh.getChips());
            result.put("systemHint", dh.getSystemHint());
        } else {
            result.put("found", false);
        }
        return result;
    }
}

