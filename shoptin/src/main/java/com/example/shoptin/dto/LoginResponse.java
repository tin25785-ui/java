package com.example.shoptin.dto;

/**
 * =========================================================================
 * FILE: LoginResponse.java
 * NHIỆM VỤ: DTO đóng gói dữ liệu trả về cho Client sau khi đăng nhập thành công.
 * =========================================================================
 */
public class LoginResponse {

    // 1. CÁC THUỘC TÍNH (Fields)
    private String token;                  // Chuỗi mã JWT Token dùng để xác thực cho các request sau
    private String tokenType = "Bearer";   // Tiền tố chuẩn định danh là "Bearer"
    private String username;               // Tên đăng nhập của người dùng
    private String role;                   // Vai trò của người dùng ("ADMIN" hoặc "USER")
    private String fullName;               // Họ và tên đầy đủ hiển thị trên giao diện

    // 2. CONSTRUCTOR MẶC ĐỊNH (Không tham số)
    // Cần thiết để các thư viện chuyển đổi JSON (như Jackson) có thể tự động khởi tạo đối tượng
    public LoginResponse() {
    }

    // 3. CONSTRUCTOR CÓ THAM SỐ
    // Giúp tạo nhanh đối tượng phản hồi chứa đầy đủ token, username, role và fullName
    public LoginResponse(String token, String username, String role, String fullName) {
        this.token = token;         // Gán mã token vào thuộc tính
        this.username = username;   // Gán tên đăng nhập vào thuộc tính
        this.role = role;           // Gán vai trò vào thuộc tính
        this.fullName = fullName;   // Gán họ tên vào thuộc tính
    }

    // 4. HÀM GETTER / SETTER CHO TOKEN
    public String getToken() {
        return token; // Lấy chuỗi mã JWT Token
    }

    public void setToken(String token) {
        this.token = token; // Gán giá trị mã JWT Token
    }

    // 5. HÀM GETTER / SETTER CHO TOKEN TYPE
    public String getTokenType() {
        return tokenType; // Lấy loại token (mặc định là "Bearer")
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType; // Gán loại token
    }

    // 6. HÀM GETTER / SETTER CHO USERNAME
    public String getUsername() {
        return username; // Lấy tên đăng nhập
    }

    public void setUsername(String username) {
        this.username = username; // Gán tên đăng nhập
    }

    // 7. HÀM GETTER / SETTER CHO ROLE
    public String getRole() {
        return role; // Lấy vai trò (ADMIN / USER)
    }

    public void setRole(String role) {
        this.role = role; // Gán vai trò
    }

    // 8. HÀM GETTER / SETTER CHO FULL NAME
    public String getFullName() {
        return fullName; // Lấy họ tên hiển thị
    }

    public void setFullName(String fullName) {
        this.fullName = fullName; // Gán họ tên hiển thị
    }
}
