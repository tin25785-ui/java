import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import ProductList from "./pages/ProductList";
import ProductAdd from "./pages/ProductAdd";
import ProductDetail from "./pages/ProductDetail";
import ProductEdit from "./pages/ProductEdit";
import "./App.css";

/**
 * =========================================================================
 * FILE: App.jsx
 * NHIỆM VỤ: Cấu hình cây điều hướng toàn diện (React Router) cho ứng dụng SPA.
 * NGUYÊN LÝ HOẠT ĐỘNG:
 *   1. Bọc trong <AuthProvider> để chia sẻ trạng thái đăng nhập cho toàn bộ ứng dụng.
 *   2. Header luôn hiển thị ở trên cùng.
 *   3. Phân quyền Router:
 *      - /login : Công khai cho mọi người.
 *      - /products & /products/:id : Bọc ProtectedRoute (phải đăng nhập, USER và ADMIN đều vào được).
 *      - /products/add & /products/edit/:id : Bọc ProtectedRoute với adminOnly={true} (chỉ ADMIN).
 * =========================================================================
 */
function AppRoutes() {
    return (
        <>
            {/* Thanh điều hướng Topbar phía trên cùng */}
            <Header />

            {/* Vùng nội dung trang thay đổi theo URL */}
            <main className="page">
                <Routes>
                    {/* 1. Trang Đăng nhập: Công khai */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* 2. Danh sách sản phẩm: Cần đăng nhập (USER và ADMIN đều xem được) */}
                    <Route
                        path="/products"
                        element={
                            <ProtectedRoute>
                                <ProductList />
                            </ProtectedRoute>
                        }
                    />

                    {/* 3. Chi tiết 1 sản phẩm: Cần đăng nhập */}
                    <Route
                        path="/products/:id"
                        element={
                            <ProtectedRoute>
                                <ProductDetail />
                            </ProtectedRoute>
                        }
                    />

                    {/* 4. Thêm sản phẩm mới: CHỈ DÀNH CHO ADMIN (adminOnly={true}) */}
                    <Route
                        path="/products/add"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <ProductAdd />
                            </ProtectedRoute>
                        }
                    />

                    {/* 5. Sửa sản phẩm: CHỈ DÀNH CHO ADMIN (adminOnly={true}) */}
                    <Route
                        path="/products/edit/:id"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <ProductEdit />
                            </ProtectedRoute>
                        }
                    />

                    {/* Mặc định chuyển hướng về /products */}
                    <Route path="/" element={<Navigate to="/products" replace />} />
                    <Route path="*" element={<Navigate to="/products" replace />} />
                </Routes>
            </main>
        </>
    );
}

function App() {
    return (
        // Khởi tạo BrowserRouter quản lý lịch sử điều hướng
        <BrowserRouter>
            {/* Cung cấp dữ liệu đăng nhập AuthContext cho toàn bộ cây Component */}
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
