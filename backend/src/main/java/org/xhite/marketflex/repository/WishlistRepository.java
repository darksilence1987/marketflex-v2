package org.xhite.marketflex.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.model.Wishlist;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    
    Optional<Wishlist> findByUser(AppUser user);
    
    Optional<Wishlist> findByUserId(Long userId);
    
    boolean existsByUserId(Long userId);
}
