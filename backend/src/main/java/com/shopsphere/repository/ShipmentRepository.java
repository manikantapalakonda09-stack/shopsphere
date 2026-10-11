package com.shopsphere.repository;

import com.shopsphere.entity.DeliveryPartner;
import com.shopsphere.entity.Shipment;
import com.shopsphere.entity.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByTrackingNumber(String trackingNumber);
    Optional<Shipment> findBySellerOrderId(Long sellerOrderId);
    List<Shipment> findByDeliveryPartner(DeliveryPartner deliveryPartner);
    List<Shipment> findByDeliveryPartnerId(Long deliveryPartnerId);
    List<Shipment> findByDeliveryPartnerIdAndStatus(Long deliveryPartnerId, ShipmentStatus status);
}
