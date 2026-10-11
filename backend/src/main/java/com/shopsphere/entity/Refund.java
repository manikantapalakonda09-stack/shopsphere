package com.shopsphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "refunds")
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_id")
    private Return returnRequest;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(length = 255)
    private String reason;

    @Column(nullable = false, length = 30)
    private String status = "INITIATED"; // INITIATED, PROCESSED, FAILED

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    public Refund() {}

    public Refund(Return returnRequest, Order order, BigDecimal amount, String reason) {
        this.returnRequest = returnRequest;
        this.order = order;
        this.amount = amount;
        this.reason = reason;
        this.status = "INITIATED";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Return getReturnRequest() { return returnRequest; }
    public void setReturnRequest(Return returnRequest) { this.returnRequest = returnRequest; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
}
