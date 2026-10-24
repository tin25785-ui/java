import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";

/**
 * =========================================================================
 * TRANG SỬA SẢN PHẨM: ProductEdit.jsx (Chỉ dành cho ADMIN)
 * =========================================================================
 */
function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        price: "",
        quantity: "",
        description: ""
    });

    useEffect(() => {
        getProductById(id)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi nạp dữ liệu sửa sản phẩm:", error);
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

        try {
            await updateProduct(id, {
                ...product,
                price: Number(product.price),
                quantity: Number(product.quantity)
            });

            alert("Cập nhật sản phẩm thành công");
            navigate(`/products/${id}`);
        } catch (err) {
            console.error("Lỗi khi cập nhật sản phẩm:", err);
            alert("Lỗi khi cập nhật sản phẩm (Kiểm tra lại quyền ADMIN)");
        }
    };

    return (
        <div>
            <h2>Sửa sản phẩm</h2>

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
                        value={product.description || ""}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "6px" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <button type="submit">
                        Cập nhật
                    </button>
                    <Link to="/products" style={{ alignSelf: "center" }}>
                        Hủy bỏ
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ProductEdit;
