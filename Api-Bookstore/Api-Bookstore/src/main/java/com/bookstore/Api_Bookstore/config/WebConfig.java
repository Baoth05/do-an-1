package com.bookstore.Api_Bookstore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Áp dụng cho tất cả các đường dẫn bắt đầu bằng /api/
                .allowedOrigins("http://localhost:3000") // Cho phép cổng 3000
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Các phương thức cho phép
                .allowedHeaders("*") // Cho phép tất cả các header
                .allowCredentials(true); // Cho phép gửi token
    }
}