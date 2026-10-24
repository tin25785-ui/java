package com.example.shoptin;

import com.example.shoptin.entity.Product;
import com.example.shoptin.entity.User;
import com.example.shoptin.repository.ProductRepository;
import com.example.shoptin.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * =========================================================================
 * FILE: ShoptinApplication.java
 * GÓI (PACKAGE): com.example.shoptin (Giữ nguyên tên shoptin theo yêu cầu)
 * NHIỆM VỤ: Lớp khởi chạy chính (Main Entry Point) của toàn bộ hệ thống Spring Boot.
 * 
 * GIẢI THÍCH KÝ HIỆU & ANNOTATION:
 * - @SpringBootApplication: Là Annotation cốt lõi gộp 3 chức năng lớn của Spring Boot:
 *   1. @Configuration: Đánh dấu class chứa các cấu hình Bean cho hệ thống.
 *   2. @EnableAutoConfiguration: Tự động kích hoạt cơ chế tự cấu hình thông minh của Spring Boot.
 *   3. @ComponentScan: Tự động quét (scan) tất cả các Controller, Service, Repository, Component trong gói com.example.shoptin.
 * 
 * - @Bean: Khai báo một đối tượng (Bean) do Spring Container quản lý vòng đời (Inversion of Control - IoC).
 * - CommandLineRunner: Giao diện (Interface) của Spring Boot cung cấp phương thức run() được tự động kích hoạt ngay sau khi Server Tomcat khởi động xong.
 * =========================================================================
 */
@SpringBootApplication
public class ShoptinApplication {

    /**
     * HÀM MAIN: Điểm xuất phát của chương trình Java.
     * CÔNG THỨC: SpringApplication.run(TênClass.class, args)
     * - Kích hoạt nạp Spring ApplicationContext.
     * - Khởi động Web Server nhúng Tomcat trên cổng mạng 8080.
     * 
     * @param args Các tham số dòng lệnh truyền vào khi chạy chương trình
     */
    public static void main(String[] args) {
        SpringApplication.run(ShoptinApplication.class, args);
    }

    /**
     * BEAN NẠP DỮ LIỆU BAN ĐẦU (Data Seeder / Init Data):
     * CÔNG THỨC & NGUYÊN LÝ HOẠT ĐỘNG:
     * - Spring tự động tiêm (Dependency Injection) 2 Bean: UserRepository và ProductRepository.
     * - Sử dụng biểu thức Lambda (args -> { ... }) để triển khai phương thức run() của CommandLineRunner.
     * - Kiểm tra nếu bảng chưa có tài khoản thì tự động tạo tài khoản mặc định và sản phẩm mẫu có hình ảnh thật.
     * 
     * @param userRepository Repository giao tiếp bảng dữ liệu users
     * @param productRepository Repository giao tiếp bảng dữ liệu products
     * @return Đối tượng CommandLineRunner được thực thi khi khởi động
     */
    @Bean
    public CommandLineRunner initData(UserRepository userRepository, ProductRepository productRepository) {
        return args -> {
            // -------------------------------------------------------------
            // 1. TẠO TÀI KHOẢN QUẢN TRỊ VIÊN (ADMIN) MẶC ĐỊNH
            // CÔNG THỨC: findByUsername("admin").isEmpty() -> Trả về true nếu chưa có tài khoản
            // -------------------------------------------------------------
            if (userRepository.findByUsername("admin").isEmpty()) {
                // Khởi tạo đối tượng User: username = "admin", password = "123456", role = "ADMIN"
                User admin = new User("admin", "123456", "ADMIN");
                // Lưu đối tượng xuống Database thông qua JPA Repository
                userRepository.save(admin);
            }

            // -------------------------------------------------------------
            // 2. TẠO TÀI KHOẢN NGƯỜI DÙNG THƯỜNG (USER) MẶC ĐỊNH
            // -------------------------------------------------------------
            if (userRepository.findByUsername("user").isEmpty()) {
                // Khởi tạo đối tượng User: username = "user", password = "123456", role = "USER"
                User user = new User("user", "123456", "USER");
                userRepository.save(user);
            }

            // -------------------------------------------------------------
            // 3. TẠO CÁC SẢN PHẨM MẪU CÓ HÌNH ẢNH BAN ĐẦU (NẾU BẢNG ĐANG TRỐNG)
            // CÔNG THỨC: count() == 0 -> Đếm số lượng dòng trong bảng products
            // -------------------------------------------------------------
            if (productRepository.count() == 0) {
                // Sản phẩm mẫu 1: Laptop
                Product p1 = new Product();
                p1.setName("Laptop Dell Inspiron");
                p1.setPrice(15000000.0); // Đơn giá kiểu double: 15.000.000 VNĐ
                p1.setQuantity(10);       // Số lượng tồn kho kiểu int: 10 cái
                p1.setDescription("Laptop văn phòng hiệu năng cao, màn hình Full HD sắc nét");
                p1.setImageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"); // Link hình ảnh Unsplash
                productRepository.save(p1);

                // Sản phẩm mẫu 2: Bàn phím cơ
                Product p2 = new Product();
                p2.setName("Bàn phím cơ Logitech");
                p2.setPrice(1200000.0);  // Đơn giá: 1.200.000 VNĐ
                p2.setQuantity(25);       // Số lượng tồn kho: 25 cái
                p2.setDescription("Bàn phím cơ gõ êm, đèn nền RGB 16.8 triệu màu");
                p2.setImageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400");
                productRepository.save(p2);

                // Sản phẩm mẫu 3: Chuột gaming
                Product p3 = new Product();
                p3.setName("Chuột không dây Razer");
                p3.setPrice(850000.0);   // Đơn giá: 850.000 VNĐ
                p3.setQuantity(40);       // Số lượng tồn kho: 40 cái
                p3.setDescription("Chuột gaming cảm biến quang học độ nhạy cao 16000 DPI");
                p3.setImageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400");
                productRepository.save(p3);
            }
        };
    }
}
