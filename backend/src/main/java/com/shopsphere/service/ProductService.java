package com.shopsphere.service;

import com.shopsphere.dto.InventoryUpdateDto;
import com.shopsphere.dto.ProductCreateRequest;
import com.shopsphere.dto.ProductDto;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Transactional(readOnly = true)
    public Page<ProductDto> searchCatalog(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String search,
                                         int page, int size, String sortBy, String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction != null ? direction : "DESC"), 
                            sortBy != null ? sortBy : "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> productPage = productRepository.searchProducts(categoryId, minPrice, maxPrice, search, pageable);
        return productPage.map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDto(product);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return mapToDto(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getFeaturedProducts() {
        Pageable topEight = PageRequest.of(0, 8);
        return productRepository.findTopSellingProducts(topEight).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getTopRatedProducts() {
        Pageable topEight = PageRequest.of(0, 8);
        return productRepository.findTopRatedProducts(topEight).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getProductsBySeller(Long sellerId) {
        return productRepository.findBySellerIdAndStatus(sellerId, ProductStatus.ACTIVE).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto createProduct(Long sellerId, ProductCreateRequest request) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + sellerId));

        if (seller.getStatus() != SellerStatus.APPROVED) {
            throw new BadRequestException("Seller account is not approved to list products. Current status: " + seller.getStatus());
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = new Product();
        product.setSeller(seller);
        product.setCategory(category);
        product.setName(request.getName());

        String slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-") + "-" + UUID.randomUUID().toString().substring(0, 8);
        product.setSlug(slug);
        product.setDescription(request.getDescription());
        product.setHighlights(request.getHighlights());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice() != null ? request.getOriginalPrice() : request.getPrice());
        product.setDiscountPercent(request.getDiscountPercent() != null ? request.getDiscountPercent() : 0);
        product.setSku(request.getSku() != null ? request.getSku() : "SKU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        product.setStatus(ProductStatus.ACTIVE);

        Product savedProduct = productRepository.save(product);

        // Save inventory
        Inventory inventory = new Inventory(savedProduct, request.getStockQuantity(), 
                request.getLowStockThreshold() != null ? request.getLowStockThreshold() : 5);
        inventoryRepository.save(inventory);
        savedProduct.setInventory(inventory);

        // Save product images
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImage img = new ProductImage(savedProduct, request.getImageUrls().get(i), i == 0, i + 1);
                images.add(productImageRepository.save(img));
            }
            savedProduct.setImages(images);
        }

        return mapToDto(savedProduct);
    }

    @Transactional
    public ProductDto updateProduct(Long sellerId, Long productId, ProductCreateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (!product.getSeller().getId().equals(sellerId)) {
            throw new BadRequestException("Unauthorized: You do not own this product listing");
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getHighlights() != null) product.setHighlights(request.getHighlights());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getOriginalPrice() != null) product.setOriginalPrice(request.getOriginalPrice());
        if (request.getDiscountPercent() != null) product.setDiscountPercent(request.getDiscountPercent());
        if (request.getSku() != null) product.setSku(request.getSku());

        // Update Inventory if provided
        if (request.getStockQuantity() != null && product.getInventory() != null) {
            Inventory inv = product.getInventory();
            inv.setStockQuantity(request.getStockQuantity());
            if (request.getLowStockThreshold() != null) {
                inv.setLowStockThreshold(request.getLowStockThreshold());
            }
            inventoryRepository.save(inv);
        }

        // Update images if provided
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            product.getImages().clear();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImage img = new ProductImage(product, request.getImageUrls().get(i), i == 0, i + 1);
                product.getImages().add(img);
            }
        }

        Product updated = productRepository.save(product);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteProduct(Long sellerId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (!product.getSeller().getId().equals(sellerId)) {
            throw new BadRequestException("Unauthorized: You do not own this product listing");
        }

        product.setStatus(ProductStatus.INACTIVE);
        productRepository.save(product);
    }

    @Transactional
    public ProductDto updateInventory(Long sellerId, Long productId, InventoryUpdateDto dto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (!product.getSeller().getId().equals(sellerId)) {
            throw new BadRequestException("Unauthorized: You do not own this product listing");
        }

        Inventory inv = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory record not found"));

        inv.setStockQuantity(dto.getStockQuantity());
        if (dto.getLowStockThreshold() != null) {
            inv.setLowStockThreshold(dto.getLowStockThreshold());
        }
        inventoryRepository.save(inv);

        return mapToDto(product);
    }

    public ProductDto mapToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setSellerId(product.getSeller().getId());
        dto.setSellerStoreName(product.getSeller().getStoreName());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDescription(product.getDescription());
        dto.setHighlights(product.getHighlights());
        dto.setPrice(product.getPrice());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setDiscountPercent(product.getDiscountPercent());
        dto.setSku(product.getSku());
        dto.setStatus(product.getStatus().name());
        dto.setIsFlagged(product.getIsFlagged());
        dto.setFlagReason(product.getFlagReason());
        dto.setAverageRating(product.getAverageRating());
        dto.setTotalReviews(product.getTotalReviews());
        dto.setTotalSales(product.getTotalSales());
        dto.setPrimaryImageUrl(product.getPrimaryImageUrl());
        dto.setCreatedAt(product.getCreatedAt());

        if (product.getImages() != null) {
            dto.setImageUrls(product.getImages().stream().map(ProductImage::getImageUrl).collect(Collectors.toList()));
        }

        if (product.getInventory() != null) {
            dto.setStockQuantity(product.getInventory().getStockQuantity());
            dto.setLowStockThreshold(product.getInventory().getLowStockThreshold());
            dto.setIsLowStock(product.getInventory().isLowStock());
            dto.setOutOfStock(product.getInventory().getOutOfStock());
        } else {
            dto.setStockQuantity(0);
            dto.setLowStockThreshold(5);
            dto.setIsLowStock(false);
            dto.setOutOfStock(true);
        }

        return dto;
    }
}
