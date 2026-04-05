-- Users
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       nickname VARCHAR(100),
                       gender CHAR(1) CHECK (gender IN ('M', 'F')),
                       created_at TIMESTAMP DEFAULT NOW(),
                       last_login TIMESTAMP
);

-- Survival Kits (main)
CREATE TABLE kits (
                      id BIGSERIAL PRIMARY KEY,
                      user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                      title VARCHAR(255),
                      service_type VARCHAR(100),
                      status VARCHAR(50) DEFAULT 'in_progress',
                      created_at TIMESTAMP DEFAULT NOW(),
                      updated_at TIMESTAMP DEFAULT NOW()
);

-- Game Plan (operation detail)
CREATE TABLE kit_game_plan (
                               id BIGSERIAL PRIMARY KEY,
                               kit_id BIGINT REFERENCES kits(id) ON DELETE CASCADE,
                               step_order INT,
                               title VARCHAR(255),
                               description TEXT,
                               is_completed BOOLEAN DEFAULT FALSE,
                               created_at TIMESTAMP DEFAULT NOW()
);

-- Field Notes (tips)
CREATE TABLE kit_field_notes (
                                 id BIGSERIAL PRIMARY KEY,
                                 kit_id BIGINT REFERENCES kits(id) ON DELETE CASCADE,
                                 step_id BIGINT REFERENCES kit_game_plan(id),
                                 content TEXT,
                                 created_at TIMESTAMP DEFAULT NOW()
);

-- Your Intel (refine your chat records)
CREATE TABLE kit_intel (
                           id BIGSERIAL PRIMARY KEY,
                           kit_id BIGINT REFERENCES kits(id) ON DELETE CASCADE,
                           content TEXT,
                           created_at TIMESTAMP DEFAULT NOW()
);

-- Sources (sources)
CREATE TABLE kit_sources (
                             id BIGSERIAL PRIMARY KEY,
                             kit_id BIGINT REFERENCES kits(id) ON DELETE CASCADE,
                             title VARCHAR(255),
                             url TEXT,
                             created_at TIMESTAMP DEFAULT NOW()
);

-- Decision Tree Questions
CREATE TABLE dt_questions (
                              id VARCHAR(50) PRIMARY KEY,
                              question_text TEXT NOT NULL,
                              phase INT,
                              created_at TIMESTAMP DEFAULT NOW()
);

-- Decision Tree Options
CREATE TABLE dt_options (
                            id BIGSERIAL PRIMARY KEY,
                            question_id VARCHAR(50) REFERENCES dt_questions(id),
                            value VARCHAR(100),
                            label VARCHAR(255),
                            display_order INT
);

-- Decision Tree Transitions
CREATE TABLE dt_transitions (
                                id BIGSERIAL PRIMARY KEY,
                                question_id VARCHAR(50) REFERENCES dt_questions(id),
                                answer_value VARCHAR(100),
                                next_question_id VARCHAR(50),
                                response_type VARCHAR(50),
                                feedback TEXT
);

-- Session Mappings (certain answer)
CREATE TABLE session_mappings (
                                  id BIGSERIAL PRIMARY KEY,
                                  session_key TEXT NOT NULL UNIQUE,
                                  cheatsheet_template TEXT,
                                  created_at TIMESTAMP DEFAULT NOW()
);

-- Intel Library (knowledge base)
CREATE TABLE forms (
                       id VARCHAR(50) PRIMARY KEY,
                       name VARCHAR(255),
                       description TEXT,
                       how_to_fill TEXT,
                       tips TEXT,
                       pitfalls TEXT,
                       created_at TIMESTAMP DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
                               id BIGSERIAL PRIMARY KEY,
                               kit_id BIGINT REFERENCES kits(id) ON DELETE CASCADE,
                               role VARCHAR(20),
                               content TEXT,
                               created_at TIMESTAMP DEFAULT NOW()
);