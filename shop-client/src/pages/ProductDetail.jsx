import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { getRole } from "../services/authService";

/**
 * =========================================================================
 * TRANG CHI TIẾT SẢN PHẨM: ProductDetail.jsx
 * =========================================================================
 */
function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const role = getRole();

    useEffect(() => {
        getProductById(id)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            });
    }, [id]);

    if (!product) {
        return <p>Đang tải...</p>;
    }

    return (
        <div>
            <h2>Chi tiết sản phẩm</h2>

            <p><strong>ID:</strong> {product.id}</p>
            <p><strong>Tên:</strong> {product.name}</p>
            <p><strong>Giá:</strong> {Number(product.price).toLocaleString()} đ</p>
            <p><strong>Số lượng:</strong> {product.quantity}</p>
            <p><strong>Mô tả:</strong> {product.description || "Chưa có mô tả"}</p>

            <div style={{ marginTop: "16px" }}>
                {role === "ADMIN" && (
                    <>
                        <Link to={`/products/edit/${product.id}`}>
                            Sửa sản phẩm
                        </Link>
                        {" | "}
                    </>
                )}
                <Link to="/products">
                    Quay lại danh sách
                </Link>
            </div>
        </div>
    );
}

export default ProductDetail;
