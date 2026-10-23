import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useAuth } from "../context/AuthContext";

/**
 * =========================================================================
 * FILE: ProductDetail.jsx
 * NHIỆM VỤ: Trang hiển thị thông tin chi tiết của 1 sản phẩm.
 * PHÂN QUYỀN:
 *   - Cả USER và ADMIN đều xem được thông tin.
 *   - Nút "Sửa sản phẩm" CHỈ HIỂN THỊ khi người xem có vai trò là ADMIN.
 * =========================================================================
 */
function ProductDetail() {
    const { id } = useParams(); // Lấy mã ID trên URL (ví dụ /products/5 -> id = 5)
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");
    const { isAdmin } = useAuth(); // Kiểm tra có phải ADMIN không

    // Tải thông tin chi tiết sản phẩm từ backend
    useEffect(() => {
        getProductById(id)
            .then(response => {
                setProduct(response.data);
            })
            .catch(err => {
                console.error(err);
                setError("Không tìm thấy sản phẩm hoặc xảy ra lỗi.");
            });
    }, [id]);

    if (error) {
        return (
            <div className="card narrow">
                <div className="alert alert-danger">{error}</div>
                <Link to="/products" className="btn btn-soft">Quay lại danh sách</Link>
            </div>
        );
    }

    if (!product) {
        return <p className="loading">Đang tải chi tiết sản phẩm...</p>;
    }

    return (
        <div className="card narrow">
            <h2>Chi tiết sản phẩm</h2>
            <dl className="detail">
                <dt>ID</dt><dd>{product.id}</dd>
                <dt>Tên</dt><dd>{product.name}</dd>
                <dt>Giá</dt><dd>{product.price ? product.price.toLocaleString("vi-VN") : 0} ₫</dd>
                <dt>Số lượng</dt><dd>{product.quantity}</dd>
                <dt>Mô tả</dt><dd>{product.description || "(Chưa có mô tả)"}</dd>
            </dl>
            <div className="actions">
                {/* NÚT SỬA SẢN PHẨM CHỈ XUẤT HIỆN NẾU LÀ ADMIN */}
                {isAdmin && (
                    <Link to={`/products/edit/${product.id}`} className="btn btn-primary">
                        Sửa sản phẩm
                    </Link>
                )}
                <Link to="/products" className="btn btn-soft">
                    Quay lại danh sách
                </Link>
            </div>
        </div>
    );
}

export default ProductDetail;
