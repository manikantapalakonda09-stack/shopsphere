package com.shopsphere.repository;

import com.shopsphere.entity.SellerReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SellerReviewRepository extends JpaRepository<SellerReview, Long> {

    List<SellerReview> findBySellerIdOrderByCreatedAtDesc(Long sellerId);

    @Query("SELECT AVG(sr.rating) FROM SellerReview sr WHERE sr.seller.id = :sellerId")
    Double calculateAverageSellerRating(@Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(sr) FROM SellerReview sr WHERE sr.seller.id = :sellerId")
    Long countReviewsBySellerId(@Param("sellerId") Long sellerId);
}
