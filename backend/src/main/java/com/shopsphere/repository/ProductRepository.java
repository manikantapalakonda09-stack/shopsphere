package com.shopsphere.repository;

import com.shopsphere.entity.Product;
import com.shopsphere.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    List<Product> findBySellerId(Long sellerId);

    List<Product> findBySellerIdAndStatus(Long sellerId, ProductStatus status);

    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    List<Product> findByStatus(ProductStatus status);

    List<Product> findByIsFlaggedTrue();

    List<Product> findByCategoryIdAndStatus(Long categoryId, ProductStatus status);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchProducts(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' ORDER BY p.totalSales DESC")
    List<Product> findTopSellingProducts(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' ORDER BY p.averageRating DESC")
    List<Product> findTopRatedProducts(Pageable pageable);
}
