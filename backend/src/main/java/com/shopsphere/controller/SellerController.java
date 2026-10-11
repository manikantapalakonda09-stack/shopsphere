package com.shopsphere.controller;

import com.shopsphere.dto.*;
import com.shopsphere.entity.OrderStatus;
import com.shopsphere.entity.Seller;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.SellerRepository;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.AdminService;
import com.shopsphere.service.OrderService;
import com.shopsphere.service.ProductService;
import com.shopsphere.service.SettlementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller")
@PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
public class SellerController {

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private SettlementService settlementService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private SellerRepository sellerRepository;

    private Long getSellerId(UserPrincipal user) {
        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller profile not found for user: " + user.getUsername()));
        return seller.getId();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<SellerDashboardStats> getDashboard(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(adminService.getSellerDashboardStats(getSellerId(currentUser)));
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getMyProducts(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(productService.getProductsBySeller(getSellerId(currentUser)));
    }

    @PostMapping("/products")
    public ResponseEntity<ProductDto> createProduct(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ProductCreateRequest request) {
        return ResponseEntity.ok(productService.createProduct(getSellerId(currentUser), request));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody ProductCreateRequest request) {
        return ResponseEntity.ok(productService.updateProduct(getSellerId(currentUser), id, request));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        productService.deleteProduct(getSellerId(currentUser), id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/products/{id}/inventory")
    public ResponseEntity<ProductDto> updateInventory(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody InventoryUpdateDto dto) {
        return ResponseEntity.ok(productService.updateInventory(getSellerId(currentUser), id, dto));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<SellerOrderDto>> getMyOrders(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(orderService.getSellerOrders(getSellerId(currentUser)));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<SellerOrderDto> updateOrderStatus(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        OrderStatus status = OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(orderService.updateSellerOrderStatus(getSellerId(currentUser), id, status));
    }

    @GetMapping("/settlements")
    public ResponseEntity<List<SettlementDto>> getMySettlements(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(settlementService.getSellerSettlements(getSellerId(currentUser)));
    }
}
