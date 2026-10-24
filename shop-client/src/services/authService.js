/**
 * =========================================================================
 * FILE: authService.js
 * THƯ MỤC: src/services/
 * NHIỆM VỤ: Quản lý lưu trữ và trích xuất thông tin xác thực JWT ở phía Client (Trình duyệt).
 * 
 * GIẢI THÍCH CÁC CƠ CHẾ & CÔNG THỨC:
 * 1. localStorage: Bộ nhớ cục bộ của trình duyệt Web (HTML5 Web Storage API),
 *    dữ liệu lưu tại đây sẽ tồn tại vĩnh viễn kể cả khi người dùng F5 hoặc tắt trình duyệt mở lại.
 * 2. CÔNG THỨC GIẢI MÃ TOKEN TẠI CHỖ (Client-side JWT Decoding):
 *    - Một chuỗi JWT gồm 3 phần: [Header].[Payload].[Chữ_Ký] ngăn cách bởi dấu chấm (.).
 *    - token.split(".")[1]: Tách chuỗi bằng dấu chấm và lấy phần tử ở vị trí số 1 (chính là phần Payload).
 *    - atob(...): Hàm tích hợp sẵn của JavaScript (ASCII to Binary) để giải mã chuỗi mã hóa Base64 thành chuỗi văn bản JSON thuần.
 *    - JSON.parse(...): Chuyển chuỗi JSON thành đối tượng JavaScript để lấy trường "role".
 * =========================================================================
 */

/**
 * 1. ĐỌC MÃ TOKEN TỪ BỘ NHỚ TRÌNH DUYỆT:
 * CÔNG THỨC: localStorage.getItem("token")
 * 
 * @returns {string|null} Chuỗi Token JWT hoặc null nếu chưa đăng nhập
 */
export const getToken = () => {
    return localStorage.getItem("token");
};

/**
 * 2. ĐĂNG XUẤT NGƯỜI DÙNG:
 * CÔNG THỨC: localStorage.removeItem("token")
 * - Xóa sạch mã token khỏi trình duyệt, khiến người dùng không còn quyền gọi API nữa.
 */
export const logout = () => {
    localStorage.removeItem("token");
};

/**
 * 3. TỰ GIẢI MÃ LẤY QUYỀN HẠN (ROLE) TỪ TOKEN:
 * 
 * CÔNG THỨC & NGUYÊN LÝ HOẠT ĐỘNG:
 * - Bước 1: Lấy chuỗi token từ localStorage qua hàm getToken().
 * - Bước 2: Kiểm tra nếu không có token -> trả về null.
 * - Bước 3: Cắt lấy phần Payload: token.split(".")[1]
 * - Bước 4: Giải mã Base64 sang chuỗi JSON: atob(...)
 * - Bước 5: Phân tích cú pháp JSON: JSON.parse(...)
 * - Bước 6: Trả về trường role: payload.role ("ADMIN" hoặc "USER")
 * 
 * @returns {string|null} "ADMIN", "USER" hoặc null nếu chưa đăng nhập / lỗi
 */
export const getRole = () => {
    const token = getToken();
    if (!token) {
        return null;
    }

    try {
        // Tách chuỗi JWT lấy phần Payload ở vị trí index = 1 và giải mã Base64
        const payload = JSON.parse(
            atob(token.split(".")[1])
        );
        // Trả về giá trị của trường "role"
        return payload.role;
    } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        return null;
    }
};
