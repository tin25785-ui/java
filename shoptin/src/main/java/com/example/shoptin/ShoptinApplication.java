package com.example.shoptin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * =========================================================================
 * FILE: ShoptinApplication.java
 * NHIỆM VỤ: Điểm khởi đầu (Entry Point) của toàn bộ ứng dụng Spring Boot.
 * NGUYÊN LÝ HOẠT ĐỘNG:
 *   1. Chú thích @SpringBootApplication tự động bật quét linh kiện (@ComponentScan)
 *      và nạp các cấu hình tự động của Spring Boot.
 *   2. Hàm main() chạy SpringApplication.run() để bật máy chủ nhúng Tomcat (cổng 8080).
 * =========================================================================
 */
@SpringBootApplication // Chú thích tổng hợp: Cấu hình tự động, quét Bean và khai báo ứng dụng Spring Boot
public class ShoptinApplication {

    /**
     * HÀM MAIN: Điểm khởi đầu của chương trình Java khi chạy
     * @param args Các tham số dòng lệnh truyền vào lúc khởi động (nếu có)
     */
	public static void main(String[] args) {
		// Gọi hàm run của SpringApplication để đánh thức máy chủ Tomcat nhúng trên cổng 8080
		SpringApplication.run(ShoptinApplication.class, args);
	}

}
