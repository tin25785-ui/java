import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../services/productService";

/**
 * =========================================================================
 * TRANG THÊM SẢN PHẨM: ProductAdd.jsx (Chỉ dành cho ADMIN)
 * - Form nhập liệu bo góc, chia 2 cột cho Đơn giá và Số lượng
 * - Hỗ trợ dán đường link hình ảnh (URL) kèm khung xem trước (Preview) trực tiếp
 * =========================================================================
 */
function ProductAdd() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [product, setProduct] = useState({
        name: "",
        price: "",
        quantity: "",
        description: "",
        imageUrl: ""
    });

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
            await createProduct({
                ...product,
                price: Number(product.price),
                quantity: Number(product.quantity),
                imageUrl: product.imageUrl?.trim() || ""
            });

            alert("✅ Thêm sản phẩm mới thành công!");
            navigate("/products");
        } catch (err) {
            console.error("Lỗi khi thêm sản phẩm:", err);
            setError("Không thể thêm sản phẩm (Vui lòng kiểm tra quyền ADMIN hoặc kết nối mạng)!");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page">
            <div className="card narrow">
                <div className="card-head">
                    <div>
                        <h2>Thêm Sản Phẩm Mới</h2>
                        <p className="card-subtitle">Nhập thông tin sản phẩm và dán link hình ảnh để thêm vào kho hàng</p>
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
                            placeholder="Ví dụ: Bàn phím cơ không dây..."
                            value={product.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Ô DÁN LINK HÌNH ẢNH SẢN PHẨM */}
                    <div className="field">
                        <label htmlFor="imageUrl">Hình ảnh sản phẩm (Dán link URL ảnh vào đây):</label>
                        <input
                            id="imageUrl"
                            name="imageUrl"
                            placeholder="Dán link ảnh tại đây (Ví dụ: https://images.unsplash.com/...)"
                            value={product.imageUrl}
                            onChange={handleChange}
                        />

                        {/* Gợi ý một số link ảnh mẫu để test nhanh */}
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                            <span style={{ fontSize: "0.8rem", color: "var(--muted)", alignSelf: "center" }}>
                                Link ảnh mẫu:
                            </span>
                            <button
                                type="button"
                                style={{ fontSize: "0.75rem", padding: "2px 8px", cursor: "pointer" }}
                                onClick={() => setProduct(prev => ({ ...prev, imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400" }))}
                            >
                                ⌚ Đồng hồ
                            </button>
                            <button
                                type="button"
                                style={{ fontSize: "0.75rem", padding: "2px 8px", cursor: "pointer" }}
                                onClick={() => setProduct(prev => ({ ...prev, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" }))}
                            >
                                🎧 Tai nghe
                            </button>
                            <button
                                type="button"
                                style={{ fontSize: "0.75rem", padding: "2px 8px", cursor: "pointer" }}
                                onClick={() => setProduct(prev => ({ ...prev, imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400" }))}
                            >
                                📷 Máy ảnh
                            </button>
                        </div>

                        {/* Khung xem trước hình ảnh ngay lập tức khi người dùng dán link */}
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
                                    <strong style={{ fontSize: "0.85rem", color: "#166534" }}>✓ Đã nhận diện hình ảnh</strong>
                                    <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--muted)" }}>
                                        Hình này sẽ được hiển thị trên bảng sản phẩm
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
                                placeholder="Ví dụ: 500000"
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
                                placeholder="Ví dụ: 20"
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
                            placeholder="Mô tả thông tin chi tiết, xuất xứ, bảo hành..."
                            value={product.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="actions" style={{ marginTop: "12px" }}>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Đang lưu..." : "➕ Lưu Sản Phẩm Mới"}
                        </button>

                        <Link to="/products" className="btn btn-soft">
                            Hủy bỏ
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductAdd;
