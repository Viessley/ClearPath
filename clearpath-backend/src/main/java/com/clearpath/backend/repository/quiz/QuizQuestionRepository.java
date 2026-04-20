package com.clearpath.backend.repository.quiz;

import com.clearpath.backend.entity.quiz.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {

    List<QuizQuestion> findByType(String type);

    @Query("SELECT q FROM QuizQuestion q ORDER BY RANDOM()")
    List<QuizQuestion> findRandom();

    @Query("SELECT q FROM QuizQuestion q WHERE q.type = :type ORDER BY RANDOM()")
    List<QuizQuestion> findRandomByType(@Param("type") String type);
}