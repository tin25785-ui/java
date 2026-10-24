package com.example.shoptin.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * =========================================================================
 * FILE: User.java
 * GÓI (PACKAGE): com.example.shoptin.entity
 * NHIỆM VỤ: Lớp thực thể (Entity) mô hình hóa bảng "users" dưới cơ sở dữ liệu.
 * 
 * GIẢI THÍCH KÝ HIỆU & ANNOTATION:
 * - @Entity: Báo cho JPA / Hibernate biết lớp Java này là một bảng trong CSDL.
 * - @Table(name = "users"): Chỉ định rõ tên bảng trong DB là "users" (tránh xung đột với từ khóa 'user' của một số hệ quản trị CSDL).
 * - @Id: Đánh dấu trường thuộc tính là KHÓA CHÍNH (Primary Key) duy nhất của bảng.
 * - @GeneratedValue(strategy = GenerationType.IDENTITY): Cơ chế tự động tăng giá trị khóa chính (1, 2, 3...) do Database tự sinh ra (Auto Increment).
 * =========================================================================
 */
@Entity
@Table(name = "users")
public class User {

    // 1. KHÓA CHÍNH (PRIMARY KEY): Kiểu số nguyên lớn Long để hỗ trợ số lượng bản ghi không giới hạn
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 2. TÊN ĐĂNG NHẬP (Username): Lưu trữ chuỗi ký tự định danh tài khoản người dùng
    private String username;

    // 3. MẬT KHẨU (Password): Lưu trữ chuỗi mật khẩu xác thực người dùng
    private String password;

    // 4. QUYỀN HẠN (Role): Lưu vai trò phân quyền: "ADMIN" (Toàn quyền) hoặc "USER" (Chỉ xem)
    private String role;

    /**
     * CONSTRUCTOR MẶC ĐỊNH (Không tham số):
     * CÔNG THỨC & BẮT BUỘC:
     * - Hibernate/JPA bắt buộc phải có Constructor rỗng này để sử dụng Reflection API
     *   tự động khởi tạo đối tượng khi thực hiện các câu lệnh truy vấn SQL (SELECT).
     */
    public User() {
    }

    /**
     * CONSTRUCTOR CÓ THAM SỐ KHỞI TẠO NHANH:
     * CÔNG THỨC: Gán giá trị từ tham số đầu vào vào các biến thuộc tính của đối tượng (this.thuộcTính = thamSố).
     * 
     * @param username Tên tài khoản
     * @param password Mật khẩu
     * @param role Vai trò phân quyền ("ADMIN" hoặc "USER")
     */
    public User(String username, String password, String role) {
        this.username = username; // this đại diện cho thể hiện (instance) hiện tại của class User
        this.password = password;
        this.role = role;
    }

    // =========================================================================
    // CÁC HÀM GETTER VÀ SETTER:
    // Đảm bảo nguyên lý ĐÓNG GÓI (Encapsulation) trong lập trình hướng đối tượng (OOP).
    // Cho phép đọc (Getter) và ghi (Setter) các thuộc tính private một cách an toàn.
    // =========================================================================

    /**
     * Lấy mã ID người dùng
     * @return id kiểu Long
     */
    public Long getId() {
        return id;
    }

    /**
     * Thiết lập mã ID người dùng
     * @param id mã ID cần gán
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Lấy tên đăng nhập
     * @return username kiểu String
     */
    public String getUsername() {
        return username;
    }

    /**
     * Thiết lập tên đăng nhập
     * @param username tên đăng nhập mới
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Lấy mật khẩu
     * @return password kiểu String
     */
    public String getPassword() {
        return password;
    }

    /**
     * Thiết lập mật khẩu
     * @param password mật khẩu mới
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Lấy quyền hạn người dùng
     * @return role kiểu String ("ADMIN" hoặc "USER")
     */
    public String getRole() {
        return role;
    }

    /**
     * Thiết lập quyền hạn người dùng
     * @param role vai trò mới
     */
    public void setRole(String role) {
        this.role = role;
    }
}
