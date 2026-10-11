package com.shopsphere.repository;

import com.shopsphere.entity.Return;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReturnRepository extends JpaRepository<Return, Long> {
    List<Return> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Return> findBySellerOrderId(Long sellerOrderId);
    List<Return> findBySellerOrderSellerId(Long sellerId);
    List<Return> findByStatus(String status);
}
