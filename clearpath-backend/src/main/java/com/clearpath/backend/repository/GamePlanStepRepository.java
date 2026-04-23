package com.clearpath.backend.repository;

import com.clearpath.backend.entity.GamePlanStep;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GamePlanStepRepository extends JpaRepository<GamePlanStep, Long> {
    List<GamePlanStep> findByKbIdOrderByStepAsc(Integer kbId);
}