package org.xhite.marketflex.mapper;

import org.springframework.stereotype.Component;
import org.xhite.marketflex.dto.CategoryDto;
import org.xhite.marketflex.model.Category;

import lombok.RequiredArgsConstructor;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.xhite.marketflex.dto.CreateCategoryRequest;

@Component
@RequiredArgsConstructor
public class CategoryMapper {
    
    public CategoryDto toDto(Category category) {
        if (category == null) return null;

        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .active(category.isActive())
                .products(category.getProducts() != null ? 
                         category.getProducts().size() : 0)
                .build();
    }

    public Category toEntity(CreateCategoryRequest request) {
        if (request == null) return null;

        return Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .active(true)
                .build();
    }

    public List<CategoryDto> toDtoList(List<Category> categories) {
        if (categories == null) return Collections.emptyList();
        return categories.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
