package com.clearpath.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.clearpath.backend.entity.DtTransition;
import java.util.List;

public interface DtTransitionRepository extends JpaRepository<DtTransition, Long> {
    List<DtTransition> findByQuestionId(String questionId);
    DtTransition findByQuestionIdAndAnswerValue(String questionId, String answerValue);
}