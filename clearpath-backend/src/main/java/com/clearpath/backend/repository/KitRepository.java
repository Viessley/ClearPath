package com.clearpath.backend.repository;

import com.clearpath.backend.entity.Kit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KitRepository extends JpaRepository<Kit, Long> {
    List<Kit> findByUserId(Long userId);
}
