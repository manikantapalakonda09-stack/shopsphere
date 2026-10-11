package com.shopsphere.config;

import com.shopsphere.entity.*;
import com.shopsphere.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing and validating ShopSphere database state...");

        // Ensure all demo users have cleanly hashed BCrypt passwords
        String defaultEncodedPassword = passwordEncoder.encode("password123");

        for (User user : userRepository.findAll()) {
            user.setPassword(defaultEncodedPassword);
            userRepository.save(user);

            // Ensure every customer user has a Customer profile, Cart, and Wishlist
            boolean isCustomer = user.getRoles().stream()
                    .anyMatch(r -> r.getName() == RoleName.ROLE_CUSTOMER);
            if (isCustomer) {
                Customer customer = customerRepository.findByUserId(user.getId())
                        .orElseGet(() -> {
                            Customer c = new Customer(user);
                            c.setShippingAddress("Demo Address 101, Innovation Lane");
                            c.setCity("Bengaluru");
                            c.setState("Karnataka");
                            c.setPostalCode("560001");
                            return customerRepository.save(c);
                        });

                if (cartRepository.findByCustomerId(customer.getId()).isEmpty()) {
                    cartRepository.save(new Cart(customer));
                }

                if (wishlistRepository.findByCustomerId(customer.getId()).isEmpty()) {
                    wishlistRepository.save(new Wishlist(customer));
                }
            }
        }

        logger.info("ShopSphere startup validation complete. Ready for multi-vendor requests.");
    }
}
