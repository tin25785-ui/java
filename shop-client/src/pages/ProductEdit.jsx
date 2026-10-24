import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";

/**
 * =========================================================================
 * TRANG SỬA SẢN PHẨM: ProductEdit.jsx (Chỉ dành cho ADMIN)
 * - Tự động nạp dữ liệu cũ bao gồm cả link hình ảnh
 * - Hỗ trợ dán hoặc sửa link hình ảnh kèm khung xem trước
 * =========================================================================
 */
function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [product, setProduct] = useState({
        name: "",
        price: "",
        quantity: "",
        description: "",
        imageUrl: ""
    });

    useEffect(() => {
        getProductById(id)
            .then(response => {
                if (response.data) {
                    setProduct({
                        name: response.data.name || "",
                        price: response.data.price || "",
                        quantity: response.data.quantity || "",
                        description: response.data.description || "",
                        imageUrl: response.data.imageUrl || ""
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi khi nạp dữ liệu sửa sản phẩm:", err);
                setError("Không tìm thấy thông tin sản phẩm cần sửa!");
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await updateProduct(id, {
                ...product,
                price: Number(product.price),
                quantity: Number(product.quantity),
                imageUrl: product.imageUrl?.trim() || ""
            });

            alert("✅ Cập nhật thông tin sản phẩm thành công!");
            navigate(`/products/${id}`);
        } catch (err) {
            console.error("Lỗi khi cập nhật sản phẩm:", err);
            setError("Lỗi khi cập nhật sản phẩm (Kiểm tra lại quyền ADMIN hoặc kết nối máy chủ)!");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="page">
                <div className="card narrow loading">
                    ⏳ Đang tải thông tin sản phẩm cần sửa...
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="card narrow">
                <div className="card-head">
                    <div>
                        <h2>Chỉnh Sửa Sản Phẩm #{id}</h2>
                        <p className="card-subtitle">Cập nhật thông tin hoặc đổi link hình ảnh sản phẩm</p>
                    </div>
                    <span className="badge-role badge-admin">Chỉ ADMIN</span>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form">
                    <div className="field">
                        <label htmlFor="name">Tên sản phẩm (*):</label>
                        <input
                            id="name"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Ô DÁN / SỬA LINK HÌNH ẢNH */}
                    <div className="field">
                        <label htmlFor="imageUrl">Hình ảnh sản phẩm (Link URL ảnh):</label>
                        <input
                            id="imageUrl"
                            name="imageUrl"
                            placeholder="Dán link ảnh tại đây (Ví dụ: https://...)"
                            value={product.imageUrl}
                            onChange={handleChange}
                        />

                        {/* Khung xem trước hình ảnh */}
                        {product.imageUrl && (
                            <div style={{
                                marginTop: "10px",
                                padding: "10px",
                                border: "1px dashed var(--line)",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                background: "#fafafa"
                            }}>
                                <img
                                    src={product.imageUrl}
                                    alt="Xem trước"
                                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }}
                                    onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Link+Anh+Loi"; }}
                                />
                                <div>
                                    <strong style={{ fontSize: "0.85rem", color: "#166534" }}>✓ Hình ảnh hiển thị</strong>
                                    <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--muted)" }}>
                                        Bạn có thể thay đổi link ảnh khác bất cứ lúc nào
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="price">Đơn giá (VNĐ) (*):</label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                value={product.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="quantity">Số lượng tồn kho (*):</label>
                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="0"
                                value={product.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="description">Mô tả chi tiết sản phẩm:</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={product.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="actions" style={{ marginTop: "12px" }}>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Đang lưu thay đổi..." : "💾 Cập Nhật Sản Phẩm"}
                        </button>

                        <Link to={`/products/${id}`} className="btn btn-soft">
                            Hủy bỏ
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductEdit;
