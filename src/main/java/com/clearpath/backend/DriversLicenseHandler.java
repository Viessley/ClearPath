package com.clearpath.backend;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DriversLicenseHandler {
    @Autowired
    private DriversLicenseBuilder builder;

    // ===== Helper =====
    private Map<String, Object> baseResponse(String questionId) {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "NEXT_QUESTION");
        response.put("questionId", questionId);
        return response;
    }

    // =============================================
    // Q1: How old are you?
    // =============================================
    public Map<String, Object> handleQ1(String value) {
        Map<String, Object> response = new HashMap<>();
        if (value.equals("under16")) {
            response.put("type", "ANSWER");
            response.put("feedback", "You must be at least 16 to apply for a G1 license in Ontario.");
            response.put("done", true);
        } else if (value.equals("age16to17")) {
            response.put("type", "NEXT_QUESTION");
            response.put("questionId", "Q1.1");
            response.put("feedback", "You can apply drive licence, You need parental/guardian consent to apply.");
            response.put("question", "Do you have one of these available?");
            response.put("options", List.of(
                    Map.of("value", "can_sign", "label", "I have someone who can sign"),
                    Map.of("value", "not_sure",  "label", "I'm not sure about my situation")
            ));
            response.put("done", false);
        } else if (value.equals("age18plus")) {
            return builder.buildQ2();
        }
        return response;
    }

    // =============================================
    // Q1.1: Do you have one of these available?
    // =============================================
    public Map<String, Object> handleQ1_1(String value) {
        Map<String, Object> response = new HashMap<>();
        if (value.equals("can_sign")) {
            response.put("type", "NEXT_QUESTION");
            response.put("questionId", "Q1.2");
            response.put("feedback", "Perfect! You have someone who can sign for you.");
            response.put("message", "DriveTest has different consent procedures depending on their location.");
            response.put("question", "Where is your parent/guardian?");
            response.put("options", List.of(
                    Map.of("value", "in_canada",      "label", "In Canada"),
                    Map.of("value", "outside_canada", "label", "Outside Canada")
            ));
            response.put("done", false);
        } else if (value.equals("not_sure")) {
            response.put("type", "PERSONAL");
            response.put("feedback", "No problem, let's figure this out together.");
            response.put("message", "This requires sharing some personal information");
            response.put("done", false);
            response.put("aiSupport", true);
        }
        return response;
    }

    // =============================================
    // Q1.2: Where is your parent/guardian?
    // =============================================
    public Map<String, Object> handleQ1_2(String value) {
        Map<String, Object> response = new HashMap<>();
        if (value.equals("in_canada")) {
            response.put("feedback", "Good news! Since they're in Canada, the process is simpler.");
        } else if (value.equals("outside_canada")) {
            response.put("type", "PERSONAL");
            response.put("feedback", "Since they're outside Canada, they'll need to provide notarized consent.");
            response.put("message", "This requires sharing some personal information");
            response.put("done", false);
            response.put("aiSupport", true);
        }
        return response;
    }

    // =============================================
    // Q1.2 Not Sure
    // =============================================
    public Map<String, Object> handleQ1_2_NotSure(String value) {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "PERSONAL");
        response.put("feedback", "No problem, let's figure this out together.");
        response.put("message", "This requires sharing some personal information");
        response.put("done", false);
        response.put("aiSupport", true);
        return response;
    }

    // =============================================
    // Q2: What is your status in Canada?
    // =============================================
    public Map<String, Object> handleQ2(String value) {
        Map<String, Object> response = new HashMap<>();
        if (value.equals("international_student")) {
            response.put("type", "NEXT_QUESTION");
            response.put("questionId", "Q2.1.IS");
            response.put("feedback", "As an International Student, you'll need your Study Permit to apply.");
            response.put("question", "Do you have a valid Study Permit?");
            response.put("options", List.of(
                    Map.of("value", "validMoreThan6Months", "label", "Yes, valid for 6+ months"),
                    Map.of("value", "validLessThan6Months", "label", "Yes, but expires soon (less than 6 months)"),
                    Map.of("value", "noExpired",            "label", "No / Expired")
            ));
            response.put("done", false);
        } else if (value.equals("work_permit")) {
            response.put("type", "NEXT_QUESTION");
            response.put("questionId", "Q2.1.WP");
            response.put("feedback", "As a Work Permit holder, you'll need your Work Permit to apply.");
            response.put("question", "What type of Work Permit do you have?");
            response.put("options", List.of(
                    Map.of("value", "openWorkPermit",              "label", "Open Work Permit"),
                    Map.of("value", "employerSpecificWorkPermit",  "label", "Employer-specific Work Permit"),
                    Map.of("value", "notSure",                     "label", "I'm not sure")
            ));
            response.put("done", false);
        } else if (value.equals("visitor")) {
            response.put("type", "NEXT_QUESTION");
            response.put("questionId", "Q2.1.VIS");
            response.put("feedback", "Visitor covers different situations. Let's clarify yours:");
            response.put("question", "Which one describes you best?");
            response.put("options", List.of(
                    Map.of("value", "shortTermTourist", "label", "I'm a short-term tourist (no Visitor Record)"),
                    Map.of("value", "visitorRecord",    "label", "I have a Visitor Record (IMM 1442) - extended stay"),
                    Map.of("value", "waitingPR_WP",     "label", "I'm waiting for PR/WP approval (Maintained Status)"),
                    Map.of("value", "notSure",          "label", "I'm not sure what I have")
            ));
            response.put("done", false);
        } else if (value.equals("permanent_resident")) {
            response.put("type", "NEXT_QUESTION");
            response.put("questionId", "Q2.1.PR");
            response.put("feedback", "As a Permanent Resident, your required documents depend on which stage of PR you're at.");
            response.put("question", "Which one describes you best?");
            response.put("options", List.of(
                    Map.of("value", "PR",      "label", "I have a PR Card"),
                    Map.of("value", "newPR",   "label", "I'm a new PR (have COPR - Landing paper IMM 5292)"),
                    Map.of("value", "notSure", "label", "I'm not sure what I have")
            ));
            response.put("done", false);
        } else if (value.equals("protected_person_refugee")) {
            response.put("type", "NEXT_QUESTION");
            response.put("questionId", "Q2.1.PPR");
            response.put("feedback", "As a protected person, your required documents depend on your current status.");
            response.put("question", "Which one describes you best?");
            response.put("options", List.of(
                    Map.of("value", "RC",      "label", "Refugee Claimant (still waiting for decision)"),
                    Map.of("value", "CR_PP",   "label", "Convention Refugee / Protected Person (claim approved)"),
                    Map.of("value", "notSure", "label", "I'm not sure what I have")
            ));
            response.put("done", false);
        }
        return response;
    }

    // =============================================
    // Q2.1.IS: Do you have a valid Study Permit?
    // =============================================
    public Map<String, Object> handleQ2_1_IS(String value) {
        Map<String, Object> response = new HashMap<>();
        if (value.equals("validMoreThan6Months")) {
            response.put("type", "NEXT_QUESTION");
            response.put("questionId", "Q3");
            response.put("feedback", "Now, one question that could significantly change your path and save you a lot of time.");
            response.put("question", "Do you have a valid driver's license from another country?");
            response.put("options", List.of(
                    Map.of("value", "yes",          "label", "Yes I have"),
                    Map.of("value", "no",           "label", "No, never had one"),
                    Map.of("value", "expiredOrLost","label", "I used to have one (expired/lost)")
            ));
            response.put("done", false);
        } else if (value.equals("validLessThan6Months")) {
            response.put("type", "NEXT_QUESTION");
            response.put("questionId", "Q2.1.ISLess6Months");
            response.put("message", "DriveTest requires 6+ months validity. You may only get a temporary license.");
            response.put("feedback", "Your permit is expiring soon. What would you like to do?");
            response.put("question", "How would you like to proceed?");
            response.put("options", List.of(
                    Map.of("value", "helpWithSPE",     "label", "Get help with Study Permit Extension (SPE) first"),
                    Map.of("value", "continueAnyway",  "label", "Continue with driver's license plan anyway"),
                    Map.of("value", "specialCase",     "label", "My case is special")
            ));
            response.put("done", false);
        } else if (value.equals("noExpired")) {
            response.put("type", "NEXT_QUESTION");
            response.put("questionId", "Q2.1.ISExpired");
            response.put("message", "No valid Study Permit found. You'll need to renew it before applying.");
            response.put("question", "Which one describes you best?");
            response.put("options", List.of(
                    Map.of("value", "expired",          "label", "My permit expired - I need to renew it"),
                    Map.of("value", "waiting",          "label", "I'm waiting for permit approval"),
                    Map.of("value", "otherSituation",   "label", "Other situation - let me explain"),
                    Map.of("value", "applyingForPGWP",  "label", "I'm applying for PGWP instead")
            ));
            response.put("done", false);
        }
        return response;
    }

    public Map<String, Object> handleQ2_1_IS_less6Months(String value) {
        Map<String, Object> response = new HashMap<>();
        if(value.equals("validMoreThan6Months")){
            response.put("type", "NEXT_QUESTION");
            response.put("questionId","Q3.1_IS_moreThen6");
            response.put("feedback","Now, one question that could significantly change your path and save you a lot of time.");
            response.put("question"," Do you have a valid driver's license from another country?");
            response.put("options", List.of(
                    Map.of("value", "yes", "label", "Yes I have."),
                    Map.of("value", "no","label", "No, never had one"),
                    Map.of("value","expiredOrLost","label","I used to have one (expired/lost)")
            ));
            response.put("done",false);
    }
    public Map<String, Object> handleQ2_1_IS_expired(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ2_1_WP(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ2_2_WP(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ2_3_WP(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ2_3_WPNotSure(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ2_1_PPR(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ2_2_PPR(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ2_2_PPRApproved(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ2_1_VIS(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ2_1_PR(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ2_2_PRCard(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ2_2_PRNew(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ3(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ3_1(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ3_2NotAgreement(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ3_3NotAgreement(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
    public Map<String, Object> handleQ4(String value) {
        return Map.of("type", "COMING_SOON", "message", "Under construction", "done", false);
    }
}
