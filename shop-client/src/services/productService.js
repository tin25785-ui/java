import axios from "axios";

/**
 * =========================================================================
 * SERVICE: productService.js
 * Quản lý gọi API Sản phẩm đến Backend Spring Boot (port 8080)
 * =========================================================================
 */
const API_URL = "http://localhost:8080/api/products";

// Hàm tiện ích tự động gắn Bearer Token vào header Authorization
const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// 1. Lấy danh sách sản phẩm
export const getProducts = () => {
    return axios.get(API_URL, getAuthConfig());
};

// 2. Lấy chi tiết sản phẩm theo ID
export const getProductById = (id) => {
    return axios.get(`${API_URL}/${id}`, getAuthConfig());
};

// 3. Thêm mới sản phẩm (Dành riêng cho ADMIN)
export const createProduct = (product) => {
    return axios.post(API_URL, product, getAuthConfig());
};

// 4. Cập nhật thông tin sản phẩm (Dành riêng cho ADMIN)
export const updateProduct = (id, product) => {
    return axios.put(`${API_URL}/${id}`, product, getAuthConfig());
};

// 5. Xóa sản phẩm (Dành riêng cho ADMIN)
export const deleteProduct = (id) => {
    return axios.delete(`${API_URL}/${id}`, getAuthConfig());
};
