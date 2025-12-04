package org.xhite.marketflex.config;
import org.xhite.marketflex.exception.CartException;
import org.xhite.marketflex.exception.InsufficientStockException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import lombok.extern.slf4j.Slf4j;
import org.xhite.marketflex.exception.UserNotFoundException;
import org.xhite.marketflex.exception.UnauthorizedException;



@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(InsufficientStockException.class)
    public String handleInsufficientStock(InsufficientStockException ex, RedirectAttributes redirectAttributes) {
        log.error("Stock insufficient: {}", ex.getMessage());
        redirectAttributes.addFlashAttribute("error", ex.getMessage());
        return "redirect:/cart";
    }

    @ExceptionHandler(CartException.class)
    public String handleCartException(CartException ex, RedirectAttributes redirectAttributes) {
        log.error("Cart error: {}", ex.getMessage());
        redirectAttributes.addFlashAttribute("error", ex.getMessage());
        return "redirect:/cart";
    }

    @ExceptionHandler(UserNotFoundException.class)
    public String handleUserNotFound(UserNotFoundException ex, 
                                   RedirectAttributes redirectAttributes) {
        log.error("User not found: {}", ex.getMessage());
        redirectAttributes.addFlashAttribute("error", "User session expired. Please login again.");
        return "redirect:/login";
    }

    @ExceptionHandler(UnauthorizedException.class)
    public String handleUnauthorized(UnauthorizedException ex, 
                                   RedirectAttributes redirectAttributes) {
        log.error("Unauthorized access: {}", ex.getMessage());
        redirectAttributes.addFlashAttribute("error", "Please login to continue.");
        return "redirect:/login";
    }

    @ExceptionHandler(Exception.class)
    public String handleGeneralError(Exception ex, 
                                   RedirectAttributes redirectAttributes) {
        log.error("Unexpected error: ", ex);
        redirectAttributes.addFlashAttribute("error", "An unexpected error occurred.");
        return "redirect:/error";
    }
}
