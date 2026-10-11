package com.shopsphere.controller;

import com.shopsphere.dto.ProductDto;
import com.shopsphere.entity.Customer;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CustomerRepository;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private CustomerRepository customerRepository;

    private Long getCustomerId(UserPrincipal user) {
        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
        return customer.getId();
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getWishlist(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(wishlistService.getCustomerWishlist(getCustomerId(currentUser)));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> addToWishlist(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long productId) {
        wishlistService.addToWishlist(getCustomerId(currentUser), productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long productId) {
        wishlistService.removeFromWishlist(getCustomerId(currentUser), productId);
        return ResponseEntity.noContent().build();
    }
}
