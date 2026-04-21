package com.clearpath.backend.service.quiz;

import com.clearpath.backend.entity.quiz.QuizQuestion;
import com.clearpath.backend.entity.quiz.UserQuizRecord;
import com.clearpath.backend.repository.quiz.QuizQuestionRepository;
import com.clearpath.backend.repository.quiz.UserQuizRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private QuizQuestionRepository questionRepository;

    @Autowired
    private UserQuizRecordRepository recordRepository;

    // Fetch questions — spaced repetition for logged-in users, random for guests
    public List<QuizQuestion> getQuestions(Long userId, String type, int limit) {
        if (userId == null) {
            // Guest — return random questions
            List<QuizQuestion> all = (type != null)
                    ? questionRepository.findRandomByType(type)
                    : questionRepository.findRandom();
            return all.stream().limit(limit).toList();
        }

        // Logged-in — fetch questions due for review first
        List<UserQuizRecord> due = recordRepository.findDueForReview(userId, LocalDateTime.now());

        List<Long> dueIds = due.stream().map(UserQuizRecord::getQuestionId).toList();
        List<QuizQuestion> dueQuestions = dueIds.isEmpty()
                ? new ArrayList<>()
                : new ArrayList<>(questionRepository.findAllById(dueIds));

        // Top up with random questions if not enough due questions
        if (dueQuestions.size() < limit) {
            List<QuizQuestion> random = (type != null)
                    ? questionRepository.findRandomByType(type)
                    : questionRepository.findRandom();
            random.stream()
                    .filter(q -> !dueIds.contains(q.getId()))
                    .limit(limit - dueQuestions.size())
                    .forEach(dueQuestions::add);
        }

        return dueQuestions.stream().limit(limit).toList();
    }

    // Submit answer
    public boolean submitAnswer(Long userId, Long questionId, String selectedOption) {
        QuizQuestion question = questionRepository.findById(questionId).orElse(null);
        if (question == null) return false;

        boolean correct = question.getCorrectOption().equals(selectedOption);

        if (userId != null) {
            saveRecord(userId, questionId, correct, false);
        }

        return correct;
    }

    // User viewed the answer without answering
    public void seeAnswer(Long userId, Long questionId) {
        if (userId != null) {
            saveRecord(userId, questionId, false, true);
        }
    }

    private void saveRecord(Long userId, Long questionId, boolean correct, boolean sawAnswer) {
        Optional<UserQuizRecord> existing = recordRepository.findByUserIdAndQuestionId(userId, questionId);

        UserQuizRecord record = existing.orElse(new UserQuizRecord());
        record.setUserId(userId);
        record.setQuestionId(questionId);
        record.setLastSeenAt(LocalDateTime.now());

        if (sawAnswer) {
            // Saw answer — review again in 4 hours
            record.setSeenAnswerCount((record.getSeenAnswerCount() == null ? 0 : record.getSeenAnswerCount()) + 1);
            record.setNextReviewAt(LocalDateTime.now().plusHours(4));
        } else if (correct) {
            // Correct — spaced repetition interval increases with each correct answer
            int count = (record.getCorrectCount() == null ? 0 : record.getCorrectCount()) + 1;
            record.setCorrectCount(count);
            record.setNextReviewAt(switch (count) {
                case 1 -> LocalDateTime.now().plusDays(1);
                case 2 -> LocalDateTime.now().plusDays(3);
                default -> LocalDateTime.now().plusDays(7);
            });
        } else {
            // Wrong — review again in 1 hour
            record.setNextReviewAt(LocalDateTime.now().plusHours(1));
        }

        recordRepository.save(record);
    }

    // Progress tracking
    public long getMasteredCount(Long userId) {
        return recordRepository.countMastered(userId);
    }

    public long getTotalCount() {
        return questionRepository.count();
    }
}