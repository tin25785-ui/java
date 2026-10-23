package com.example.shoptin.controller;

import com.example.shoptin.config.JwtUtil;
import com.example.shoptin.dto.LoginRequest;
import com.example.shoptin.dto.LoginResponse;
import com.example.shoptin.dto.UserDto;
import com.example.shoptin.entity.User;
import com.example.shoptin.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * =========================================================================
 * FILE: AuthController.java
 * NHIỆM VỤ: RESTful API xử lý việc Xác thực và Đăng nhập người dùng.
 * CÁC ENDPOINT:
 *   1. POST /api/auth/login : Nhận username/password, kiểm tra mã hash BCrypt, tạo JWT trả về.
 *   2. GET  /api/auth/me    : Lấy thông tin tài khoản đang đăng nhập từ SecurityContext.
 * =========================================================================
 */
@RestController // Đánh dấu Controller REST API, dữ liệu hàm trả về tự chuyển thành JSON
@RequestMapping("/api/auth") // Tiền tố chung cho tất cả các URL trong controller này
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Tiêm các phụ thuộc (Dependency Injection) qua Constructor
    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * API ĐĂNG NHẬP: POST /api/auth/login
     * @param request Chứa { username, password } người dùng nhập vào
     * @return Mã JWT Token và thông tin cơ bản của user nếu thành công
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // 1. Kiểm tra dữ liệu đầu vào: Không được để trống
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!"));
        }

        // 2. Tìm tài khoản trong Database theo username
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername().trim());
        if (userOpt.isEmpty()) {
            // Không tìm thấy user -> Báo lỗi 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Tên đăng nhập hoặc mật khẩu không chính xác!"));
        }

        User user = userOpt.get();

        // 3. Dùng passwordEncoder.matches để đối chiếu mật khẩu người dùng nhập với chuỗi băm trong DB
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            // Mật khẩu không khớp -> Báo lỗi 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Tên đăng nhập hoặc mật khẩu không chính xác!"));
        }

        // 4. Đúng tài khoản & mật khẩu -> Dùng JwtUtil sinh ra chuỗi mã Token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        // 5. Đóng gói kết quả vào LoginResponse gửi về cho Client (React)
        LoginResponse response = new LoginResponse(
                token,
                user.getUsername(),
                user.getRole(),
                user.getFullName()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * API LẤY THÔNG TIN TÀI KHOẢN HIỆN TẠI: GET /api/auth/me
     * @param authentication Được Spring Security tự động tiêm vào sau khi xác thực Token thành công
     * @return Đối tượng UserDto chứa thông tin an toàn (không có trường password)
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        // 1. Kiểm tra người dùng đã xác thực chưa
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Chưa đăng nhập!"));
        }

        // 2. Lấy tên tài khoản từ phiên xác thực hiện tại
        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy thông tin tài khoản!"));
        }

        // 3. Chuyển thành UserDto để bảo mật (loại bỏ hoàn toàn trường password)
        User user = userOpt.get();
        UserDto dto = new UserDto(user.getId(), user.getUsername(), user.getRole(), user.getFullName());
        return ResponseEntity.ok(dto);
    }
}
