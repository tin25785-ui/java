import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";

import ProductList from "./pages/ProductList";
import ProductAdd from "./pages/ProductAdd";
import ProductDetail from "./pages/ProductDetail";
import ProductEdit from "./pages/ProductEdit";
import Login from "./pages/Login";
import { getToken, getRole, logout } from "./services/authService";

/**
 * =========================================================================
 * COMPONENT CHÍNH: AppContent
 * - Bố cục header với điều hướng Trang chủ / Đăng nhập / Thoát
 * - Định tuyến (Routes) bảo vệ phân quyền:
 *   + Chưa đăng nhập -> Chỉ vào được /login
 *   + USER & ADMIN   -> Vào được /products, /products/:id
 *   + Chỉ ADMIN      -> Vào được /products/add, /products/edit/:id
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
        <>
            <header style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 24px",
                borderBottom: "1px solid #ddd",
                backgroundColor: "#fafafa"
            }}>
                <Link to="/login" style={{ textDecoration: "none", fontWeight: "bold", fontSize: "18px", color: "#333" }}>
                    🏬 ShopTin
                </Link>

                <div>
                    {token ? (
                        <>
                            <span style={{ marginRight: "12px", color: "#2563eb", fontWeight: "600" }}>
                                👤 {username} {role && `(${role})`}
                            </span>

                            <button onClick={handleLogout} style={{ padding: "5px 12px", cursor: "pointer" }}>
                                Thoát
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => { navigate("/login?showLogin=true"); }}
                            style={{ padding: "5px 12px", cursor: "pointer" }}
                        >
                            Đăng nhập
                        </button>
                    )}
                </div>
            </header>

            <main style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
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
        </>
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
