/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import * as authService from "../services/authService";

/**
 * =========================================================================
 * FILE: AuthContext.jsx
 * NHIỆM VỤ: Quản lý trạng thái xác thực và phân quyền toàn cục (Global State).
 * NGUYÊN LÝ HOẠT ĐỘNG:
 *   - Sử dụng React Context API để chia sẻ dữ liệu (user, token, role, login, logout)
 *     cho toàn bộ các Component trong ứng dụng.
 *   - Khi người dùng đăng nhập hoặc đăng xuất, toàn bộ thanh Header và các trang
 *     tự động vẽ lại giao diện tương ứng mà không cần phải reload website.
 * =========================================================================
 */

// 1. Tạo Context đối tượng
const AuthContext = createContext(null);

// 2. Component bọc (Provider) cung cấp dữ liệu cho toàn bộ ứng dụng
export function AuthProvider({ children }) {
    // Khởi tạo state trực tiếp từ localStorage khi ứng dụng vừa tải
    const [user, setUser] = useState(() => authService.getCurrentUser());
    const [token, setToken] = useState(() => authService.getToken());

    // Hàm đăng nhập: Gọi authService.login rồi cập nhật ngay vào state
    const login = async (username, password) => {
        const data = await authService.login(username, password);
        setUser({
            username: data.username,
            role: data.role,
            fullName: data.fullName
        });
        setToken(data.token);
        return data;
    };

    // Hàm đăng xuất: Xóa localStorage và xóa state
    const logout = () => {
        authService.logout();
        setUser(null);
        setToken(null);
    };

    // Đóng gói các giá trị dùng chung
    const value = {
        user,                             // Thông tin user: { username, role, fullName }
        token,                            // Chuỗi JWT Token
        isAuthenticated: !!token,         // true nếu đã có token
        isAdmin: user?.role === "ADMIN", // true nếu vai trò là ADMIN
        login,                            // Hàm đăng nhập
        logout                            // Hàm đăng xuất
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Custom Hook tiện lợi: Chỉ cần gọi useAuth() là lấy được toàn bộ thông tin
export const useAuth = () => {
    return useContext(AuthContext);
};
