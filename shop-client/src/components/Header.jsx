import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * =========================================================================
 * FILE: Header.jsx
 * NHIỆM VỤ: Thanh điều hướng (Topbar) phía trên cùng của trang web.
 * PHÂN QUYỀN GIAO DIỆN:
 *   - Nếu là ADMIN: Hiển thị thêm nút "+ Thêm sản phẩm".
 *   - Nếu là USER: Ẩn nút "+ Thêm sản phẩm" đi.
 *   - Hiển thị Huy hiệu vai trò [ADMIN] (đỏ) hoặc [USER] (xanh) và nút Đăng xuất.
 * =========================================================================
 */
export default function Header() {
    // Rút các thông tin xác thực từ AuthContext
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const navigate = useNavigate();

    // Xử lý khi bấm nút Đăng xuất
    const handleLogout = () => {
        logout();             // Xóa token và user khỏi state + localStorage
        navigate("/login");   // Chuyển hướng ngay về màn hình Đăng nhập
    };

    return (
        <header className="topbar">
            <div className="topbar-inner">
                {/* Logo thương hiệu */}
                <div className="brand-group">
                    <span className="brand">🛒 Shoptin</span>
                    <span className="brand-tagline">Quản lý Sản phẩm - JWT & Phân quyền</span>
                </div>

                {/* Danh mục menu điều hướng */}
                <nav className="nav-links">
                    {isAuthenticated && (
                        <>
                            <NavLink to="/products" end>
                                Danh sách sản phẩm
                            </NavLink>

                            {/* CHỈ HIỂN THỊ NÚT "THÊM SẢN PHẨM" NẾU VAI TRÒ LÀ ADMIN */}
                            {isAdmin && (
                                <NavLink to="/products/add">
                                    + Thêm sản phẩm
                                </NavLink>
                            )}
                        </>
                    )}
                </nav>

                {/* Khung hiển thị tài khoản góc trên bên phải */}
                <div className="auth-box">
                    {isAuthenticated ? (
                        <div className="user-profile">
                            {/* Huy hiệu vai trò: ADMIN màu đỏ, USER màu xanh */}
                            <span className={`badge-role ${isAdmin ? "badge-admin" : "badge-user"}`}>
                                {user?.role}
                            </span>
                            {/* Tên hiển thị người dùng */}
                            <span className="user-name">
                                {user?.fullName || user?.username}
                            </span>
                            {/* Nút Đăng xuất */}
                            <button onClick={handleLogout} className="btn btn-logout">
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <NavLink to="/login" className="btn btn-login">
                            Đăng nhập
                        </NavLink>
                    )}
                </div>
            </div>
        </header>
    );
}
