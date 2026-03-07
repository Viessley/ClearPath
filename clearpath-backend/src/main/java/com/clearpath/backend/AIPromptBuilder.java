package com.clearpath.backend;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

/**
 * AIPromptBuilder
 *
 * Responsibility: Build the prompt to send to AI based on the validated session
 *
 * Pipeline:
 * session → SessionValidator → AIPromptBuilder → AIService → CheatsheetResponse
 */
@Component
public class AIPromptBuilder {

    public String buildPrompt(Map<String, String> session) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String sessionJson = mapper.writeValueAsString(session);

            return """
                    You are ClearPath, an AI assistant helping newcomers navigate Canadian government processes.
                    
                    The user has completed a decision tree. Here is their session data:
                    %s
                    
                    Based on this session, generate a personalized action plan.
                    
                    You MUST respond with ONLY a valid JSON object in exactly this format, no other text:
                    {
                        "profile": {
                            "status": "one sentence describing who this user is",
                            "situation": "one sentence describing their current situation"
                        },
                        "steps": [
                            {
                                "stepId": "S1",
                                "title": "short title of the step",
                                "description": "detailed explanation of what to do",
                                "documents": ["document1", "document2"]
                            }
                        ],
                        "warnings": [
                            "important thing to be aware of"
                        ],
                        "aiNotes": "personalized notes based on the user's specific situation"
                    }
                    
                    Rules:
                    - steps must be in the correct order
                    - documents must be specific and accurate
                    - warnings must be genuinely important, not generic
                    - aiNotes must be specific to this user's situation
                    - respond in the same language the user used
                    """.formatted(sessionJson);

        } catch (Exception e) {
            return null;
        }
    }
}