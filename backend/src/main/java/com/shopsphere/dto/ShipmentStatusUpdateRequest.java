package com.shopsphere.dto;

import jakarta.validation.constraints.NotBlank;

public class ShipmentStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status; // ASSIGNED, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED

    private String deliveryNotes;

    public ShipmentStatusUpdateRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDeliveryNotes() { return deliveryNotes; }
    public void setDeliveryNotes(String deliveryNotes) { this.deliveryNotes = deliveryNotes; }
}
