package org.xhite.marketflex.config;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.xhite.marketflex.service.NavbarService;
import org.xhite.marketflex.dto.CategoryDto;
import java.util.List;

@ControllerAdvice
@RequiredArgsConstructor
public class NavbarControllerAdvice {
    private final NavbarService navbarService;

    @ModelAttribute("navbarCategories")
    public List<CategoryDto> navbarCategories() {
        return navbarService.getNavbarCategories();
    }
}