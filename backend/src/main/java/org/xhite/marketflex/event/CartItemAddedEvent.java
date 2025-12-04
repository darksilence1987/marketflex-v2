package org.xhite.marketflex.event;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class CartItemAddedEvent {
    private final Long productId;
    private final Integer quantity;
}
