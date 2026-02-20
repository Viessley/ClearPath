package com.clearpath.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers-license")
public class DriversLicenseController {

    @Autowired
    private DriversLicenseHandler answerHandler;

    @Autowired
    private DriversLicenseBuilder questionBuilder;

    @GetMapping("/start")
    public Map<String, Object> start() {
        return questionBuilder.P1Q1();
    }

    @GetMapping("/answer")
    public Map<String, Object> answer(@RequestParam String questionId,
                                      @RequestParam String value) {
        return switch (questionId) {
            case "P1Q1"                  -> answerHandler.handleP1Q1(value);
            case "P1Q1.1"                -> answerHandler.handleP1Q1_1(value);
            case "P1Q1.1NotSure"        -> answerHandler.handleP1Q1_1NotSure(value);
            case "P1Q1.2"                -> answerHandler.handleP1Q1_2(value);
            case "P1Q2"                  -> answerHandler.handleP1Q2(value);
            case "P1Q2.1IS"             -> answerHandler.handleP1Q2_1IS(value);
            case "P1Q2.1ISLess6Months"  -> answerHandler.handleP1Q2_1_ISless6Months(value);
            case "P1Q2.1ISExpired"      -> answerHandler.handleP1Q2_1_ISexpired(value);
            case "P1Q2.1WP"             -> answerHandler.handleP1Q2_1WP(value);
            case "P1Q2.2WP"             -> answerHandler.handleP1Q2_2WP(value);
            case "P1Q2.3WP"             -> answerHandler.handleP1Q2_3WP(value);
            case "P1Q2.3WPNotSure"      -> answerHandler.handleP1Q2_3WPNotSure(value);
            case "P1Q2.1PPR"            -> answerHandler.handleP1Q2_1PPR(value);
            case "P1Q2.2PPRWaiting"     -> answerHandler.handleP1Q2_2PPR(value);
            case "P1Q2.2PPRApproved"    -> answerHandler.handleP1Q2_2PPRApproved(value);
            case "P1Q2.1VIS"            -> answerHandler.handleP1Q2_1VIS(value);
            case "P1Q2.1PR"             -> answerHandler.handleP1Q2_1PR(value);
            case "P1Q2.2PRCard"         -> answerHandler.handleP1Q2_2PRCard(value);
            case "P1Q2.2PRNew"          -> answerHandler.handleP1Q2_2PRNew(value);
            case "P1Q3"                  -> answerHandler.handleP1Q3(value);
            case "P1Q3.1"                -> answerHandler.handleP1Q3_1(value);
            case "P1Q3.2NotAgreement"    -> answerHandler.handleP1Q3_2NotAgreement(value);
            case "P1Q3.3NotAgreement"    -> answerHandler.handleP1Q3_3NotAgreement(value);
            case "P1Q4"                  -> answerHandler.handleP1Q4(value);
            default                      -> Map.of("error", "Unknown question");
        };
    }
}