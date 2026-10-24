import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";

/**
 * =========================================================================
 * TRANG SỬA SẢN PHẨM: ProductEdit.jsx (Chỉ dành cho ADMIN)
 * - Tự động tải thông tin sản phẩm theo ID để người dùng chỉnh sửa
 * - Form nhập liệu bo góc, chia 2 cột cho Đơn giá và Số lượng
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
        description: ""
    });

    useEffect(() => {
        getProductById(id)
            .then(response => {
                if (response.data) {
                    setProduct({
                        name: response.data.name || "",
                        price: response.data.price || "",
                        quantity: response.data.quantity || "",
                        description: response.data.description || ""
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
                quantity: Number(product.quantity)
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
                        <p className="card-subtitle">Cập nhật thông tin sản phẩm trong kho hàng</p>
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
