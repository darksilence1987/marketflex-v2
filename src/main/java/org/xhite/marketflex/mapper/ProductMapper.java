package org.xhite.marketflex.mapper;

import org.springframework.stereotype.Component;
import org.xhite.marketflex.dto.ProductDto;
import org.xhite.marketflex.model.Category;
import org.xhite.marketflex.model.Product;
import org.xhite.marketflex.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProductMapper {
    private final CategoryRepository categoryRepository;

    public ProductDto toDto(Product product) {
        if (product == null) {
            return null;
        }
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        dto.setImageUrl(product.getImageUrl());
        return dto;
    }

    public Product toEntity(ProductDto productDto) {
        if (productDto == null) return null;
        Category category = productDto.getCategoryId() == null ? null : categoryRepository.findById(productDto.getCategoryId()).orElse(null);
        return Product.builder()
            .id(productDto.getId())
            .name(productDto.getName())
            .description(productDto.getDescription())
            .price(productDto.getPrice())
            .category(category)  
            .build();
    }
}
