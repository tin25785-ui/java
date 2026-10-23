package com.example.shoptin.entity;

import jakarta.persistence.*;

/**
 * =========================================================================
 * FILE: User.java
 * NHIỆM VỤ: Thực thể (Entity) đại diện cho bảng "users" dưới cơ sở dữ liệu.
 * CÁC CỘT:
 *   - id       : Khóa chính tự tăng (Primary Key)
 *   - username : Tên đăng nhập duy nhất (NOT NULL, UNIQUE)
 *   - password : Mật khẩu đã mã hóa băm bằng thuật toán BCrypt (NOT NULL)
 *   - role     : Vai trò của tài khoản: "ADMIN" hoặc "USER" (NOT NULL)
 *   - fullName : Họ và tên hiển thị của người dùng
 * =========================================================================
 */
@Entity             // Khai báo cho Hibernate/JPA biết class này tương ứng với 1 bảng dữ liệu
@Table(name = "users") // Chỉ định rõ tên bảng dưới Database là "users"
public class User {

    // 1. KHÓA CHÍNH (Primary Key): Tự động tăng số 1, 2, 3...
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 2. TÊN ĐĂNG NHẬP: Bắt buộc phải có (NOT NULL) và không được trùng lặp (UNIQUE)
    @Column(nullable = false, unique = true)
    private String username;

    // 3. MẬT KHẨU: Lưu chuỗi hash BCrypt, bắt buộc phải có (NOT NULL)
    @Column(nullable = false)
    private String password;

    // 4. VAI TRÒ: Lưu vai trò "ADMIN" hoặc "USER", bắt buộc phải có (NOT NULL)
    @Column(nullable = false)
    private String role;

    // 5. HỌ TÊN ĐẦY ĐỦ: Tên hiển thị của người dùng (ví dụ: Quản Trị Viên)
    private String fullName;

    // 6. CONSTRUCTOR MẶC ĐỊNH (Không tham số)
    // Bắt buộc phải có để JPA/Hibernate có thể tự động ánh xạ các bản ghi từ DB thành Object
    public User() {
    }

    // 7. CONSTRUCTOR CÓ THAM SỐ
    // Giúp tạo nhanh một đối tượng User với đầy đủ username, password, role và fullName
    public User(String username, String password, String role, String fullName) {
        this.username = username; // Gán tên đăng nhập
        this.password = password; // Gán mật khẩu đã mã hóa
        this.role = role;         // Gán vai trò (ADMIN / USER)
        this.fullName = fullName; // Gán họ tên đầy đủ
    }

    // 8. HÀM GETTER / SETTER CHO ID
    public Integer getId() {
        return id; // Lấy mã ID của người dùng
    }

    public void setId(Integer id) {
        this.id = id; // Gán mã ID cho người dùng
    }

    // 9. HÀM GETTER / SETTER CHO USERNAME
    public String getUsername() {
        return username; // Lấy tên đăng nhập
    }

    public void setUsername(String username) {
        this.username = username; // Gán tên đăng nhập
    }

    // 10. HÀM GETTER / SETTER CHO PASSWORD
    public String getPassword() {
        return password; // Lấy mật khẩu đã mã hóa
    }

    public void setPassword(String password) {
        this.password = password; // Gán mật khẩu
    }

    // 11. HÀM GETTER / SETTER CHO ROLE
    public String getRole() {
        return role; // Lấy vai trò ("ADMIN" hoặc "USER")
    }

    public void setRole(String role) {
        this.role = role; // Gán vai trò
    }

    // 12. HÀM GETTER / SETTER CHO FULL NAME
    public String getFullName() {
        return fullName; // Lấy họ tên hiển thị
    }

    public void setFullName(String fullName) {
        this.fullName = fullName; // Gán họ tên hiển thị
    }
}
