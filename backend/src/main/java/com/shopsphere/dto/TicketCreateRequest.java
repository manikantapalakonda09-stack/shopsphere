package com.shopsphere.dto;

import jakarta.validation.constraints.NotBlank;

public class TicketCreateRequest {

    private Long orderId;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    public TicketCreateRequest() {}

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
