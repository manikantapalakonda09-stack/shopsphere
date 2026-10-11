package com.shopsphere.repository;

import com.shopsphere.entity.Seller;
import com.shopsphere.entity.SellerStatus;
import com.shopsphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {
    Optional<Seller> findByUser(User user);
    Optional<Seller> findByUserId(Long userId);
    List<Seller> findByStatus(SellerStatus status);
}
