import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../services/productService";

/**
 * =========================================================================
 * FILE: ProductAdd.jsx
 * THƯ MỤC: src/pages/
 * NHIỆM VỤ: Giao diện Form Thêm Sản Phẩm Mới (Dành riêng cho ADMIN).
 * 
 * GIẢI THÍCH KÝ HIỆU & REACT HOOKS:
 * - useRef(null): Tạo một tham chiếu trực tiếp đến phần tử DOM (trong bài này là thẻ <input type="file" />)
 *   để dễ dàng đặt lại (reset) giá trị file input khi người dùng bấm nút "Xóa ảnh".
 * - FileReader API: Giao diện chuẩn của trình duyệt Web dùng để đọc nội dung file từ máy tính người dùng một cách bất đồng bộ.
 * 
 * CÔNG THỨC NÉN & GIẢM KÍCH THƯỚC ẢNH BẰNG HTML5 CANVAS:
 * - maxDim = 600 (Kích thước cạnh lớn nhất tối đa 600 pixel).
 * - CÔNG THỨC BẢO TOÀN TỈ LỆ KHUNG HÌNH (Aspect Ratio):
 *   + Nếu Chiều rộng (w) > Chiều cao (h) và w > 600:
 *     Chiều cao mới = Math.round((h * 600) / w); Chiều rộng mới = 600;
 *   + Ngược lại nếu Chiều cao (h) > 600:
 *     Chiều rộng mới = Math.round((w * 600) / h); Chiều cao mới = 600;
 * - canvas.toDataURL("image/jpeg", 0.85): Nén chất lượng 85% sang chuỗi Base64.
 *   => Giúp giảm dung lượng từ 5MB xuống chỉ còn khoảng ~30KB-50KB, lưu vào Database siêu nhanh!
 * =========================================================================
 */
function ProductAdd() {
    const navigate = useNavigate();      // Hook điều hướng trang
    const fileInputRef = useRef(null);   // Tham chiếu thẻ input file

    // 1. CÁC BIẾN TRẠNG THÁI (STATES):
    const [submitting, setSubmitting] = useState(false); // Trạng thái đang gửi form
    const [error, setError] = useState("");              // Thông báo lỗi

    // State lưu toàn bộ dữ liệu form sản phẩm
    const [product, setProduct] = useState({
        name: "",
        price: "",
        quantity: "",
        description: "",
        imageUrl: "" // Chứa đường link URL hoặc chuỗi Base64
    });

    /**
     * HÀM CẬP NHẬT DỮ LIỆU INPUT:
     * CÔNG THỨC: [e.target.name]: e.target.value
     * Sử dụng Computed Property Name trong ES6 để cập nhật linh hoạt bất kỳ trường nào theo tên 'name' của thẻ input.
     * 
     * @param {Event} e Sự kiện Change của thẻ input
     */
    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    /**
     * HÀM XỬ LÝ CHỌN FILE ẢNH TỪ MÁY TÍNH:
     * 1. Đọc file người dùng vừa chọn từ ổ cứng.
     * 2. Sử dụng FileReader nạp vào đối tượng Image.
     * 3. Vẽ lên thẻ ảo Canvas để thu nhỏ kích thước (tối đa 600px).
     * 4. Chuyển đổi thành chuỗi Base64 (data:image/jpeg;base64,...) gán vào state imageUrl.
     * 
     * @param {Event} e Sự kiện Change khi chọn file
     */
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Kiểm tra loại file có phải là hình ảnh không
        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn một file hình ảnh hợp lệ (PNG, JPG, JPEG, WEBP)!");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Tạo thẻ ảo canvas để xử lý nén kích thước ảnh
                const canvas = document.createElement("canvas");
                const maxDim = 600;
                let w = img.width;
                let h = img.height;

                // Áp dụng công thức bảo toàn tỉ lệ khung hình
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

                // Xuất chuỗi Base64 với chất lượng 85%
                const base64 = canvas.toDataURL(file.type || "image/jpeg", 0.85);
                setProduct(prev => ({ ...prev, imageUrl: base64 }));
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    /**
     * HÀM XÓA HÌNH ẢNH ĐÃ CHỌN:
     * Đặt lại imageUrl về rỗng và reset giá trị của thẻ input file trên DOM.
     */
    const handleRemoveImage = () => {
        setProduct(prev => ({ ...prev, imageUrl: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    /**
     * HÀM XỬ LÝ SUBMIT FORM LƯU SẢN PHẨM:
     * CÔNG THỨC:
     * - Number(product.price): Ép kiểu chuỗi số sang số thực double.
     * - Number(product.quantity): Ép kiểu chuỗi số sang số nguyên int.
     * - Gọi createProduct() gửi request POST lên Spring Boot.
     * 
     * @param {Event} e Sự kiện Submit của Form
     */
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
            navigate("/products"); // Chuyển về danh sách sản phẩm
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

                        {/* Gợi ý link ảnh mẫu */}
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
