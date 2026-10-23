import api from "./api";

/**
 * =========================================================================
 * FILE: authService.js
 * NHIỆM VỤ: Chứa các hàm xử lý Đăng nhập, Đăng xuất và lưu trữ Token ở Client.
 * =========================================================================
 */

/**
 * 1. HÀM ĐĂNG NHẬP:
 * Gửi username/password lên API /auth/login.
 * Nhận về token và thông tin user, sau đó cất vào localStorage của trình duyệt.
 */
export const login = async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    if (response.data && response.data.token) {
        // Cất mã JWT Token vào bộ nhớ trình duyệt
        localStorage.setItem("token", response.data.token);
        // Cất thông tin user (dưới dạng chuỗi JSON) vào trình duyệt
        localStorage.setItem("user", JSON.stringify({
            username: response.data.username,
            role: response.data.role,
            fullName: response.data.fullName
        }));
    }
    return response.data;
};

/**
 * 2. HÀM ĐĂNG XUẤT:
 * Xóa sạch token và thông tin tài khoản khỏi bộ nhớ trình duyệt.
 */
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

/**
 * 3. HÀM LẤY THÔNG TIN USER HIỆN TẠI TỪ LOCALSTORAGE:
 * Dùng JSON.parse dịch ngược chuỗi chữ thành đối tượng JavaScript.
 */
export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
};

/**
 * 4. HÀM LẤY CHUỖI TOKEN RA DÙNG:
 */
export const getToken = () => {
    return localStorage.getItem("token");
};

/**
 * 5. KIỂM TRA NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP CHƯA:
 * Trả về true nếu trong localStorage đã có token.
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

/**
 * 6. KIỂM TRA NGƯỜI DÙNG CÓ PHẢI VAI TRÒ ADMIN KHÔNG:
 * Trả về true nếu role === "ADMIN".
 */
export const isAdmin = () => {
    const user = getCurrentUser();
    return user?.role === "ADMIN";
};
