package com.clearpath.backend.service.phase1;

import com.clearpath.backend.entity.KnowledgeBase;
import com.clearpath.backend.repository.KnowledgeBaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class KnowledgeService {

    @Autowired
    private KnowledgeBaseRepository knowledgeBaseRepository;

    public Map<String, Object> buildCheatsheet(Map<String, String> session) {
        String topic = mapTopic(session);
        String subtopic = mapSubtopic(session);
        Map<String, Object> response = new HashMap<>();

        if (topic == null) {
            response.put("error", "Could not determine user profile from session.");
            return response;
        }

        List<KnowledgeBase> results;
        if (subtopic != null) {
            results = knowledgeBaseRepository.findByTopicAndSubtopic(topic, subtopic);
        } else {
            results = knowledgeBaseRepository.findByTopic(topic);
        }

        if (results.isEmpty()) {
            response.put("error", "No knowledge found for this profile.");
            return response;
        }

        KnowledgeBase kb = results.get(0);
        response.put("summary", kb.getSummary());
        response.put("content", kb.getContent());
        response.put("steps", kb.getSteps());
        response.put("documents", kb.getDocuments());
        response.put("tips", kb.getTips());
        response.put("fees", kb.getFees());
        response.put("officialRule", kb.getOfficialRule());
        response.put("sourceUrl", kb.getSourceUrl());
        response.put("topic", topic);
        response.put("subtopic", subtopic);

        String cheatsheet = "**Your Steps:**\n" + formatSteps(kb.getSteps()) +
                "\n**Document Checklist:**\n" + formatDocuments(kb.getDocuments()) +
                "\n**Cost:**\n" + (kb.getFees() != null ? kb.getFees() : "") +
                "\n**Tips:**\n" + formatTips(kb.getTips());

        response.put("cheatsheet", cheatsheet);
        response.put("overview",      kb.getOverview());
        response.put("cheatsheetTips", kb.getCheatsheetTips());
        response.put("whatToPrepare",  kb.getWhatToPrepare());
        response.put("sources",        kb.getSources());

        return response;

    }

    public String retrieveForAI(Map<String, String> session) {
        String topic = mapTopic(session);
        String subtopic = mapSubtopic(session);

        if (topic == null) return "";

        List<KnowledgeBase> results;
        if (subtopic != null) {
            results = knowledgeBaseRepository.findByTopicAndSubtopic(topic, subtopic);
        } else {
            results = knowledgeBaseRepository.findByTopic(topic);
        }

        if (results.isEmpty()) return "";

        KnowledgeBase kb = results.get(0);
        return """
                Summary: %s
                Official Rule: %s
                Steps: %s
                Documents: %s
                Tips: %s
                Fees: %s
                Source: %s
                """.formatted(
                kb.getSummary() != null ? kb.getSummary() : "",
                kb.getOfficialRule() != null ? kb.getOfficialRule() : "",
                kb.getSteps() != null ? kb.getSteps() : "",
                kb.getDocuments() != null ? kb.getDocuments() : "",
                kb.getTips() != null ? kb.getTips() : "",
                kb.getFees() != null ? kb.getFees() : "",
                kb.getSourceUrl() != null ? kb.getSourceUrl() : ""
        );
    }

    private String mapTopic(Map<String, String> session) {
        String status = session.get("P1Q2");
        if (status == null) return null;
        return switch (status) {
            case "international_student" -> "international_student";
            case "canadian_citizen" -> "canadian_citizen";
            case "permanent_resident" -> {
                String prType = session.get("P1Q2.1PR");
                yield "NewPR".equals(prType) ? "permanent_resident_copr" : "permanent_resident_pr_card";
            }
            case "work_permit" -> "work_permit";
            case "visitor" -> {
                String visType = session.get("P1Q2.1VIS");
                yield "HasVisitorRecord".equals(visType) ? "visitor_record" : "visitor_tourist";
            }
            case "protected_person_refugee" -> {
                String pprType = session.get("P1Q2.1PPR");
                yield "Approved".equals(pprType) ? "protected_person" : "refugee_claimant";
            }
            default -> null;
        };
    }

    private String mapSubtopic(Map<String, String> session) {
        String hasLicence = session.get("P1Q3");
        if ("No".equals(hasLicence)) return "no_foreign_licence";
        if ("Yes".equals(hasLicence)) {
            String country = session.get("P1Q3.1");
            List<String> agreementCountries = List.of(
                    "US", "GB", "DE", "FR", "AU", "NZ", "KR", "JP", "AT", "BE", "CH",
                    "HU", "DK", "IM", "IE", "TW"
            );
            if (country != null && agreementCountries.contains(country)) {
                return "exchange_agreement_licence";
            }
            String experience = session.get("P1Q3.2NotAgreement");
            String hasRecord = session.get("P1Q3.3NotAgreement");
            if ("No".equals(hasRecord)) return "non_agreement_no_record";
            if ("Less1Year".equals(experience)) return "non_agreement_record_under_1_year";
            if ("1To2".equals(experience)) return "non_agreement_record_1_to_2_years";
            if ("MoreThen2".equals(experience)) return "non_agreement_record_over_2_years";
        }
        return null;
    }

    public Integer resolveKbId(Map<String, String> session) {
        String subtopic = mapSubtopic(session);
        if (subtopic == null) return null;
        return switch (subtopic) {
            case "no_foreign_licence"              -> 1;
            case "exchange_agreement_licence"      -> 2;
            case "non_agreement_record_under_1_year" -> 3;
            case "non_agreement_record_1_to_2_years" -> 4;
            case "non_agreement_record_over_2_years" -> 5;
            case "non_agreement_no_record"         -> 6;
            default -> null;
        };
    }

    private String formatSteps(String stepsJson) {
        if (stepsJson == null) return "";
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<Map<String, Object>> steps = mapper.readValue(stepsJson, List.class);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < steps.size(); i++) {
                Map<String, Object> step = steps.get(i);
                sb.append(i + 1).append(". ").append(step.get("title")).append("\n");
                sb.append("   - ").append(step.get("description")).append("\n");
            }
            return sb.toString();
        } catch (Exception e) {
            return stepsJson;
        }
    }

    private String formatDocuments(String docsJson) {
        if (docsJson == null) return "";
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<Map<String, Object>> docs = mapper.readValue(docsJson, List.class);
            StringBuilder sb = new StringBuilder();
            sb.append("| Document | Requirement |\n");
            for (Map<String, Object> doc : docs) {
                sb.append("| ").append(doc.get("name")).append(" | ").append(doc.get("requirement")).append(" |\n");
            }
            return sb.toString();
        } catch (Exception e) {
            return docsJson;
        }
    }

    private String formatTips(String tipsJson) {
        if (tipsJson == null) return "";
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<Map<String, Object>> tips = mapper.readValue(tipsJson, List.class);
            StringBuilder sb = new StringBuilder();
            for (Map<String, Object> tip : tips) {
                sb.append("- ").append(tip.get("tip")).append("\n");
            }
            return sb.toString();
        } catch (Exception e) {
            return tipsJson;
        }
    }
}