package com.shopsphere.ai;

import com.shopsphere.dto.ProductDto;
import com.shopsphere.entity.*;
import com.shopsphere.repository.*;
import com.shopsphere.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiRecommendationService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BrowsingHistoryRepository browsingHistoryRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductService productService;

    @Transactional
    public void recordProductView(Long customerId, Long productId) {
        if (customerId == null || productId == null) return;
        Product product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            Customer customer = new Customer();
            customer.setId(customerId);
            browsingHistoryRepository.save(new BrowsingHistory(customer, product));
        }
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getPersonalizedRecommendations(Long customerId, int limit) {
        List<Product> candidates = new ArrayList<>();

        if (customerId != null) {
            // 1. Analyze categories from recent browsing history
            List<BrowsingHistory> views = browsingHistoryRepository.findTop20ByCustomerIdOrderByViewedAtDesc(customerId);
            Set<Long> viewedCategoryIds = views.stream()
                    .map(v -> v.getProduct().getCategory().getId())
                    .collect(Collectors.toSet());

            // 2. Analyze wishlist categories
            wishlistRepository.findByCustomerId(customerId).ifPresent(wl -> {
                wl.getItems().forEach(item -> viewedCategoryIds.add(item.getProduct().getCategory().getId()));
            });

            // Find matching active products in these preferred categories
            for (Long catId : viewedCategoryIds) {
                candidates.addAll(productRepository.findByCategoryIdAndStatus(catId, ProductStatus.ACTIVE));
            }
        }

        // Fallback to top-selling and high-rated active products if candidate pool is small
        if (candidates.size() < limit) {
            List<Product> topSelling = productRepository.findByStatus(ProductStatus.ACTIVE);
            candidates.addAll(topSelling);
        }

        // Deduplicate & shuffle/rank
        List<Product> ranked = candidates.stream()
                .filter(p -> p.getStatus() == ProductStatus.ACTIVE && !Boolean.TRUE.equals(p.getIsFlagged()))
                .distinct()
                .sorted(Comparator.comparing(Product::getAverageRating).reversed())
                .limit(limit)
                .collect(Collectors.toList());

        return ranked.stream().map(productService::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getRelatedProducts(Long productId, int limit) {
        Product target = productRepository.findById(productId).orElse(null);
        if (target == null) return Collections.emptyList();

        List<Product> sameCategory = productRepository.findByCategoryIdAndStatus(target.getCategory().getId(), ProductStatus.ACTIVE);
        return sameCategory.stream()
                .filter(p -> !p.getId().equals(productId) && !Boolean.TRUE.equals(p.getIsFlagged()))
                .sorted(Comparator.comparing(Product::getTotalSales).reversed())
                .limit(limit)
                .map(productService::mapToDto)
                .collect(Collectors.toList());
    }
}
