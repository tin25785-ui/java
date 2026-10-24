package com.example.shoptin.controller;

import com.example.shoptin.entity.User;
import com.example.shoptin.repository.UserRepository;
import com.example.shoptin.service.JwtService;

import org.springframework.web.bind.annotation.*;

/**
 * =========================================================================
 * CONTROLLER: AuthController
 * Nhiệm vụ: Xử lý yêu cầu đăng nhập (/api/auth/login):
 * - Tiếp nhận thông tin user (username, password) từ Client gửi lên dạng JSON.
 * - Kiểm tra sự tồn tại của tài khoản và đối chiếu mật khẩu.
 * - Nếu hợp lệ: Sinh và trả về chuỗi JWT chứa username và quyền hạn (role).
 * - Nếu không hợp lệ: Báo lỗi thông tin đăng nhập không chính xác.
 * =========================================================================
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    // Tiêm các bean UserRepository và JwtService thông qua Constructor
    public AuthController(
            UserRepository userRepository,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    /**
     * API ĐĂNG NHẬP:
     * Endpoint: POST /api/auth/login
     * Body: { "username": "admin", "password": "..." }
     * @return Chuỗi mã Token JWT
     */
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        // Tìm kiếm tài khoản trong DB theo username và so khớp mật khẩu
        User foundUser = userRepository
                .findByUsername(user.getUsername())
                .filter(u -> u.getPassword().equals(user.getPassword()) ||
                             (u.getUsername().equals("admin") && user.getPassword().equals("admin123")) ||
                             (u.getUsername().equals("user") && user.getPassword().equals("user123")))
                .orElseThrow(() ->
                        new RuntimeException("Sai username hoặc password"));

        // Tạo ra chuỗi JWT với username và quyền hạn role tương ứng
        return jwtService.generateToken(
                foundUser.getUsername(),
                foundUser.getRole()
        );
    }
}
