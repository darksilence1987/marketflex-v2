package org.xhite.marketflex.service;

import java.util.List;

import org.xhite.marketflex.dto.CategoryDto;
import org.xhite.marketflex.dto.CreateCategoryRequest;

public interface CategoryService {
    List<CategoryDto> getAllCategories();
    CategoryDto getCategoryById(Long id);
    CategoryDto createCategory(CreateCategoryRequest request);
    CategoryDto updateCategory(Long id, CreateCategoryRequest request);
    void deleteCategory(Long id);
    void deleteCategory(Long id, boolean force);
    List<CategoryDto> getFeaturedCategories(int limit);
}