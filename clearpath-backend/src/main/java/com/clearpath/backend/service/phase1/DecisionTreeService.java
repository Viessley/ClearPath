package com.clearpath.backend.service.phase1;

import com.clearpath.backend.entity.DtOption;
import com.clearpath.backend.entity.DtQuestion;
import com.clearpath.backend.entity.DtTransition;
import com.clearpath.backend.repository.DtOptionRepository;
import com.clearpath.backend.repository.DtQuestionRepository;
import com.clearpath.backend.repository.DtTransitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class DecisionTreeService {

    @Autowired
    private DtQuestionRepository questionRepository;

    @Autowired
    private DtOptionRepository optionRepository;

    @Autowired
    private DtTransitionRepository transitionRepository;

    public Map<String, Object> getQuestion(String questionId) {
        DtQuestion question = questionRepository.findById(questionId).orElse(null);
        if(question == null){
            return Map.of("error","Question not found:" + questionId);
        }

        List<DtOption>options = optionRepository.findByQuestionId(questionId);

        Map<String, Object> response = new HashMap<>();
        response.put("questionId", questionId);
        response.put("question", question.getQuestionText());
        response.put("options", options.stream().map(opt -> {
            Map<String, Object> o = new HashMap<>();
            o.put("value", opt.getValue());
            o.put("label", opt.getLabel());
            return o;
        }).collect(java.util.stream.Collectors.toList()));

        return response;
    }

    public Map<String, Object>handleAnswer(String questionId, String value){

        DtTransition transition = transitionRepository.findByQuestionIdAndAnswerValue(questionId, value);

        if(transition == null){
            return Map.of("error", "No transition found for:" + questionId + "/" + value);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("type", transition.getResponseType());
        response.put("feedback", transition.getFeedback());
        response.put("nextQuestionId",transition.getNextQuestionId());
        response.put("done","ANSWER".equals(transition.getResponseType()));

        String nextId = transition.getNextQuestionId();
        if (nextId != null) {
            Map<String, Object> nextQ = getQuestion(nextId);
            response.put("question", nextQ.get("question"));
            response.put("questionId", nextId);
            response.put("options", nextQ.get("options"));
        }
        return response;
    }



}
