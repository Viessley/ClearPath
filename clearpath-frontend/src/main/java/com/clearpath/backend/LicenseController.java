package com.clearpath.backend;

import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/license")
public class LicenseController {

    @PostMapping("/calculate-g2-date")
    public Map<String, String> calculateG2Date(@RequestBody G1Request request) {
        // Parse the G1 issue date from user input
        LocalDate g1Date = LocalDate.parse(request.getG1Date());

        // Check if user has completed a BDE (Beginner Driver Education) course
        boolean hasBDE = request.isHasBDE();

        // Calculate G2 eligibility: 8 months with BDE, 12 months without
        LocalDate g2Date = hasBDE ? g1Date.plusMonths(8) : g1Date.plusMonths(12);

        // Build the response
        Map<String, String> response = new HashMap<>();
        response.put("message", "You can book your G2 road test on " + g2Date);
        response.put("eligibleDate", g2Date.toString());

        return response;
    }

    // Inner class: defines the structure of incoming request data
    public static class G1Request {
        private String g1Date;  // G1 test date in ISO format (e.g., "2025-01-01")
        private boolean hasBDE;  // Whether user completed driving school

        // Getters and Setters
        public String getG1Date() {
            return g1Date;
        }

        public void setG1Date(String g1Date) {
            this.g1Date = g1Date;
        }

        public boolean isHasBDE() {
            return hasBDE;
        }

        public void setHasBDE(boolean hasBDE) {
            this.hasBDE = hasBDE;
        }
    }
}