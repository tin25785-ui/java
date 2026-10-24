package com.example.shoptin.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * =========================================================================
 * FILE: HomeController.java
 * GÓI (PACKAGE): com.example.shoptin.controller
 * NHIỆM VỤ: Controller cơ bản kiểm tra trạng thái hoạt động của Server tại đường dẫn gốc ("/").
 * 
 * GIẢI THÍCH KÝ HIỆU & ANNOTATION:
 * - @RestController: Đánh dấu lớp là REST Controller trả về chuỗi văn bản trực tiếp.
 * - @GetMapping("/"): Xử lý yêu cầu HTTP GET gửi đến địa chỉ gốc: http://localhost:8080/
 * =========================================================================
 */
@RestController
public class HomeController {

    /**
     * Endpoint kiểm tra máy chủ Spring Boot:
     * Truy cập trình duyệt: http://localhost:8080/
     * 
     * @return Chuỗi thông báo "Hello Spring Boot!"
     */
    @GetMapping("/")
    public String home() {
        return "Hello Spring Boot!";
    }
}
