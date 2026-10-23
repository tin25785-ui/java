package com.example.shoptin.dto;

/**
 * =========================================================================
 * FILE: UserDto.java
 * NHIỆM VỤ: DTO trả về thông tin tài khoản người dùng cho API GET /api/auth/me.
 * NGUYÊN TẮC AN NINH: Tuyệt đối không chứa trường "password" để tránh
 * làm lộ chuỗi băm mật khẩu ra ngoài trình duyệt.
 * =========================================================================
 */
public class UserDto {

    // 1. CÁC THUỘC TÍNH (Fields)
    private Integer id;      // Mã định danh duy nhất của tài khoản
    private String username; // Tên đăng nhập
    private String role;     // Vai trò của tài khoản ("ADMIN" hoặc "USER")
    private String fullName; // Họ và tên đầy đủ hiển thị trên giao diện

    // 2. CONSTRUCTOR MẶC ĐỊNH (Không tham số)
    // Cần thiết để các thư viện tuần tự hóa JSON (Jackson) có thể khởi tạo đối tượng
    public UserDto() {
    }

    // 3. CONSTRUCTOR CÓ THAM SỐ
    // Giúp tạo nhanh đối tượng UserDto chứa thông tin người dùng từ Entity User
    public UserDto(Integer id, String username, String role, String fullName) {
        this.id = id;               // Gán mã ID vào thuộc tính
        this.username = username;   // Gán tên đăng nhập vào thuộc tính
        this.role = role;           // Gán vai trò vào thuộc tính
        this.fullName = fullName;   // Gán họ tên vào thuộc tính
    }

    // 4. HÀM GETTER / SETTER CHO ID
    public Integer getId() {
        return id; // Lấy mã ID
    }

    public void setId(Integer id) {
        this.id = id; // Gán mã ID
    }

    // 5. HÀM GETTER / SETTER CHO USERNAME
    public String getUsername() {
        return username; // Lấy tên đăng nhập
    }

    public void setUsername(String username) {
        this.username = username; // Gán tên đăng nhập
    }

    // 6. HÀM GETTER / SETTER CHO ROLE
    public String getRole() {
        return role; // Lấy vai trò (ADMIN hoặc USER)
    }

    public void setRole(String role) {
        this.role = role; // Gán vai trò
    }

    // 7. HÀM GETTER / SETTER CHO FULL NAME
    public String getFullName() {
        return fullName; // Lấy họ tên hiển thị
    }

    public void setFullName(String fullName) {
        this.fullName = fullName; // Gán họ tên hiển thị
    }
}
