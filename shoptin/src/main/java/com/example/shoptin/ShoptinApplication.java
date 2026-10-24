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
 * CLASS KHỞI CHẠY CHÍNH: ShoptinApplication
 * - Tên gói: com.example.shoptin (giữ lại tên shoptin theo yêu cầu)
 * - Tự động nạp sẵn dữ liệu ban đầu (admin, user và sản phẩm mẫu) để tiện test ngay
 * =========================================================================
 */
@SpringBootApplication
public class ShoptinApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShoptinApplication.class, args);
    }

    /**
     * Tự động khởi tạo tài khoản mặc định và sản phẩm mẫu nếu DB còn trống
     */
    @Bean
    public CommandLineRunner initData(UserRepository userRepository, ProductRepository productRepository) {
        return args -> {
            // 1. Tạo tài khoản admin nếu chưa có
            if (userRepository.findByUsername("admin").isEmpty()) {
                userRepository.save(new User("admin", "123456", "ADMIN"));
            }

            // 2. Tạo tài khoản user nếu chưa có
            if (userRepository.findByUsername("user").isEmpty()) {
                userRepository.save(new User("user", "123456", "USER"));
            }

            // 3. Tạo một số sản phẩm mẫu nếu bảng products còn trống
            if (productRepository.count() == 0) {
                Product p1 = new Product();
                p1.setName("Laptop Dell Inspiron");
                p1.setPrice(15000000.0);
                p1.setQuantity(10);
                p1.setDescription("Laptop văn phòng hiệu năng cao");
                p1.setImageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400");
                productRepository.save(p1);

                Product p2 = new Product();
                p2.setName("Bàn phím cơ Logitech");
                p2.setPrice(1200000.0);
                p2.setQuantity(25);
                p2.setDescription("Bàn phím cơ gõ êm, đèn RGB");
                p2.setImageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400");
                productRepository.save(p2);

                Product p3 = new Product();
                p3.setName("Chuột không dây Razer");
                p3.setPrice(850000.0);
                p3.setQuantity(40);
                p3.setDescription("Chuột gaming cảm biến quang học");
                p3.setImageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400");
                productRepository.save(p3);
            }
        };
    }
}
