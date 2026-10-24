import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../services/productService";

/**
 * =========================================================================
 * TRANG THÊM SẢN PHẨM: ProductAdd.jsx (Chỉ dành cho ADMIN)
 * =========================================================================
 */
function ProductAdd() {
    const navigate = useNavigate();

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

        try {
            await createProduct({
                ...product,
                price: Number(product.price),
                quantity: Number(product.quantity)
            });

            alert("Thêm sản phẩm thành công");
            navigate("/products");
        } catch (err) {
            console.error("Lỗi khi thêm sản phẩm:", err);
            alert("Lỗi khi thêm sản phẩm (Vui lòng kiểm tra quyền ADMIN)");
        }
    };

    return (
        <div>
            <h2>Thêm sản phẩm</h2>

            <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
                <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block" }}>Tên sản phẩm:</label>
                    <input
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "6px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block" }}>Giá:</label>
                    <input
                        name="price"
                        type="number"
                        value={product.price}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "6px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block" }}>Số lượng:</label>
                    <input
                        name="quantity"
                        type="number"
                        value={product.quantity}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "6px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block" }}>Mô tả:</label>
                    <input
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "6px" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <button type="submit">
                        Thêm sản phẩm
                    </button>
                    <Link to="/products" style={{ alignSelf: "center" }}>
                        Hủy bỏ
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ProductAdd;
