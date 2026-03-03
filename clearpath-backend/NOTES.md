# ClearPath Backend - Developer Notes

## Project Structure
```
src/main/java/com/clearpath/backend/
├── ClearpathBackendApplication.java  # Spring Boot entry point
├── DriversLicenseBuilder.java        # Decision tree question builder
├── DriversLicenseHandler.java        # Decision tree answer handler
├── DriversLicenseController.java     # Decision tree API endpoints
├── CheatsheetController.java         # Cheatsheet API endpoints
├── CheatsheetRequest.java            # Cheatsheet generate DTO
├── CheatsheetUpdateRequest.java      # Cheatsheet update DTO
├── GuideLibrary.java                 # Guide content library
├── AIService.java                    # Claude AI integration
├── CorsConfig.java                   # CORS configuration
```

## API Endpoints

### Decision Tree
```
GET /api/drivers-license/start
GET /api/drivers-license/answer?questionId={id}&value={value}
```

### AI Chat
```
POST /api/drivers-license/ai/chat
Body: {
  "session": {"P1Q1": "age18plus", ...},
  "userMessage": "user input"
}
```

### Cheatsheet
```
POST /api/cheatsheet/generate
Body: {
  "session": {"P1Q1": "age18plus", ...},
  "aiSummary": "AI conversation summary"
}

POST /api/cheatsheet/update
Body: {
  "session": {"P1Q1": "age18plus", ...},
  "completedSteps": [...],
  "newSituation": "situation changed..."
}
```

## Guide Library
Two placeholder guides available:
- `GUIDE_DRIVETEST_BOOKING` → How to book G1 test
- `GUIDE_DRIVETEST_WALKTHROUGH` → What to expect on test day

Content maintained by product/ops team, no dev required!

## TODO
- [ ] Get Anthropic API Key and add to application.properties
- [ ] Do NOT push application.properties until API Key is ready
- [ ] Replace localhost:3000 in CorsConfig with real domain before deployment
- [ ] Replace H2 with real database (MySQL) before deployment
- [ ] buildSteps() in CheatsheetController is placeholder, replace after AI integration

## Architecture Notes

### Data Flow
```
Frontend collects decision tree answers → stored in frontend session
↓
Hit AI_CHAT node → open chat window
↓
AI conversation ends → aiSummary stored in frontend
↓
session + aiSummary POST to /cheatsheet/generate
↓
Backend generates and returns Cheatsheet
```

### Session Structure
```json
{
  "P1Q1": "age18plus",
  "P1Q2": "international_student",
  "P1Q2.1IS": "validLessThan6Months",
  "P1Q3": "Yes",
  "P1Q3.1": "CN"
}
```

### Response Types
```
NEXT_QUESTION  → proceed to next question
NEXT_SECTION   → jump to another flow
AI_CHAT        → open AI chat window
ANSWER         → terminal node, show result
```

## Security Notes
- API Key injected via @Value from application.properties
- NEVER push API Key to GitHub!
- Configure Rate Limiting before deployment to prevent AI endpoint abuseg