package com.shopsphere.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class SellerOrderDto {
    private Long id;
    private Long masterOrderId;
    private String masterOrderNumber;
    private Long sellerId;
    private String sellerStoreName;
    private String sellerOrderNumber;
    private String status;
    private BigDecimal subtotal;
    private BigDecimal sellerDiscount;
    private BigDecimal commissionRate;
    private BigDecimal platformCommission;
    private BigDecimal sellerPayableAmount;
    private List<OrderItemDto> items;
    private String trackingNumber;
    private String shipmentStatus;
    private String deliveryNotes;
    private String customerName;
    private String shippingAddress;
    private String shippingCity;
    private String shippingPhone;
    private LocalDateTime createdAt;

    public SellerOrderDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMasterOrderId() { return masterOrderId; }
    public void setMasterOrderId(Long masterOrderId) { this.masterOrderId = masterOrderId; }

    public String getMasterOrderNumber() { return masterOrderNumber; }
    public void setMasterOrderNumber(String masterOrderNumber) { this.masterOrderNumber = masterOrderNumber; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getSellerStoreName() { return sellerStoreName; }
    public void setSellerStoreName(String sellerStoreName) { this.sellerStoreName = sellerStoreName; }

    public String getSellerOrderNumber() { return sellerOrderNumber; }
    public void setSellerOrderNumber(String sellerOrderNumber) { this.sellerOrderNumber = sellerOrderNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getSellerDiscount() { return sellerDiscount; }
    public void setSellerDiscount(BigDecimal sellerDiscount) { this.sellerDiscount = sellerDiscount; }

    public BigDecimal getCommissionRate() { return commissionRate; }
    public void setCommissionRate(BigDecimal commissionRate) { this.commissionRate = commissionRate; }

    public BigDecimal getPlatformCommission() { return platformCommission; }
    public void setPlatformCommission(BigDecimal platformCommission) { this.platformCommission = platformCommission; }

    public BigDecimal getSellerPayableAmount() { return sellerPayableAmount; }
    public void setSellerPayableAmount(BigDecimal sellerPayableAmount) { this.sellerPayableAmount = sellerPayableAmount; }

    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getShipmentStatus() { return shipmentStatus; }
    public void setShipmentStatus(String shipmentStatus) { this.shipmentStatus = shipmentStatus; }

    public String getDeliveryNotes() { return deliveryNotes; }
    public void setDeliveryNotes(String deliveryNotes) { this.deliveryNotes = deliveryNotes; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getShippingCity() { return shippingCity; }
    public void setShippingCity(String shippingCity) { this.shippingCity = shippingCity; }

    public String getShippingPhone() { return shippingPhone; }
    public void setShippingPhone(String shippingPhone) { this.shippingPhone = shippingPhone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
