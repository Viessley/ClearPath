# ClearPath

ClearPath is an AI-assisted guidance platform designed to reduce 
information fragmentation for newcomers in Canada. It walks users 
through complex government processes using a structured decision tree, 
and connects them with personalized AI support when their situation 
is unique.

## Current Status
🚧 Phase 1 in active development (Jan - Apr 2026)

## Tech Stack
- Backend: Java, Spring Boot
- Frontend: React (coming soon)
- AI Integration: planned

## Project Structure
- Controller → routing
- Handler → decision logic  
- Builder → question templates

## Phase 1
Driver's License application guidance for international students in Ontario.

## Author
RedBloodSocker（Zhida Wang）

## Database Setup

ClearPath uses [Supabase](https://supabase.com) (PostgreSQL) hosted in **Canada Central (ca-central-1)** to comply with PIPEDA data residency requirements.

### Connection

Uses Supabase Transaction Pooler on port `6543`.

Configure the following in your `application.properties` (not committed to Git):
```properties
spring.datasource.url=jdbc:postgresql://aws-1-ca-central-1.pooler.supabase.com:6543/postgres
spring.datasource.username=postgres.<your-project-id>
spring.datasource.password=<your-password>
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=none
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

For deployment (e.g. Render), set these as environment variables instead.

### Schema

Run `schema.sql` in the Supabase SQL Editor to initialize all tables.

### Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts |
| `kits` | Survival Kit container per user |
| `kit_game_plan` | Step-by-step action plan |
| `kit_field_notes` | Detail notes and pitfall warnings |
| `kit_intel` | Distilled conversation history |
| `kit_sources` | Reference links and documents |
| `dt_questions` | Decision tree questions |
| `dt_options` | Answer options per question |
| `dt_transitions` | Navigation logic between questions |
| `session_mappings` | Deterministic session → cheatsheet mappings |
| `forms` | Intel Library (IMM forms, tips, pitfalls) |
| `chat_messages` | Raw chat log (temporary, processed into Intel) |


