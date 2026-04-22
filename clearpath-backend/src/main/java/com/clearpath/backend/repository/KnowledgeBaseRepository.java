package com.clearpath.backend.repository;

import com.clearpath.backend.entity.KnowledgeBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KnowledgeBaseRepository extends JpaRepository<KnowledgeBase, Long> {

    List<KnowledgeBase> findByTopicAndSubtopic(String topic, String subtopic);

    List<KnowledgeBase> findByTopic(String topic);
}