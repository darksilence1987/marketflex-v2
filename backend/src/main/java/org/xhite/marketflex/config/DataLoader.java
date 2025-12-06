package org.xhite.marketflex.config;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
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
        // Skip if data already exists
        if (productRepository.count() > 0) {
            log.info("Products already exist, skipping data load");
            return;
        }

        log.info("Starting comprehensive data load...");

        // Create users
        createAdminUser();
        AppUser manager = createTestManager();
        AppUser multiStoreOwner = createMultiStoreOwner();
        createTestCustomer();

        // Create vendors
        Vendor mainVendor = createVendorForUser(manager, "MarketFlex Official", 
            "Premium products from the official MarketFlex store",
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400");
        
        // Multi-store owner gets 3 stores
        Vendor techStore = createVendorForUser(multiStoreOwner, "TechZone", 
            "Your one-stop shop for all things technology",
            "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400");
        
        Vendor fashionStore = createVendorForUser(multiStoreOwner, "StyleHub", 
            "Fashion forward clothing and accessories",
            "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400");
        
        Vendor homeStore = createVendorForUser(multiStoreOwner, "HomeNest", 
            "Everything you need for a cozy home",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400");

        // Additional vendors
        Vendor fitnessVendor = createVendorForUser(
            createVendorUser("fitness@vendor.com", "FitGear", "Pro"),
            "FitGear Pro", "Professional fitness equipment and sportswear",
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400");

        Vendor beautyVendor = createVendorForUser(
            createVendorUser("beauty@vendor.com", "GlowUp", "Beauty"),
            "GlowUp Beauty", "Premium skincare and cosmetics",
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400");

        Vendor bookVendor = createVendorForUser(
            createVendorUser("books@vendor.com", "BookWorm", "Reads"),
            "BookWorm Reads", "Books for every reader",
            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400");

        // Create categories with images
        List<Category> categories = createCategories();
        Category electronics = findCategory(categories, "Electronics");
        Category fashion = findCategory(categories, "Fashion");
        Category home = findCategory(categories, "Home & Living");
        Category sports = findCategory(categories, "Sports & Fitness");
        Category beauty = findCategory(categories, "Beauty");
        Category books = findCategory(categories, "Books");
        Category toys = findCategory(categories, "Toys & Games");
        Category automotive = findCategory(categories, "Automotive");

        // Create products for each vendor and category
        List<Product> allProducts = new ArrayList<>();

        // Main vendor products (Electronics & Fashion)
        allProducts.addAll(createElectronicsProducts(mainVendor, electronics));
        allProducts.addAll(createFashionProducts(mainVendor, fashion));

        // TechZone products
        allProducts.addAll(createElectronicsProducts(techStore, electronics));
        allProducts.add(createProduct("Gaming Console", "Next-gen gaming console", 
            new BigDecimal("499.99"), 45, electronics, techStore,
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400"));
        allProducts.add(createProduct("VR Headset", "Immersive virtual reality headset", 
            new BigDecimal("399.99"), 30, electronics, techStore,
            "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400"));

        // StyleHub products
        allProducts.addAll(createFashionProducts(fashionStore, fashion));
        allProducts.add(createProduct("Designer Watch", "Luxury timepiece", 
            new BigDecimal("299.99"), 25, fashion, fashionStore,
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400"));
        allProducts.add(createProduct("Sunglasses", "UV protection stylish shades", 
            new BigDecimal("89.99"), 80, fashion, fashionStore,
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"));

        // HomeNest products
        allProducts.addAll(createHomeProducts(homeStore, home));

        // FitGear products
        allProducts.addAll(createSportsProducts(fitnessVendor, sports));

        // GlowUp products
        allProducts.addAll(createBeautyProducts(beautyVendor, beauty));

        // BookWorm products
        allProducts.addAll(createBookProducts(bookVendor, books));

        // Additional toys products
        allProducts.add(createProduct("Building Blocks Set", "1000 piece creative blocks", 
            new BigDecimal("49.99"), 100, toys, mainVendor,
            "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400"));
        allProducts.add(createProduct("Remote Control Car", "High-speed RC car", 
            new BigDecimal("79.99"), 60, toys, mainVendor,
            "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400"));
        allProducts.add(createProduct("Board Game Collection", "Family game night essentials", 
            new BigDecimal("34.99"), 75, toys, techStore,
            "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400"));

        // Automotive products
        allProducts.add(createProduct("Car Vacuum Cleaner", "Portable car vacuum", 
            new BigDecimal("39.99"), 90, automotive, homeStore,
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"));
        allProducts.add(createProduct("Dash Camera", "Full HD dashcam with night vision", 
            new BigDecimal("79.99"), 50, automotive, techStore,
            "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400"));

        productRepository.saveAll(allProducts);
        log.info("Created {} products across {} vendors", allProducts.size(), 6);
    }

    private List<Category> createCategories() {
        List<Category> categories = new ArrayList<>();
        
        categories.add(createCategory("Electronics", "Electronic gadgets and devices",
            "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600"));
        categories.add(createCategory("Fashion", "Latest fashion trends and clothing",
            "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600"));
        categories.add(createCategory("Home & Living", "Furniture, decor and home essentials",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600"));
        categories.add(createCategory("Sports & Fitness", "Sports equipment and activewear",
            "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600"));
        categories.add(createCategory("Beauty", "Skincare, makeup and grooming",
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600"));
        categories.add(createCategory("Books", "Books, eBooks and audiobooks",
            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600"));
        categories.add(createCategory("Toys & Games", "Toys, games and entertainment",
            "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600"));
        categories.add(createCategory("Automotive", "Car accessories and parts",
            "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600"));

        return categoryRepository.saveAll(categories);
    }

    private Category createCategory(String name, String description, String imageUrl) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setImageUrl(imageUrl);
        category.setActive(true);
        return category;
    }

    private Category findCategory(List<Category> categories, String name) {
        return categories.stream()
            .filter(c -> c.getName().equals(name))
            .findFirst()
            .orElseThrow();
    }

    private List<Product> createElectronicsProducts(Vendor vendor, Category category) {
        List<Product> products = new ArrayList<>();
        products.add(createProduct("Smartphone Pro", "Latest flagship smartphone with 5G", 
            new BigDecimal("999.99"), 50, category, vendor,
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"));
        products.add(createProduct("Laptop Ultra", "High-performance ultrabook", 
            new BigDecimal("1299.99"), 30, category, vendor,
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"));
        products.add(createProduct("Wireless Earbuds", "True wireless with ANC", 
            new BigDecimal("149.99"), 100, category, vendor,
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400"));
        products.add(createProduct("Smart Watch", "Fitness tracking smartwatch", 
            new BigDecimal("249.99"), 75, category, vendor,
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400"));
        products.add(createProduct("Tablet Plus", "10.5 inch tablet with stylus", 
            new BigDecimal("449.99"), 40, category, vendor,
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400"));
        return products;
    }

    private List<Product> createFashionProducts(Vendor vendor, Category category) {
        List<Product> products = new ArrayList<>();
        products.add(createProduct("Classic T-Shirt", "Premium cotton casual tee", 
            new BigDecimal("29.99"), 200, category, vendor,
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"));
        products.add(createProduct("Denim Jeans", "Slim fit classic denim", 
            new BigDecimal("59.99"), 150, category, vendor,
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"));
        products.add(createProduct("Leather Jacket", "Genuine leather biker jacket", 
            new BigDecimal("199.99"), 40, category, vendor,
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"));
        products.add(createProduct("Running Shoes", "Lightweight performance shoes", 
            new BigDecimal("89.99"), 120, category, vendor,
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"));
        products.add(createProduct("Summer Dress", "Floral print midi dress", 
            new BigDecimal("49.99"), 80, category, vendor,
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400"));
        return products;
    }

    private List<Product> createHomeProducts(Vendor vendor, Category category) {
        List<Product> products = new ArrayList<>();
        products.add(createProduct("Ergonomic Office Chair", "Adjustable lumbar support chair", 
            new BigDecimal("299.99"), 30, category, vendor,
            "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400"));
        products.add(createProduct("LED Desk Lamp", "Dimmable smart desk lamp", 
            new BigDecimal("49.99"), 80, category, vendor,
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400"));
        products.add(createProduct("Coffee Maker", "Programmable drip coffee machine", 
            new BigDecimal("79.99"), 60, category, vendor,
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400"));
        products.add(createProduct("Throw Blanket", "Soft fleece cozy blanket", 
            new BigDecimal("34.99"), 100, category, vendor,
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400"));
        products.add(createProduct("Plant Pot Set", "Ceramic indoor planters", 
            new BigDecimal("24.99"), 120, category, vendor,
            "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400"));
        return products;
    }

    private List<Product> createSportsProducts(Vendor vendor, Category category) {
        List<Product> products = new ArrayList<>();
        products.add(createProduct("Yoga Mat Premium", "Non-slip exercise mat", 
            new BigDecimal("39.99"), 150, category, vendor,
            "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"));
        products.add(createProduct("Dumbbell Set", "Adjustable weight dumbbells", 
            new BigDecimal("149.99"), 40, category, vendor,
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400"));
        products.add(createProduct("Resistance Bands", "5-piece resistance band set", 
            new BigDecimal("24.99"), 200, category, vendor,
            "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400"));
        products.add(createProduct("Running Shorts", "Breathable athletic shorts", 
            new BigDecimal("29.99"), 120, category, vendor,
            "https://images.unsplash.com/photo-1591291621164-2c6367723315?w=400"));
        products.add(createProduct("Sports Water Bottle", "Insulated steel bottle", 
            new BigDecimal("19.99"), 180, category, vendor,
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"));
        return products;
    }

    private List<Product> createBeautyProducts(Vendor vendor, Category category) {
        List<Product> products = new ArrayList<>();
        products.add(createProduct("Face Serum", "Vitamin C brightening serum", 
            new BigDecimal("39.99"), 100, category, vendor,
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"));
        products.add(createProduct("Moisturizer", "Hydrating day cream", 
            new BigDecimal("29.99"), 120, category, vendor,
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400"));
        products.add(createProduct("Lipstick Set", "Long-lasting matte collection", 
            new BigDecimal("49.99"), 80, category, vendor,
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400"));
        products.add(createProduct("Perfume", "Eau de parfum floral notes", 
            new BigDecimal("79.99"), 60, category, vendor,
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400"));
        products.add(createProduct("Makeup Brush Set", "Professional 12-piece set", 
            new BigDecimal("34.99"), 90, category, vendor,
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400"));
        return products;
    }

    private List<Product> createBookProducts(Vendor vendor, Category category) {
        List<Product> products = new ArrayList<>();
        products.add(createProduct("Fiction Bestseller", "Award-winning novel", 
            new BigDecimal("16.99"), 150, category, vendor,
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"));
        products.add(createProduct("Cookbook Collection", "100+ recipes from around the world", 
            new BigDecimal("29.99"), 80, category, vendor,
            "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400"));
        products.add(createProduct("Self-Help Guide", "Productivity and mindfulness", 
            new BigDecimal("14.99"), 200, category, vendor,
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"));
        products.add(createProduct("Children's Stories", "Illustrated fairy tales", 
            new BigDecimal("12.99"), 100, category, vendor,
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400"));
        products.add(createProduct("History Encyclopedia", "Comprehensive world history", 
            new BigDecimal("44.99"), 50, category, vendor,
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"));
        return products;
    }

    private Product createProduct(String name, String description, BigDecimal price, 
            int stock, Category category, Vendor vendor, String imageUrl) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStockQuantity(stock);
        product.setCategory(category);
        product.setVendor(vendor);
        product.setImageUrl(imageUrl);
        product.setActive(true);
        return product;
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

    private AppUser createMultiStoreOwner() {
        AppUser owner = AppUser.builder()
                .email("multistore@marketflex.com")
                .password(passwordEncoder.encode("MultiStore123!"))
                .firstName("Multi")
                .lastName("StoreOwner")
                .roles(Set.of(Role.VENDOR))
                .enabled(true)
                .accountNonLocked(true)
                .build();
        
        AppUser savedOwner = userRepository.save(owner);
        log.info("Multi-store owner created (multistore@marketflex.com / MultiStore123!)");
        return savedOwner;
    }

    private AppUser createVendorUser(String email, String firstName, String lastName) {
        AppUser user = AppUser.builder()
                .email(email)
                .password(passwordEncoder.encode("Vendor123!"))
                .firstName(firstName)
                .lastName(lastName)
                .roles(Set.of(Role.VENDOR))
                .enabled(true)
                .accountNonLocked(true)
                .build();
        return userRepository.save(user);
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

    private Vendor createVendorForUser(AppUser user, String storeName, String description, String logoUrl) {
        Vendor vendor = Vendor.builder()
                .storeName(storeName)
                .storeDescription(description)
                .contactEmail(user.getEmail())
                .user(user)
                .build();
        
        Vendor savedVendor = vendorRepository.save(vendor);
        log.info("Vendor created: {}", savedVendor.getStoreName());
        return savedVendor;
    }
}