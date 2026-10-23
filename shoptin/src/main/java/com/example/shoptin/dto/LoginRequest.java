package com.example.shoptin.dto;

/**
 * =========================================================================
 * FILE: LoginRequest.java
 * NHIỆM VỤ: DTO (Data Transfer Object) hứng dữ liệu đăng nhập do Client gửi lên.
 * GỒM: username và password người dùng nhập trong form.
 * =========================================================================
 */
public class LoginRequest {

    // 1. KHAI BÁO THUỘC TÍNH (Fields)
    private String username; // Thuộc tính lưu tên đăng nhập người dùng nhập vào
    private String password; // Thuộc tính lưu mật khẩu thô người dùng nhập vào

    // 2. CONSTRUCTOR MẶC ĐỊNH (Không tham số)
    // Bắt buộc phải có để thư viện Jackson có thể tự động ánh xạ chuỗi JSON từ Client thành đối tượng Java
    public LoginRequest() {
    }

    // 3. CONSTRUCTOR CÓ ĐẦY ĐỦ THAM SỐ
    // Giúp lập trình viên tạo nhanh một đối tượng LoginRequest bằng cách truyền sẵn username và password
    public LoginRequest(String username, String password) {
        this.username = username; // Gán tham số username vào biến thuộc tính của class
        this.password = password; // Gán tham số password vào biến thuộc tính của class
    }

    // 4. HÀM GETTER CHO USERNAME: Dùng để đọc/lấy ra tên đăng nhập
    public String getUsername() {
        return username; // Trả về giá trị username
    }

    // 5. HÀM SETTER CHO USERNAME: Dùng để gán/cập nhật tên đăng nhập
    public void setUsername(String username) {
        this.username = username; // Cập nhật lại giá trị username
    }

    // 6. HÀM GETTER CHO PASSWORD: Dùng để đọc/lấy ra mật khẩu
    public String getPassword() {
        return password; // Trả về giá trị password
    }

    // 7. HÀM SETTER CHO PASSWORD: Dùng để gán/cập nhật mật khẩu
    public void setPassword(String password) {
        this.password = password; // Cập nhật lại giá trị password
    }
}
