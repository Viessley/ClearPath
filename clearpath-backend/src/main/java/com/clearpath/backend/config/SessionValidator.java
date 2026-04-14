package com.clearpath.backend.config;

import org.springframework.stereotype.Component;
import java.util.*;

/**
 * SessionValidator
 *
 * Responsibility: Validate the session received from the frontend
 *
 * 1. Validate keys - ensure all question IDs exist in the decision tree
 * 2. Validate values - ensure all answers are valid options for their question
 * 3. Validate path consistency
 *    e.g. P1Q2.1IS can only appear if P1Q2 = international_student
 *
 * Pass → forward to AIPromptBuilder
 * Fail → reject request, return error, never reach AI service
 */
@Component
public class SessionValidator {

    // All valid answers for each question
    private static final Map<String, Set<String>> VALID_ANSWERS = new HashMap<>();

    static {
        VALID_ANSWERS.put("P1Q1",                Set.of("under16", "age16to17", "age18plus"));
        VALID_ANSWERS.put("P1Q1.1",              Set.of("can_sign", "not_sure"));
        VALID_ANSWERS.put("P1Q1.1NotSure",       Set.of("userInput", "clearPathGuided"));
        VALID_ANSWERS.put("P1Q1.2",              Set.of("inCanada", "outsideCanada"));

        VALID_ANSWERS.put("P1Q2", Set.of(
                "international_student", "work_permit", "visitor",
                "permanent_resident", "protected_person_refugee"));

        VALID_ANSWERS.put("P1Q2.1IS",            Set.of("validMoreThan6Months", "validLessThan6Months", "noExpired"));
        VALID_ANSWERS.put("P1Q2.1ISLess6Months", Set.of("SPEFirst", "ContinueAnyway", "SpecialCase"));
        VALID_ANSWERS.put("P1Q2.1ISExpired",     Set.of("ExpiredNeedRenew", "WaitingApproval", "ApplyPGWPInstead", "UserExplain"));

        VALID_ANSWERS.put("P1Q2.1WP",            Set.of("OWP", "ESWP", "UserNotSure"));
        VALID_ANSWERS.put("P1Q2.2WP",            Set.of("MoreThen6", "LessThen6", "Expired"));
        VALID_ANSWERS.put("P1Q2.2WPNotSure",     Set.of("Open", "ES", "UserNotSure"));

        VALID_ANSWERS.put("P1Q2.1PPR",           Set.of("Waiting", "Approved", "UserNotSure"));
        VALID_ANSWERS.put("P1Q2.2PPRWaiting",    Set.of("IMM1434", "IMM7703", "UserNotSure"));
        VALID_ANSWERS.put("P1Q2.2PPRApproved",   Set.of("ImReady", "DocMissing", "Help"));

        VALID_ANSWERS.put("P1Q2.1VIS",           Set.of("ShortTerm", "HasVisitorRecord", "WaitingPRWP", "UserNotSure"));
        VALID_ANSWERS.put("P1Q2.1PR",            Set.of("PRCard", "NewPR", "UserNotSure"));
        VALID_ANSWERS.put("P1Q2.2PRCard",        Set.of("Valid", "Expired"));
        VALID_ANSWERS.put("P1Q2.2PRNew",         Set.of("HaveBoth", "JustOne", "UserHasQuestion"));

        VALID_ANSWERS.put("P1Q3",                Set.of("Yes", "No", "Expired"));
        VALID_ANSWERS.put("P1Q3.2NotAgreement",  Set.of("Less1Year", "1To2", "MoreThen2"));
        VALID_ANSWERS.put("P1Q3.3NotAgreement",  Set.of("Yes", "No", "NotSure"));
    }

    // Path consistency rules
    // key = question that requires a parent
    // value = "parentQuestion:requiredAnswer"
    private static final Map<String, String> PATH_RULES = new HashMap<>();

    static {
        PATH_RULES.put("P1Q2.1IS",            "P1Q2:international_student");
        PATH_RULES.put("P1Q2.1ISLess6Months", "P1Q2.1IS:validLessThan6Months");
        PATH_RULES.put("P1Q2.1ISExpired",     "P1Q2.1IS:noExpired");

        PATH_RULES.put("P1Q2.1WP",            "P1Q2:work_permit");
        PATH_RULES.put("P1Q2.2WP",            "P1Q2.1WP:OWP");
        PATH_RULES.put("P1Q2.2WPNotSure",     "P1Q2.1WP:UserNotSure");

        PATH_RULES.put("P1Q2.1PPR",           "P1Q2:protected_person_refugee");
        PATH_RULES.put("P1Q2.2PPRWaiting",    "P1Q2.1PPR:Waiting");
        PATH_RULES.put("P1Q2.2PPRApproved",   "P1Q2.1PPR:Approved");

        PATH_RULES.put("P1Q2.1VIS",           "P1Q2:visitor");
        PATH_RULES.put("P1Q2.1PR",            "P1Q2:permanent_resident");
        PATH_RULES.put("P1Q2.2PRCard",        "P1Q2.1PR:PRCard");
        PATH_RULES.put("P1Q2.2PRNew",         "P1Q2.1PR:NewPR");

        PATH_RULES.put("P1Q3.1",              "P1Q3:Yes");
        PATH_RULES.put("P1Q3.2NotAgreement",  "P1Q3:Yes");
        PATH_RULES.put("P1Q3.3NotAgreement",  "P1Q3.2NotAgreement:Less1Year");
    }

    public boolean validate(Map<String, String> session) {
        return getValidationError(session) == null;
    }

    public String getValidationError(Map<String, String> session) {

        for (Map.Entry<String, String> entry : session.entrySet()) {
            String questionId = entry.getKey();
            String answer = entry.getValue();

            // 1. Validate key
            if (!VALID_ANSWERS.containsKey(questionId) && !questionId.equals("P1Q3.1")) {
                return "Invalid question ID: " + questionId;
            }

            // 2. Validate value
            if (questionId.equals("P1Q3.1")) {
                if (!isValidCountryCode(answer)) {
                    return "Invalid country code: " + answer;
                }
            } else {
                if (!VALID_ANSWERS.get(questionId).contains(answer)) {
                    return "Invalid answer '" + answer + "' for question: " + questionId;
                }
            }

            // 3. Validate path consistency
            if (PATH_RULES.containsKey(questionId)) {
                String rule = PATH_RULES.get(questionId);
                String[] parts = rule.split(":");
                String parentQuestion = parts[0];
                String requiredAnswer = parts[1];

                if (!requiredAnswer.equals(session.get(parentQuestion))) {
                    return "Path inconsistency: " + questionId +
                            " requires " + parentQuestion + "=" + requiredAnswer;
                }
            }
        }
        return null;
    }

    private boolean isValidCountryCode(String code) {
        return Arrays.asList(Locale.getISOCountries()).contains(code);
    }
}
