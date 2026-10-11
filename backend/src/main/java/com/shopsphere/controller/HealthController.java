package com.shopsphere.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping({"/api/health", "/health", "/"})
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "ShopSphere Multi-Vendor Backend",
            "version", "1.0.0",
            "timestamp", System.currentTimeMillis()
        ));
    }
}
