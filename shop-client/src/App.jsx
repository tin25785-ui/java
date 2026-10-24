import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";

import ProductList from "./pages/ProductList";
import ProductAdd from "./pages/ProductAdd";
import ProductDetail from "./pages/ProductDetail";
import ProductEdit from "./pages/ProductEdit";
import Login from "./pages/Login";
import { getToken, getRole, logout } from "./services/authService";
import "./App.css";

/**
 * =========================================================================
 * FILE: App.jsx
 * THƯ MỤC: src/
 * NHIỆM VỤ: Thành phần gốc (Root Component) định tuyến toàn bộ ứng dụng React SPA.
 * 
 * GIẢI THÍCH KÝ HIỆU & REACT ROUTER DOM:
 * - BrowserRouter: Bộ định tuyến bao bọc sử dụng HTML5 History API để đồng bộ giao diện người dùng với thanh địa chỉ URL.
 * - Routes: Vùng chứa tập hợp các tuyến đường Route, tự động chọn Route khớp nhất với URL hiện tại.
 * - Route: Định nghĩa một đường dẫn (path) và Component tương ứng sẽ hiển thị (element).
 * - Navigate: Chuyển hướng người dùng tự động tới một URL khác (thay thế thẻ redirect).
 * 
 * NGUYÊN LÝ BẢO VỆ PHÂN QUYỀN ĐỊNH TUYẾN (Conditional Route Protection):
 * 1. Tuyến đường yêu cầu ĐĂNG NHẬP:
 *    CÔNG THỨC: token ? <Component /> : <Navigate to="/login" replace />
 *    - Nếu có token -> Cho phép vào xem.
 *    - Nếu không có token -> Tự động đuổi về trang đăng nhập /login.
 * 
 * 2. Tuyến đường yêu cầu QUYỀN ADMIN:
 *    CÔNG THỨC: token && role === "ADMIN" ? <Component /> : <Navigate to="/products" replace />
 *    - Nếu vừa có token vừa có quyền ADMIN -> Cho phép vào Thêm/Sửa.
 *    - Nếu là tài khoản USER thường -> Tự động chuyển hướng về danh sách /products (chặn truy cập trái phép).
 * =========================================================================
 */

function AppContent() {
    // 1. TRẠNG THÁI TOKEN: Lấy từ bộ nhớ trình duyệt localStorage
    const [token, setToken] = useState(getToken());

    // 2. TRẠNG THÁI USERNAME: Đọc từ localStorage nếu có sẵn
    const [username, setUsername] = useState(() => {
        const saved = localStorage.getItem("username");
        return saved || "";
    });

    const navigate = useNavigate(); // Hàm chuyển trang

    // 3. LẤY VAI TRÒ QUYỀN HẠN TỪ TOKEN ("ADMIN" HOẶC "USER")
    const role = getRole();

    /**
     * HÀM XỬ LÝ KHI ĐĂNG NHẬP THÀNH CÔNG:
     * CÔNG THỨC:
     * - Lưu token và username vào localStorage.
     * - Cập nhật State để Topbar đổi sang giao diện đã đăng nhập.
     * - Chuyển hướng người dùng sang trang danh sách /products.
     * 
     * @param {string} newToken Mã token JWT nhận từ Spring Boot
     * @param {string} newUsername Tên tài khoản người dùng
     */
    const handleLoginSuccess = (newToken, newUsername) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("username", newUsername);

        setToken(newToken);
        setUsername(newUsername);

        navigate("/products");
    };

    /**
     * HÀM XỬ LÝ ĐĂNG XUẤT (LOGOUT):
     * CÔNG THỨC:
     * - Xóa token và username khỏi localStorage.
     * - Đặt State token và username về rỗng.
     * - Chuyển hướng về trang đăng nhập /login.
     */
    const handleLogout = () => {
        logout();
        localStorage.removeItem("username");

        setToken(null);
        setUsername("");

        navigate("/login");
    };

    return (
        <div className="app-container">
            {/* =============================================================
                THANH ĐIỀU HƯỚNG TRÊN CÙNG (TOPBAR HEADER)
                ============================================================= */}
            <header className="topbar">
                <div className="topbar-inner">
                    {/* Logo & Tên thương hiệu */}
                    <div className="brand-group">
                        <Link to="/products" style={{ textDecoration: "none" }}>
                            <span className="brand">🛒 ShopTin</span>
                        </Link>
                        <span className="brand-tagline">Hệ thống Quản lý Sản phẩm & Xác thực JWT</span>
                    </div>

                    {/* Khu vực thông tin tài khoản hoặc nút đăng nhập */}
                    <div className="auth-box">
                        {token ? (
                            <div className="user-profile">
                                <span className="user-name">👤 {username}</span>
                                {/* Huy hiệu vai trò */}
                                <span className={`badge-role ${role === "ADMIN" ? "badge-admin" : "badge-user"}`}>
                                    {role === "ADMIN" ? "QUẢN TRỊ VIÊN" : "NGƯỜI DÙNG"}
                                </span>
                                <button onClick={handleLogout} className="btn-logout" title="Đăng xuất khỏi hệ thống">
                                    Thoát
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { navigate("/login?showLogin=true"); }}
                                className="btn-login"
                            >
                                Đăng nhập
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* =============================================================
                KHU VỰC NỘI DUNG CHÍNH (MAIN CONTENT ROUTING)
                ============================================================= */}
            <main>
                <Routes>
                    {/* 1. Trang Đăng Nhập */}
                    <Route
                        path="/login"
                        element={
                            <Login
                                onLoginSuccess={handleLoginSuccess}
                                isLoggedIn={Boolean(token)}
                            />
                        }
                    />

                    {/* 2. Trang Danh Sách Sản Phẩm (Yêu cầu đăng nhập) */}
                    <Route
                        path="/products"
                        element={
                            token
                                ? <ProductList />
                                : <Navigate to="/login" replace />
                        }
                    />

                    {/* 3. Trang Thêm Sản Phẩm Mới (Yêu cầu quyền ADMIN) */}
                    <Route
                        path="/products/add"
                        element={
                            token && role === "ADMIN"
                                ? <ProductAdd />
                                : <Navigate to="/products" replace />
                        }
                    />

                    {/* 4. Trang Chỉnh Sửa Sản Phẩm (Yêu cầu quyền ADMIN) */}
                    <Route
                        path="/products/edit/:id"
                        element={
                            token && role === "ADMIN"
                                ? <ProductEdit />
                                : <Navigate to="/products" replace />
                        }
                    />

                    {/* 5. Trang Chi Tiết Sản Phẩm (Yêu cầu đăng nhập) */}
                    <Route
                        path="/products/:id"
                        element={
                            token
                                ? <ProductDetail />
                                : <Navigate to="/login" replace />
                        }
                    />

                    {/* 6. Tuyến đường bắt tất cả (Catch-all): Chuyển hướng mặc định về /login */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </main>
        </div>
    );
}

/**
 * THÀNH PHẦN GỐC BAO BỌC BROWSERROUTER
 */
function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
