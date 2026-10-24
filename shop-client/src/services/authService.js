/**
 * =========================================================================
 * SERVICE: authService.js
 * Quản lý xác thực phía Client:
 * 1. getToken: Đọc token từ localStorage
 * 2. logout: Xóa token khỏi localStorage
 * 3. getRole: Tự giải mã JWT ở client để lấy quyền hạn ("ADMIN" hoặc "USER")
 * =========================================================================
 */

// 1. Đọc mã token từ bộ nhớ trình duyệt để gửi kèm lên Server khi gọi API
export const getToken = () => {
    return localStorage.getItem("token");
};

// 2. Xóa mã token khỏi trình duyệt để thực hiện đăng xuất người dùng
export const logout = () => {
    localStorage.removeItem("token");
};

// 3. Tự giải mã token tại chỗ để lấy quyền hạn (ví dụ: ADMIN / USER), phục vụ ẩn/hiện chức năng
export const getRole = () => {
    const token = getToken();
    if (!token) {
        return null;
    }

    try {
        // Token gồm 3 phần: Header.Payload.Signature cách nhau bởi dấu chấm
        // atob giải mã phần Payload từ Base64 sang chuỗi JSON
        const payload = JSON.parse(
            atob(token.split(".")[1])
        );
        return payload.role;
    } catch {
        return null;
    }
};
