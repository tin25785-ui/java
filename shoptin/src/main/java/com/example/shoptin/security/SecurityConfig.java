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
 * FILE: SecurityConfig.java
 * GÓI (PACKAGE): com.example.shoptin.security
 * NHIỆM VỤ: Lớp cấu hình trung tâm của toàn bộ hệ thống bảo mật Spring Security 6.
 * 
 * GIẢI THÍCH KÝ HIỆU & ANNOTATION:
 * - @Configuration: Đánh dấu lớp chứa các thiết lập cấu hình Bean cho Spring Container.
 * - @Bean: Khai báo phương thức trả về một Spring Bean được quản lý vòng đời tự động.
 * - SecurityFilterChain: Chuỗi các bộ lọc bảo vệ kiểm soát mọi đường dẫn HTTP Request.
 * =========================================================================
 */
@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    /**
     * Tiêm đối tượng JwtFilter vào cấu hình
     */
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    /**
     * CẤU HÌNH BỘ LỌC BẢO MẬT (SecurityFilterChain):
     * 
     * GIẢI THÍCH TỪNG THÀNH PHẦN & CÔNG THỨC:
     * 1. .cors(cors -> cors.configurationSource(corsConfigurationSource())):
     *    - Cho phép chia sẻ tài nguyên chéo nguồn (Cross-Origin Resource Sharing) giữa React (port 5173) và Spring Boot (port 8080).
     * 
     * 2. .csrf(csrf -> csrf.disable()):
     *    - Vô hiệu hóa chống giả mạo request liên trang (CSRF - Cross-Site Request Forgery)
     *    - Lý do: Ứng dụng là RESTful API không sử dụng Cookie Session mà dùng JWT Token gửi trong Header nên miễn nhiễm với CSRF.
     * 
     * 3. .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)):
     *    - Thiết lập chế độ phi trạng thái (Stateless). Máy chủ hoàn toàn không lưu trữ Session trong bộ nhớ RAM,
     *      mỗi một request gửi lên đều độc lập và tự mang theo Token JWT để xác thực.
     * 
     * 4. .authorizeHttpRequests(auth -> auth ...):
     *    - Phân quyền chi tiết cho từng đường dẫn URL:
     *      + OPTIONS /** : permitAll() -> Cho phép trình duyệt gửi request kiểm tra CORS (Preflight).
     *      + /api/auth/login : permitAll() -> Cho phép truy cập tự do để người dùng đăng nhập.
     *      + POST, PUT, DELETE /api/products/** : hasAuthority("ADMIN") -> CHỈ CÓ ADMIN mới có quyền Thêm, Sửa, Xóa!
     *      + GET /api/products/** : hasAnyAuthority("USER", "ADMIN") -> CẢ ADMIN VÀ USER đều có quyền Xem danh sách và Chi tiết!
     *      + anyRequest().authenticated() -> Tất cả các API còn lại đều bắt buộc phải đăng nhập.
     * 
     * 5. .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class):
     *    - Đặt bộ lọc JwtFilter của chúng ta chạy trước bộ lọc UsernamePassword mặc định của Spring Security.
     * 
     * @param http đối tượng cấu hình bảo mật HttpSecurity
     * @return Chuỗi SecurityFilterChain hoàn chỉnh
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // 1. Kích hoạt cấu hình CORS từ bean corsConfigurationSource phía dưới
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 2. Tắt CSRF vì ứng dụng dùng cơ chế xác thực Token phi trạng thái
            .csrf(csrf -> csrf.disable())

            // 3. Quản lý phiên làm việc theo cơ chế Stateless (Không lưu Session)
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // 4. Định nghĩa quy tắc phân quyền truy cập
            .authorizeHttpRequests(auth -> auth
                // Cho phép tất cả request kiểm tra CORS (OPTIONS) đi qua tự do
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Cho phép gọi API đăng nhập tự do
                .requestMatchers("/api/auth/login", "/api/auth/**").permitAll()

                // Phân quyền cho ADMIN: Thêm (POST), Sửa (PUT), Xóa (DELETE)
                .requestMatchers(HttpMethod.POST, "/api/products/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAuthority("ADMIN")

                // Phân quyền Xem (GET): Cả USER và ADMIN đều được phép
                .requestMatchers(HttpMethod.GET, "/api/products/**").hasAnyAuthority("USER", "ADMIN")

                // Tất cả các yêu cầu còn lại bắt buộc phải có Token hợp lệ
                .anyRequest().authenticated()
            )

            // 5. Chèn bộ lọc JwtFilter trước bộ lọc đăng nhập mặc định
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    /**
     * BEAN CẤU HÌNH CORS (Cross-Origin Resource Sharing):
     * - Mặc định trình duyệt chặn các request gọi giữa 2 cổng khác nhau (port 5173 gọi sang port 8080).
     * - Cấu hình này mở cổng cho phép React gửi request:
     *   + Origins: http://localhost:5173
     *   + Methods: GET, POST, PUT, DELETE, OPTIONS
     *   + Headers: Cho phép tất cả (*)
     *   + AllowCredentials: Cho phép gửi kèm thông tin ủy quyền
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
