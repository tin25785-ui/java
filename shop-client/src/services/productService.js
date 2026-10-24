import axios from "axios";

/**
 * =========================================================================
 * FILE: productService.js
 * THƯ MỤC: src/services/
 * NHIỆM VỤ: Tầng dịch vụ Client chịu trách nhiệm gửi các HTTP Request (GET, POST, PUT, DELETE)
 * tới Backend Spring Boot chạy tại địa chỉ http://localhost:8080/api/products.
 * 
 * GIẢI THÍCH KÝ HIỆU & CƠ CHẾ:
 * - Axios: Thư viện HTTP Client chuẩn dựa trên Promise để giao tiếp với RESTful API.
 * - Authorization Header: Tiêu đề HTTP bắt buộc mang chuỗi định dạng: "Bearer <token>"
 *   để Spring Security nhận diện danh tính và phân quyền người dùng.
 * =========================================================================
 */

// Địa chỉ URL gốc của API sản phẩm
const API_URL = "http://localhost:8080/api/products";

/**
 * HÀM TIỆN ÍCH TỰ ĐỘNG GẮN BEARER TOKEN:
 * CÔNG THỨC:
 * headers: {
 *   Authorization: `Bearer ${token}`
 * }
 * - Đọc token mới nhất từ localStorage.
 * - Đóng gói vào tiêu đề HTTP Authorization theo chuẩn RFC 6750.
 * 
 * @returns {object} Cấu hình config chứa Headers của Axios
 */
const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

/**
 * 1. LẤY TOÀN BỘ DANH SÁCH SẢN PHẨM:
 * Phương thức HTTP: GET http://localhost:8080/api/products
 * 
 * @returns {Promise} Trả về Promise chứa danh sách sản phẩm từ máy chủ
 */
export const getProducts = () => {
    return axios.get(API_URL, getAuthConfig());
};

/**
 * 2. LẤY CHI TIẾT SẢN PHẨM THEO MÃ ID:
 * Phương thức HTTP: GET http://localhost:8080/api/products/{id}
 * 
 * @param {number|string} id Mã sản phẩm
 * @returns {Promise} Trả về Promise chứa đối tượng sản phẩm
 */
export const getProductById = (id) => {
    return axios.get(`${API_URL}/${id}`, getAuthConfig());
};

/**
 * 3. THÊM MỚI SẢN PHẨM:
 * Phương thức HTTP: POST http://localhost:8080/api/products
 * Yêu cầu quyền: BẮT BUỘC ADMIN
 * 
 * @param {object} product Dữ liệu sản phẩm mới (name, price, quantity, description, imageUrl)
 * @returns {Promise} Phản hồi sau khi thêm
 */
export const createProduct = (product) => {
    return axios.post(API_URL, product, getAuthConfig());
};

/**
 * 4. CẬP NHẬT SẢN PHẨM THEO ID:
 * Phương thức HTTP: PUT http://localhost:8080/api/products/{id}
 * Yêu cầu quyền: BẮT BUỘC ADMIN
 * 
 * @param {number|string} id Mã sản phẩm cần sửa
 * @param {object} product Dữ liệu mới cần cập nhật
 * @returns {Promise} Phản hồi sau khi cập nhật
 */
export const updateProduct = (id, product) => {
    return axios.put(`${API_URL}/${id}`, product, getAuthConfig());
};

/**
 * 5. XÓA SẢN PHẨM THEO ID:
 * Phương thức HTTP: DELETE http://localhost:8080/api/products/{id}
 * Yêu cầu quyền: BẮT BUỘC ADMIN
 * 
 * @param {number|string} id Mã sản phẩm cần xóa
 * @returns {Promise} Phản hồi sau khi xóa
 */
export const deleteProduct = (id) => {
    return axios.delete(`${API_URL}/${id}`, getAuthConfig());
};
