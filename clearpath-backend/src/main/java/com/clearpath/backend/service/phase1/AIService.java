package com.clearpath.backend.service.phase1;

import com.clearpath.backend.dto.phase1.CheatsheetResponse;
import com.clearpath.backend.entity.DtOption;
import com.clearpath.backend.repository.DtOptionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AIService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    @Autowired
    private KnowledgeService knowledgeService;

    @Autowired
    private DtOptionRepository dtOptionRepository;

    private static final String ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

    public String chat(Map<String, String> session, String userMessage, String stuckAt, String systemHint) {
        try {
            String prompt = buildServicePrompt(session, userMessage, stuckAt, systemHint);
            return callHaiku(prompt);
        } catch (Exception e) {
            return "Our AI is taking a break — the free API quota has been used up. Please try again in a few hours. You can also email clearpathwesley@gmail.com to speed things up.";
        }
    }

    private String buildServicePrompt(Map<String, String> session, String userMessage, String stuckAt, String systemHint) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String sessionJson = mapper.writeValueAsString(session);

            String stuckContext = (stuckAt != null && !stuckAt.isBlank())
                    ? "User is stuck at question: " + stuckAt
                    : "User is asking a follow-up question.";

            String hintContext = (systemHint != null && !systemHint.isBlank())
                    ? "\nSCOPE RULES:\n" + systemHint
                    : "";

            // Dynamically fetch options for the stuck question only
            String optionsContext = "";
            if (stuckAt != null && !stuckAt.isBlank()) {
                List<DtOption> options = dtOptionRepository.findByQuestionId(stuckAt);
                if (!options.isEmpty()) {
                    optionsContext = "\nOptions for " + stuckAt + ":\n" +
                            options.stream()
                                    .map(o -> o.getValue() + " (" + o.getLabel() + ")")
                                    .collect(Collectors.joining(" | "));
                }
            }

            return """
                You are ClearPath, Ontario driver's license guide.
                %s
                Session: %s
                Context: %s
                %s
                User: %s

                Rules:
                - Max 3 short sentences per reply.
                - Simple words. One idea per sentence.
                - Ask one question at a time.
                - ASCII only. No greetings.

                If sure of answer: one sentence why, then append:
                [DECISION: {"questionId":"...","answer":"..."}]

                If out of scope: append [SCOPE_OUT]
                If still asking: no tag.
                """.formatted(hintContext, sessionJson, stuckContext, optionsContext, userMessage);

        } catch (Exception e) {
            return userMessage;
        }
    }

    private String callHaiku(String prompt) throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        String requestBody = mapper.writeValueAsString(Map.of(
                "model", "claude-haiku-4-5",
                "max_tokens", 1024,
                "messages", new Object[]{
                        Map.of("role", "user", "content", prompt)
                }
        ));

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ANTHROPIC_URL))
                .header("Content-Type", "application/json")
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

        return extractHaikuText(response.body());
    }

    private String extractHaikuText(String responseBody) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(responseBody);
        return root.path("content")
                .path(0)
                .path("text")
                .asText("No response from AI.");
    }

    public CheatsheetResponse generateCheatsheet(String prompt) {
        try {
            String response = callHaiku(prompt);
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(response, CheatsheetResponse.class);
        } catch (Exception e) {
            return null;
        }
    }
}