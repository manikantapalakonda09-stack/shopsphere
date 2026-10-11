package com.shopsphere.service;

import com.shopsphere.dto.*;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import com.shopsphere.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private SellerProfileRepository sellerProfileRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse registerCustomer(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        Role customerRole = roleRepository.findByName(RoleName.ROLE_CUSTOMER)
                .orElseThrow(() -> new ResourceNotFoundException("Customer role not found"));

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getPhone()
        );
        user.setRoles(Collections.singleton(customerRole));
        User savedUser = userRepository.save(user);

        // Create Customer profile
        Customer customer = new Customer(savedUser);
        customer.setShippingAddress(request.getShippingAddress());
        customer.setCity(request.getCity());
        customer.setState(request.getState());
        customer.setPostalCode(request.getPostalCode());
        Customer savedCustomer = customerRepository.save(customer);

        // Create empty Cart and Wishlist
        cartRepository.save(new Cart(savedCustomer));
        wishlistRepository.save(new Wishlist(savedCustomer));

        // Generate JWT
        String token = tokenProvider.generateTokenFromEmail(savedUser.getEmail(), savedUser.getId(), savedUser.getFullName());

        AuthResponse response = new AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), List.of("ROLE_CUSTOMER"));
        response.setCustomerId(savedCustomer.getId());
        return response;
    }

    @Transactional
    public AuthResponse registerSeller(SellerRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        Role sellerRole = roleRepository.findByName(RoleName.ROLE_SELLER)
                .orElseThrow(() -> new ResourceNotFoundException("Seller role not found"));

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getPhone()
        );
        user.setRoles(Collections.singleton(sellerRole));
        User savedUser = userRepository.save(user);

        // Create Seller record in PENDING state awaiting Admin approval
        Seller seller = new Seller();
        seller.setUser(savedUser);
        seller.setStoreName(request.getStoreName());
        seller.setBusinessEmail(request.getBusinessEmail() != null ? request.getBusinessEmail() : request.getEmail());
        seller.setPhone(request.getPhone());
        seller.setStoreDescription(request.getStoreDescription());
        seller.setBusinessAddress(request.getBusinessAddress());
        seller.setTaxId(request.getTaxId());
        seller.setStatus(SellerStatus.PENDING);
        seller.setCommissionRate(new BigDecimal("10.00"));
        Seller savedSeller = sellerRepository.save(seller);

        // Create default profile
        SellerProfile profile = new SellerProfile();
        profile.setSeller(savedSeller);
        sellerProfileRepository.save(profile);

        String token = tokenProvider.generateTokenFromEmail(savedUser.getEmail(), savedUser.getId(), savedUser.getFullName());

        AuthResponse response = new AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), List.of("ROLE_SELLER"));
        response.setSellerId(savedSeller.getId());
        response.setStoreName(savedSeller.getStoreName());
        response.setSellerStatus(savedSeller.getStatus().name());
        return response;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        AuthResponse response = new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), roleNames);

        sellerRepository.findByUserId(user.getId()).ifPresent(seller -> {
            response.setSellerId(seller.getId());
            response.setStoreName(seller.getStoreName());
            response.setSellerStatus(seller.getStatus().name());
        });

        customerRepository.findByUserId(user.getId()).ifPresent(customer -> {
            response.setCustomerId(customer.getId());
        });

        return response;
    }

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setRoles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList()));

        customerRepository.findByUserId(user.getId()).ifPresent(customer -> {
            dto.setCustomerId(customer.getId());
            dto.setShippingAddress(customer.getShippingAddress());
            dto.setCity(customer.getCity());
            dto.setState(customer.getState());
            dto.setPostalCode(customer.getPostalCode());
            dto.setCountry(customer.getCountry());
        });

        sellerRepository.findByUserId(user.getId()).ifPresent(seller -> {
            dto.setSellerId(seller.getId());
            dto.setStoreName(seller.getStoreName());
            dto.setSellerStatus(seller.getStatus().name());
        });

        return dto;
    }

    @Transactional
    public UserProfileDto updateProfile(String email, UserProfileDto updateRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (updateRequest.getFullName() != null) user.setFullName(updateRequest.getFullName());
        if (updateRequest.getPhone() != null) user.setPhone(updateRequest.getPhone());
        userRepository.save(user);

        customerRepository.findByUserId(user.getId()).ifPresent(customer -> {
            if (updateRequest.getShippingAddress() != null) customer.setShippingAddress(updateRequest.getShippingAddress());
            if (updateRequest.getCity() != null) customer.setCity(updateRequest.getCity());
            if (updateRequest.getState() != null) customer.setState(updateRequest.getState());
            if (updateRequest.getPostalCode() != null) customer.setPostalCode(updateRequest.getPostalCode());
            customerRepository.save(customer);
        });

        return getProfile(email);
    }
}
