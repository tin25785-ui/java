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
 * BỘ LỌC BẢO MẬT: JwtFilter
 * Nhiệm vụ: Đứng chặn trước mọi request gửi lên server:
 * 1. Đọc header "Authorization".
 * 2. Nếu có "Bearer <token>", giải mã lấy username và quyền hạn (role).
 * 3. Tạo GrantedAuthority và nạp vào SecurityContextHolder để Spring Security phân quyền.
 * =========================================================================
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    // Tiêm JwtService thông qua Constructor Injection
    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Lấy chuỗi Authorization từ tiêu đề HTTP header của request
        String header = request.getHeader("Authorization");

        // Kiểm tra xem header có hợp lệ và bắt đầu bằng tiền tố "Bearer " hay không
        if (header != null && header.startsWith("Bearer ")) {
            // Cắt bỏ 7 ký tự đầu tiên ("Bearer ") để lấy ra chuỗi JWT nguyên chất
            String token = header.substring(7);

            try {
                // Giải mã lấy tên người dùng từ token
                String username = jwtService.getUsername(token);

                // 1. Gọi hàm getRole ở JwtService để lấy quyền hạn (role) từ token
                String role = jwtService.getRole(token);

                // 2. Chuyển đổi chuỗi role ("USER" hoặc "ADMIN") thành SimpleGrantedAuthority
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);

                // 3. Tạo đối tượng xác thực Authentication chứa username và danh sách quyền
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                List.of(authority)
                        );

                // 4. Lưu đối tượng xác thực vào SecurityContextHolder của hệ thống
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

            } catch (Exception e) {
                // Nếu token sai, hết hạn hoặc bị giả mạo, lập tức từ chối với mã HTTP 401 Unauthorized
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        // Cho phép request tiếp tục đi qua các filter tiếp theo
        filterChain.doFilter(request, response);
    }
}
