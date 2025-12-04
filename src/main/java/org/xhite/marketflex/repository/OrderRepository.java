package org.xhite.marketflex.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Find all orders for a user, sorted by creation date descending (newest first).
     */
    List<Order> findByUserOrderByCreatedAtDesc(AppUser user);

    /**
     * Find an order by ID and user (for ownership validation).
     */
    Optional<Order> findByIdAndUser(Long id, AppUser user);
}
