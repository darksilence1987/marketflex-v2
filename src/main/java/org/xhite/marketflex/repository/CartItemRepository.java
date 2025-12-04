package org.xhite.marketflex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.xhite.marketflex.model.Cart;
import org.xhite.marketflex.model.CartItem;
import org.xhite.marketflex.model.Product;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

    void deleteAllByCart(Cart cart);

    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.id = :itemId AND ci.cart.user.id = :userId")
    void deleteByIdAndUserId(Long itemId, Long userId);

}
