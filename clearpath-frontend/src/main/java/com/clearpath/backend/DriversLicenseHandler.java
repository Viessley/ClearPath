package com.clearpath.backend;

import java.util.List;
import java.util.Locale;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DriversLicenseHandler {
    @Autowired
    private DriversLicenseBuilder questionBuilder;

    public Map<String, Object> handleP1Q1(String value) {
        return switch (value) {
            case "under16" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "ANSWER");
                response.put("feedback", "You must be at least 16 to apply for a G1 license in Ontario.");
                response.put("done", true);
                yield response;
            }

            case "age16to17" -> {
                Map<String, Object> response = questionBuilder.P1Q1_1();
                response.put("type", "NEXT_QUESTION");
                response.put("questionId", "P1Q1.1");
                response.put("feedback", "You can apply, but you need parental/guardian consent.");
                response.put("done", false);
                yield response;
            }

            case "age18plus" -> {
                Map<String, Object> response = questionBuilder.P1Q2();
                response.put("type", "NEXT_QUESTION");
                response.put("questionId", "P1Q2");
                response.put("feedback", "Great! You're 18 or older, so you can apply independently.  ");
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q1_1(String value) {
        return switch (value) {
            case "can_sign" -> {
                Map<String, Object> response = questionBuilder.P1Q1_2();
                response.put("type", "NEXT_QUESTION");
                response.put("questionId", "P1Q1.2");
                response.put("feedback", "Great! Where is your guardian? DriveTest's consent process varies by location");
                response.put("done", false);
                yield response;
            }

            case "not_sure" -> {
                Map<String, Object> response = questionBuilder.P1Q1_1notSure();
                response.put("type", "AI_SUPPORT");
                response.put("questionId", "P1Q1.1NotSure");
                response.put("feedback", "No problem, let's figure this out together.\n" +
                        "This requires sharing some personal information.");
                response.put("done", false);
                response.put("aiSupport", true);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q1_1NotSure(String value) {
        return switch (value) {
            case "userInput" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "Go ahead! Tell me your situation.");
                response.put("inputType", "TEXT");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }

            case "clearPathGuided" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "I'll ask you a few questions to understand your situation.");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q1_2(String value) {
        return switch (value) {
            case "inCanada" -> {
                Map<String, Object> response = questionBuilder.P1Q2();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "Good news! Since they're in Canada, the process is simpler.");
                response.put("questionId", "P1Q2");
                response.put("done", false);
                yield response;
            }

            case "outsideCanada" -> {
                Map<String, Object> response = questionBuilder.P1Q2();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "Since they're outside Canada, they'll need to provide notarized consent.");
                response.put("questionId", "P1Q2");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q2(String value) {
        return switch (value) {
            case "international_student" -> {
                Map<String, Object> response = questionBuilder.P1Q2_1IS();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "As an International Student, you'll need your Study Permit to apply.");
                response.put("questionId", "P1Q2.1IS");
                response.put("done", false);
                yield response;
            }

            case "work_permit" -> {
                Map<String, Object> response = questionBuilder.P1Q2_1WP();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "As a Work Permit holder, you'll need your Work Permit to apply.");
                response.put("questionId", "P1Q2.1WP");
                response.put("done", false);
                yield response;
            }

            case "visitor" -> {
                Map<String, Object> response = questionBuilder.P1Q2_1VIS();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "Visitor covers different situations. Let's clarify yours:");
                response.put("questionId", "P1Q2.1VIS");
                response.put("done", false);
                yield response;
            }

            case "permanent_resident" -> {
                Map<String, Object> response = questionBuilder.P1Q2_1PR();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "As a Permanent Resident, your required documents depend on which stage of PR you're at.");
                response.put("questionId", "P1Q2.1PR");
                response.put("done", false);
                yield response;
            }

            case "protected_person_refugee" -> {
                Map<String, Object> response = questionBuilder.P1Q2_1PPR();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "As a protected person, your required documents depend on your current status.");
                response.put("questionId", "P1Q2.1PPR");
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q2_1IS(String value) {
        return switch (value) {
            case "validMoreThan6Months" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "Great! We have your status sorted. Now, one question that could significantly change your path and save you a lot of time.");
                response.put("questionId", "P1Q3");
                response.put("done", false);
                yield response;
            }

            case "validLessThan6Months" -> {
                Map<String, Object> response = questionBuilder.P1Q2_1ISLess6Months();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "DriveTest requires 6+ months validity. You may only get a temporary license.");
                response.put("questionId", "P1Q2.1ISLess6Months");
                response.put("done", false);
                yield response;
            }

            case "noExpired" -> {
                Map<String, Object> response = questionBuilder.P1Q2_1ISExpired();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "Your Study Permit is expired or unavailable — you'll need a valid one to apply for an Ontario driver's license.");
                response.put("questionId", "P1Q2.1ISExpired");
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q2_1_ISless6Months(String value) {
        return switch (value) {
            case "SPEFirst" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "NEXT_SECTION");
                response.put("feedback", "Great! Let's sort our your Study Permit first.");
                response.put("sectionId", "SP");
                response.put("done", false);
                yield response;
            }

            case "ContinueAnyway" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "Let's move on.");
                response.put("questionId", "P1Q3");
                response.put("done", false);
                yield response;
            }

            case "SpecialCase" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "Tell me your story");
                response.put("aiSupport", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q2_1_ISexpired(String value) {
        return switch (value) {
            case "ExpiredNeedRenew" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "NEXT_SECTION");
                response.put("feedback", "Great! Let's sort our your Study Permit first.");
                response.put("sectionId", "SP");
                response.put("done", false);
                yield response;
            }

            case "WaitingApproval" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "This situation is complex. DriveTest requires a valid, original permit — maintained status may not be accepted. Let's look at your specific situation.");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }

            case "ApplyPGWPInstead" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "While waiting for PGWP approval, you're on maintained status — your Study Permit has expired and PGWP isn't issued yet. DriveTest may not accept this. Let's look at your specific situation.");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }

            case "UserExplain" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "Tell me your story");
                response.put("aiSupport", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q2_1WP(String value) {
        return switch (value) {
            case "OWP" -> {
                Map<String, Object> response = questionBuilder.P1Q2_2WP();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "saySomething");
                response.put("questionId", "P1Q2.2WP");
                response.put("done", false);
                yield response;
            }

            case "ESWP" -> {
                Map<String, Object> response = questionBuilder.P1Q2_2WP();
                response.put("type", "NEXT_SECTION");
                response.put("feedback", "saySomethingButNotNow");
                response.put("questionId", "P1Q2.2WP");
                response.put("done", false);
                yield response;
            }

            case "UserNotSure" -> {
                Map<String, Object> response = questionBuilder.P1Q2_2WPNotSure();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "How to check: Open Work Permit says:" +
                        "This permit does not restrict the holder" +
                        "to a specific employer");
                response.put("questionId", "P1Q2.2WPNotSure");
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q2_2WP(String value) {
        return switch (value) {
            case "MoreThen6" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "saySomething");
                response.put("questionId", "P1Q3");
                response.put("done", false);
                yield response;
            }

            case "LessThen6" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "saySomethingButNotNow");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }

            case "Expired" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "NEXT_SECTION");
                response.put("sectionId", "WP");
                response.put("feedback", "We have to fix your Work Permit first");
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q2_2WPNotSure(String value) {
        return switch (value) {
            case "Open" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "saySomething");
                response.put("questionId", "P1Q3");
                response.put("done", false);
                yield response;
            }

            case "ES" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type", "NEXT_QUESTION");
                response.put("questionId", "P1Q3");
                response.put("done", false);
                yield response;
            }

            case "UserNotSure" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "saySomethingButNotNow");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q2_1PPR(String value) {
        return switch (value) {
            case "Waiting" -> {
                Map<String, Object> response = questionBuilder.P1Q2_2PPRWaiting();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "You can apply for G1 while your claim is being processed.");
                response.put("questionId", "P1Q2.2PPRWaiting");
                response.put("done", false);
                yield response;
            }

            case "Approved" -> {
                Map<String, Object> response = questionBuilder.P1Q2_2PPRApproved();
                response.put("type", "NEXT_QUESTION");
                response.put("feedback", "You'll need a Refugee Travel Document OR Notice of Decision/VOS, plus a Photo ID with Signature.");
                response.put("questionId", "P1Q2_2PPRApproved");
                response.put("done", false);
                yield response;
            }

            case "UserNotSure" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "Let's figure out which document you have");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q2_2PPRWaiting(String value) {
        return switch (value) {
            case "IMM1434" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type", "NEXT_QUESTION");
                response.put("questionId", "P1Q3");
                response.put("feedback", "Great! IMM 1434 is accepted. Let's move on.");
                response.put("done", false);
                yield response;
            }
            case "IMM7703" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type", "NEXT_QUESTION");
                response.put("questionId", "P1Q3");
                response.put("feedback", "Great! IMM 7703 with photo is accepted. Let's move on.");
                response.put("done", false);
                yield response;
            }
            case "UserNotSure" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "Let's figure out which document you have");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q2_2PPRApproved(String value) {
        return switch (value) {
            case "ImReady" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type", "NEXT_QUESTION");
                response.put("questionId", "P1Q3");
                response.put("feedback", "Perfect! You have everything you need. Let's move on.");
                response.put("done", false);
                yield response;
            }

            case "DocMissing" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "Let's figure out which documents you're missing and how to get them");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }

            case "help" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "Let me explain what each document is and where to get it.");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q2_1PR(String value) {
        return switch (value) {
            case "PRCard" -> {
                Map<String, Object> response = questionBuilder.P1Q2_2PRCard();
                response.put("type", "NEXT_QUESTION");
                response.put("questionId", "P1Q2.2PRCard");
                response.put("feedback", "PR Cards are valid for 5 years. Let's check yours.");
                response.put("done", false);
                yield response;
            }
            case "NewPR" -> {
                Map<String, Object> response = questionBuilder.P1Q2_2PRNew();
                response.put("type", "NEXT_QUESTION");
                response.put("questionId", "P1Q2.2PRNew");
                response.put("feedback", "Important: Your COPR (IMM 5292) does NOT have a photo. DriveTest requires a photo, so you MUST bring BOTH: COPR (IMM 5292) AND your valid passport from your home country.");
                response.put("done", false);
                yield response;
            }
            case "UserNotSure" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "No problem, let's figure out your PR stage together.");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q2_2PRCard(String value) {
        return switch (value) {
            case "Valid" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type", "NEXT_QUESTION");
                response.put("questionId", "P1Q3");
                response.put("feedback", "Great! Your PR Card is valid. Let's move on.");
                response.put("done", false);
                yield response;
            }
            case "Expired" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "An expired PR Card may not be accepted. Let's figure out your options.");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }


    public Map<String, Object> handleP1Q2_2PRNew(String value) {
        return switch (value) {
            case "HaveBoth" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type", "NEXT_QUESTION");
                response.put("questionId", "P1Q3");
                response.put("feedback", "Perfect! You have both COPR and passport. Let's move on.");
                response.put("done", false);
                yield response;
            }
            case "JustOne" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "You'll need both COPR and a valid passport. Let's figure out your options.");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }

            case "UserHasQuestion" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type", "AI_SUPPORT");
                response.put("feedback", "No problem! Let me explain what you need and why.");
                response.put("aiSupport", true);
                response.put("done", false);
                yield response;
            }
            default -> Map.of("error", "Unknown value");
        };
    }

    public Map<String, Object> handleP1Q2_1VIS(String value) {
        return switch (value) {
            case "ShortTerm" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type",     "ANSWER");
                response.put("feedback", "As a short-term tourist, you cannot apply for an Ontario driver's license. You may drive with your foreign license for up to 3 months.");
                response.put("done",     true);
                yield response;
            }
            case "HasVisitorRecord" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type",       "NEXT_QUESTION");
                response.put("questionId", "P1Q3");
                response.put("feedback",   "Great! A Visitor Record (IMM 1442) is accepted. Let's move on.");
                response.put("done",       false);
                yield response;
            }
            case "WaitingPRWP" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type",      "AI_SUPPORT");
                response.put("feedback",  "Maintained status is complex — DriveTest may not accept it. Let's look at your specific situation.");
                response.put("aiSupport", true);
                response.put("done",      false);
                yield response;
            }
            case "UserNotSure" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type",      "AI_SUPPORT");
                response.put("feedback",  "No problem, let's figure out your visitor status together.");
                response.put("aiSupport", true);
                response.put("done",      false);
                yield response;
            }
            default -> {
                yield Map.of("error", "Unknown value");
            }
        };
    }

    public Map<String, Object> handleP1Q3(String value) {
        return switch (value) {
            case "Yes" -> {
                Map<String, Object> response = questionBuilder.P1Q3();
                response.put("type",       "NEXT_QUESTION");
                response.put("questionId", "P1Q3.1");
                response.put("feedback",   "Great! Which country issued your license?");
                response.put("done",       false);
                yield response;
            }
            case "No" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type",     "ANSWER");
                response.put("feedback", "No foreign license — you'll go through the full G1→G2→G process.");
                response.put("done",     true);
                yield response;
            }
            case "Expired" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type",      "AI_SUPPORT");
                response.put("feedback",  "An expired or lost license situation can vary. Let's look at your specific case.");
                response.put("aiSupport", true);
                response.put("done",      false);
                yield response;
            }
            default -> {
                yield Map.of("error", "Unknown value");
            }
        };
    }

    public Map<String, Object> handleP1Q3_1(String value) {
        boolean agreement = hasAgreement(value);
        if (agreement) {
            Map<String, Object> response = new HashMap<>();
            response.put("type",      "ANSWER");
            response.put("feedback",  "Great news! " + getCountryName(value) + " has a license exchange agreement with Ontario. You may be able to exchange your license directly without going through the full G1/G2 process!");
            response.put("agreement", true);
            response.put("country",   value);
            response.put("done",      true);
            return response;
        } else {
            Map<String, Object> response = questionBuilder.P1Q3_2NotAgreement();
            response.put("type",       "NEXT_QUESTION");
            response.put("questionId", "P1Q3.2NotAgreement");
            response.put("feedback",   "Your country doesn't have a direct exchange agreement with Ontario. But your experience may still help — let's check.");
            response.put("done",       false);
            return response;
        }
    }

    public Map<String, Object> handleP1Q3_2NotAgreement(String value) {
        return switch (value) {
            case "Less1Year" -> {
                Map<String, Object> response = questionBuilder.P1Q3_3NotAgreement();
                response.put("type",       "NEXT_QUESTION");
                response.put("questionId", "P1Q3.3NotAgreement");
                response.put("feedback",   "Less than 1 year of experience. You'll need to go through the full G1 process, but your foreign experience may reduce wait times.");
                response.put("done",       false);
                yield response;
            }
            case "1To2" -> {
                Map<String, Object> response = questionBuilder.P1Q3_3NotAgreement();
                response.put("type",       "NEXT_QUESTION");
                response.put("questionId", "P1Q3.3NotAgreement");
                response.put("feedback",   "1-2 years of experience. You may be able to skip the G1 wait period.");
                response.put("done",       false);
                yield response;
            }
            case "MoreThen2" -> {
                Map<String, Object> response = questionBuilder.P1Q3_3NotAgreement();
                response.put("type",       "NEXT_QUESTION");
                response.put("questionId", "P1Q3.3NotAgreement");
                response.put("feedback",   "2+ years of experience. You may be eligible to take the G2 exit test directly!");
                response.put("done",       false);
                yield response;
            }
            default -> {
                yield Map.of("error", "Unknown value");
            }
        };
    }

    public Map<String, Object> handleP1Q3_3NotAgreement(String value) {
        return switch (value) {
            case "Yes" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type",     "ANSWER");
                response.put("feedback", "Great! Bring your foreign license and driving record to DriveTest. Your experience will be credited toward Ontario's graduated licensing system.");
                response.put("done",     true);
                yield response;
            }
            case "No" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type",     "ANSWER");
                response.put("feedback", "Without a driving record, DriveTest may not be able to credit your experience. You may need to go through the full G1/G2 process.");
                response.put("done",     true);
                yield response;
            }
            case "NotSure" -> {
                Map<String, Object> response = new HashMap<>();
                response.put("type",      "AI_SUPPORT");
                response.put("feedback",  "A driving record/abstract is an official document from your home country showing your driving history. Let me help you figure out how to get one.");
                response.put("aiSupport", true);
                response.put("done",      false);
                yield response;
            }
            default -> {
                yield Map.of("error", "Unknown value");
            }
        };
    }

    private boolean hasAgreement(String countryCode) {
        List<String> agreementCountries = List.of(
                "US", "GB", "DE", "FR", "AT", "BE", "CH", "KR", "JP", "AU", "NZ"
        );
        return agreementCountries.contains(countryCode);
    }

    private String getCountryName(String countryCode) {
        Locale locale = new Locale("", countryCode);
        return locale.getDisplayCountry(Locale.ENGLISH);
    }
}

