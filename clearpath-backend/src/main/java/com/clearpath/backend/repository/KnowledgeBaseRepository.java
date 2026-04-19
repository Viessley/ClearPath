package com.clearpath.backend.repository;

import com.clearpath.backend.entity.KnowledgeBase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KnowledgeBaseRepository extends JpaRepository<KnowledgeBase, Long> {

    List<KnowledgeBase> findByTopicAndSubtopic(String topic, String subtopic);

    List<KnowledgeBase> findByTopic(String topic);
}