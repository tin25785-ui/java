import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * =========================================================================
 * FILE: ProtectedRoute.jsx
 * NHIỆM VỤ: Vệ sĩ bảo vệ các đường dẫn (Router Guarding) phía React.
 * NGUYÊN LÝ HOẠT ĐỘNG:
 *   1. Nếu chưa đăng nhập (!isAuthenticated) -> Chuyển hướng ngay về /login.
 *   2. Nếu trang yêu cầu quyền Admin (adminOnly = true) mà user là USER thường
 *      -> Bật thông báo không có quyền và đẩy về trang danh sách /products.
 *   3. Hợp lệ -> Cho phép hiển thị nội dung trang con (children).
 * =========================================================================
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation(); // Lưu lại vị trí trang hiện tại để redirect sau khi login

    // BƯỚC 1: Nếu chưa đăng nhập, lập tức đẩy về trang Login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // BƯỚC 2: Nếu trang yêu cầu ADMIN nhưng vai trò hiện tại chỉ là USER
    if (adminOnly && !isAdmin) {
        alert("Bạn không có quyền truy cập trang này (Chỉ ADMIN mới có quyền thêm/sửa sản phẩm)!");
        return <Navigate to="/products" replace />;
    }

    // BƯỚC 3: Đủ điều kiện -> Cho phép nạp trang bình thường
    return children;
}
