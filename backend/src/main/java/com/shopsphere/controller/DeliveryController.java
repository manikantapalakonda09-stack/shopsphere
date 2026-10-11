package com.shopsphere.controller;

import com.shopsphere.dto.SellerOrderDto;
import com.shopsphere.dto.ShipmentStatusUpdateRequest;
import com.shopsphere.entity.DeliveryPartner;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.DeliveryPartnerRepository;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
@PreAuthorize("hasAnyRole('DELIVERY', 'ADMIN')")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;

    private Long getDeliveryPartnerId(UserPrincipal user) {
        DeliveryPartner partner = deliveryPartnerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Delivery partner profile not found"));
        return partner.getId();
    }

    @GetMapping("/shipments")
    public ResponseEntity<List<SellerOrderDto>> getAssignedShipments(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(deliveryService.getAssignedShipments(getDeliveryPartnerId(currentUser)));
    }

    @PutMapping("/shipments/{id}/status")
    public ResponseEntity<SellerOrderDto> updateStatus(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody ShipmentStatusUpdateRequest request) {
        return ResponseEntity.ok(deliveryService.updateShipmentStatus(getDeliveryPartnerId(currentUser), id, request));
    }
}
