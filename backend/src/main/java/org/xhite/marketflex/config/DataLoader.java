package org.xhite.marketflex.config;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.model.Category;
import org.xhite.marketflex.model.Product;
import org.xhite.marketflex.model.Vendor;
import org.xhite.marketflex.model.enums.Role;
import org.xhite.marketflex.repository.CategoryRepository;
import org.xhite.marketflex.repository.ProductRepository;
import org.xhite.marketflex.repository.UserRepository;
import org.xhite.marketflex.repository.VendorRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
@Profile("!prod")
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final VendorRepository vendorRepository;

    @Override
    public void run(String... args) {
        Vendor vendor = null;
        if (userRepository.count() == 0) {
            createAdminUser();
            AppUser manager = createTestManager();
            createTestCustomer();
            
            // Create vendor for the manager
            vendor = createVendorForUser(manager, "MarketFlex Official Store");
        } else {
            // Fetch existing vendor if data already exists
            vendor = vendorRepository.findByUserEmail("manager@marketflex.com").orElse(null);
        }

        // Skip if products already exist
        if (productRepository.count() > 0) {
            log.info("Products already exist, skipping data load");
            return;
        }

        if (vendor == null) {
            log.warn("No vendor found, skipping product creation");
            return;
        }

        // Create categories
        Category electronics = new Category();
        electronics.setName("Electronics");
        electronics.setDescription("Electronic gadgets and devices");
        electronics.setImageUrl("/images/categories/electronics.jpg");

        Category fashion = new Category();
        fashion.setName("Fashion");
        fashion.setDescription("Latest fashion trends");
        fashion.setImageUrl("/images/categories/fashion.jpg");

        categoryRepository.saveAll(Arrays.asList(electronics, fashion));

        final Vendor finalVendor = vendor;

        // Create products with vendor assignment
        Product smartphone = new Product();
        smartphone.setName("Smartphone");
        smartphone.setDescription("Latest model smartphone with advanced features");
        smartphone.setPrice(new BigDecimal("699.99"));
        smartphone.setStockQuantity(100);
        smartphone.setCategory(electronics);
        smartphone.setImageUrl("/images/products/smartphone.jpg");
        smartphone.setVendor(finalVendor);

        Product tshirt = new Product();
        tshirt.setName("T-Shirt");
        tshirt.setDescription("Comfortable cotton t-shirt");
        tshirt.setPrice(new BigDecimal("19.99"));
        tshirt.setStockQuantity(200);
        tshirt.setCategory(fashion);
        tshirt.setImageUrl("/images/products/tshirt.jpg");
        tshirt.setVendor(finalVendor);

        productRepository.saveAll(Arrays.asList(smartphone, tshirt));

        // Create a few more products
        Product laptop = new Product();
        laptop.setName("Laptop");
        laptop.setDescription("High performance laptop for work and gaming");
        laptop.setPrice(new BigDecimal("1299.99"));
        laptop.setStockQuantity(50);
        laptop.setCategory(electronics);
        laptop.setImageUrl("/images/products/laptop.jpg");
        laptop.setVendor(finalVendor);

        Product jeans = new Product();
        jeans.setName("Jeans");
        jeans.setDescription("Stylish denim jeans");
        jeans.setPrice(new BigDecimal("39.99"));
        jeans.setStockQuantity(150);
        jeans.setCategory(fashion);
        jeans.setImageUrl("/images/products/jeans.jpg");
        jeans.setVendor(finalVendor);

        Product headphones = new Product();
        headphones.setName("Headphones");
        headphones.setDescription("Wireless headphones with noise cancellation");
        headphones.setPrice(new BigDecimal("99.99"));
        headphones.setStockQuantity(100);
        headphones.setCategory(electronics);
        headphones.setImageUrl("/images/products/headphones.jpg");
        headphones.setVendor(finalVendor);

        Product dress = new Product();
        dress.setName("Dress");
        dress.setDescription("Elegant evening dress");
        dress.setPrice(new BigDecimal("59.99"));
        dress.setStockQuantity(100);
        dress.setCategory(fashion);
        dress.setImageUrl("/images/products/dress.jpg");
        dress.setVendor(finalVendor);

        productRepository.saveAll(Arrays.asList(laptop, jeans, headphones, dress));
        log.info("Created {} products assigned to vendor: {}", 6, finalVendor.getStoreName());
    }

    private void createAdminUser() {
        AppUser admin = AppUser.builder()
                .email("admin@marketflex.com")
                .password(passwordEncoder.encode("Admin123!"))
                .firstName("Admin")
                .lastName("User")
                .roles(Set.of(Role.ADMIN))
                .enabled(true)
                .accountNonLocked(true)
                .build();
        
        userRepository.save(admin);
        log.info("Admin user created");
    }

    private AppUser createTestManager() {
        AppUser manager = AppUser.builder()
                .email("manager@marketflex.com")
                .password(passwordEncoder.encode("Manager123!"))
                .firstName("Manager")
                .lastName("User")
                .roles(Set.of(Role.MANAGER, Role.VENDOR))
                .enabled(true)
                .accountNonLocked(true)
                .build();
        
        AppUser savedManager = userRepository.save(manager);
        log.info("Manager user created with VENDOR role");
        return savedManager;
    }

    private void createTestCustomer() {
        AppUser customer = AppUser.builder()
                .email("customer@marketflex.com")
                .password(passwordEncoder.encode("Customer123!"))
                .firstName("Customer")
                .lastName("User")
                .roles(Set.of(Role.CUSTOMER))
                .enabled(true)
                .accountNonLocked(true)
                .build();
        
        userRepository.save(customer);
        log.info("Customer user created");
    }

    private Vendor createVendorForUser(AppUser user, String storeName) {
        Vendor vendor = Vendor.builder()
                .storeName(storeName)
                .storeDescription("Official MarketFlex store with premium products")
                .contactEmail(user.getEmail())
                .user(user)
                .build();
        
        Vendor savedVendor = vendorRepository.save(vendor);
        log.info("Vendor created: {}", savedVendor.getStoreName());
        return savedVendor;
    }
}