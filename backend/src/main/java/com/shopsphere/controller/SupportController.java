package com.shopsphere.controller;

import com.shopsphere.dto.DisputeCreateRequest;
import com.shopsphere.dto.TicketCreateRequest;
import com.shopsphere.entity.*;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CustomerRepository;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.SupportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    @Autowired
    private SupportService supportService;

    @Autowired
    private CustomerRepository customerRepository;

    private Long getCustomerId(UserPrincipal user) {
        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
        return customer.getId();
    }

    // --- Tickets ---
    @PostMapping("/tickets")
    public ResponseEntity<SupportTicket> createTicket(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody TicketCreateRequest request) {
        return ResponseEntity.ok(supportService.createTicket(getCustomerId(currentUser), request));
    }

    @GetMapping("/tickets/my")
    public ResponseEntity<List<SupportTicket>> getMyTickets(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(supportService.getCustomerTickets(getCustomerId(currentUser)));
    }

    @GetMapping("/tickets")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    public ResponseEntity<List<SupportTicket>> getAllTickets() {
        return ResponseEntity.ok(supportService.getAllTickets());
    }

    @PutMapping("/tickets/{id}/status")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    public ResponseEntity<SupportTicket> updateTicketStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(supportService.updateTicketStatus(id, body.get("status")));
    }

    // --- Disputes ---
    @PostMapping("/disputes")
    public ResponseEntity<Dispute> createDispute(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody DisputeCreateRequest request) {
        return ResponseEntity.ok(supportService.createDispute(getCustomerId(currentUser), request));
    }

    @GetMapping("/disputes")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    public ResponseEntity<List<Dispute>> getAllDisputes() {
        return ResponseEntity.ok(supportService.getAllDisputes());
    }

    @PutMapping("/disputes/{id}/resolve")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    public ResponseEntity<Dispute> resolveDispute(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(supportService.resolveDispute(id, body.get("decision"), body.get("status")));
    }

    // --- Returns & Refunds ---
    @PostMapping("/returns")
    public ResponseEntity<Return> requestReturn(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, Object> body) {
        Long orderId = Long.valueOf(body.get("orderId").toString());
        Long sellerOrderId = Long.valueOf(body.get("sellerOrderId").toString());
        String reason = body.get("reason").toString();
        return ResponseEntity.ok(supportService.requestReturn(getCustomerId(currentUser), orderId, sellerOrderId, reason));
    }

    @GetMapping("/returns")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    public ResponseEntity<List<Return>> getAllReturns() {
        return ResponseEntity.ok(supportService.getAllReturns());
    }

    @PutMapping("/returns/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    public ResponseEntity<Refund> approveReturn(@PathVariable Long id) {
        return ResponseEntity.ok(supportService.approveReturnAndRefund(id));
    }
}
