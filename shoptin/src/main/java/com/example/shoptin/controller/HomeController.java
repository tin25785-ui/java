package com.example.shoptin.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * =========================================================================
 * CONTROLLER: HomeController
 * Nhiệm vụ: Endpoint chào mừng đơn giản tại đường dẫn gốc "/"
 * =========================================================================
 */
@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Hello Spring Boot!";
    }
}
