import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";

/**
 * =========================================================================
 * TRANG SỬA SẢN PHẨM: ProductEdit.jsx (Chỉ dành cho ADMIN)
 * - Tự động nạp dữ liệu cũ bao gồm cả hình ảnh
 * - Hỗ trợ:
 *   1. Chọn ảnh mới từ máy tính (File Picker Base64).
 *   2. Nhập / sửa link URL ảnh.
 *   3. Xem trước (Preview) hình ảnh tức thì.
 * =========================================================================
 */
function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
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

    // Xử lý chọn ảnh mới từ máy tính
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn một file hình ảnh (PNG, JPG, JPEG, WEBP)!");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
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

    // Xóa ảnh
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
                        <p className="card-subtitle">Cập nhật thông tin hoặc tải ảnh mới từ máy tính</p>
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

                    {/* KHU VỰC CHỌN ẢNH TỪ MÁY HOẶC ĐỔI LINK */}
                    <div className="field">
                        <label>Hình ảnh sản phẩm:</label>

                        {/* Nút bấm chọn ảnh từ máy */}
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                            <label
                                htmlFor="editFileInput"
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
                                💻 Đổi ảnh khác từ máy tính
                            </label>
                            <input
                                id="editFileInput"
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                                hoặc sửa URL ảnh mạng:
                            </span>
                        </div>

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

                        {/* Khung xem trước hình ảnh */}
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
