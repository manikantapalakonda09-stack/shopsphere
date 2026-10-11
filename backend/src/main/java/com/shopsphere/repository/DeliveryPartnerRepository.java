package com.shopsphere.repository;

import com.shopsphere.entity.DeliveryPartner;
import com.shopsphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, Long> {
    Optional<DeliveryPartner> findByUser(User user);
    Optional<DeliveryPartner> findByUserId(Long userId);
    List<DeliveryPartner> findByIsAvailable(Boolean isAvailable);
}
