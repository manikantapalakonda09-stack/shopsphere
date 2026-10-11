package com.shopsphere.service;

import com.shopsphere.dto.AddToCartRequest;
import com.shopsphere.dto.CartDto;
import com.shopsphere.dto.CartItemDto;
import com.shopsphere.dto.UpdateCartItemRequest;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Transactional(readOnly = true)
    public CartDto getCustomerCart(Long customerId) {
        Cart cart = getOrCreateCart(customerId);
        return mapToDto(cart);
    }

    @Transactional
    public CartDto addItemToCart(Long customerId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(customerId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new BadRequestException("Product is not currently available for purchase");
        }

        // Validate available inventory
        Inventory inventory = inventoryRepository.findByProductId(product.getId())
                .orElseThrow(() -> new BadRequestException("Product inventory not initialized"));

        int currentCartQty = 0;
        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());
        if (existingItemOpt.isPresent()) {
            currentCartQty = existingItemOpt.get().getQuantity();
        }

        int requestedTotal = currentCartQty + request.getQuantity();
        if (requestedTotal > inventory.getAvailableStock()) {
            throw new BadRequestException("Insufficient stock available. Only " + inventory.getAvailableStock() + " units available.");
        }

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(requestedTotal);
            existingItem.setUnitPrice(product.getPrice());
            cartItemRepository.save(existingItem);
            if (cart.getItems() != null) {
                for (CartItem ci : cart.getItems()) {
                    if (ci.getId() != null && ci.getId().equals(existingItem.getId())) {
                        ci.setQuantity(requestedTotal);
                        ci.setUnitPrice(product.getPrice());
                    }
                }
            }
        } else {
            CartItem newItem = new CartItem(cart, product, request.getQuantity(), product.getPrice());
            CartItem savedItem = cartItemRepository.save(newItem);
            if (cart.getItems() != null) {
                cart.getItems().add(savedItem);
            }
        }

        cartRepository.saveAndFlush(cart);
        return mapToDto(cart);
    }

    @Transactional
    public CartDto updateItemQuantity(Long customerId, Long cartItemId, UpdateCartItemRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            return removeItemFromCart(customerId, cartItemId);
        }

        Cart cart = getOrCreateCart(customerId);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        Inventory inventory = inventoryRepository.findByProductId(item.getProduct().getId())
                .orElseThrow(() -> new BadRequestException("Product inventory not initialized"));

        if (request.getQuantity() > inventory.getAvailableStock()) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + inventory.getAvailableStock() + " available)");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        if (cart.getItems() != null) {
            for (CartItem ci : cart.getItems()) {
                if (ci.getId() != null && ci.getId().equals(cartItemId)) {
                    ci.setQuantity(request.getQuantity());
                }
            }
        }

        cartRepository.saveAndFlush(cart);
        return mapToDto(cart);
    }

    @Transactional
    public CartDto removeItemFromCart(Long customerId, Long cartItemId) {
        Cart cart = getOrCreateCart(customerId);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }

        if (cart.getItems() != null) {
            cart.getItems().removeIf(i -> i.getId() != null && i.getId().equals(cartItemId));
        }
        item.setCart(null);
        cartItemRepository.delete(item);
        cartRepository.saveAndFlush(cart);
        return mapToDto(cart);
    }

    @Transactional
    public void clearCart(Long customerId) {
        Cart cart = getOrCreateCart(customerId);
        if (cart.getItems() != null) {
            cart.getItems().clear();
        }
        cartItemRepository.deleteByCartId(cart.getId());
        cartRepository.saveAndFlush(cart);
    }

    private Cart getOrCreateCart(Long customerId) {
        return cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Customer customer = customerRepository.findById(customerId)
                            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
                    return cartRepository.save(new Cart(customer));
                });
    }

    public CartDto mapToDto(Cart cart) {
        CartDto dto = new CartDto();
        dto.setId(cart.getId());
        dto.setCustomerId(cart.getCustomer().getId());

        if (cart.getItems() != null) {
            dto.setItems(cart.getItems().stream().map(item -> {
                CartItemDto itemDto = new CartItemDto();
                itemDto.setId(item.getId());
                itemDto.setProductId(item.getProduct().getId());
                itemDto.setProductName(item.getProduct().getName());
                itemDto.setProductSlug(item.getProduct().getSlug());
                itemDto.setProductImage(item.getProduct().getPrimaryImageUrl());
                itemDto.setSellerId(item.getProduct().getSeller().getId());
                itemDto.setSellerStoreName(item.getProduct().getSeller().getStoreName());
                itemDto.setQuantity(item.getQuantity());
                itemDto.setUnitPrice(item.getUnitPrice());
                itemDto.setSubtotal(item.getItemTotal());
                
                if (item.getProduct().getInventory() != null) {
                    itemDto.setAvailableStock(item.getProduct().getInventory().getAvailableStock());
                }
                return itemDto;
            }).collect(Collectors.toList()));

            dto.setTotalItems(cart.getItems().stream().mapToInt(CartItem::getQuantity).sum());
            dto.setSubtotal(cart.calculateSubtotal());
        } else {
            dto.setTotalItems(0);
            dto.setSubtotal(BigDecimal.ZERO);
        }

        return dto;
    }
}
