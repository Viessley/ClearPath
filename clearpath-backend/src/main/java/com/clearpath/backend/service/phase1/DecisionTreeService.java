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
import java.util.ArrayList;

@Service
public class DecisionTreeService {

    @Autowired
    private DtQuestionRepository questionRepository;

    @Autowired
    private DtOptionRepository optionRepository;

    @Autowired
    private DtTransitionRepository transitionRepository;

    private List<Map<String, Object>> countryOptions = null;

    public Map<String, Object> getQuestion(String questionId) {

        DtQuestion question = questionRepository.findById(questionId).orElse(null);
        if (question == null) {
            return Map.of("error", "Question not found:" + questionId);
        }

        // Special case: P1Q3.1 country selection — dynamic, cached
        if ("P1Q3.1".equals(questionId)) {
            if (countryOptions == null) {
                countryOptions = new ArrayList<>();
                String[] codes = java.util.Locale.getISOCountries();
                for (String code : codes) {
                    java.util.Locale locale = new java.util.Locale("", code);
                    Map<String, Object> opt = new HashMap<>();
                    opt.put("value", code);
                    opt.put("label", locale.getDisplayCountry(java.util.Locale.ENGLISH));
                    countryOptions.add(opt);
                }
            }
            Map<String, Object> response = new HashMap<>();
            response.put("questionId", questionId);
            response.put("question", question.getQuestionText());
            response.put("options", countryOptions);
            return response;
        }

        List<DtOption> options = optionRepository.findByQuestionId(questionId);

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

        if ("P1Q3.1".equals(questionId)) {
            List<String> agreementCountries = List.of(
                    "US", "GB", "DE", "FR", "AU", "NZ", "KR", "JP", "AT", "BE", "CH",
                    "HU", "DK", "IM", "IE", "TW"
            );
            Map<String, Object> response = new HashMap<>();
            if (agreementCountries.contains(value)) {
                response.put("type", "ANSWER");
                response.put("feedback", "Great! Your country has a licence exchange agreement with Ontario.");
                response.put("nextQuestionId", null);
                response.put("done", true);
            } else {
                Map<String, Object> nextQ = getQuestion("P1Q3.2NotAgreement");
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "Your country does not have a direct exchange agreement. Let's check your experience.");
                response.put("nextQuestionId", "P1Q3.2NotAgreement");
                response.put("question", nextQ.get("question"));
                response.put("questionId", "P1Q3.2NotAgreement");
                response.put("options", nextQ.get("options"));
                response.put("done", false);
            }
            return response;
        }

        DtTransition transition = transitionRepository.findByQuestionIdAndAnswerValue(questionId, value);

        if(transition == null){
            return Map.of("error", "No transition found for:" + questionId + "/" + value);
        }

        Map<String, Object> response = new HashMap<>();
        String responseType = transition.getResponseType();
        response.put("type", responseType);
        response.put("feedback", transition.getFeedback());
        response.put("nextQuestionId", transition.getNextQuestionId());
        response.put("done", "ANSWER".equals(responseType) || "SCOPE_OUT".equals(responseType));

        String nextId = transition.getNextQuestionId();
        if (nextId != null) {
            // Check if next question is a SCOPE_OUT terminal node
            DtQuestion nextQuestion = questionRepository.findById(nextId).orElse(null);
            if (nextQuestion != null && nextQuestion.getScopeOutKey() != null) {
                response.put("type", "SCOPE_OUT");
                response.put("scopeOutKey", nextQuestion.getScopeOutKey());
                response.put("done", true);
            } else {
                Map<String, Object> nextQ = getQuestion(nextId);
                response.put("question", nextQ.get("question"));
                response.put("questionId", nextId);
                response.put("options", nextQ.get("options"));
            }
        }
        return response;
    }



}
