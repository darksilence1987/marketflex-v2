package org.xhite.marketflex.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.xhite.marketflex.model.Order;
import org.xhite.marketflex.model.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /**
     * Find all items for a specific order.
     */
    List<OrderItem> findByOrder(Order order);
    
    /**
     * Find all order items for a specific vendor (for vendor dashboard orders).
     */
    List<OrderItem> findByVendorIdOrderByCreatedAtDesc(Long vendorId);
}
