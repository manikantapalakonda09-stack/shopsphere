package com.shopsphere.controller;

import com.shopsphere.dto.AdminDashboardStats;
import com.shopsphere.dto.ProductDto;
import com.shopsphere.dto.SettlementDto;
import com.shopsphere.entity.Seller;
import com.shopsphere.service.AdminService;
import com.shopsphere.service.SettlementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private SettlementService settlementService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStats> getDashboard() {
        return ResponseEntity.ok(adminService.getAdminDashboardStats());
    }

    @GetMapping("/sellers")
    public ResponseEntity<List<Seller>> getAllSellers() {
        return ResponseEntity.ok(adminService.getAllSellers());
    }

    @GetMapping("/sellers/pending")
    public ResponseEntity<List<Seller>> getPendingSellers() {
        return ResponseEntity.ok(adminService.getPendingSellers());
    }

    @PutMapping("/sellers/{id}/approve")
    public ResponseEntity<Seller> approveSeller(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        boolean approve = body.getOrDefault("approve", true);
        return ResponseEntity.ok(adminService.approveSeller(id, approve));
    }

    @GetMapping("/suspicious-listings")
    public ResponseEntity<List<ProductDto>> getSuspiciousListings() {
        return ResponseEntity.ok(adminService.getSuspiciousListings());
    }

    @PutMapping("/listings/{id}/moderate")
    public ResponseEntity<Void> moderateListing(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        boolean approveFlag = body.getOrDefault("approveFlag", true);
        adminService.moderateListing(id, approveFlag);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/settlements")
    public ResponseEntity<List<SettlementDto>> getAllSettlements() {
        return ResponseEntity.ok(settlementService.getAllSettlements());
    }

    @PutMapping("/settlements/{id}/release")
    public ResponseEntity<SettlementDto> releaseSettlement(@PathVariable Long id) {
        return ResponseEntity.ok(settlementService.releaseSettlement(id));
    }
}
