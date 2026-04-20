package com.clearpath.backend.repository.quiz;

import com.clearpath.backend.entity.quiz.UserQuizRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserQuizRecordRepository extends JpaRepository<UserQuizRecord, Long> {

    Optional<UserQuizRecord> findByUserIdAndQuestionId(Long userId, Long questionId);

    List<UserQuizRecord> findByUserId(Long userId);

    @Query("SELECT r FROM UserQuizRecord r WHERE r.userId = :userId AND r.nextReviewAt <= :now")
    List<UserQuizRecord> findDueForReview(@Param("userId") Long userId, @Param("now") LocalDateTime now);

    @Query("SELECT COUNT(r) FROM UserQuizRecord r WHERE r.userId = :userId AND r.correctCount >= 3")
    Long countMastered(@Param("userId") Long userId);
}