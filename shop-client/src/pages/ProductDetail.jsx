import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { getRole } from "../services/authService";

/**
 * =========================================================================
 * FILE: ProductDetail.jsx
 * THƯ MỤC: src/pages/
 * NHIỆM VỤ: Giao diện Trang Chi Tiết Sản Phẩm.
 * 
 * GIẢI THÍCH KÝ HIỆU & REACT HOOKS:
 * - useParams(): Hook của React Router DOM dùng để trích xuất các tham số động từ thanh địa chỉ URL.
 *   Ví dụ: Đường dẫn "/products/3" -> useParams() sẽ trả về { id: "3" }.
 * - useState(initialValue): Khởi tạo và quản lý dữ liệu chi tiết của sản phẩm.
 * - useEffect(): Tự động gọi API lấy thông tin chi tiết ngay khi người dùng truy cập trang này.
 * =========================================================================
 */
function ProductDetail() {
    // 1. LẤY MÃ ID TỪ ĐƯỜNG DẪN URL
    const { id } = useParams();

    // 2. CÁC BIẾN TRẠNG THÁI (STATES):
    const [product, setProduct] = useState(null); // Đối tượng sản phẩm lấy từ DB
    const [loading, setLoading] = useState(true);  // Trạng thái đang tải dữ liệu

    // 3. LẤY QUYỀN HẠN CỦA TÀI KHOẢN ĐĂNG NHẬP ("ADMIN" HOẶC "USER")
    const role = getRole();

    /**
     * HOOK useEffect:
     * - Khi biến id thay đổi (dependencies: [id]), tự động gửi request GET /api/products/{id} lên máy chủ.
     */
    useEffect(() => {
        getProductById(id)
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
                setLoading(false);
            });
    }, [id]);

    // Trạng thái đang nạp dữ liệu
    if (loading) {
        return (
            <div className="page">
                <div className="card narrow loading">
                    ⏳ Đang tải thông tin sản phẩm...
                </div>
            </div>
        );
    }

    // Trường hợp không tìm thấy sản phẩm trong cơ sở dữ liệu
    if (!product) {
        return (
            <div className="page">
                <div className="card narrow" style={{ textAlign: "center" }}>
                    <div className="alert alert-danger">
                        ❌ Không tìm thấy thông tin sản phẩm này (hoặc sản phẩm đã bị xóa khỏi hệ thống).
                    </div>
                    <Link to="/products" className="btn btn-soft">
                        ⬅ Quay lại danh sách sản phẩm
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="card narrow">
                {/* Phần đầu Card */}
                <div className="card-head">
                    <div>
                        <h2>Chi Tiết Sản Phẩm #{product.id}</h2>
                        <p className="card-subtitle">Thông tin chi tiết về sản phẩm trong hệ thống</p>
                    </div>
                    <span className="badge-role badge-user" style={{ fontSize: "0.85rem" }}>
                        Mã SP: #{product.id}
                    </span>
                </div>

                {/* HÌNH ẢNH SẢN PHẨM: Hiển thị nếu sản phẩm có link ảnh hoặc Base64 */}
                {product.imageUrl && (
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "260px",
                                objectFit: "cover",
                                borderRadius: "10px",
                                border: "1px solid var(--line)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                            }}
                            onError={(e) => { e.target.style.display = "none"; }}
                        />
                    </div>
                )}

                {/* Danh sách định nghĩa thông tin chi tiết (Definition List <dl>, <dt>, <dd>) */}
                <dl className="detail">
                    <dt>Tên sản phẩm:</dt>
                    <dd style={{ fontSize: "1.1rem" }}>{product.name}</dd>

                    <dt>Đơn giá:</dt>
                    <dd style={{ color: "#0d9488", fontSize: "1.2rem" }}>
                        {/* CÔNG THỨC: Định dạng tiền tệ VNĐ */}
                        {Number(product.price).toLocaleString("vi-VN")} đ
                    </dd>

                    <dt>Số lượng tồn:</dt>
                    <dd>
                        <span style={{
                            padding: "3px 10px",
                            borderRadius: "12px",
                            backgroundColor: product.quantity > 5 ? "#e6f4ea" : "#fce8e6",
                            color: product.quantity > 5 ? "#137333" : "#c5221f",
                            fontWeight: "600"
                        }}>
                            {product.quantity} cái
                        </span>
                    </dd>

                    <dt>Mô tả chi tiết:</dt>
                    <dd style={{ fontWeight: "normal", color: "var(--ink)" }}>
                        {product.description || "Chưa có thông tin mô tả chi tiết"}
                    </dd>
                </dl>

                {/* Các nút bấm thao tác điều hướng */}
                <div className="actions" style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--line)" }}>
                    {/* PHÂN QUYỀN ADMIN: Chỉ hiển thị nút Sửa sản phẩm cho Quản trị viên */}
                    {role === "ADMIN" && (
                        <Link to={`/products/edit/${product.id}`} className="btn btn-primary">
                            ✏️ Sửa sản phẩm
                        </Link>
                    )}

                    <Link to="/products" className="btn btn-soft">
                        ⬅ Quay lại danh sách
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
