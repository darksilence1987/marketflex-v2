package org.xhite.marketflex.config;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.xhite.marketflex.service.CategoryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@RequiredArgsConstructor
public class GlobalModelInterceptor implements HandlerInterceptor {
    private final CategoryService categoryService;
    
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, 
                         Object handler, ModelAndView modelAndView) {
        if (modelAndView != null && !isRestCall(request)) {
            modelAndView.addObject("categories", categoryService.getAllCategories());
        }
    }
    
    private boolean isRestCall(HttpServletRequest request) {
        String accept = request.getHeader("Accept");
        return accept != null && accept.contains("application/json");
    }
}