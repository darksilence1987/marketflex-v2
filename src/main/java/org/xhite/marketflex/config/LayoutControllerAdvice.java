package org.xhite.marketflex.config;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.xhite.marketflex.service.CategoryService;
import org.xhite.marketflex.dto.CategoryDto;
import java.util.List;

@ControllerAdvice
@RequiredArgsConstructor
public class LayoutControllerAdvice {
    private final CategoryService categoryService;

    @ModelAttribute("layoutCategories")
    public List<CategoryDto> getCategories() {
        return categoryService.getAllCategories();
    }
}