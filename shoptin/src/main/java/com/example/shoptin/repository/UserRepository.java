package com.example.shoptin.repository;

import com.example.shoptin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * =========================================================================
 * FILE: UserRepository.java
 * NHIỆM VỤ: Tầng giao tiếp cơ sở dữ liệu (DAO) cho bảng "users".
 * NGUYÊN LÝ: Kế thừa JpaRepository<User, Integer> để có sẵn toàn bộ hàm CRUD.
 * =========================================================================
 */
@Repository // Khai báo tầng Repository của Spring
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Tìm tài khoản theo username.
     * Trả về Optional<User> để tránh lỗi NullPointerException khi không tìm thấy.
     */
    Optional<User> findByUsername(String username);

    /**
     * Kiểm tra xem tên username này đã tồn tại trong DB chưa.
     */
    boolean existsByUsername(String username);
}
