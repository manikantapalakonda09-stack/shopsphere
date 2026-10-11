package com.shopsphere.service;

import com.shopsphere.dto.SellerOrderDto;
import com.shopsphere.dto.ShipmentStatusUpdateRequest;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.DeliveryPartnerRepository;
import com.shopsphere.repository.SellerOrderRepository;
import com.shopsphere.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;

    @Autowired
    private SellerOrderRepository sellerOrderRepository;

    @Autowired
    private OrderService orderService;

    @Transactional(readOnly = true)
    public List<SellerOrderDto> getAssignedShipments(Long deliveryPartnerId) {
        List<Shipment> shipments = shipmentRepository.findByDeliveryPartnerId(deliveryPartnerId);
        return shipments.stream()
                .map(s -> orderService.mapSellerOrderToDto(s.getSellerOrder()))
                .collect(Collectors.toList());
    }

    @Transactional
    public SellerOrderDto updateShipmentStatus(Long deliveryPartnerId, Long shipmentId, ShipmentStatusUpdateRequest request) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + shipmentId));

        if (shipment.getDeliveryPartner() != null && !shipment.getDeliveryPartner().getId().equals(deliveryPartnerId)) {
            throw new BadRequestException("Unauthorized access to shipment");
        }

        ShipmentStatus newStatus = ShipmentStatus.valueOf(request.getStatus());
        shipment.setStatus(newStatus);
        if (request.getDeliveryNotes() != null) {
            shipment.setDeliveryNotes(request.getDeliveryNotes());
        }

        if (newStatus == ShipmentStatus.PICKED_UP) {
            shipment.setShippedAt(LocalDateTime.now());
            shipment.getSellerOrder().setStatus(OrderStatus.SHIPPED);
        } else if (newStatus == ShipmentStatus.OUT_FOR_DELIVERY) {
            shipment.getSellerOrder().setStatus(OrderStatus.OUT_FOR_DELIVERY);
        } else if (newStatus == ShipmentStatus.DELIVERED) {
            shipment.setDeliveredAt(LocalDateTime.now());
            orderService.updateSellerOrderStatus(shipment.getSellerOrder().getSeller().getId(), 
                                                 shipment.getSellerOrder().getId(), 
                                                 OrderStatus.DELIVERED);
        }

        shipmentRepository.save(shipment);
        return orderService.mapSellerOrderToDto(shipment.getSellerOrder());
    }
}
