package com.example.shoptin.entity;

import jakarta.persistence.*;

/**
 * =========================================================================
 * ENTITY: User
 * Bảng dữ liệu người dùng (users) trong hệ thống:
 * - id: Khóa chính tự tăng (Long)
 * - username: Tên đăng nhập (ví dụ: admin, user)
 * - password: Mật khẩu
 * - role: Quyền hạn của tài khoản ("ADMIN" hoặc "USER")
 * =========================================================================
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String password;

    private String role;

    // Constructor mặc định (Bắt buộc cho JPA/Hibernate)
    public User() {
    }

    // Constructor khởi tạo nhanh
    public User(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // --- CÁC HÀM GETTER VÀ SETTER ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
