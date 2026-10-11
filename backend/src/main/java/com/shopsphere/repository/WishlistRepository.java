package com.shopsphere.repository;

import com.shopsphere.entity.Customer;
import com.shopsphere.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByCustomer(Customer customer);
    Optional<Wishlist> findByCustomerId(Long customerId);
}
