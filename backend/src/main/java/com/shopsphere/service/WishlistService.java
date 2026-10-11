package com.shopsphere.service;

import com.shopsphere.dto.ProductDto;
import com.shopsphere.entity.*;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Transactional(readOnly = true)
    public List<ProductDto> getCustomerWishlist(Long customerId) {
        Wishlist wishlist = getOrCreateWishlist(customerId);
        return wishlist.getItems().stream()
                .map(item -> productService.mapToDto(item.getProduct()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void addToWishlist(Long customerId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(customerId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), productId).isEmpty()) {
            WishlistItem item = new WishlistItem(wishlist, product);
            wishlistItemRepository.save(item);
        }
    }

    @Transactional
    public void removeFromWishlist(Long customerId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(customerId);
        wishlistItemRepository.deleteByWishlistIdAndProductId(wishlist.getId(), productId);
    }

    private Wishlist getOrCreateWishlist(Long customerId) {
        return wishlistRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Customer customer = customerRepository.findById(customerId)
                            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
                    return wishlistRepository.save(new Wishlist(customer));
                });
    }
}
