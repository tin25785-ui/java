package com.example.shoptin.repository;

import com.example.shoptin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * =========================================================================
 * FILE: UserRepository.java
 * GÓI (PACKAGE): com.example.shoptin.repository
 * NHIỆM VỤ: Tầng truy xuất dữ liệu (Data Access Layer / DAO) cho bảng "users".
 * 
 * GIẢI THÍCH KÝ HIỆU & ANNOTATION:
 * - @Repository: Khai báo lớp này là một Spring Data Repository component.
 * - extends JpaRepository<User, Long>:
 *   + User: Kiểu thực thể mà Repository này quản lý.
 *   + Long: Kiểu dữ liệu của khóa chính (@Id) trong lớp User.
 *   + Khi kế thừa JpaRepository, Spring Data JPA tự động cung cấp sẵn hàng chục hàm:
 *     findAll(), findById(), save(), deleteById(), count(), existsById(),... mà không cần viết một dòng SQL nào!
 * =========================================================================
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * TÌM KIẾM NGƯỜI DÙNG THEO TÊN ĐĂNG NHẬP (USERNAME):
     * CÔNG THỨC QUY ƯỚC ĐẶT TÊN CỦA SPRING DATA JPA:
     * - "findBy" + "Username" (tên thuộc tính)
     * - Spring tự động phân tích và sinh ra câu lệnh SQL tương đương:
     *   SELECT * FROM users WHERE username = ?;
     * 
     * GIẢI THÍCH KIỂU TRẢ VỀ Optional<User>:
     * - Optional là một lớp đóng gói trong Java 8+ giúp xử lý trường hợp đối tượng có thể bị NULL.
     * - Tránh hoàn toàn lỗi kinh điển NullPointerException khi người dùng nhập sai username.
     * - Hỗ trợ các phương thức tiện ích: .isEmpty(), .isPresent(), .filter(), .orElseThrow().
     * 
     * @param username Tên đăng nhập cần tìm
     * @return Optional chứa User nếu tìm thấy, hoặc Optional rỗng nếu không có
     */
    Optional<User> findByUsername(String username);
}
