package org.xhite.marketflex.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.springframework.ui.Model;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.xhite.marketflex.service.CartService;
import org.xhite.marketflex.dto.CartDto;
import org.xhite.marketflex.exception.InsufficientStockException;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Map;

@Controller
@SessionAttributes("cart")
@RequestMapping("/cart")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class CartController {
    private final CartService cartService;

    @ModelAttribute("cart")
    public CartDto cart() {
        return CartDto.builder()
                .cartItems(new ArrayList<>())
                .totalPrice(BigDecimal.ZERO)
                .totalItems(0)
                .build();
    }

    @GetMapping
    public String viewCart(Model model) {
        CartDto cart = cartService.getCart();
        model.addAttribute("cart", cart);
        return "cart/view";
    }

    @PostMapping("/add/{productId}")
    @ResponseBody
    public ResponseEntity<?> addToCart(@PathVariable Long productId,
                          @RequestParam(defaultValue = "1") Integer quantity) {
        try {
            CartDto cart = cartService.addToCart(productId, quantity);
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "cart", cart,
                "message", "Product added to cart successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false, 
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/items/{itemId}")
    public String updateCartItem(@PathVariable Long itemId,
                               @RequestParam Integer quantity,
                               RedirectAttributes redirectAttributes) {
        try {
            cartService.updateCartItem(itemId, quantity);
            redirectAttributes.addFlashAttribute("success", "Cart updated successfully");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/cart";
    }

    @PostMapping("/items/{itemId}/remove")
    public String removeFromCart(@PathVariable Long itemId,
                               RedirectAttributes redirectAttributes) {
        try {
            cartService.removeFromCart(itemId);
            redirectAttributes.addFlashAttribute("success", "Item removed from cart");
        } catch (Exception e) {
            log.error("Error removing item from cart: ", e);
            redirectAttributes.addFlashAttribute("error", 
                "Failed to remove item: " + e.getMessage());
        }
        return "redirect:/cart";
    }

    @PostMapping("/clear")
    public String clearCart(RedirectAttributes redirectAttributes) {
        cartService.clearCart();
        redirectAttributes.addFlashAttribute("success", "Cart cleared successfully");
        return "redirect:/cart";
    }
}
