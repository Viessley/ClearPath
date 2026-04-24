package com.clearpath.backend.service.phase1;

import com.clearpath.backend.dto.phase1.CheatsheetResponse;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.util.Map;

import com.clearpath.backend.service.phase1.KnowledgeService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Autowired
    private KnowledgeService knowledgeService;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    public String chat(Map<String, String> session, String userMessage, String stuckAt) {
        try {
            String servicePrompt = buildServicePrompt(session, userMessage, stuckAt);
            String serviceResponse = extractText(callGemini(buildGeminiRequest(servicePrompt, false)));
            System.out.println("Agent 1: Service response generated.");

            String plainPrompt = buildPlainLanguagePrompt(serviceResponse);
            String finalResponse = extractText(callGemini(buildGeminiRequest(plainPrompt, false)));
            System.out.println("Agent 2: Plain language output ready.");

            return finalResponse;

        } catch (Exception e) {
            return "AI service error: " + e.getMessage();
        }
    }

    private String buildServicePrompt(Map<String, String> session, String userMessage, String stuckAt) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String sessionJson = mapper.writeValueAsString(session);

            String stuckContext = (stuckAt != null && !stuckAt.isBlank())
                    ? "User is stuck at question: " + stuckAt
                    : "User is asking a follow-up question.";

            return """
                You are ClearPath, Ontario driver's license guide.

                Session: %s
                Context: %s
                User: %s

                Options:
                P1Q1:age18plus|age16to17|underAge16|notSure
                P1Q2:international_student|work_permit|visitor|permanent_resident|protected_person_refugee|canadian_citizen
                P1Q2.1IS:validMoreThan6Months|validLessThan6Months|expired
                P1Q2.1WP:open_work_permit|employer_specific
                P1Q2.2WP:validMoreThan6Months|validLessThan6Months|expired
                P1Q2.1VIS:short_term_tourist|long_stay
                P1Q2.1PR:pr_card|copr
                P1Q2.2PRCard:valid|expired
                P1Q3:Yes|No
                P1Q3.1:country_code
                P1Q3.2NotAgreement:Less1Year|1To2|MoreThen2
                P1Q3.3NotAgreement:Yes|No

                Rules:
                - Max 3 short sentences per reply.
                - Simple words. One idea per sentence.
                - Ask one question at a time.
                - ASCII only. No greetings.

                If sure of answer: one sentence why, then append:
                [DECISION: {"questionId":"...","answer":"..."}]

                If out of scope: append [SCOPE_OUT]
                If still asking: no tag.
                """.formatted(sessionJson, stuckContext, userMessage);

        } catch (Exception e) {
            return userMessage;
        }
    }

    private String buildPlainLanguagePrompt(String serviceResponse) {
        return """
                You are formatting guidance for a newcomer navigating a government process.

                Original:
                %s

                Rules:
                - If the original is asking clarifying questions, output those questions as-is. Do NOT reformat into steps.
                - If the original contains steps/documents/fees, restructure into this format:

                **Your Steps:**
                1. [Step title in 5 words or less]
                   - [One sentence: what to do]
                2. [Next step]
                   - [One sentence]

                **Document Checklist:**
                | Document | Requirement |
                | [document name] | [requirement] |

                **Cost:**
                - Total: $[amount] (before tax)
                - Includes: [brief breakdown]

                **Tips:**
                - [specific warning for this user's situation]
                - [common mistake for similar situations]
                - [easy to forget item]

                Use only standard ASCII characters. No emojis, no arrows, no special symbols.
                No greetings, no encouragement, no filler.
                """.formatted(serviceResponse);
    }

    public CheatsheetResponse generateCheatsheet(String prompt) {
        String requestBody = buildGeminiRequest(prompt);

        try {
            String responseBody = callGemini(requestBody);
            String content = extractText(responseBody);

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(content, CheatsheetResponse.class);
        } catch (Exception e) {
            return null;
        }
    }

    // ── Shared helpers ──

    private String buildGeminiRequest(String prompt, boolean withSearch) {
        if (withSearch) {
            return """
                    {
                        "contents": [
                            {"parts": [{"text": "%s"}]}
                        ],
                        "tools": [{"google_search": {}}]
                    }
                    """.formatted(prompt.replace("\"", "\\\"").replace("\n", "\\n"));
        } else {
            return """
                    {
                        "contents": [
                            {"parts": [{"text": "%s"}]}
                        ]
                    }
                    """.formatted(prompt.replace("\"", "\\\"").replace("\n", "\\n"));
        }
    }

    private String buildGeminiRequest(String prompt) {
        return """
                {
                    "contents": [
                        {
                            "parts": [
                                {"text": "%s"}
                            ]
                        }
                    ]
                }
                """.formatted(prompt.replace("\"", "\\\"").replace("\n", "\\n"));
    }

    private String callGemini(String requestBody) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GEMINI_URL + apiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

        return response.body();
    }

    private String extractText(String responseBody) throws Exception {
        System.out.println("Gemini raw: " + responseBody.substring(0, Math.min(300, responseBody.length())));
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(responseBody);
        String text = root.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText("No response from AI.");
        return text.replaceAll("[^\\x00-\\x7F]", "");
    }

    private String buildPrompt(Map<String, String> session, String userMessage) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String sessionJson = mapper.writeValueAsString(session);

            return """
                    You are ClearPath, an AI assistant helping people navigate
                    Canadian government processes.

                    User's background from decision tree:
                    %s

                    User's message:
                    %s

                    Please provide clear, specific guidance for their situation.
                    """.formatted(sessionJson, userMessage);

        } catch (Exception e) {
            return userMessage;
        }
    }
}
