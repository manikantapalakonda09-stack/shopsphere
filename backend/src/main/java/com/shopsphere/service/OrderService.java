package com.shopsphere.service;

import com.shopsphere.dto.*;
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
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SellerOrderRepository sellerOrderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private SettlementRepository settlementRepository;

    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Transactional
    public OrderDto checkout(Long customerId, CheckoutRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new BadRequestException("Shopping cart is empty"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Shopping cart is empty. Please add products before checking out.");
        }

        // 1. Verify inventory availability for all items
        for (CartItem item : cart.getItems()) {
            Inventory inv = inventoryRepository.findByProductId(item.getProduct().getId())
                    .orElseThrow(() -> new BadRequestException("Inventory missing for product: " + item.getProduct().getName()));
            if (inv.getAvailableStock() < item.getQuantity()) {
                throw new BadRequestException("Product '" + item.getProduct().getName() + "' has only " + inv.getAvailableStock() + " units available.");
            }
        }

        // 2. Calculate totals and coupon discounts
        BigDecimal subtotal = cart.calculateSubtotal();
        BigDecimal discountAmount = BigDecimal.ZERO;
        String couponCode = null;

        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            Optional<Coupon> couponOpt = couponRepository.findByCodeIgnoreCase(request.getCouponCode().trim());
            if (couponOpt.isPresent() && couponOpt.get().isValid(subtotal)) {
                Coupon coupon = couponOpt.get();
                discountAmount = coupon.calculateDiscount(subtotal);
                couponCode = coupon.getCode();
                coupon.setTimesUsed(coupon.getTimesUsed() + 1);
                couponRepository.save(coupon);
            }
        }

        BigDecimal shippingFee = BigDecimal.ZERO; // Free marketplace shipping promotion
        BigDecimal totalAmount = subtotal.subtract(discountAmount).add(shippingFee);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        // 3. Create Master Order
        String orderNumber = "ORD-" + System.currentTimeMillis() % 10000000 + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setCustomer(customer);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setSubtotal(subtotal);
        order.setDiscountAmount(discountAmount);
        order.setShippingFee(shippingFee);
        order.setTotalAmount(totalAmount);
        order.setCouponCode(couponCode);

        order.setShippingName(request.getShippingName());
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingCity(request.getShippingCity());
        order.setShippingState(request.getShippingState());
        order.setShippingZip(request.getShippingZip());
        order.setShippingCountry(request.getShippingCountry() != null ? request.getShippingCountry() : "India");
        order.setShippingPhone(request.getShippingPhone());

        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CREDIT_CARD");
        order.setPaymentStatus("SUCCESS");

        Order savedOrder = orderRepository.save(order);

        // 4. Create Simulated Payment
        String txnId = "TXN-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
        Payment payment = new Payment(savedOrder, txnId, order.getPaymentMethod(), "SUCCESS", totalAmount, "INR");
        paymentRepository.save(payment);
        savedOrder.setPayment(payment);

        // 5. MULTI-VENDOR SPLITTING ENGINE: Group items by Seller
        Map<Seller, List<CartItem>> itemsBySeller = cart.getItems().stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getSeller()));

        List<SellerOrder> splitOrders = new ArrayList<>();
        List<DeliveryPartner> availableCouriers = deliveryPartnerRepository.findByIsAvailable(true);
        int courierIndex = 0;

        for (Map.Entry<Seller, List<CartItem>> entry : itemsBySeller.entrySet()) {
            Seller seller = entry.getKey();
            List<CartItem> sellerItems = entry.getValue();

            BigDecimal sellerSubtotal = sellerItems.stream()
                    .map(CartItem::getItemTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Calculate proportional discount for this seller
            BigDecimal sellerDiscount = BigDecimal.ZERO;
            if (discountAmount.compareTo(BigDecimal.ZERO) > 0 && subtotal.compareTo(BigDecimal.ZERO) > 0) {
                sellerDiscount = sellerSubtotal.multiply(discountAmount)
                        .divide(subtotal, 2, RoundingMode.HALF_UP);
            }

            BigDecimal commissionRate = seller.getCommissionRate() != null ? seller.getCommissionRate() : new BigDecimal("10.00");
            BigDecimal netTaxable = sellerSubtotal.subtract(sellerDiscount);
            if (netTaxable.compareTo(BigDecimal.ZERO) < 0) netTaxable = BigDecimal.ZERO;

            BigDecimal platformCommission = netTaxable.multiply(commissionRate)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            BigDecimal sellerPayableAmount = netTaxable.subtract(platformCommission);

            String sellerOrderNumber = "SO-" + savedOrder.getOrderNumber() + "-S" + seller.getId();

            SellerOrder sellerOrder = new SellerOrder();
            sellerOrder.setMasterOrder(savedOrder);
            sellerOrder.setSeller(seller);
            sellerOrder.setSellerOrderNumber(sellerOrderNumber);
            sellerOrder.setStatus(OrderStatus.CONFIRMED);
            sellerOrder.setSubtotal(sellerSubtotal);
            sellerOrder.setSellerDiscount(sellerDiscount);
            sellerOrder.setCommissionRate(commissionRate);
            sellerOrder.setPlatformCommission(platformCommission);
            sellerOrder.setSellerPayableAmount(sellerPayableAmount);

            SellerOrder savedSellerOrder = sellerOrderRepository.save(sellerOrder);

            // Create OrderItems and decrement inventory
            List<OrderItem> orderItems = new ArrayList<>();
            for (CartItem ci : sellerItems) {
                OrderItem oi = new OrderItem(savedSellerOrder, ci.getProduct(), ci.getQuantity(), ci.getUnitPrice());
                orderItems.add(orderItemRepository.save(oi));

                // Decrement inventory
                Inventory inv = inventoryRepository.findByProductId(ci.getProduct().getId()).get();
                inv.setStockQuantity(Math.max(0, inv.getStockQuantity() - ci.getQuantity()));
                inventoryRepository.save(inv);

                // Update product sales
                Product p = ci.getProduct();
                p.setTotalSales(p.getTotalSales() + ci.getQuantity());
                productRepository.save(p);

                // Check low-stock notification
                if (inv.isLowStock()) {
                    notificationRepository.save(new Notification(
                            seller.getUser(),
                            "Low Stock Alert: " + p.getName(),
                            "Inventory for '" + p.getName() + "' is low (" + inv.getStockQuantity() + " units remaining). Please restock.",
                            "ALERT",
                            "/seller/inventory"
                    ));
                }
            }
            savedSellerOrder.getItems().addAll(orderItems);

            // Assign Shipment
            DeliveryPartner assignedCourier = null;
            if (!availableCouriers.isEmpty()) {
                assignedCourier = availableCouriers.get(courierIndex % availableCouriers.size());
                courierIndex++;
            }

            String trackingNumber = "TRK-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
            Shipment shipment = new Shipment(savedSellerOrder, assignedCourier, trackingNumber);
            shipmentRepository.save(shipment);
            savedSellerOrder.setShipment(shipment);

            // Create Settlement record
            Settlement settlement = new Settlement(savedSellerOrder, seller, sellerSubtotal, platformCommission, sellerPayableAmount);
            settlement.setTransactionReference("SETTL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            settlementRepository.save(settlement);
            savedSellerOrder.setSettlement(settlement);

            splitOrders.add(savedSellerOrder);

            // Notify Seller
            notificationRepository.save(new Notification(
                    seller.getUser(),
                    "New Order Received #" + sellerOrderNumber,
                    "You have a new order for " + orderItems.size() + " items totaling ₹" + sellerSubtotal,
                    "ORDER",
                    "/seller/orders"
            ));
        }

        savedOrder.getSellerOrders().addAll(splitOrders);

        // 6. Clear the customer's cart
        cartItemRepository.deleteByCartId(cart.getId());

        // Notify Customer
        notificationRepository.save(new Notification(
                customer.getUser(),
                "Order Placed Successfully #" + orderNumber,
                "Your order totaling ₹" + totalAmount + " has been placed and split across " + itemsBySeller.size() + " seller(s).",
                "ORDER",
                "/customer/orders"
        ));

        return mapToDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return mapToDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getCustomerOrders(Long customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SellerOrderDto> getSellerOrders(Long sellerId) {
        return sellerOrderRepository.findBySellerIdOrderByCreatedAtDesc(sellerId).stream()
                .map(this::mapSellerOrderToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SellerOrderDto updateSellerOrderStatus(Long sellerId, Long sellerOrderId, OrderStatus status) {
        SellerOrder so = sellerOrderRepository.findById(sellerOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller order not found with id: " + sellerOrderId));

        if (!so.getSeller().getId().equals(sellerId)) {
            throw new BadRequestException("Unauthorized access to seller order");
        }

        so.setStatus(status);

        // If delivered, update settlement to RELEASED
        if (status == OrderStatus.DELIVERED) {
            Settlement settlement = settlementRepository.findBySellerOrderId(so.getId()).orElse(null);
            if (settlement != null && settlement.getStatus() == SettlementStatus.PENDING) {
                settlement.setStatus(SettlementStatus.RELEASED);
                settlement.setReleasedAt(LocalDateTime.now());
                settlementRepository.save(settlement);
            }
        }

        sellerOrderRepository.save(so);

        // Check if all seller orders for the master order have matching status
        Order master = so.getMasterOrder();
        List<SellerOrder> allSplit = sellerOrderRepository.findByMasterOrderId(master.getId());
        boolean allDelivered = allSplit.stream().allMatch(s -> s.getStatus() == OrderStatus.DELIVERED);
        if (allDelivered) {
            master.setStatus(OrderStatus.DELIVERED);
            orderRepository.save(master);
        }

        return mapSellerOrderToDto(so);
    }

    @Transactional(readOnly = true)
    public Page<OrderDto> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return orderRepository.findAll(pageable).map(this::mapToDto);
    }

    public OrderDto mapToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setCustomerName(order.getCustomer().getUser().getFullName());
        dto.setCustomerEmail(order.getCustomer().getUser().getEmail());
        dto.setStatus(order.getStatus().name());
        dto.setSubtotal(order.getSubtotal());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setShippingFee(order.getShippingFee());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setCouponCode(order.getCouponCode());
        dto.setShippingName(order.getShippingName());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setShippingCity(order.getShippingCity());
        dto.setShippingState(order.getShippingState());
        dto.setShippingZip(order.getShippingZip());
        dto.setShippingCountry(order.getShippingCountry());
        dto.setShippingPhone(order.getShippingPhone());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setCreatedAt(order.getCreatedAt());

        if (order.getPayment() != null) {
            dto.setTransactionId(order.getPayment().getTransactionId());
        }

        if (order.getSellerOrders() != null) {
            dto.setSellerOrders(order.getSellerOrders().stream()
                    .map(this::mapSellerOrderToDto)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public SellerOrderDto mapSellerOrderToDto(SellerOrder so) {
        SellerOrderDto dto = new SellerOrderDto();
        dto.setId(so.getId());
        dto.setMasterOrderId(so.getMasterOrder().getId());
        dto.setMasterOrderNumber(so.getMasterOrder().getOrderNumber());
        dto.setSellerId(so.getSeller().getId());
        dto.setSellerStoreName(so.getSeller().getStoreName());
        dto.setSellerOrderNumber(so.getSellerOrderNumber());
        dto.setStatus(so.getStatus().name());
        dto.setSubtotal(so.getSubtotal());
        dto.setSellerDiscount(so.getSellerDiscount());
        dto.setCommissionRate(so.getCommissionRate());
        dto.setPlatformCommission(so.getPlatformCommission());
        dto.setSellerPayableAmount(so.getSellerPayableAmount());
        dto.setCustomerName(so.getMasterOrder().getShippingName());
        dto.setShippingAddress(so.getMasterOrder().getShippingAddress());
        dto.setShippingCity(so.getMasterOrder().getShippingCity());
        dto.setShippingPhone(so.getMasterOrder().getShippingPhone());
        dto.setCreatedAt(so.getCreatedAt());

        if (so.getShipment() != null) {
            dto.setTrackingNumber(so.getShipment().getTrackingNumber());
            dto.setShipmentStatus(so.getShipment().getStatus().name());
            dto.setDeliveryNotes(so.getShipment().getDeliveryNotes());
        }

        if (so.getItems() != null) {
            dto.setItems(so.getItems().stream().map(item -> {
                OrderItemDto oi = new OrderItemDto();
                oi.setId(item.getId());
                oi.setProductId(item.getProduct().getId());
                oi.setProductName(item.getProductName());
                oi.setProductImage(item.getProductImage());
                oi.setUnitPrice(item.getUnitPrice());
                oi.setQuantity(item.getQuantity());
                oi.setSubtotal(item.getSubtotal());
                return oi;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}
