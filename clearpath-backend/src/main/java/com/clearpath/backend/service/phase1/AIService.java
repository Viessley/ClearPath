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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AIService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    @Autowired
    private DtOptionRepository dtOptionRepository;

    private static final String ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
    private static final String MODEL = "claude-haiku-4-5-20251001";

    // ── Public API ──────────────────────────────────────────────────────────────

    /**
     * Main chat method used by AISupportController and CheatsheetController.
     * systemHint and stuckAt are both optional (pass null if not applicable).
     */
    public String chat(Map<String, String> session, String userMessage, String stuckAt, String systemHint) {
        try {
            String prompt = buildPrompt(session, userMessage, stuckAt, systemHint);
            return callHaiku(prompt);
        } catch (Exception e) {
            System.out.println("AIService.chat error: " + e.getMessage());
            return "Our AI is taking a break right now. Please try again in a few minutes, " +
                    "or email clearpathwesley@gmail.com if this keeps happening.";
        }
    }

    /**
     * Kept for CheatsheetController fallback — calls chat() with no stuckAt or systemHint.
     */
    public String chat(Map<String, String> session, String userMessage) {
        return chat(session, userMessage, null, null);
    }

    // ── Prompt Builder ───────────────────────────────────────────────────────────

    private String buildPrompt(Map<String, String> session,
                               String userMessage,
                               String stuckAt,
                               String systemHint) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String sessionJson = mapper.writeValueAsString(session);

            String stuckContext = (stuckAt != null && !stuckAt.isBlank())
                    ? "User is stuck at question: " + stuckAt
                    : "User is asking a follow-up question.";

            String hintBlock = (systemHint != null && !systemHint.isBlank())
                    ? "\nSCOPE RULES:\n" + systemHint + "\n"
                    : "";

            String optionsBlock = "";
            if (stuckAt != null && !stuckAt.isBlank()) {
                List<DtOption> options = dtOptionRepository.findByQuestionId(stuckAt);
                if (!options.isEmpty()) {
                    optionsBlock = "\nOptions for " + stuckAt + ":\n" +
                            options.stream()
                                    .map(o -> o.getValue() + " (" + o.getLabel() + ")")
                                    .collect(Collectors.joining(" | ")) + "\n";
                }
            }

            return """
                You are ClearPath, an Ontario driver's license guide for newcomers to Canada.
                %s
                Session: %s
                Context: %s
                %s
                User: %s

                Rules:
                - Max 3 short sentences per reply.
                - Use simple words. One idea per sentence.
                - Ask only one question at a time.
                - ASCII only. No emojis, no special symbols. No greetings.

                When you know the answer with confidence:
                  Write one sentence explaining why, then append exactly:
                  [DECISION: {"questionId":"...","answer":"..."}]

                When the user's situation is out of scope:
                  Briefly explain why, then append exactly: [SCOPE_OUT]

                When you need more information: reply normally with no tag.
                """.formatted(hintBlock, sessionJson, stuckContext, optionsBlock, userMessage);

        } catch (Exception e) {
            System.out.println("AIService.buildPrompt error: " + e.getMessage());
            return userMessage;
        }
    }

    // ── Haiku API Call ───────────────────────────────────────────────────────────

    private String callHaiku(String prompt) throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        // Use HashMap to avoid Map.of() type issues with nested structures
        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        Map<String, Object> body = new HashMap<>();
        body.put("model", MODEL);
        body.put("max_tokens", 1024);
        body.put("messages", List.of(message));

        String requestBody = mapper.writeValueAsString(body);

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

        System.out.println("Haiku HTTP status: " + response.statusCode());
        return extractText(response.body());
    }

    // ── Response Parser ──────────────────────────────────────────────────────────

    private String extractText(String responseBody) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(responseBody);

        // Log and surface API-level errors (401, 429, 500, etc.)
        if (root.has("error")) {
            String errorMsg = root.path("error").path("message").asText("unknown error");
            System.out.println("Haiku API error: " + errorMsg);
            throw new RuntimeException("Haiku API error: " + errorMsg);
        }

        String text = root.path("content")
                .path(0)
                .path("text")
                .asText("");

        if (text.isBlank()) {
            System.out.println("Haiku returned empty text. Full response: " + responseBody);
            return "I couldn't generate a response. Please try again.";
        }

        return text;
    }
}