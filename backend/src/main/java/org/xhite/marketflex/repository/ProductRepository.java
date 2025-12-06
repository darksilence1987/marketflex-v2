package org.xhite.marketflex.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.xhite.marketflex.model.Product;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrueOrderByCreatedAtDesc();
    List<Product> findByActiveTrueOrderByCreatedAtDesc(PageRequest pageRequest);
    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);
    Optional<Product> findByIdAndActiveTrue(Long id);
    
    @Query("SELECT p FROM Product p WHERE p.active = true AND p.stockQuantity > 0")
    List<Product> findAvailableProducts();
    
    @Query(value = "SELECT * FROM products WHERE active = true ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Product> findRandomProducts(int limit);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.stockQuantity > 0 AND p.category.id = :categoryId")
    List<Product> findAvailableProductsByCategoryId(Long categoryId);

    List<Product> findByVendorIdAndActiveTrue(Long vendorId);
}