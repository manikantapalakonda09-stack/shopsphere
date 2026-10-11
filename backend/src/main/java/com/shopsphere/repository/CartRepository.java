package com.shopsphere.repository;

import com.shopsphere.entity.Cart;
import com.shopsphere.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByCustomer(Customer customer);
    Optional<Cart> findByCustomerId(Long customerId);
}
