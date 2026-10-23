import api from "./api";

/**
 * =========================================================================
 * FILE: productService.js
 * NHIỆM VỤ: Tập hợp các hàm gọi RESTful API sản phẩm sang Backend.
 * ĐẶC BIỆT: Tất cả các hàm này dùng thể hiện "api" (từ api.js), do đó
 * đều TỰ ĐỘNG được đính kèm JWT Token vào Header mà không cần truyền tay!
 * =========================================================================
 */

// 1. Lấy toàn bộ danh sách sản phẩm (GET /api/products)
export const getProducts = () => {
    return api.get("/products");
};

// 2. Tìm kiếm sản phẩm theo tên (GET /api/products/search?name=...)
export const searchProducts = (name) => {
    return api.get(`/products/search?name=${encodeURIComponent(name)}`);
};

// 3. Xem chi tiết 1 sản phẩm theo ID (GET /api/products/{id})
export const getProductById = (id) => {
    return api.get(`/products/${id}`);
};

// 4. Thêm sản phẩm mới (POST /api/products) - Chỉ ADMIN gọi thành công
export const createProduct = (product) => {
    return api.post("/products", product);
};

// 5. Cập nhật thông tin sản phẩm (PUT /api/products/{id}) - Chỉ ADMIN gọi thành công
export const updateProduct = (id, product) => {
    return api.put(`/products/${id}`, product);
};

// 6. Xóa sản phẩm theo ID (DELETE /api/products/{id}) - Chỉ ADMIN gọi thành công
export const deleteProduct = (id) => {
    return api.delete(`/products/${id}`);
};
