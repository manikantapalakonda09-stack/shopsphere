package com.shopsphere.controller;

import com.shopsphere.dto.CheckoutRequest;
import com.shopsphere.dto.OrderDto;
import com.shopsphere.entity.Customer;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CustomerRepository;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomerRepository customerRepository;

    private Long getCustomerId(UserPrincipal user) {
        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
        return customer.getId();
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderDto> checkout(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(orderService.checkout(getCustomerId(currentUser), request));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDto>> getMyOrders(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(orderService.getCustomerOrders(getCustomerId(currentUser)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderDto>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size));
    }
}
