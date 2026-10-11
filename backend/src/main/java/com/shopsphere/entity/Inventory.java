package com.shopsphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @Column(name = "low_stock_threshold", nullable = false)
    private Integer lowStockThreshold = 5;

    @Column(name = "reserved_quantity", nullable = false)
    private Integer reservedQuantity = 0;

    @Column(name = "out_of_stock")
    private Boolean outOfStock = false;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Inventory() {}

    public Inventory(Product product, Integer stockQuantity, Integer lowStockThreshold) {
        this.product = product;
        this.stockQuantity = stockQuantity;
        this.lowStockThreshold = lowStockThreshold;
        this.reservedQuantity = 0;
        this.outOfStock = stockQuantity <= 0;
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.outOfStock = (this.stockQuantity <= 0);
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isLowStock() {
        return this.stockQuantity > 0 && this.stockQuantity <= this.lowStockThreshold;
    }

    public int getAvailableStock() {
        return Math.max(0, this.stockQuantity - this.reservedQuantity);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { 
        this.stockQuantity = stockQuantity; 
        this.outOfStock = (stockQuantity <= 0);
    }

    public Integer getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(Integer lowStockThreshold) { this.lowStockThreshold = lowStockThreshold; }

    public Integer getReservedQuantity() { return reservedQuantity; }
    public void setReservedQuantity(Integer reservedQuantity) { this.reservedQuantity = reservedQuantity; }

    public Boolean getOutOfStock() { return outOfStock; }
    public void setOutOfStock(Boolean outOfStock) { this.outOfStock = outOfStock; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
