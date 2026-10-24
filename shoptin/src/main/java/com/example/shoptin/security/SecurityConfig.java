package com.example.shoptin.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * =========================================================================
 * CẤU HÌNH BẢO MẬT: SecurityConfig
 * Nhiệm vụ:
 * 1. Cấu hình CORS cho phép React (port 5173) gọi API Spring Boot (port 8080).
 * 2. Vô hiệu hóa CSRF vì dùng REST API không lưu trạng thái (Stateless).
 * 3. Phân quyền chi tiết:
 *    - /api/auth/login : Tự do truy cập không cần đăng nhập (permitAll).
 *    - POST, PUT, DELETE /api/products/** : Chỉ dành cho "ADMIN" (hasAuthority("ADMIN")).
 *    - GET /api/products/** : Cả "USER" và "ADMIN" đều được xem (hasAnyAuthority("USER", "ADMIN")).
 * 4. Chèn bộ lọc JwtFilter trước UsernamePasswordAuthenticationFilter.
 * =========================================================================
 */
@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    // Tiêm JwtFilter vào cấu hình bảo mật
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // 1. Kích hoạt cấu hình CORS từ bean corsConfigurationSource phía dưới
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 2. Vô hiệu hóa chống giả mạo request liên trang (CSRF)
            .csrf(csrf -> csrf.disable())

            // 3. Chế độ phiên làm việc không trạng thái (STATELESS) vì sử dụng JWT
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // 4. Định nghĩa quy tắc phân quyền cho từng đường dẫn (URL)
            .authorizeHttpRequests(auth -> auth
                // Cho phép tất cả các request OPTIONS (Preflight của trình duyệt) đi qua tự do
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Cho phép gọi API đăng nhập tự do
                .requestMatchers("/api/auth/login", "/api/auth/**").permitAll()

                // Phân quyền chi tiết cho API Sản phẩm dùng hasAuthority:
                // CHỈ CÓ ADMIN MỚI ĐƯỢC: THÊM (POST), SỬA (PUT), XÓA (DELETE)
                .requestMatchers(HttpMethod.POST, "/api/products/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAuthority("ADMIN")

                // CẢ USER VÀ ADMIN ĐỀU ĐƯỢC XEM (GET) SẢN PHẨM
                .requestMatchers(HttpMethod.GET, "/api/products/**").hasAnyAuthority("USER", "ADMIN")

                // Tất cả các API khác còn lại bắt buộc phải đăng nhập
                .anyRequest().authenticated()
            )

            // 5. Gắn bộ lọc JwtFilter trước bộ lọc đăng nhập mặc định
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    // Bean cấu hình CORS chi tiết để chấp nhận request từ React (port 5173)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Cho phép frontend React từ port 5173
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        // Cho phép các phương thức HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Cho phép tất cả các tiêu đề headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // Cho phép gửi kèm thông tin xác thực
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
