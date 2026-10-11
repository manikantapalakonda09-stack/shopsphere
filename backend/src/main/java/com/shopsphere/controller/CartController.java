package com.shopsphere.controller;

import com.shopsphere.dto.AddToCartRequest;
import com.shopsphere.dto.CartDto;
import com.shopsphere.dto.UpdateCartItemRequest;
import com.shopsphere.entity.Customer;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CustomerRepository;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private CustomerRepository customerRepository;

    private Long getCustomerId(UserPrincipal user) {
        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user: " + user.getUsername()));
        return customer.getId();
    }

    @GetMapping
    public ResponseEntity<CartDto> getCart(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(cartService.getCustomerCart(getCustomerId(currentUser)));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> addItem(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addItemToCart(getCustomerId(currentUser), request));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<CartDto> updateItemQuantity(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.updateItemQuantity(getCustomerId(currentUser), id, request));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<CartDto> removeItem(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        return ResponseEntity.ok(cartService.removeItemFromCart(getCustomerId(currentUser), id));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserPrincipal currentUser) {
        cartService.clearCart(getCustomerId(currentUser));
        return ResponseEntity.noContent().build();
    }
}
