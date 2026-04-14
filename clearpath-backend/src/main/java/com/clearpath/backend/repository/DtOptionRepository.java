package com.clearpath.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.clearpath.backend.entity.DtOption;
import java.util.List;

public interface DtOptionRepository extends JpaRepository<DtOption, Long> {
    List<DtOption> findByQuestionId(String questionId);
}
