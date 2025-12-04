package org.xhite.marketflex.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDto {
    private Long id;
    @Builder.Default
    private List<CartItemDto> cartItems = new ArrayList<>();
    private BigDecimal totalPrice;
    private int totalItems;
}
