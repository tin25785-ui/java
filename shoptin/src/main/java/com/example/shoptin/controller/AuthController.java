package com.example.shoptin.controller;

import com.example.shoptin.entity.User;
import com.example.shoptin.repository.UserRepository;
import com.example.shoptin.service.JwtService;

import org.springframework.web.bind.annotation.*;

/**
 * =========================================================================
 * FILE: AuthController.java
 * GÓI (PACKAGE): com.example.shoptin.controller
 * NHIỆM VỤ: Tầng điều khiển (REST Controller) xử lý yêu cầu Đăng nhập và Xác thực tài khoản.
 * 
 * GIẢI THÍCH KÝ HIỆU & ANNOTATION:
 * - @RestController: Đánh dấu lớp là REST API Controller. Tất cả các hàm bên trong
 *   sẽ tự động trả về dữ liệu thô (JSON hoặc chuỗi text) trực tiếp cho Client, không thông qua giao diện View.
 * - @RequestMapping("/api/auth"): Định nghĩa tiền tố đường dẫn URL chung cho Controller này.
 * - @CrossOrigin(origins = "http://localhost:5173"): Cấu hình cho phép ứng dụng React từ port 5173 gọi API này.
 * - @PostMapping("/login"): Ánh xạ yêu cầu HTTP POST tới đường dẫn đầy đủ: http://localhost:8080/api/auth/login.
 * - @RequestBody: Tự động phân tích (parse) chuỗi JSON trong phần thân (body) của request thành đối tượng User trong Java.
 * =========================================================================
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    /**
     * Tiêm UserRepository và JwtService thông qua Constructor Injection
     */
    public AuthController(
            UserRepository userRepository,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    /**
     * API XỬ LÝ ĐĂNG NHẬP:
     * Endpoint: POST /api/auth/login
     * Body JSON gửi lên: { "username": "admin", "password": "..." }
     * 
     * NGUYÊN LÝ HOẠT ĐỘNG & CÔNG THỨC KIỂM TRA:
     * 1. userRepository.findByUsername(user.getUsername()): Tìm kiếm tài khoản trong DB theo username.
     * 2. .filter(u -> ...): Đối chiếu mật khẩu nhập vào với mật khẩu trong cơ sở dữ liệu.
     *    - Hỗ trợ mật khẩu mặc định "123456" hoặc "admin123"/"user123" để tránh lỗi khi người dùng gõ.
     * 3. .orElseThrow(...): Nếu không tìm thấy hoặc sai mật khẩu, ném ra ngoại lệ RuntimeException báo lỗi.
     * 4. jwtService.generateToken(username, role): Nếu đăng nhập đúng, sinh ra chuỗi mã Token JWT chứa quyền hạn tương ứng.
     * 
     * @param user Đối tượng chứa thông tin đăng nhập do Client gửi lên
     * @return Chuỗi mã Token JWT dùng để xác thực các request sau này
     */
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        // 1. Tìm tài khoản trong cơ sở dữ liệu và so khớp mật khẩu
        User foundUser = userRepository
                .findByUsername(user.getUsername())
                .filter(u -> u.getPassword().equals(user.getPassword()) ||
                             (u.getUsername().equals("admin") && user.getPassword().equals("admin123")) ||
                             (u.getUsername().equals("user") && user.getPassword().equals("user123")))
                .orElseThrow(() ->
                        new RuntimeException("Sai username hoặc password"));

        // 2. Tạo và trả về chuỗi Token JWT
        return jwtService.generateToken(
                foundUser.getUsername(),
                foundUser.getRole()
        );
    }

    /**
     * API ĐĂNG NHẬP DÀNH CHO TRÌNH DUYỆT (Phương thức GET):
     * Giúp bạn có thể gõ thẳng đường dẫn lên thanh địa chỉ của trình duyệt Web:
     * Ví dụ: http://localhost:8080/api/auth/login?username=admin&password=123456
     * Hoặc chỉ cần gõ: http://localhost:8080/api/auth/login (Mặc định tự đăng nhập admin)
     */
    @GetMapping("/login")
    public String loginGet(
            @RequestParam(defaultValue = "admin") String username,
            @RequestParam(defaultValue = "123456") String password) {

        User foundUser = userRepository
                .findByUsername(username)
                .filter(u -> u.getPassword().equals(password) ||
                             (u.getUsername().equals("admin") && password.equals("admin123")) ||
                             (u.getUsername().equals("user") && password.equals("user123")))
                .orElseThrow(() ->
                        new RuntimeException("Sai username hoặc password"));

        return "DANG NHAP THANH CONG! Token JWT cua ban la:\n\n" +
                jwtService.generateToken(foundUser.getUsername(), foundUser.getRole());
    }
}
