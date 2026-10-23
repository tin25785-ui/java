package com.example.shoptin.config;

import com.example.shoptin.entity.Product;
import com.example.shoptin.entity.User;
import com.example.shoptin.repository.ProductRepository;
import com.example.shoptin.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * =========================================================================
 * FILE: DataSeeder.java
 * NHIỆM VỤ: Tự động nạp dữ liệu mẫu vào cơ sở dữ liệu khi hệ thống khởi động.
 * NGUYÊN LÝ HOẠT ĐỘNG:
 *   1. Kế thừa CommandLineRunner để hàm run() tự động chạy khi bật server.
 *   2. Kiểm tra nếu bảng users trống -> Nạp 2 tài khoản mẫu (admin & user).
 *   3. Kiểm tra nếu bảng products trống -> Nạp 12 sản phẩm mẫu ban đầu.
 *   4. Nếu đã có dữ liệu -> Bỏ qua không thêm lại, chống trùng lặp.
 * =========================================================================
 */
@Component // Khai báo Spring Bean để Spring Boot tự động quản lý vòng đời
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository; // Thao tác bảng products
    private final UserRepository userRepository;       // Thao tác bảng users
    private final PasswordEncoder passwordEncoder;     // Mã hóa băm mật khẩu BCrypt

    // Constructor Dependency Injection: Spring Boot tự động truyền các đối tượng vào
    public DataSeeder(ProductRepository productRepository,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Hàm run() được ghi đè từ Interface CommandLineRunner.
     * Tự động kích hoạt chạy đầu tiên khi máy chủ Spring Boot bật lên.
     */
    @Override
    public void run(String... args) {
        seedUsers();    // Bước 1: Nạp tài khoản mẫu
        seedProducts(); // Bước 2: Nạp sản phẩm mẫu
    }

    /**
     * HÀM NẠP TÀI KHOẢN MẪU (ADMIN và USER)
     */
    private void seedUsers() {
        // Chỉ thêm khi bảng users hoàn toàn trống (chưa có tài khoản nào)
        if (userRepository.count() == 0) {
            // 1. Tạo tài khoản Quản trị viên (ADMIN)
            User admin = new User(
                    "admin",                               // Tên đăng nhập
                    passwordEncoder.encode("admin123"),    // Mật khẩu gốc "admin123" được băm bằng BCrypt
                    "ADMIN",                               // Vai trò: ADMIN
                    "Quản Trị Viên (Admin)"                // Tên hiển thị
            );

            // 2. Tạo tài khoản Khách hàng (USER)
            User user = new User(
                    "user",                                // Tên đăng nhập
                    passwordEncoder.encode("user123"),     // Mật khẩu gốc "user123" được băm bằng BCrypt
                    "USER",                                // Vai trò: USER
                    "Khách Hàng (User)"                    // Tên hiển thị
            );

            // Lưu cả 2 tài khoản xuống cơ sở dữ liệu SQLite (shoptin.db)
            userRepository.saveAll(List.of(admin, user));
            System.out.println(">>> Shoptin: Da khoi tao 2 tai khoan mau (admin / admin123 va user / user123).");
        }
    }

    /**
     * HÀM NẠP SẢN PHẨM MẪU
     */
    private void seedProducts() {
        // Nếu trong bảng products đã có dữ liệu rồi thì dừng lại ngay, không thêm trùng
        if (productRepository.count() > 0) {
            return;
        }

        // Thêm 12 sản phẩm mẫu ban đầu vào database
        productRepository.saveAll(List.of(
                p("Laptop Dell XPS 13", 32990000, 10, "Dell XPS 13, Core i7, RAM 16GB, SSD 512GB, man hinh 13.4 inch"),
                p("Laptop HP Pavilion 15", 16490000, 15, "HP Pavilion 15, Core i5, RAM 8GB, SSD 512GB, man hinh 15.6 inch"),
                p("Laptop Asus ROG Strix G15", 28990000, 8, "Laptop gaming Ryzen 7, RAM 16GB, RTX 3060, SSD 1TB"),
                p("Laptop Lenovo ThinkPad E14", 19990000, 12, "ThinkPad E14, Core i5, RAM 16GB, SSD 512GB, ben bi"),
                p("MacBook Air M2", 26990000, 7, "Apple MacBook Air M2 13 inch, RAM 8GB, SSD 256GB"),
                p("iPhone 15", 19990000, 20, "Apple iPhone 15 128GB, chip A16 Bionic"),
                p("Samsung Galaxy S24", 18490000, 18, "Samsung Galaxy S24 256GB, man hinh Dynamic AMOLED 2X"),
                p("Chuot Logitech MX Master 3S", 2390000, 40, "Chuot khong day, cam bien 8000 DPI, sac USB-C"),
                p("Ban phim co Keychron K2", 2190000, 25, "Ban phim co khong day, layout 75%, hot-swap"),
                p("Tai nghe Sony WH-1000XM5", 7990000, 14, "Tai nghe chong on chu dong, pin 30 gio"),
                p("Man hinh LG UltraGear 27 inch", 6490000, 9, "Man hinh gaming 27 inch QHD, 165Hz, IPS"),
                p("Tai nghe AirPods Pro 2", 5990000, 30, "Tai nghe khong day chong on, sac MagSafe")
        ));
        System.out.println(">>> Shoptin: da them " + productRepository.count() + " san pham mau.");
    }

    /**
     * HÀM PHỤ TRỢ (Helper Method): Tạo nhanh một đối tượng Product
     */
    private Product p(String name, double price, int quantity, String description) {
        Product product = new Product();
        product.setName(name);                 // Gán tên sản phẩm
        product.setPrice(price);               // Gán giá bán
        product.setQuantity(quantity);         // Gán số lượng
        product.setDescription(description);   // Gán mô tả
        return product;
    }
}
