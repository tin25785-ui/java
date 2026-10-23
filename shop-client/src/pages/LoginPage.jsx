import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * =========================================================================
 * FILE: LoginPage.jsx
 * NHIỆM VỤ: Giao diện màn hình Đăng Nhập.
 * TÍNH NĂNG ĐẶC BIỆT:
 *   - Form nhập tài khoản và mật khẩu.
 *   - Hiển thị thông báo lỗi màu đỏ nếu nhập sai mật khẩu (401).
 *   - Có sẵn 2 nút NẠP TÀI KHOẢN NHANH (admin / admin123 và user / user123)
 *     để tiện cho thầy cô kiểm tra bài mà không cần phải gõ phím.
 * =========================================================================
 */
export default function LoginPage() {
    // Các biến state quản lý ô nhập liệu và thông báo lỗi
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy trang mà người dùng muốn vào trước khi bị chặn về login, mặc định là /products
    const from = location.state?.from?.pathname || "/products";

    // Xử lý khi bấm nút Submit Đăng nhập
    const handleSubmit = async (e) => {
        e.preventDefault(); // Chặn reload lại trang web
        setError("");
        setLoading(true);

        try {
            // Gọi hàm login từ AuthContext
            await login(username, password);
            // Đăng nhập thành công -> Chuyển hướng sang danh sách sản phẩm
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Login failed:", err);
            const msg = err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản!";
            setError(msg); // Hiển thị lỗi ra màn hình
        } finally {
            setLoading(false);
        }
    };

    // Hàm tiện ích: Tự động điền tài khoản khi bấm vào 2 nút gợi ý
    const handleQuickLogin = (u, p) => {
        setUsername(u);
        setPassword(p);
        setError("");
    };

    return (
        <div className="login-container">
            <div className="card login-card">
                {/* Tiêu đề trang */}
                <div className="login-header">
                    <div className="login-icon">🔐</div>
                    <h2>Đăng Nhập Hệ Thống</h2>
                    <p className="login-subtitle">Xác thực JWT & Phân quyền USER / ADMIN</p>
                </div>

                {/* Khung thông báo lỗi nếu có */}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Form nhập liệu */}
                <form onSubmit={handleSubmit} className="form">
                    <div className="field">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Nhập tên đăng nhập..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? "Đang xác thực..." : "Đăng nhập"}
                    </button>
                </form>

                {/* Khu vực 2 nút nạp nhanh tài khoản mẫu */}
                <div className="quick-login-section">
                    <p className="quick-title">Tài khoản thử nghiệm sẵn có:</p>
                    <div className="quick-buttons">
                        {/* Nút nạp Admin */}
                        <button
                            type="button"
                            className="btn-quick admin"
                            onClick={() => handleQuickLogin("admin", "admin123")}
                        >
                            <span className="badge-role badge-admin">ADMIN</span>
                            <div>
                                <strong>admin</strong> / <code>admin123</code>
                                <small>Xem, thêm, sửa, xóa</small>
                            </div>
                        </button>

                        {/* Nút nạp User */}
                        <button
                            type="button"
                            className="btn-quick user"
                            onClick={() => handleQuickLogin("user", "user123")}
                        >
                            <span className="badge-role badge-user">USER</span>
                            <div>
                                <strong>user</strong> / <code>user123</code>
                                <small>Chỉ xem sản phẩm</small>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
