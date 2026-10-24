package com.example.shoptin.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * =========================================================================
 * FILE: JwtService.java
 * GÓI (PACKAGE): com.example.shoptin.service
 * NHIỆM VỤ: Lớp dịch vụ nghiệp vụ (Service) chuyên xử lý tạo và giải mã JSON Web Token (JWT).
 * 
 * GIẢI THÍCH KÝ HIỆU & ANNOTATION:
 * - @Service: Đánh dấu lớp này là một Service Component trong mô hình MVC,
 *   Spring sẽ tự động khởi tạo đối tượng này và quản lý trong ApplicationContext.
 * 
 * CẤU TRÚC CHUẨN CỦA MỘT CHUỖI JWT:
 * Chuỗi JWT bao gồm 3 phần ngăn cách nhau bằng dấu chấm (.):
 * [Header].[Payload].[Signature]
 * 1. Header (Tiêu đề): Chứa thuật toán mã hóa (ví dụ: HS256) và loại token (JWT).
 * 2. Payload (Nội dung): Chứa dữ liệu thực tế (Claims) như username (sub), role, thời gian hết hạn (exp).
 * 3. Signature (Chữ ký điện tử): Được băm từ Header + Payload + Khóa bí mật SECRET KEY để chống bị sửa đổi dữ liệu trái phép.
 * =========================================================================
 */
@Service
public class JwtService {

    /**
     * KHÓA BÍ MẬT (SECRET KEY):
     * - Độ dài: Chuỗi "1234567890123456789012345678901234567890" dài 40 ký tự (40 bytes = 320 bits).
     * - Quy chuẩn bảo mật: Thuật toán HMAC-SHA256 bắt buộc khóa phải có độ dài tối thiểu từ 256 bits (32 bytes) trở lên.
     */
    private final String SECRET = "1234567890123456789012345678901234567890";

    /**
     * KHỞI TẠO KHÓA MÃ HÓA (SecretKey):
     * CÔNG THỨC: Keys.hmacShaKeyFor(mảng_byte_utf8)
     * - Chuyển đổi chuỗi bí mật SECRET sang mảng byte chuẩn mã hóa UTF-8.
     * - Tạo thành khóa đối xứng an toàn SecretKey cho thuật toán HMAC-SHA.
     */
    private final SecretKey key = Keys.hmacShaKeyFor(
            SECRET.getBytes(StandardCharsets.UTF_8)
    );

    /**
     * 1. HÀM TẠO RA MÃ TOKEN (generateToken):
     * 
     * CÔNG THỨC TÍNH TOÁN THỜI GIAN HẾT HẠN:
     * - System.currentTimeMillis(): Lấy thời gian hiện tại tính bằng mili-giây (ms).
     * - 60 * 60 * 1000 = 3,600,000 ms (tương đương 60 phút = 1 giờ đồng hồ).
     * - new Date(System.currentTimeMillis() + 3600000): Token sẽ hết hạn sau đúng 1 tiếng tính từ lúc đăng nhập.
     * 
     * QUY TRÌNH XÂY DỰNG TOKEN (Jwts.builder()):
     * - .subject(username)   : Gán tên tài khoản vào trường Subject tiêu chuẩn ("sub").
     * - .claim("role", role) : Đính kèm quyền hạn ("ADMIN" hoặc "USER") vào trường Custom Claim ("role").
     * - .issuedAt(...)       : Ghi lại thời điểm phát hành token ("iat").
     * - .expiration(...)     : Ghi lại thời điểm hết hiệu lực ("exp").
     * - .signWith(key)       : Ký điện tử an toàn bằng khóa bí mật.
     * - .compact()           : Đóng gói và mã hóa Base64URL thành chuỗi hoàn chỉnh dạng String.
     * 
     * @param username Tên đăng nhập người dùng
     * @param role Vai trò người dùng ("ADMIN" hoặc "USER")
     * @return Chuỗi token JWT hợp lệ để gửi về Client
     */
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + 60 * 60 * 1000)
                )
                .signWith(key)
                .compact();
    }

    /**
     * 2. HÀM GIẢI MÃ LẤY USERNAME TỪ TOKEN (getUsername):
     * 
     * QUY TRÌNH PHÂN TÍCH (Parser):
     * - Jwts.parser().verifyWith(key).build(): Thiết lập bộ giải mã và kiểm tra chữ ký với khóa key.
     * - .parseSignedClaims(token): Kiểm tra tính toàn vẹn và hạn sử dụng của token. Nếu token giả mạo hoặc hết hạn -> ném lỗi Exception!
     * - .getPayload(): Trích xuất phần thân Payload chứa các thông tin Claims.
     * - .getSubject(): Lấy trường "sub" (chính là username đã lưu trước đó).
     * 
     * @param token Chuỗi JWT do Client gửi lên trong Header
     * @return Tên đăng nhập username
     */
    public String getUsername(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    /**
     * 3. HÀM GIẢI MÃ LẤY QUYỀN HẠN ROLE TỪ TOKEN (getRole):
     * 
     * NGUYÊN LÝ:
     * - Trích xuất phần Payload của token.
     * - .get("role", String.class): Đọc giá trị của trường "role" dưới dạng chuỗi String ("ADMIN" hoặc "USER").
     * 
     * @param token Chuỗi JWT
     * @return Chuỗi quyền hạn: "ADMIN" hoặc "USER"
     */
    public String getRole(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }
}
