package com.shopsphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "customer_name", length = 120)
    private String customerName;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(name = "sentiment_label", length = 20)
    private SentimentLabel sentimentLabel = SentimentLabel.NEUTRAL;

    @Column(name = "sentiment_score", precision = 4, scale = 3)
    private BigDecimal sentimentScore = BigDecimal.ZERO;

    @Column(name = "is_reported")
    private Boolean isReported = false;

    @Column(name = "is_moderated")
    private Boolean isModerated = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}

    public Review(Product product, Customer customer, String customerName, Integer rating, String title, String comment) {
        this.product = product;
        this.customer = customer;
        this.customerName = customerName;
        this.rating = rating;
        this.title = title;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public SentimentLabel getSentimentLabel() { return sentimentLabel; }
    public void setSentimentLabel(SentimentLabel sentimentLabel) { this.sentimentLabel = sentimentLabel; }

    public BigDecimal getSentimentScore() { return sentimentScore; }
    public void setSentimentScore(BigDecimal sentimentScore) { this.sentimentScore = sentimentScore; }

    public Boolean getIsReported() { return isReported; }
    public void setIsReported(Boolean isReported) { this.isReported = isReported; }

    public Boolean getIsModerated() { return isModerated; }
    public void setIsModerated(Boolean isModerated) { this.isModerated = isModerated; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
