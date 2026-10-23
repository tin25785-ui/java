package com.example.shoptin.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

/**
 * =========================================================================
 * FILE: JwtUtil.java
 * NHIỆM VỤ: Tiện ích xử lý JWT Token (JSON Web Token).
 * NGUYÊN LÝ HOẠT ĐỘNG:
 *   1. Tạo chuỗi token gồm 3 phần: Header.Payload.Signature
 *   2. Đóng dấu chữ ký điện tử bằng thuật toán HS256 và Khóa bí mật (Secret Key).
 *   3. Giải mã lấy dữ liệu người dùng (username, role) từ Payload.
 *   4. Kiểm tra tính hợp lệ và hạn sống của Token.
 * =========================================================================
 */
@Component // Khai báo Spring Bean để các nơi khác có thể tiêm vào dùng
public class JwtUtil {

    // Khóa bí mật mặc định dùng để ký chữ ký số (tối thiểu 256 bits = 32 ký tự)
    private static final String DEFAULT_SECRET = "shoptin-secret-key-buoi-06-07-super-secure-jwt-key-2026";
    // Thời hạn sống của Token: 24 giờ (86.400.000 mili-giây)
    private static final long EXPIRATION_TIME = 86400000L;

    // Đối tượng khóa ký số sau khi mã hóa từ chuỗi secret
    private final Key signingKey;

    // Constructor: Chuyển chuỗi secret thành khóa HMAC-SHA an toàn
    public JwtUtil(@Value("${jwt.secret:" + DEFAULT_SECRET + "}") String secret) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * HÀM 1: TẠO RA MỘT TOKEN MỚI (Khi đăng nhập thành công)
     * @param username Tên đăng nhập của người dùng
     * @param role Vai trò người dùng (ADMIN hoặc USER)
     * @return Chuỗi JWT Token hoàn chỉnh
     */
    public String generateToken(String username, String role) {
        Date now = new Date(); // Thời điểm cấp phát token hiện tại
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME); // Thời điểm hết hạn (sau 24h)

        return Jwts.builder()
                .setSubject(username)                 // 1. Đặt username làm chủ thể đại diện
                .claim("role", role)                  // 2. Nhét vai trò (ADMIN/USER) vào Payload
                .setIssuedAt(now)                     // 3. Gán ngày tạo
                .setExpiration(expiryDate)            // 4. Gán ngày hết hạn
                .signWith(signingKey, SignatureAlgorithm.HS256) // 5. Ký chữ ký điện tử bằng thuật toán HS256
                .compact();                           // 6. Nén lại thành chuỗi chuỗi xxxxx.yyyyy.zzzzz
    }

    /**
     * HÀM 2: GIẢI MÃ TẤT CẢ THÔNG TIN (Claims/Payload) TỪ TOKEN
     * Dùng Khóa bí mật (signingKey) của server để xác minh chữ ký và đọc dữ liệu.
     */
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey) // Cung cấp khóa bí mật để đối chiếu chữ ký
                .build()
                .parseClaimsJws(token)     // Dịch chuỗi token
                .getBody();                // Lấy phần thân dữ liệu (Claims)
    }

    /**
     * HÀM 3: RÚT TÊN ĐĂNG NHẬP (Username) TỪ TOKEN
     */
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * HÀM 4: RÚT VAI TRÒ (Role) TỪ TOKEN
     */
    public String extractRole(String token) {
        Object role = extractAllClaims(token).get("role");
        return role != null ? role.toString() : null;
    }

    /**
     * HÀM 5: KIỂM TRA TÍNH TOÀN VẸN VÀ HẠN DÙNG CỦA TOKEN
     * @return true nếu hợp lệ; false nếu token bị giả mạo hoặc đã hết hạn
     */
    public boolean validateToken(String token) {
        try {
            // Thử giải mã token bằng khóa bí mật
            Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token);
            return true; // Token hợp lệ, chưa hết hạn, chữ ký chuẩn xác
        } catch (JwtException | IllegalArgumentException e) {
            // Nếu có ai sửa đổi chuỗi token hoặc token hết hạn, thư viện sẽ ném lỗi vào đây
            return false;
        }
    }
}
