package com.example.shoptin.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * =========================================================================
 * FILE: SecurityConfig.java
 * NHIỆM VỤ: Lớp cấu hình an ninh trung tâm của hệ thống Spring Security.
 * NGUYÊN LÝ:
 *   1. Tạo Bean PasswordEncoder dùng BCrypt để băm mật khẩu 1 chiều.
 *   2. Cấu hình chuỗi lọc SecurityFilterChain (Tắt CSRF, Bật CORS, Stateless).
 *   3. Phân quyền URL: POST/PUT/DELETE sản phẩm chỉ cho ADMIN; GET cho cả USER + ADMIN.
 *   4. Bắt lỗi trả về JSON 401 Unauthorized (chưa login) và 403 Forbidden (USER cố sửa/xóa).
 *   5. Gắn JwtAuthenticationFilter chạy trước bộ lọc mặc định của Spring.
 * =========================================================================
 */
@Configuration        // Đánh dấu class chứa các thiết lập cấu hình của Spring
@EnableWebSecurity     // Bật tính năng bảo mật Spring Security cho ứng dụng web
@EnableMethodSecurity  // Cho phép phân quyền chi tiết tới từng phương thức nếu cần
public class SecurityConfig {

    // Bộ lọc tùy chỉnh dùng để đón bắt và xác thực mã JWT Token
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Tiêm (Inject) JwtAuthenticationFilter vào thông qua Constructor
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * TẠO BEAN MÃ HÓA MẬT KHẨU (BCrypt)
     * - Băm mật khẩu 1 chiều kèm muối (Salt) ngẫu nhiên.
     * - Cùng 1 mật khẩu nếu băm 2 lần sẽ ra 2 chuỗi khác nhau, chống bị dò mật khẩu.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * THIẾT LẬP CHUỖI BỘ LỌC AN NINH (Security Filter Chain)
     * Nơi khai báo luật bảo vệ: ai được vào đâu, cần quyền gì.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt bảo vệ CSRF vì ứng dụng dùng REST API Stateless với JWT Token, không dùng Cookie
                .csrf(csrf -> csrf.disable())

                // 2. Kích hoạt cấu hình CORS để cho phép Frontend React (cổng 5173) gọi API
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Cấu hình STATELESS: Server không lưu Session trong RAM, mỗi request client phải tự gửi kèm Token
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. PHÂN QUYỀN TRUY CẬP ĐƯỜNG DẪN (URL Authorization):
                .authorizeHttpRequests(auth -> auth
                        // Cho phép các request OPTIONS (preflight check của trình duyệt) đi qua tự do
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // API Đăng nhập (/api/auth/**): Công khai hoàn toàn, ai cũng được gọi mà không cần token
                        .requestMatchers("/api/auth/**").permitAll()

                        // XEM SẢN PHẨM (GET /api/products/**): Cho phép cả vai trò USER và ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/products/**").hasAnyRole("USER", "ADMIN")

                        // THÊM SẢN PHẨM (POST): Chỉ dành riêng cho vai trò ADMIN (USER gọi sẽ bị chặn)
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")

                        // SỬA SẢN PHẨM (PUT): Chỉ dành riêng cho vai trò ADMIN (USER gọi sẽ bị chặn)
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")

                        // XÓA SẢN PHẨM (DELETE): Chỉ dành riêng cho vai trò ADMIN (USER gọi sẽ bị chặn)
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                        // Tất cả các đường dẫn còn lại: Bắt buộc phải có tài khoản đăng nhập hợp lệ
                        .anyRequest().authenticated()
                )

                // 5. XỬ LÝ KHI XẢY RA LỖI QUYỀN HẠN (Exception Handling):
                .exceptionHandling(ex -> ex
                        // Lỗi 401 Unauthorized: Khi chưa đăng nhập hoặc token sai / đã hết hạn
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.setCharacterEncoding("UTF-8");
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Chưa đăng nhập hoặc token không hợp lệ!\"}");
                        })
                        // Lỗi 403 Forbidden: Khi đã đăng nhập nhưng không đủ quyền (tài khoản USER cố tình thêm/sửa/xóa)
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.setCharacterEncoding("UTF-8");
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write("{\"error\": \"Forbidden\", \"message\": \"Bạn không có quyền thực hiện thao tác này. Chỉ ADMIN mới có quyền thêm/sửa/xóa!\"}");
                        })
                )

                // 6. GẮN BỘ LỌC JWT: Đặt JwtAuthenticationFilter đứng TRƯỚC bộ lọc đăng nhập mặc định của Spring
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // Đóng gói cấu hình và trả về chuỗi bộ lọc hoàn chỉnh
        return http.build();
    }

    /**
     * CẤU HÌNH CORS (Cross-Origin Resource Sharing)
     * Cho phép trình duyệt gọi từ cổng 5173 (React) sang cổng 8080 (Spring Boot).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*")); // Cho phép mọi nguồn gốc (origin)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")); // Đủ các phương thức
        config.setAllowedHeaders(List.of("*")); // Cho phép mọi Header (bao gồm Authorization)
        config.setAllowCredentials(true);      // Cho phép gửi kèm thông tin xác thực

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Áp dụng cho toàn bộ các API
        return source;
    }
}
