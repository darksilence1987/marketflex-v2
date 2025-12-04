package org.xhite.marketflex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.xhite.marketflex.model.Category;
import org.xhite.marketflex.dto.CategoryDto;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    @Query("SELECT c FROM Category c WHERE c.active = true")
    List<Category> findAllActive();
    
    @Query("SELECT c FROM Category c WHERE c.id = :id AND c.active = true")
    Optional<Category> findActiveById(@Param("id") Long id);
    
    boolean existsByNameAndActiveTrue(String name);
}
