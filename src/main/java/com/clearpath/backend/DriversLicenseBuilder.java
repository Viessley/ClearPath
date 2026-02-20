package com.clearpath.backend;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class DriversLicenseBuilder {



    // ===== Question Library =====
    //------------------------------------------------------------------------------------------------------
    //Phase1 Question1: How old are you?
    public Map<String, Object> P1Q1(){
        Map<String, Object> response = new HashMap<>();
        response.put("question","How old are you");
        response.put("options",List.of(
                Map.of("value", "under16",   "label", "Under 16"),
                Map.of("value", "age16to17", "label", "16 - 17"),
                Map.of("value", "age18plus", "label", "18 or older")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question1.1: Do you have one of these available??
    public Map<String, Object> P1Q1_1() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "Do you have one of these available?");
        response.put("options", List.of(
                Map.of("value", "can_sign", "label", " I have someone who can sign"),
                Map.of("value", "not_sure",  "label", "I'm not sure about my situation")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question1.1 user not sure: How would you like to proceed?
    public Map<String, Object> P1Q1_1notSure() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "How would you like to proceed?");
        response.put("options", List.of(
                Map.of("value", "userInput", "label", "I'll tell you my situation (text/voice)"),
                Map.of("value", "clearPathGuided",  "label", "Ask me questions to understand (guided)")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question1.2 Where is your parent/guardian?
    public Map<String, Object> P1Q1_2() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "Where is your parent/guardian?");
        response.put("options", List.of(
                Map.of("value", "inCanada", "label", "In Canada"),
                Map.of("value", "outsideCanada",  "label", "Outside Canada")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2: What's your status in Canada?
    public Map<String, Object> P1Q2() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "What is your status in Canada?");
        response.put("options", List.of(
                Map.of("value", "international_student",    "label", "International Student"),
                Map.of("value", "work_permit",              "label", "Work Permit"),
                Map.of("value", "visitor",                  "label", "Visitor"),
                Map.of("value", "permanent_resident",       "label", "Permanent Resident"),
                Map.of("value", "protected_person_refugee", "label", "Protected Person/Refugee")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2.1 International Student: Do you have a valid Study Permit?
    public Map<String, Object> P1Q2_1IS() {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "NEXT_QUESTION");
        response.put("questionId", "Q2.1.IS");
        response.put("question", "Do you have a valid Study Permit?");
        response.put("options", List.of(
                Map.of("value", "validMoreThan6Months", "label", "Yes, valid for 6+ months"),
                Map.of("value", "validLessThan6Months", "label", "Yes, but expires soon (less than 6 months)"),
                Map.of("value", "noExpired",            "label", "No / Expired")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2.1 International Student, Study Permit less then 6 months:
    //We can help you extend it first! Would you like to:
    public Map<String, Object> P1Q2_1ISLess6Months() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "We can help you extend it first! Would you like to:");
        response.put("options", List.of(
                Map.of("value", "SPEFirst", "label", " Get help with Study Permit Extension (SPE) first   "),
                Map.of("value", "ContinueAnyway", "label", "Continue with driver's license plan anyway"),
                Map.of("value", "SpecialCase", "label", "My case is special")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2.1International Student, Study Permit Expired:
    //What is your status now?:
    public Map<String, Object> P1Q2_1ISExpired() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "What is your status now?");
        response.put("options", List.of(
                Map.of("value", "ExpiredNeedRenew", "label", " My permit expired - I need to renew it"),
                Map.of("value", "WaitingApproval", "label", "I'm waiting for permit approval"),
                Map.of("value", "ApplyPGWPInstead", "label", "I'm applying for PGWP instead"),
                Map.of("value", "UserExplain", "label", "Other situation - let me explain")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2.1International Student, Study Permit Expired:
    //What is your status now?:
    public Map<String, Object> P1Q2_1ISExpired() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "What is your status now?");
        response.put("options", List.of(
                Map.of("value", "ExpiredNeedRenew", "label", " My permit expired - I need to renew it"),
                Map.of("value", "WaitingApproval", "label", "I'm waiting for permit approval"),
                Map.of("value", "ApplyPGWPInstead", "label", "I'm applying for PGWP instead"),
                Map.of("value", "UserExplain", "label", "Other situation - let me explain")
        ));
        return response;
    }


}

