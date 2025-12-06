package org.xhite.marketflex.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.xhite.marketflex.model.Vendor;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    
    Optional<Vendor> findByStoreName(String storeName);
    
    Optional<Vendor> findByStoreNameIgnoreCase(String storeName);
    
    // Changed to List for multi-vendor support
    List<Vendor> findByUserId(Long userId);
    
    Optional<Vendor> findByUserEmail(String email);
    
    boolean existsByStoreName(String storeName);
    
    boolean existsByUserId(Long userId);
}
