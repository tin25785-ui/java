package com.example.shoptin.repository;

import com.example.shoptin.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * =========================================================================
 * FILE: ProductRepository.java
 * GÓI (PACKAGE): com.example.shoptin.repository
 * NHIỆM VỤ: Tầng giao tiếp dữ liệu (DAO) cho bảng "products".
 * 
 * GIẢI THÍCH KÝ HIỆU & ANNOTATION:
 * - @Repository: Đánh dấu interface này là một tầng kho dữ liệu được Spring quản lý.
 * - extends JpaRepository<Product, Integer>:
 *   + Product: Thực thể đại diện cho bảng sản phẩm.
 *   + Integer: Kiểu dữ liệu của khóa chính (id) trong bảng Product.
 *   + Cung cấp sẵn các thao tác CRUD cơ bản: Thêm, Đọc, Sửa, Xóa.
 * =========================================================================
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    /**
     * TÌM KIẾM SẢN PHẨM THEO TÊN (KHÔNG PHÂN BIỆT HOA THƯỜNG):
     * CÔNG THỨC ĐẶT TÊN HÀM TRONG SPRING DATA JPA:
     * - "findBy"     : Tìm kiếm
     * - "Name"       : Dựa trên thuộc tính name của Product
     * - "Containing" : Chứa chuỗi con (tương đương toán tử LIKE '%từ_khóa%' trong SQL)
     * - "IgnoreCase" : Bỏ qua chữ hoa/chữ thường (không phân biệt A hay a)
     * 
     * CÂU LỆNH SQL THỰC TẾ ĐƯỢC SPRING SINH TỰ ĐỘNG:
     * SELECT * FROM products WHERE LOWER(name) LIKE LOWER('%' || ? || '%');
     * 
     * @param name Từ khóa tên sản phẩm người dùng gõ vào ô tìm kiếm
     * @return Danh sách List<Product> thỏa mãn điều kiện tìm kiếm
     */
    List<Product> findByNameContainingIgnoreCase(String name);
}
