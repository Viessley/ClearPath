package com.clearpath.backend;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

@Component
public class QuestionIdMapper {

    // Q001 → P1Q1 (NewID → Old question tag)
    private final Map<String, String> newToOld = new HashMap<>(64);
    // P1Q1 → Q001 (Old question tag → NewID)
    private final Map<String, String> oldToNew = new HashMap<>(64);

    public QuestionIdMapper() {
        register("Q001", "P1Q1");
        register("Q002", "P1Q1.1");
        register("Q003", "P1Q1.1NotSure");
        register("Q004", "P1Q1.2");
        register("Q005", "P1Q2");
        register("Q006", "P1Q2.1IS");
        register("Q007", "P1Q2.1ISLess6Months");
        register("Q008", "P1Q2.1ISExpired");
        register("Q009", "P1Q2.1WP");
        register("Q010", "P1Q2.2WP");
        register("Q011", "P1Q2.2WPNotSure");
        register("Q012", "P1Q2.1PPR");
        register("Q013", "P1Q2.2PPRWaiting");
        register("Q014", "P1Q2.2PPRApproved");
        register("Q015", "P1Q2.1VIS");
        register("Q016", "P1Q2.1PR");
        register("Q017", "P1Q2.2PRCard");
        register("Q018", "P1Q2.2PRNew");
        register("Q019", "P1Q3");
        register("Q020", "P1Q3.1");
        register("Q021", "P1Q3.2NotAgreement");
        register("Q022", "P1Q3.3NotAgreement");
    }

    private void register(String newId, String oldId) {
        newToOld.put(newId, oldId);
        oldToNew.put(oldId, newId);
    }

    // NewID → Old question tag
    public String toOldId(String newId) {
        return newToOld.getOrDefault(newId, newId);
    }

    // Old question tag → NewID
    public String toNewId(String oldId) {
        return oldToNew.getOrDefault(oldId, oldId);
    }

    //Convert the entire conversation from the old question number to the new ID.
    public Map<String, String> translateSession(Map<String, String> oldSession) {
        Map<String, String> newSession = new HashMap<>();
        for (Map.Entry<String, String> entry : oldSession.entrySet()) {
            String newKey = toNewId(entry.getKey());
            newSession.put(newKey, entry.getValue());
        }
        return newSession;
    }
}
