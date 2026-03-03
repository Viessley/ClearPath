package com.clearpath.backend;

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

    @Value("${anthropic.api.key}")
    private String apiKey;

    public String chat(Map<String, String> session, String userMessage) {

        String prompt = buildPrompt(session, userMessage);

        String requestBody = """
                {
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 1024,
                    "messages": [
                        {
                            "role": "user",
                            "content": "%s"
                        }
                    ]
                }
                """.formatted(prompt.replace("\"", "\\\""));

        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.anthropic.com/v1/messages"))
                    .header("Content-Type", "application/json")
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", "2023-06-01")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());

            return response.body();

        } catch (Exception e) {
            return "AI service error: " + e.getMessage();
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