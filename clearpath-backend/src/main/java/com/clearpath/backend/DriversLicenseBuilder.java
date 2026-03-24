package com.clearpath.backend;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Locale;

import org.springframework.stereotype.Component;

@Component
public class DriversLicenseBuilder {
    private List<Map<String, String>> countryOptions = null;

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
    //Phase1 Question2.1Work Permit: What type of Work Permit do you have?
    public Map<String, Object> P1Q2_1WP() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "What type of Work Permit do you have?");
        response.put("options", List.of(
                Map.of("value", "OWP", "label", "Open Work Permit"),
                Map.of("value", "ESWP", "label", "Employer-specific Work Permit"),
                Map.of("value", "UserNotSure", "label", "I'm not sure")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2.2Work Permit: Is your Work Permit valid for 6+ months?
    public Map<String, Object> P1Q2_2WP() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "Is your Work Permit valid for 6+ months?");
        response.put("options", List.of(
                Map.of("value", "MoreThen6", "label", "Yes, 6+ months"),
                Map.of("value", "LessThen6", "label", "Expires soon (less than 6 months)"),
                Map.of("value", "Expired", "label", "No/Expired")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2.3Work Permit: What is the status of your Work Permit?
    public Map<String, Object> P1Q2_2WPNotSure() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "What is the status of your Work Permit?");
        response.put("options", List.of(
                Map.of("value", "Open", "label", "I checked, it's Open"),
                Map.of("value", "ES", "label", " I checked, it's Employer-specific"),
                Map.of("value", "UserNotSure", "label", "I still can't tell, I need help")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2.1Protected Person/Refugee: What is your current status?
    public Map<String, Object> P1Q2_1PPR() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "What is your current status?");
        response.put("options", List.of(
                Map.of("value", "Waiting", "label", "Refugee Claimant (still waiting for decision) "),
                Map.of("value", "Approved", "label", "Convention Refugee / Protected Person (claim approved)"),
                Map.of("value", "UserNotSure", "label", "I'm not sure")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2.2Protected Person/Refugee waiting for decision: What document do you have?
    public Map<String, Object> P1Q2_2PPRWaiting() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "What document do you have?");
        response.put("options", List.of(
                Map.of("value", "IMM1434", "label", "Yes, IMM 1434"),
                Map.of("value", "IMM7703", "label", "Yes, IMM 7703 (with photo)"),
                Map.of("value", "UserNotSure", "label", "I'm not sure")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2.2Protected Person/Refugee Approved: Do you have all of those documents?
    public Map<String, Object> P1Q2_2PPRApproved() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "What document do you have?");
        response.put("options", List.of(
                Map.of("value", "ImReady", "label", "Yes, I have them ready "),
                Map.of("value", "DocMissing", "label", "Missing some documents "),
                Map.of("value", "Help", "label", "Need help understanding these")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2.1Visitor: "Visitor" covers different situations. Let's clarify yours:
    public Map<String, Object> P1Q2_1VIS() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "Visitor covers different situations. Let's clarify yours:");
        response.put("options", List.of(
                Map.of("value", "ShortTerm", "label", "I'm a short-term tourist(no Visitor Record)"),
                Map.of("value", "HasVisitorRecord", "label", "I have a Visitor Record (IMM 1442) - extended stay"),
                Map.of("value", "WaitingPRWP", "label", "I'm waiting for PR/WP approval (Maintained Status)"),
                Map.of("value", "UserNotSure", "label", "I'm not sure what I have")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2.1PR: Documents depend on which stage of PR you're at. Let's clarify yours:
    public Map<String, Object> P1Q2_1PR() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "Documents depend on which stage of PR you're at. Let's clarify yours:");
        response.put("options", List.of(
                Map.of("value", "PRCard", "label", "I have a PR Card"),
                Map.of("value", "NewPR", "label", "I'm a new PR (have COPR - Landing paper IMM 5292"),
                Map.of("value", "UserNotSure", "label", "I'm not sure what I have")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2.2PR with Card: Is your PR Card expired?
    public Map<String, Object> P1Q2_2PRCard() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "Is your PR Card expired?");
        response.put("options", List.of(
                Map.of("value", "Valid", "label", "Valid (not expired)"),
                Map.of("value", "Expired", "label", "Expired")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question2.2new PR: Check your documents
    public Map<String, Object> P1Q2_2PRNew() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "Check your documents");
        response.put("options", List.of(
                Map.of("value", "HaveBoth", "label", "Yes, I have both"),
                Map.of("value", "JustOne", "label", "I only have COPR, no passport"),
                Map.of("value", "UserHasQuestion", "label", "I have questions about this")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question3 driver's license from another country?

    public Map<String, Object> P1Q3() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "Do you have a valid driver's license from another country?");
        response.put("options", List.of(
                Map.of("value", "Yes", "label", "Yes"),
                Map.of("value", "No", "label", "No"),
                Map.of("value", "Expired", "label", "Expired / Lost")
        ));
        return response;
    }

    public Map<String, Object> P1Q3_1() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "Which country issued your license?");
        if (countryOptions == null) {
            countryOptions = new ArrayList<>();
            String[] countryCodes = Locale.getISOCountries();
            for (String code : countryCodes) {
                Locale locale = new Locale("", code);
                countryOptions.add(Map.of(
                        "value", code,
                        "label", locale.getDisplayCountry(Locale.ENGLISH)
                ));
            }
        }
        response.put("options", countryOptions);
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question3.2 How long have you been licensed?
    public Map<String, Object> P1Q3_2NotAgreement() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "How long have you been licensed?");
        response.put("options", List.of(
                Map.of("value", "Less1Year", "label", "Less than 1 year"),
                Map.of("value", "1To2", "label", "1-2 years"),
                Map.of("value", "MoreThen2", "label", "2+ years")
        ));
        return response;
    }

    //------------------------------------------------------------------------------------------------------
    //Phase1 Question3.3 driving record/abstract from home country?
    public Map<String, Object> P1Q3_3NotAgreement() {
        Map<String, Object> response = new HashMap<>();
        response.put("question", "Q3.3: Do you have an official driving record/abstract from \n" +
                "your home country?");
        response.put("options", List.of(
                Map.of("value", "Yes", "label", "Yes, I can get it"),
                Map.of("value", "No", "label", "No"),
                Map.of("value", "NotSure", "label", "Not sure what this is")
        ));
        return response;
    }








}

