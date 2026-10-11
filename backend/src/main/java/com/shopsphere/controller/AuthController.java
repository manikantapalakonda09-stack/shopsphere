package com.shopsphere.controller;

import com.shopsphere.dto.*;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerCustomer(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registerCustomer(request));
    }

    @PostMapping("/register-seller")
    public ResponseEntity<AuthResponse> registerSeller(@Valid @RequestBody SellerRegisterRequest request) {
        return ResponseEntity.ok(authService.registerSeller(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(authService.getProfile(currentUser.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UserProfileDto updateRequest) {
        return ResponseEntity.ok(authService.updateProfile(currentUser.getUsername(), updateRequest));
    }
}
