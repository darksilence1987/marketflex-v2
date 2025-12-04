package org.xhite.marketflex.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.xhite.marketflex.service.CategoryService;

import lombok.RequiredArgsConstructor;
import org.xhite.marketflex.service.ProductService;

@Controller
@RequestMapping("")
@RequiredArgsConstructor
public class HomeController {

    private final CategoryService categoryService;
    private final ProductService productService;


    @GetMapping("/")
    public String home(){
        return "redirect:/home";
    }

    @GetMapping("/home")
    public String homePage(Model model) {
        model.addAttribute("featuredCategories", categoryService.getAllCategories());
        model.addAttribute("featuredProducts", productService.getAllProducts());
        return "home";
    }
    
}
