import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { getRole } from "../services/authService";

/**
 * =========================================================================
 * TRANG CHI TIẾT SẢN PHẨM: ProductDetail.jsx
 * - Thiết kế giao diện Card chi tiết, nhãn rõ ràng
 * =========================================================================
 */
function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const role = getRole();

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

    if (loading) {
        return (
            <div className="page">
                <div className="card narrow loading">
                    ⏳ Đang tải thông tin sản phẩm...
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page">
                <div className="card narrow" style={{ textAlign: "center" }}>
                    <div className="alert alert-danger">
                        ❌ Không tìm thấy thông tin sản phẩm này (hoặc sản phẩm đã bị xóa).
                    </div>
                    <Link to="/products" className="btn btn-soft">
                        ⬅ Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="card narrow">
                <div className="card-head">
                    <div>
                        <h2>Chi Tiết Sản Phẩm #{product.id}</h2>
                        <p className="card-subtitle">Thông tin chi tiết về sản phẩm trong hệ thống</p>
                    </div>
                    <span className="badge-role badge-user" style={{ fontSize: "0.85rem" }}>
                        ID: {product.id}
                    </span>
                </div>

                <dl className="detail">
                    <dt>Tên sản phẩm:</dt>
                    <dd style={{ fontSize: "1.1rem" }}>{product.name}</dd>

                    <dt>Đơn giá:</dt>
                    <dd style={{ color: "#0d9488", fontSize: "1.2rem" }}>
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
                        {product.description || "Chưa có mô tả"}
                    </dd>
                </dl>

                <div className="actions" style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--line)" }}>
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
