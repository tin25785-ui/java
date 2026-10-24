package com.example.shoptin.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * =========================================================================
 * SERVICE: JwtService
 * Nhiệm vụ: Xử lý toàn bộ logic liên quan đến mã thông báo JSON Web Token (JWT):
 * 1. generateToken: Tạo ra chuỗi JWT có chứa username, role và thời gian hết hạn (1 tiếng).
 * 2. getUsername: Giải mã token để lấy tên tài khoản (Subject).
 * 3. getRole: Giải mã token để lấy quyền hạn (Role: "ADMIN" hoặc "USER").
 * =========================================================================
 */
@Service
public class JwtService {

    // Khóa bí mật (SECRET KEY) độ dài tối thiểu 256-bit dùng cho thuật toán HMAC-SHA256
    private final String SECRET = "1234567890123456789012345678901234567890";

    // Khởi tạo SecretKey từ mảng byte của chuỗi SECRET theo bảng mã UTF-8
    private final SecretKey key = Keys.hmacShaKeyFor(
            SECRET.getBytes(StandardCharsets.UTF_8)
    );

    /**
     * TẠO MÃ TOKEN JWT:
     * @param username Tên đăng nhập người dùng
     * @param role Quyền hạn người dùng ("ADMIN" hoặc "USER")
     * @return Chuỗi token đã được ký điện tử
     */
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username) // Đặt username vào trường sub (Subject)
                .claim("role", role) // Đính kèm quyền hạn role vào phần thân (Claims)
                .issuedAt(new Date()) // Thời điểm phát hành token (hiện tại)
                .expiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000)) // Hết hạn sau 1 giờ (3600000 ms)
                .signWith(key) // Ký điện tử bảo mật bằng khóa bí mật key
                .compact(); // Nén lại thành chuỗi JWT (Header.Payload.Signature)
    }

    /**
     * LẤY USERNAME TỪ TOKEN:
     * @param token Chuỗi JWT client gửi lên
     * @return Tên người dùng đã được lưu trong token
     */
    public String getUsername(String token) {
        return Jwts.parser()
                .verifyWith(key) // Xác thực chữ ký bằng khóa bí mật key
                .build()
                .parseSignedClaims(token) // Phân tích chuỗi JWT
                .getPayload() // Trích xuất nội dung payload
                .getSubject(); // Lấy trường subject (chứa username)
    }

    /**
     * LẤY QUYỀN HẠN (ROLE) TỪ TOKEN:
     * @param token Chuỗi JWT client gửi lên
     * @return Chuỗi role ("ADMIN" hoặc "USER")
     */
    public String getRole(String token) {
        return Jwts.parser()
                .verifyWith(key) // Xác thực chữ ký
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class); // Lấy giá trị của claim "role"
    }
}
