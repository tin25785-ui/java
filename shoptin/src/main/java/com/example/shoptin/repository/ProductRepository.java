package com.example.shoptin.repository;

import com.example.shoptin.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * =========================================================================
 * FILE: ProductRepository.java
 * NHIỆM VỤ: Tầng giao tiếp cơ sở dữ liệu cho bảng "products".
 * NGUYÊN LÝ: Kế thừa JpaRepository<Product, Integer> để có sẵn findAll(), findById(), save(), deleteById().
 * =========================================================================
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    /**
     * TÌM KIẾM SẢN PHẨM THEO TÊN (Không phân biệt chữ hoa, chữ thường).
     * Spring Data JPA tự động dịch tên hàm này thành câu lệnh SQL:
     * SELECT * FROM products WHERE LOWER(name) LIKE LOWER('%...%');
     */
    List<Product> findByNameContainingIgnoreCase(String name);
}
