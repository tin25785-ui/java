import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * =========================================================================
 * FILE: Login.jsx
 * THƯ MỤC: src/pages/
 * NHIỆM VỤ: Giao diện Trang Đăng Nhập cho người dùng.
 * 
 * GIẢI THÍCH KÝ HIỆU & REACT HOOKS:
 * - useState(initialValue): Hook cốt lõi của React dùng để khai báo và quản lý biến trạng thái (State) của Component.
 *   Khi State thay đổi thông qua hàm set..., React sẽ tự động Render lại giao diện tương ứng.
 * - useEffect(callback, dependencies): Hook xử lý các tác vụ phụ (Side Effects) như gọi API, lắng nghe sự kiện, hoặc chuyển hướng trang.
 *   Khi mảng phụ thuộc [isLoggedIn, navigate] thay đổi, hàm callback bên trong sẽ được kích hoạt.
 * - useNavigate(): Hook điều hướng trang của thư viện React Router DOM, giúp chuyển trang mượt mà không cần tải lại trình duyệt.
 * =========================================================================
 */
const API_LOGIN_URL = "http://localhost:8080/api/auth/login";

function Login({ onLoginSuccess, isLoggedIn }) {
    // 1. CÁC BIẾN TRẠNG THÁI (STATES):
    const [username, setUsername] = useState(""); // Lưu tên đăng nhập người dùng nhập vào
    const [password, setPassword] = useState(""); // Lưu mật khẩu người dùng nhập vào
    const [error, setError] = useState("");       // Lưu chuỗi thông báo lỗi hiển thị cho người dùng
    const [loading, setLoading] = useState(false); // Trạng thái đang tải (true khi đang chờ server phản hồi)

    const navigate = useNavigate(); // Khởi tạo hàm điều hướng trang

    /**
     * TỰ ĐỘNG CHUYỂN HƯỚNG NẾU ĐÃ ĐĂNG NHẬP:
     * - Nếu biến isLoggedIn = true -> Người dùng đã có Token -> Chuyển ngay đến trang danh sách /products.
     */
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/products");
        }
    }, [isLoggedIn, navigate]);

    /**
     * HÀM XỬ LÝ SỰ KIỆN GỬI FORM ĐĂNG NHẬP:
     * CÔNG THỨC & NGUYÊN LÝ HOẠT ĐỘNG:
     * 1. e.preventDefault(): Ngăn chặn hành vi mặc định của trình duyệt (tránh việc trang web bị reload toàn bộ).
     * 2. axios.post(API_LOGIN_URL, { username, password }): Gửi thông tin đăng nhập lên Backend dạng JSON.
     * 3. Trích xuất token trả về từ máy chủ.
     * 4. Gọi hàm onLoginSuccess(token, username) để lưu vào localStorage và cập nhật trạng thái toàn ứng dụng.
     * 
     * @param {Event} e Sự kiện Submit của Form
     */
    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (loading) return; // Nếu đang xử lý thì không gửi thêm request trùng lặp

        setError("");       // Xóa thông báo lỗi cũ
        setLoading(true);   // Bật trạng thái đang xử lý

        try {
            // Gửi HTTP POST request tới Spring Boot
            const response = await axios.post(API_LOGIN_URL, {
                username: username.trim(),
                password: password
            });

            // Lấy chuỗi Token từ kết quả phản hồi của máy chủ
            const token = response && response.data && typeof response.data === "string"
                ? response.data
                : response.data?.token;

            if (!token) {
                setError("Hệ thống phản hồi không hợp lệ (Không tìm thấy chuỗi JWT)!");
                setLoading(false);
                return;
            }

            // Gọi hàm callback thông báo đăng nhập thành công
            if (typeof onLoginSuccess === "function") {
                onLoginSuccess(token, username);
            }

        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            // Xử lý các mã lỗi HTTP tương ứng
            if (err && err.response && err.response.status === 401) {
                setError("Tài khoản hoặc mật khẩu không chính xác!");
            } else {
                setError("Sai username hoặc password, hoặc chưa bật máy chủ Backend Spring Boot (Port 8080)!");
            }
        } finally {
            setLoading(false); // Tắt trạng thái đang xử lý
        }
    };

    /**
     * HÀM ĐIỀN NHANH THÔNG TIN TÀI KHOẢN MẪU:
     * Giúp giảng viên hoặc người dùng thử nghiệm nhanh trong 1 cú click chuột.
     * 
     * @param {string} u Tên đăng nhập
     * @param {string} p Mật khẩu
     */
    const handleQuickFill = (u, p) => {
        setUsername(u);
        setPassword(p);
        setError("");
    };

    // Nếu đã đăng nhập thì không render form nữa để chờ chuyển trang
    if (isLoggedIn) {
        return null;
    }

    return (
        <div className="login-container">
            <div className="card login-card">
                {/* Tiêu đề trang đăng nhập */}
                <div className="login-header">
                    <div className="login-icon">🔐</div>
                    <h2>Đăng Nhập Hệ Thống</h2>
                    <p className="login-subtitle">
                        Vui lòng nhập tài khoản để quản lý và xem thông tin sản phẩm
                    </p>
                </div>

                {/* Khung cảnh báo lỗi nếu có */}
                {error && (
                    <div className="alert alert-danger">
                        ⚠️ {error}
                    </div>
                )}

                {/* Form nhập liệu */}
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

                    {/* Nút bấm Submit gửi dữ liệu */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                        style={{ marginTop: "8px" }}
                    >
                        {loading ? "Đang xử lý đăng nhập..." : "Đăng Nhập Ngay"}
                    </button>
                </form>

                {/* Khu vực chọn nhanh tài khoản kiểm thử phục vụ chấm điểm bài tập */}
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
