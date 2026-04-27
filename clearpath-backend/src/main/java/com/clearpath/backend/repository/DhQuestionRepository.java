package com.clearpath.backend.repository;

import com.clearpath.backend.entity.DhQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DhQuestionRepository extends JpaRepository<DhQuestion, Long> {
    Optional<DhQuestion> findByQuestionId(String questionId);
}