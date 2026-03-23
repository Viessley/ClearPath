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
            String servicePrompt = buildServicePrompt(session, userMessage);
            String serviceResponse = extractText(callGemini(buildGeminiRequest(servicePrompt, false)));
            System.out.println("Agent 1: Service response generated.");

            String validationPrompt = buildValidationPrompt(serviceResponse);
            String validatedResponse = extractText(callGemini(buildGeminiRequest(validationPrompt, true)));
            System.out.println("Agent 2: Validation complete.");
            if (!serviceResponse.equals(validatedResponse)) {
                System.out.println("️Agent 2 made corrections.");
            }

            String plainPrompt = buildPlainLanguagePrompt(validatedResponse);
            String finalResponse = extractText(callGemini(buildGeminiRequest(plainPrompt, false)));
            System.out.println("Agent 3: Plain language output ready.");

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

    // Agent 1: Customer Service
    private String buildServicePrompt(Map<String, String> session, String userMessage) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String sessionJson = mapper.writeValueAsString(session);

            return """
                You are ClearPath, an AI assistant helping newcomers navigate
                Canadian government processes.
                
                This user is going through the Ontario driver's license process.
                
                User's background from decision tree:
                %s
                
                User's message:
                %s
                
                Provide specific guidance for their situation.
                Include document requirements, steps, fees, and locations.
                Stay focused on the Ontario driver's license process only.
                """.formatted(sessionJson, userMessage);

        } catch (Exception e) {
            return userMessage;
        }
    }

    // Agent 2: Validation
    private String buildValidationPrompt(String serviceResponse) {
        return """
            You are a fact-checking agent for Ontario driving regulations.
            
            Use Google Search to verify each factual claim below against
            official sources (ontario.ca, drivetest.ca, canada.ca).
            
            Original:
            %s
            
            Output ONLY the corrected version of the original text.
            - If everything is correct, return it unchanged.
            - If anything is wrong, fix it silently.
            - Do not add commentary, do not explain what you changed.
            - Do not add any verification markers or source URLs.
            - Just output the clean, corrected guidance.
            """.formatted(serviceResponse);
    }

    // Agent 3: Plain Language
    private String buildPlainLanguagePrompt(String validatedResponse) {
        return """
            You are formatting a cheatsheet for a newcomer going to complete
            a government task. Extract from the following and restructure.
            
            Original:
            %s
            
            Output in this exact format:
            
            **Your Steps:**
            1. [Step title in 5 words or less]
               → [One sentence: what to do]
            2. [Next step]
               → [One sentence]
            (keep steps in order, typically 3-5 steps)
            
            **Document Checklist:**
            | Document | Requirement |
            | [document name] | [what it must satisfy, e.g. "Original, not expired"] |
            | [document name] | [requirement] |
            
            **Cost:**
            - Total: $[amount] (before tax)
            - Includes: [brief breakdown in one line]
            - Other costs: [if any, one line]
            
            **Where:**
            - [Location name or website]
            - [How to book if applicable]
            
            Rules:
            - No greetings, no encouragement, no filler
            - No explanations of WHY — only WHAT and HOW
            - Remove all source URLs
            - Each step must be actionable — something the user physically does
            - Document checklist must be specific to this user's situation
            - If something needs more detail, add [Details] tag after it
              so the frontend can add a "Tell me more" button there
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