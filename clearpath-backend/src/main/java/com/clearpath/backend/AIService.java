package com.clearpath.backend;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.util.Map;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    public String chat(Map<String, String> session, String userMessage) {
        try {
            // Agent 1: Customer Service — generate initial guidance
            String servicePrompt = buildServicePrompt(session, userMessage);
            String serviceResponse = extractText(callGemini(buildGeminiRequest(servicePrompt, false)));
            System.out.println("Agent 1 (Service): " + serviceResponse);

            // Agent 2: Validation — verify against official sources via Google Search
            String validationPrompt = buildValidationPrompt(serviceResponse);
            String validatedResponse = extractText(callGemini(buildGeminiRequest(validationPrompt, true)));
            System.out.println("Agent 2 (Validation): " + validatedResponse);

            // Agent 3: Plain Language — simplify for the user
            String plainPrompt = buildPlainLanguagePrompt(validatedResponse);
            String finalResponse = extractText(callGemini(buildGeminiRequest(plainPrompt, false)));
            System.out.println("Agent 3 (Plain Language): " + finalResponse);

            return finalResponse;

        } catch (Exception e) {
            return "AI service error: " + e.getMessage();
        }
    }

    private String buildGeminiRequest(String prompt, boolean withSearch) {
        if (withSearch) {
            return """
                {
                    "contents": [
                        {
                            "parts": [
                                {"text": "%s"}
                            ]
                        }
                    ],
                    "tools": [
                        {"google_search": {}}
                    ]
                }
                """.formatted(prompt.replace("\"", "\\\"").replace("\n", "\\n"));
        } else {
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
    }

    // Agent 1: Customer Service
    private String buildServicePrompt(Map<String, String> session, String userMessage) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String sessionJson = mapper.writeValueAsString(session);

            return """
                You are ClearPath, an AI assistant helping newcomers navigate
                Canadian government processes.
                
                User's background from decision tree:
                %s
                
                User's message:
                %s
                
                Provide specific guidance for their situation.
                Include document requirements, steps, fees, and locations.
                """.formatted(sessionJson, userMessage);

        } catch (Exception e) {
            return userMessage;
        }
    }

    // Agent 2: Validation
    private String buildValidationPrompt(String serviceResponse) {
        return """
            You are a fact-checking agent specializing in Ontario driving regulations.
            
            Use Google Search to verify EVERY claim in the following guidance:
            %s
            
            For each claim, check against official sources:
            - ontario.ca
            - drivetest.ca
            - Service Ontario official pages
            
            You must:
            - Verify document requirements are current and accurate
            - Verify fees match official current amounts
            - Verify steps are in the correct order
            - Fix any inaccuracy with the correct information
            - At the end, list your sources as [Source: URL]
            
            Output the corrected guidance with sources.
            If something cannot be verified, flag it as [UNVERIFIED].
            """.formatted(serviceResponse);
    }

    // Agent 3: Plain Language
    private String buildPlainLanguagePrompt(String validatedResponse) {
        return """
            You are a plain language specialist. Rewrite the following
            guidance for an international student with intermediate English.
            
            Original:
            %s
            
            Rules:
            - Every sentence must carry useful information — cut filler
            - One idea per sentence
            - Use action verbs: "Bring your passport" not "You will need to bring your passport"
            - Replace complex words with simple ones: "valid" not "currently unexpired"
            - Use "you" and direct instructions
            - Group related info together, use bullet points for action steps
            - No greetings, no "Good luck", no encouragement padding
            - If there are [Source: URL] references, keep them at the end
            - Aim for maximum clarity with minimum words
            """.formatted(validatedResponse);
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
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(responseBody);
        return root.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText();
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