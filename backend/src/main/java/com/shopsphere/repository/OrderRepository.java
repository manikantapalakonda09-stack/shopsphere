package com.shopsphere.repository;

import com.shopsphere.entity.Order;
import com.shopsphere.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'SUCCESS'")
    BigDecimal calculatePlatformRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentStatus = 'SUCCESS'")
    Long countSuccessfulOrders();
}
