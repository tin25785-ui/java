import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * =========================================================================
 * TRANG ĐĂNG NHẬP: Login.jsx
 * - Thiết kế Card hiện đại, căn giữa màn hình
 * - Phím bấm nhanh tài khoản Admin/User để người dùng dễ kiểm tra
 * - Tự động chuyển hướng khi đăng nhập thành công
 * =========================================================================
 */
const API_LOGIN_URL = "http://localhost:8080/api/auth/login";

function Login({ onLoginSuccess, isLoggedIn }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Nếu đã đăng nhập thì tự động chuyển hướng sang danh sách sản phẩm
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/products");
        }
    }, [isLoggedIn, navigate]);

    // Xử lý gửi yêu cầu đăng nhập
    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (loading) return;

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(API_LOGIN_URL, {
                username: username.trim(),
                password: password
            });

            // Lấy token dạng String hoặc Object
            const token = response && response.data && typeof response.data === "string"
                ? response.data
                : response.data?.token;

            if (!token) {
                setError("Hệ thống phản hồi không hợp lệ (Thiếu JWT).");
                setLoading(false);
                return;
            }

            if (typeof onLoginSuccess === "function") {
                onLoginSuccess(token, username);
            }

        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            if (err && err.response && err.response.status === 401) {
                setError("Tài khoản hoặc mật khẩu không chính xác.");
            } else {
                setError("Sai username hoặc password, hoặc chưa bật Backend Spring Boot!");
            }
        } finally {
            setLoading(false);
        }
    };

    // Hàm điền nhanh thông tin tài khoản mẫu
    const handleQuickFill = (u, p) => {
        setUsername(u);
        setPassword(p);
        setError("");
    };

    if (isLoggedIn) {
        return null;
    }

    return (
        <div className="login-container">
            <div className="card login-card">
                <div className="login-header">
                    <div className="login-icon">🔐</div>
                    <h2>Đăng Nhập Hệ Thống</h2>
                    <p className="login-subtitle">
                        Vui lòng nhập tài khoản để quản lý và xem thông tin sản phẩm
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="form">
                    <div className="field">
                        <label htmlFor="username">Tên đăng nhập (Username):</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Nhập username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Mật khẩu (Password):</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                        style={{ marginTop: "8px" }}
                    >
                        {loading ? "Đang xử lý đăng nhập..." : "Đăng Nhập Ngay"}
                    </button>
                </form>

                {/* Khu vực bấm nhanh tài khoản mặc định phục vụ chấm điểm và kiểm thử */}
                <div className="quick-login-section">
                    <p className="quick-title">⚡ Chọn nhanh tài khoản kiểm thử:</p>
                    <div className="quick-buttons">
                        <button
                            type="button"
                            className="btn-quick"
                            onClick={() => handleQuickFill("admin", "123456")}
                        >
                            <span style={{ fontSize: "1.3rem" }}>👑</span>
                            <div>
                                <strong>Tài khoản ADMIN (admin / 123456)</strong>
                                <small>Toàn quyền: Xem, Thêm mới, Sửa và Xóa sản phẩm</small>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="btn-quick"
                            onClick={() => handleQuickFill("user", "123456")}
                        >
                            <span style={{ fontSize: "1.3rem" }}>👤</span>
                            <div>
                                <strong>Tài khoản USER (user / 123456)</strong>
                                <small>Quyền xem: Chỉ xem danh sách và chi tiết (ẩn nút sửa/xóa)</small>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
