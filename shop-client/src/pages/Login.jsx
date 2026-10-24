import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

/**
 * =========================================================================
 * TRANG ĐĂNG NHẬP: Login.jsx (Bố cục chuẩn theo dự án tham chiếu)
 * =========================================================================
 */
const API_LOGIN_URL = "http://localhost:8080/api/auth/login";

function Login({ onLoginSuccess, isLoggedIn }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Tính toán trạng thái hiển thị form từ param ?showLogin=true
    const showForm = useMemo(() => {
        return searchParams ? searchParams.get("showLogin") === "true" : false;
    }, [searchParams]);

    // Nếu đã đăng nhập thì tự động chuyển hướng sang danh sách sản phẩm
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/products");
        }
    }, [isLoggedIn, navigate]);

    // Xử lý gửi yêu cầu đăng nhập lên backend
    const handleLogin = async (e) => {
        e.preventDefault();
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
            
            // Xóa query param sau khi đăng nhập thành công
            searchParams.delete("showLogin");
            setSearchParams(searchParams);

        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            if (err && err.response && err.response.status === 401) {
                setError("Tài khoản hoặc mật khẩu không chính xác.");
            } else {
                setError("Sai username hoặc password, hoặc không thể kết nối Backend!");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        searchParams.delete("showLogin");
        setSearchParams(searchParams);
        setError("");
        setUsername("");
        setPassword("");
    };

    if (isLoggedIn) {
        return null; 
    }

    return (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
            {!showForm ? (
                <>
                    <h2>Danh sách sản phẩm</h2>
                    <p>Vui lòng đăng nhập để xem danh sách sản phẩm.</p>
                    <button onClick={() => setSearchParams({ showLogin: "true" })}>
                        Đi đến Đăng nhập
                    </button>
                </>
            ) : (
                <form
                    onSubmit={handleLogin}
                    style={{
                        maxWidth: "350px",
                        margin: "20px auto",
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        textAlign: "left"
                    }}
                >
                    <h3 style={{ marginTop: 0 }}>Đăng nhập</h3>

                    <div style={{ marginBottom: "12px" }}>
                        <label htmlFor="username" style={{ display: "block", marginBottom: "4px" }}>
                            Username:
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            required
                            style={{ width: "100%", padding: "6px", boxSizing: "border-box" }}
                        />
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                        <label htmlFor="password" style={{ display: "block", marginBottom: "4px" }}>
                            Password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                            style={{ width: "100%", padding: "6px", boxSizing: "border-box" }}
                        />
                    </div>

                    {/* Phím bấm nhanh tài khoản mặc định để thầy cô / bạn dễ test */}
                    <div style={{ marginBottom: "12px", display: "flex", gap: "6px" }}>
                        <button
                            type="button"
                            onClick={() => { setUsername("admin"); setPassword("123456"); }}
                            style={{ fontSize: "11px", padding: "3px 6px", cursor: "pointer" }}
                        >
                            🔑 Điền Admin (123456)
                        </button>
                        <button
                            type="button"
                            onClick={() => { setUsername("user"); setPassword("123456"); }}
                            style={{ fontSize: "11px", padding: "3px 6px", cursor: "pointer" }}
                        >
                            👤 Điền User (123456)
                        </button>
                    </div>

                    {error && (
                        <p style={{ color: "red", fontSize: "14px", marginBottom: "12px" }}>
                            {error}
                        </p>
                    )}

                    <div style={{ display: "flex", gap: "8px" }}>
                        <button type="submit" disabled={loading}>
                            {loading ? "Đang xử lý..." : "Đăng nhập"}
                        </button>

                        <button type="button" onClick={handleCancel} disabled={loading}>
                            Hủy
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default Login;
