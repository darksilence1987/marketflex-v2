package org.xhite.marketflex.service;

import java.util.List;
import java.util.Optional;

import org.xhite.marketflex.dto.PagedResponse;
import org.xhite.marketflex.dto.ProductDto;
import org.xhite.marketflex.dto.ProductFilterRequest;
import org.xhite.marketflex.model.Product;

public interface ProductService {
    List<ProductDto> getAllProducts();
    List<ProductDto> getProductsByCategory(Long categoryId);
    Optional<ProductDto> getProductById(Long id);
    ProductDto createProduct(ProductDto productDto);
    ProductDto updateProduct(Long id, ProductDto productDto);
    void deleteProduct(Long id);
    List<ProductDto> getFeaturedProducts(int limit);
    public boolean isProductAvailable(Long id, int quantity);
    public void updateStock(Long id, int quantity);
    Product convertToEntity(ProductDto productDto);
    ProductDto convertToDto(Product product);
    boolean isProductAvailable(Long productId, Integer quantity);
    void updateStock(Long productId, Integer quantity);
    List<ProductDto> getProductsByVendor(Long vendorId);
    List<ProductDto> getMyProducts();
    
    // Filtering with pagination
    PagedResponse<ProductDto> filterProducts(ProductFilterRequest request);
}