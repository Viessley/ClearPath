package com.clearpath.backend.controller.phase1;

import com.clearpath.backend.entity.ScopeOutReport;
import com.clearpath.backend.repository.ScopeOutReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/scope-out")
public class ScopeOutReportController {

    @Autowired
    private ScopeOutReportRepository repository;

    @GetMapping("/report")
    public ScopeOutReport getReport(@RequestParam String key) {
        return repository.findById(key)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No scope-out report found for key: " + key));
    }
}
