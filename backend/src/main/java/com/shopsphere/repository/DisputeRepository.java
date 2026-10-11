package com.shopsphere.repository;

import com.shopsphere.entity.Dispute;
import com.shopsphere.entity.DisputeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Dispute> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
    List<Dispute> findByStatus(DisputeStatus status);
}
