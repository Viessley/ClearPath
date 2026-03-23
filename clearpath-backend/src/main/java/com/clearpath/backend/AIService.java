package com.clearpath.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
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

    private static final String MODEL = "gemini-2.0-flash";
    private static final String ENDPOINT =
            "https://generativelanguage.googleapis.com/v1beta/models/"
                    + MODEL + ":generateContent?key=";

    public String chat(Map<String, String> session, String userMessage) {

        String prompt = buildPrompt(session, userMessage);

        // Gemini request format: contents -> parts -> text
        String requestBody = """
                {
                    "contents": [
                        {
                            "parts": [
                                { "text": "%s" }
                            ]
                        }
                    ]
                }
                """.formatted(prompt.replace("\"", "\\\"")
                .replace("\n", "\\n"));

        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ENDPOINT + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());

            return parseGeminiResponse(response.body());

        } catch (Exception e) {
            return "AI service error: " + e.getMessage();
        }
    }

    // Gemini response structure:
    // { "candidates": [ { "content": { "parts": [ { "text": "..." } ] } } ] }
    private String parseGeminiResponse(String responseBody) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(responseBody);
            return root
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text")
                    .asText("No response from AI.");
        } catch (Exception e) {
            // Return raw body if parsing fails (useful for debugging)
            return responseBody;
        }
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