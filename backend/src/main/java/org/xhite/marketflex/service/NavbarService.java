package org.xhite.marketflex.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.xhite.marketflex.dto.CategoryDto;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NavbarService {
    private final CategoryService categoryService;

    @Cacheable("navbarCategories")
    public List<CategoryDto> getNavbarCategories() {
        return categoryService.getAllCategories();
    }
}