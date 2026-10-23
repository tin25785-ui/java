package com.example.shoptin.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * =========================================================================
 * FILE: HomeController.java
 * NHIỆM VỤ: Endpoint gốc (Root URL) dùng để kiểm tra server có đang chạy không.
 * =========================================================================
 */
@RestController
public class HomeController {

    // GET http://localhost:8080/
    @GetMapping("/")
    public String home() {
        return "Shoptin API is running!";
    }
}
