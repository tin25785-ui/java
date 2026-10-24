package com.example.shoptin.security;

import com.example.shoptin.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * =========================================================================
 * FILE: JwtFilter.java
 * GÓI (PACKAGE): com.example.shoptin.security
 * NHIỆM VỤ: Bộ lọc bảo mật chặn mọi HTTP Request gửi đến hệ thống để kiểm tra mã Token JWT.
 * 
 * GIẢI THÍCH KÝ HIỆU & ANNOTATION:
 * - @Component: Khai báo lớp này là một Spring Bean tự động phát hiện bởi cơ chế Component Scan.
 * - extends OncePerRequestFilter: Lớp cha trong Spring Security đảm bảo bộ lọc này
 *   CHỈ ĐƯỢC THỰC THI DUY NHẤT 1 LẦN cho mỗi HTTP request đi vào hệ thống (tránh việc lọc lặp lại).
 * =========================================================================
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    /**
     * Tiêm JwtService thông qua Constructor Injection
     */
    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    /**
     * HÀM XỬ LÝ LỌC REQUEST (doFilterInternal):
     * 
     * QUY TRÌNH KIỂM SOÁT BẢO MẬT:
     * 1. Đọc giá trị header "Authorization" từ Request của Client.
     * 2. Kiểm tra nếu header có giá trị và bắt đầu bằng tiền tố "Bearer ":
     *    CÔNG THỨC: header.substring(7)
     *    - Độ dài chuỗi "Bearer " là đúng 7 ký tự (vị trí index từ 0 đến 6).
     *    - Cắt từ vị trí số 7 trở đi sẽ lấy được chuỗi JWT nguyên chất.
     * 3. Giải mã Token:
     *    - Gọi jwtService.getUsername(token) để lấy ra tên người dùng.
     *    - Gọi jwtService.getRole(token) để lấy ra vai trò quyền hạn ("ADMIN" hoặc "USER").
     * 4. Phân quyền trong Spring Security:
     *    - CÔNG THỨC: new SimpleGrantedAuthority(role)
     *      Chuyển đổi chuỗi String vai trò thành đối tượng Authority mà Spring Security hiểu được.
     *    - Tạo đối tượng UsernamePasswordAuthenticationToken chứa: (username, null, danh sách quyền).
     *    - Lưu vào SecurityContextHolder.getContext().setAuthentication(...) để toàn bộ ứng dụng biết người này là ai và có quyền gì.
     * 5. Nếu Token sai/hết hạn: Bắt lỗi catch và trả về HTTP 401 Unauthorized ngay lập tức.
     * 6. filterChain.doFilter(request, response): Tiếp tục cho request đi qua các tầng xử lý tiếp theo.
     * 
     * @param request Yêu cầu HTTP gửi lên
     * @param response Phản hồi HTTP trả về
     * @param filterChain Chuỗi các bộ lọc bảo mật
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Trích xuất tiêu đề Authorization từ HTTP Header
        String header = request.getHeader("Authorization");

        // 2. Kiểm tra xem tiêu đề có tồn tại và bắt đầu bằng chữ "Bearer " hay không
        if (header != null && header.startsWith("Bearer ")) {
            // Cắt bỏ 7 ký tự "Bearer " để lấy chuỗi Token
            String token = header.substring(7);

            try {
                // 3. Giải mã lấy username từ token
                String username = jwtService.getUsername(token);

                // 4. Giải mã lấy quyền hạn role ("ADMIN" hoặc "USER") từ token
                String role = jwtService.getRole(token);

                // 5. Khởi tạo đối tượng quyền hạn GrantedAuthority
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);

                // 6. Đóng gói thông tin chứng thực (Authentication)
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null, // Không lưu password ở đây vì đã xác thực qua JWT
                                List.of(authority) // Danh sách các quyền hạn của tài khoản
                        );

                // 7. Thiết lập thông tin người dùng đã xác thực vào ngữ cảnh bảo mật của Thread hiện tại
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

            } catch (Exception e) {
                // Nếu mã Token không hợp lệ hoặc đã hết hạn, trả về mã lỗi 401 và chặn request lại
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        // Chuyển tiếp request cho bộ lọc tiếp theo xử lý
        filterChain.doFilter(request, response);
    }
}
