import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/productService";
import ProductForm from "../components/ProductForm";

/**
 * =========================================================================
 * FILE: ProductAdd.jsx
 * NHIỆM VỤ: Trang Thêm sản phẩm mới.
 * BẢO VỆ: Được bọc trong <ProtectedRoute adminOnly={true}> tại App.jsx,
 * do đó CHỈ CÓ TÀI KHOẢN ADMIN mới được phép truy cập vào màn hình này!
 * =========================================================================
 */
function ProductAdd() {
    const navigate = useNavigate();
    // State lưu dữ liệu form
    const [product, setProduct] = useState({
        name: "",
        price: "",
        quantity: "",
        description: ""
    });

    // Bắt sự kiện khi người dùng gõ vào các ô input
    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    // Xử lý khi bấm nút Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gọi API POST /api/products thông qua productService
            await createProduct({
                ...product,
                price: Number(product.price),
                quantity: Number(product.quantity)
            });
            alert("Thêm sản phẩm thành công");
            navigate("/products"); // Chuyển về danh sách sản phẩm
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Thêm sản phẩm thất bại!";
            alert(msg);
        }
    };

    return (
        <div className="card narrow">
            <h2>Thêm sản phẩm</h2>
            <ProductForm product={product} onChange={handleChange} onSubmit={handleSubmit} submitLabel="Thêm sản phẩm" />
        </div>
    );
}

export default ProductAdd;
