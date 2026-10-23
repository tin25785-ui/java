import axios from "axios";

/**
 * =========================================================================
 * FILE: api.js
 * NHIỆM VỤ: Cấu hình thể hiện (instance) của Axios để kết nối sang Backend Spring Boot.
 * NGUYÊN LÝ HOẠT ĐỘNG:
 *   1. Đặt đường dẫn gốc baseURL = "http://localhost:8080/api".
 *   2. REQUEST INTERCEPTOR (Trạm kiểm soát trước khi gửi đi):
 *      Tự động vào localStorage lấy JWT Token và đính kèm vào Header:
 *      Authorization: Bearer <token>.
 *   3. RESPONSE INTERCEPTOR (Trạm kiểm soát khi nhận về):
 *      Nếu Backend trả về lỗi 401 Unauthorized (token hết hạn), tự động
 *      xóa sạch localStorage và bắt người dùng đăng nhập lại.
 * =========================================================================
 */
const api = axios.create({
    baseURL: "http://localhost:8080/api", // Đường dẫn gốc tới API Spring Boot
    headers: {
        "Content-Type": "application/json"
    }
});

// 1. TRẠM KIỂM SOÁT REQUEST GỬI ĐI (Tự động gắn JWT Token)
api.interceptors.request.use(
    (config) => {
        // Lấy token từ bộ nhớ trình duyệt
        const token = localStorage.getItem("token");
        if (token) {
            // Đính kèm tiêu đề chuẩn quốc tế: Authorization: Bearer <token>
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // Cho phép request tiếp tục bay sang server
    },
    (error) => Promise.reject(error)
);

// 2. TRẠM KIỂM SOÁT PHẢN HỒI NHẬN VỀ (Bắt lỗi 401)
api.interceptors.response.use(
    (response) => response, // Nếu thành công thì trả dữ liệu về bình thường
    (error) => {
        // Nếu server báo lỗi 401 (chưa đăng nhập hoặc token hết hạn)
        if (error.response && error.response.status === 401) {
            // Xóa sạch token và thông tin user cũ để bảo vệ dữ liệu
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);

export default api;
