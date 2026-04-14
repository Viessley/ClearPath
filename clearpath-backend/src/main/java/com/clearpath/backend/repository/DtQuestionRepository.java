package com.clearpath.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.clearpath.backend.entity.DtQuestion;
import java.util.List;

public interface DtQuestionRepository extends JpaRepository<DtQuestion, String> {

}