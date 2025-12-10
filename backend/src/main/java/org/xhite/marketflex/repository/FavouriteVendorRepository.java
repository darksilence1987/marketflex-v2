package org.xhite.marketflex.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.model.FavouriteVendor;
import org.xhite.marketflex.model.Vendor;

@Repository
public interface FavouriteVendorRepository extends JpaRepository<FavouriteVendor, Long> {
    
    List<FavouriteVendor> findByUser(AppUser user);
    
    List<FavouriteVendor> findByUserIdOrderByAddedAtDesc(Long userId);
    
    Optional<FavouriteVendor> findByUserAndVendor(AppUser user, Vendor vendor);
    
    Optional<FavouriteVendor> findByUserIdAndVendorId(Long userId, Long vendorId);
    
    boolean existsByUserIdAndVendorId(Long userId, Long vendorId);
    
    void deleteByUserAndVendor(AppUser user, Vendor vendor);
    
    void deleteByUserIdAndVendorId(Long userId, Long vendorId);
    
    long countByUserId(Long userId);
}
