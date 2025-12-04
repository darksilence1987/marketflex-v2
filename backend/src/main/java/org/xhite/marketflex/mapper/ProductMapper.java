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
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .imageUrl(product.getImageUrl())
                .active(product.isActive())
                .build();
    }

    public Product toEntity(ProductDto productDto) {
        if (productDto == null) return null;
        Category category = productDto.categoryId() == null ? null : categoryRepository.findById(productDto.categoryId()).orElse(null);
        return Product.builder()
            .id(productDto.id())
            .name(productDto.name())
            .description(productDto.description())
            .price(productDto.price())
            .category(category)  
            .build();
    }
}
