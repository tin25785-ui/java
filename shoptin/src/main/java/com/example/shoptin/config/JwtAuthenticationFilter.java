package com.example.shoptin.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * =========================================================================
 * FILE: JwtAuthenticationFilter.java
 * NHIỆM VỤ: Bộ lọc đón bắt mọi HTTP Request gửi đến server để kiểm tra Token.
 * NGUYÊN LÝ HOẠT ĐỘNG:
 *   1. Đọc header "Authorization" từ request gửi lên.
 *   2. Kiểm tra nếu có tiền tố "Bearer " thì cắt bỏ 7 ký tự để lấy chuỗi Token thật.
 *   3. Dùng JwtUtil kiểm tra xem Token có hợp lệ, chưa hết hạn không.
 *   4. Nếu hợp lệ: Trích xuất username và role (ADMIN/USER), gán quyền vào
 *      UsernamePasswordAuthenticationToken và nạp vào SecurityContextHolder.
 *   5. Spring Boot biết được danh tính người dùng và cho phép đi tiếp vào Controller.
 * =========================================================================
 */
@Component // Đăng ký class này thành 1 Spring Bean để Spring quản lý
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Tiện ích xử lý giải mã và kiểm tra tính hợp lệ của token
    private final JwtUtil jwtUtil;

    // Tiêm JwtUtil vào qua Constructor
    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /**
     * PHƯƠNG THỨC LỌC NỘI BỘ (Chạy đúng 1 lần cho mỗi request)
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // BƯỚC 1: Lấy chuỗi tiêu đề Authorization trong HTTP Header
        String authHeader = request.getHeader("Authorization");

        // BƯỚC 2: Kiểm tra header có tồn tại và bắt đầu bằng tiền tố "Bearer " hay không
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            // Cắt bỏ 7 ký tự ("Bearer ") để lấy đúng chuỗi mã JWT Token thô
            String token = authHeader.substring(7).trim();

            // BƯỚC 3: Dùng JwtUtil kiểm tra tính toàn vẹn và hạn sử dụng của Token
            if (jwtUtil.validateToken(token)) {
                // Trích xuất tên đăng nhập và vai trò được lưu trong Payload của Token
                String username = jwtUtil.extractUsername(token);
                String role = jwtUtil.extractRole(token);

                // BƯỚC 4: Nếu username hợp lệ và chưa được nạp vào SecurityContext của phiên làm việc này
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    if (role != null) {
                        String cleanRole = role.toUpperCase();
                        // Nạp quyền ROLE_ADMIN hoặc ROLE_USER cho Spring Security hiểu
                        if (cleanRole.startsWith("ROLE_")) {
                            authorities.add(new SimpleGrantedAuthority(cleanRole));
                            authorities.add(new SimpleGrantedAuthority(cleanRole.substring(5)));
                        } else {
                            authorities.add(new SimpleGrantedAuthority("ROLE_" + cleanRole));
                            authorities.add(new SimpleGrantedAuthority(cleanRole));
                        }
                    }

                    // Tạo đối tượng Authentication đại diện cho người dùng đã đăng nhập hợp lệ
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Nạp người dùng vào SecurityContextHolder để Spring Boot nhận diện danh tính
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        // BƯỚC 5: Cho phép request tiếp tục đi tới Filter tiếp theo hoặc đi vào Controller
        filterChain.doFilter(request, response);
    }
}
