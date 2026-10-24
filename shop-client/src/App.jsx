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
 * COMPONENT CHÍNH: AppContent
 * - Giao diện thanh Topbar hiện đại, hiển thị thương hiệu và thông tin người dùng
 * - Định tuyến (Routes) bảo vệ phân quyền:
 *   + Chưa đăng nhập -> Tự động chuyển hướng về /login
 *   + USER & ADMIN   -> Được xem danh sách (/products) và chi tiết (/products/:id)
 *   + Chỉ ADMIN      -> Được thêm (/products/add) và sửa (/products/edit/:id)
 * =========================================================================
 */
function AppContent() {
    const [token, setToken] = useState(getToken());
    const [username, setUsername] = useState(() => {
        const saved = localStorage.getItem("username");
        return saved || "";
    });

    const navigate = useNavigate();
    const role = getRole();

    // Xử lý sau khi đăng nhập thành công
    const handleLoginSuccess = (newToken, newUsername) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("username", newUsername);

        setToken(newToken);
        setUsername(newUsername);

        navigate("/products");
    };

    // Xử lý đăng xuất tài khoản
    const handleLogout = () => {
        logout();
        localStorage.removeItem("username");

        setToken(null);
        setUsername("");

        navigate("/login");
    };

    return (
        <div className="app-container">
            {/* Thanh điều hướng Topbar hiện đại */}
            <header className="topbar">
                <div className="topbar-inner">
                    <div className="brand-group">
                        <Link to="/products" style={{ textDecoration: "none" }}>
                            <span className="brand">🛒 ShopTin</span>
                        </Link>
                        <span className="brand-tagline">Hệ thống Quản lý Sản phẩm & Xác thực JWT</span>
                    </div>

                    <div className="auth-box">
                        {token ? (
                            <div className="user-profile">
                                <span className="user-name">👤 {username}</span>
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

            {/* Khu vực nội dung các trang */}
            <main>
                <Routes>
                    {/* Tuyến đường Đăng nhập */}
                    <Route
                        path="/login"
                        element={
                            <Login
                                onLoginSuccess={handleLoginSuccess}
                                isLoggedIn={Boolean(token)}
                            />
                        }
                    />

                    {/* Danh sách sản phẩm (Bắt buộc phải đăng nhập) */}
                    <Route
                        path="/products"
                        element={
                            token
                                ? <ProductList />
                                : <Navigate to="/login" replace />
                        }
                    />

                    {/* Thêm sản phẩm (Chỉ ADMIN) */}
                    <Route
                        path="/products/add"
                        element={
                            token && role === "ADMIN"
                                ? <ProductAdd />
                                : <Navigate to="/products" replace />
                        }
                    />

                    {/* Sửa sản phẩm (Chỉ ADMIN) */}
                    <Route
                        path="/products/edit/:id"
                        element={
                            token && role === "ADMIN"
                                ? <ProductEdit />
                                : <Navigate to="/products" replace />
                        }
                    />

                    {/* Chi tiết sản phẩm (Cả USER và ADMIN) */}
                    <Route
                        path="/products/:id"
                        element={
                            token
                                ? <ProductDetail />
                                : <Navigate to="/login" replace />
                        }
                    />

                    {/* Chuyển hướng mặc định */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
