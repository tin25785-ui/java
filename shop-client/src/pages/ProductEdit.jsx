import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";
import ProductForm from "../components/ProductForm";

/**
 * =========================================================================
 * FILE: ProductEdit.jsx
 * NHIỆM VỤ: Trang Chỉnh sửa thông tin sản phẩm theo mã ID.
 * BẢO VỆ: Được bọc trong <ProtectedRoute adminOnly={true}> tại App.jsx,
 * CHỈ CÓ TÀI KHOẢN ADMIN mới được phép truy cập vào màn hình này!
 * =========================================================================
 */
function ProductEdit() {
    const { id } = useParams(); // Lấy mã ID sản phẩm từ URL
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: "",
        price: "",
        quantity: "",
        description: ""
    });

    // Tải thông tin sản phẩm cũ nạp lên Form
    useEffect(() => {
        getProductById(id)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error(error);
                alert("Không thể tải thông tin sản phẩm!");
            });
    }, [id]);

    // Bắt sự kiện khi người dùng gõ vào các ô input
    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    // Xử lý khi bấm nút Cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gọi API PUT /api/products/{id}
            await updateProduct(id, {
                ...product,
                price: Number(product.price),
                quantity: Number(product.quantity)
            });
            alert("Cập nhật sản phẩm thành công");
            navigate(`/products/${id}`); // Chuyển sang xem chi tiết sản phẩm sau khi sửa
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Cập nhật sản phẩm thất bại!";
            alert(msg);
        }
    };

    return (
        <div className="card narrow">
            <h2>Sửa sản phẩm</h2>
            <ProductForm product={product} onChange={handleChange} onSubmit={handleSubmit} submitLabel="Cập nhật" />
        </div>
    );
}

export default ProductEdit;
