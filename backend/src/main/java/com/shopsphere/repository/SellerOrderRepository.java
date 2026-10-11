package com.shopsphere.repository;

import com.shopsphere.entity.OrderStatus;
import com.shopsphere.entity.SellerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SellerOrderRepository extends JpaRepository<SellerOrder, Long> {

    List<SellerOrder> findBySellerIdOrderByCreatedAtDesc(Long sellerId);

    List<SellerOrder> findBySellerIdAndStatus(Long sellerId, OrderStatus status);

    Optional<SellerOrder> findBySellerOrderNumber(String sellerOrderNumber);

    List<SellerOrder> findByMasterOrderId(Long masterOrderId);

    @Query("SELECT SUM(so.subtotal) FROM SellerOrder so WHERE so.seller.id = :sellerId AND so.status != 'CANCELLED'")
    BigDecimal calculateSellerTotalSales(@Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(so) FROM SellerOrder so WHERE so.seller.id = :sellerId AND so.status != 'CANCELLED'")
    Long countSellerOrders(@Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(so) FROM SellerOrder so WHERE so.seller.id = :sellerId AND so.status = :status")
    Long countSellerOrdersByStatus(@Param("sellerId") Long sellerId, @Param("status") OrderStatus status);
}
