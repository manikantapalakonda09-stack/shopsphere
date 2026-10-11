package com.shopsphere.repository;

import com.shopsphere.entity.Settlement;
import com.shopsphere.entity.SettlementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Long> {

    List<Settlement> findBySellerIdOrderByCreatedAtDesc(Long sellerId);

    List<Settlement> findBySellerIdAndStatus(Long sellerId, SettlementStatus status);

    Optional<Settlement> findBySellerOrderId(Long sellerOrderId);

    @Query("SELECT SUM(s.netPayable) FROM Settlement s WHERE s.seller.id = :sellerId AND s.status = :status")
    BigDecimal sumNetPayableBySellerAndStatus(@Param("sellerId") Long sellerId, @Param("status") SettlementStatus status);

    @Query("SELECT SUM(s.platformCommission) FROM Settlement s")
    BigDecimal sumTotalPlatformCommission();
}
