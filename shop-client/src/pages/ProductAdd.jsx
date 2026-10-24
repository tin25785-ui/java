import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../services/productService";

/**
 * =========================================================================
 * TRANG THÊM SẢN PHẨM: ProductAdd.jsx (Chỉ dành cho ADMIN)
 * - Cho phép:
 *   1. Chọn ảnh trực tiếp từ máy tính (File Picker / FileReader Base64).
 *   2. Dán link URL ảnh từ mạng Internet.
 *   3. Xem trước (Preview) hình ảnh tức thì.
 * =========================================================================
 */
function ProductAdd() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
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

    // Xử lý chọn ảnh từ máy tính (chuyển sang chuỗi Base64)
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Kiểm tra định dạng file
        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn một file hình ảnh (PNG, JPG, JPEG, WEBP)!");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Tối ưu hóa kích thước ảnh (tối đa 600px) để lưu database nhẹ và mượt mà
                const canvas = document.createElement("canvas");
                const maxDim = 600;
                let w = img.width;
                let h = img.height;
                if (w > h && w > maxDim) {
                    h = Math.round((h * maxDim) / w);
                    w = maxDim;
                } else if (h > maxDim) {
                    w = Math.round((w * maxDim) / h);
                    h = maxDim;
                }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, w, h);

                const base64 = canvas.toDataURL(file.type || "image/jpeg", 0.85);
                setProduct(prev => ({ ...prev, imageUrl: base64 }));
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Xóa ảnh đã chọn
    const handleRemoveImage = () => {
        setProduct(prev => ({ ...prev, imageUrl: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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
                        <p className="card-subtitle">Nhập thông tin sản phẩm và tải ảnh từ máy tính hoặc dán link ảnh</p>
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

                    {/* KHU VỰC CHỌN ẢNH TỪ MÁY HOẶC DÁN LINK */}
                    <div className="field">
                        <label>Hình ảnh sản phẩm:</label>

                        {/* Nút bấm chọn ảnh từ máy */}
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                            <label
                                htmlFor="localFileInput"
                                className="btn btn-soft"
                                style={{
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontWeight: "600",
                                    border: "1px dashed var(--sea)"
                                }}
                            >
                                💻 Chọn ảnh từ máy tính của bạn
                            </label>
                            <input
                                id="localFileInput"
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                                hoặc dán URL ảnh mạng bên dưới:
                            </span>
                        </div>

                        {/* Ô nhập link URL (nếu có link mạng) */}
                        <input
                            id="imageUrl"
                            name="imageUrl"
                            placeholder="Dán link ảnh tại đây (Ví dụ: https://...)"
                            value={product.imageUrl.startsWith("data:") ? "[Đã chọn ảnh từ máy tính]" : product.imageUrl}
                            onChange={(e) => {
                                if (!e.target.value.startsWith("[Đã chọn ảnh")) {
                                    handleChange(e);
                                }
                            }}
                        />

                        {/* Gợi ý một số link ảnh mẫu để test nhanh */}
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                            <span style={{ fontSize: "0.8rem", color: "var(--muted)", alignSelf: "center" }}>
                                Ảnh mẫu:
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

                        {/* Khung xem trước hình ảnh ngay lập tức */}
                        {product.imageUrl && (
                            <div style={{
                                marginTop: "12px",
                                padding: "12px",
                                border: "1px solid var(--line)",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "#fafafa"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                    <img
                                        src={product.imageUrl}
                                        alt="Xem trước ảnh"
                                        style={{ width: "84px", height: "84px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }}
                                        onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Link+Loi"; }}
                                    />
                                    <div>
                                        <strong style={{ fontSize: "0.9rem", color: "#166534" }}>
                                            ✓ {product.imageUrl.startsWith("data:") ? "Ảnh từ máy tính của bạn" : "Ảnh từ đường link URL"}
                                        </strong>
                                        <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "var(--muted)" }}>
                                            Ảnh này sẽ được lưu và hiển thị trên toàn hệ thống
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="btn btn-danger"
                                    style={{ fontSize: "0.8rem", padding: "4px 10px" }}
                                    title="Xóa hình ảnh này"
                                >
                                    ✕ Xóa ảnh
                                </button>
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
