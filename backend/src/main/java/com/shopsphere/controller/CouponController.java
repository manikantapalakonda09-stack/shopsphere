package com.shopsphere.controller;

import com.shopsphere.dto.CouponDto;
import com.shopsphere.dto.CouponValidateRequest;
import com.shopsphere.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @PostMapping("/validate")
    public ResponseEntity<CouponDto> validateCoupon(@Valid @RequestBody CouponValidateRequest request) {
        return ResponseEntity.ok(couponService.validateCoupon(request));
    }

    @GetMapping
    public ResponseEntity<List<CouponDto>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CouponDto> createCoupon(@Valid @RequestBody CouponDto dto) {
        return ResponseEntity.ok(couponService.createCoupon(dto));
    }

    @PutMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleCoupon(@PathVariable Long id) {
        couponService.toggleCouponStatus(id);
        return ResponseEntity.ok().build();
    }
}
