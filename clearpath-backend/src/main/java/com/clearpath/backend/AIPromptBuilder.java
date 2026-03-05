package com.clearpath.backend;

import org.springframework.stereotype.Component;
import java.util.Map;

/**
 * AIPromptBuilder
 *
 * Responsibility: Build the prompt to send to the AI based on the validated session
 *
 * 1. Translate session into human-readable user profile
 *    e.g. "P1Q2=international_student" → "User is an international student"
 *
 * 2. Build structured context for AI
 *    - Who the user is
 *    - What situation they are in
 *    - What we need AI to determine
 *
 * 3. Define the response format
 *    - Tell AI exactly what JSON structure to return
 *    - So CheatsheetController can parse it reliably
 *
 * 4. Handle edge cases
 *    - If session has conflicting answers, flag it for AI to clarify
 *    - e.g. study permit expired but also applying for PGWP (maintain status)
 */
@Component
public class AIPromptBuilder {

    // TODO: Build full prompt from validated session
    public String buildPrompt(Map<String, String> session) {
        return null;
    }

    // TODO: Translate session keys/values into human-readable context
    private String translateSession(Map<String, String> session) {
        return null;
    }

    // TODO: Define the JSON structure AI must return
    private String buildResponseFormat() {
        return null;
    }
}