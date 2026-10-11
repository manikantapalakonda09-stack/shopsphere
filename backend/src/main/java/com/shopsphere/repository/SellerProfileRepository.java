package com.shopsphere.repository;

import com.shopsphere.entity.Seller;
import com.shopsphere.entity.SellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SellerProfileRepository extends JpaRepository<SellerProfile, Long> {
    Optional<SellerProfile> findBySeller(Seller seller);
    Optional<SellerProfile> findBySellerId(Long sellerId);
}
