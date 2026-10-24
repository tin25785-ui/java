import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../services/productService";

/**
 * =========================================================================
 * TRANG THÊM SẢN PHẨM: ProductAdd.jsx (Chỉ dành cho ADMIN)
 * - Form nhập liệu bo góc, chia 2 cột cho Đơn giá và Số lượng
 * - Xác thực dữ liệu và thông báo trực quan
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
        description: ""
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
                quantity: Number(product.quantity)
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
                        <p className="card-subtitle">Nhập thông tin sản phẩm mới để thêm vào kho hàng</p>
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
