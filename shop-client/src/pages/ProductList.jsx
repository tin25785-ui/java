import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import { Link } from "react-router-dom";
import { getRole } from "../services/authService";

/**
 * =========================================================================
 * TRANG DANH SÁCH SẢN PHẨM: ProductList.jsx
 * - Hiển thị bảng sản phẩm cho cả USER và ADMIN
 * - Phân quyền: Chỉ ADMIN mới thấy nút "Thêm sản phẩm", "Sửa", "Xóa"
 * =========================================================================
 */
function ProductList() {
    const [products, setProducts] = useState([]);

    // Lấy quyền hạn người dùng từ token ("ADMIN" hoặc "USER")
    const role = getRole();

    // Hàm gọi API nạp danh sách sản phẩm
    const loadProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách sản phẩm:", err);
        }
    };

    useEffect(() => {
        let isMounted = true;
        getProducts()
            .then(response => {
                if (isMounted) {
                    setProducts(response.data);
                }
            })
            .catch(err => {
                console.error("Lỗi khi tải danh sách sản phẩm:", err);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Hàm xử lý xóa sản phẩm (chỉ dành cho ADMIN)
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có muốn xóa sản phẩm này?")) {
            try {
                await deleteProduct(id);
                loadProducts();
            } catch (err) {
                console.error("Lỗi khi xóa sản phẩm:", err);
                alert("Không thể xóa sản phẩm (Kiểm tra lại quyền hạn ADMIN)");
            }
        }
    };

    return (
        <div>
            <h2>Danh sách sản phẩm</h2>

            {/* Chỉ tài khoản ADMIN mới thấy nút Thêm sản phẩm */}
            {role === "ADMIN" && (
                <p style={{ marginBottom: "16px" }}>
                    <Link to="/products/add" style={{ fontWeight: "bold" }}>
                        + Thêm sản phẩm mới
                    </Link>
                </p>
            )}
            
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", maxWidth: "800px" }}>
                <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                        <th>ID</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>Chưa có sản phẩm nào</td>
                        </tr>
                    ) : (
                        products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{Number(product.price).toLocaleString()} đ</td>
                                <td>{product.quantity}</td>
                                <td>
                                    <Link to={`/products/${product.id}`}>
                                        Xem
                                    </Link>

                                    {/* Chỉ ADMIN mới thấy nút Sửa và Xóa */}
                                    {role === "ADMIN" && (
                                        <>
                                            {" | "}
                                            <Link to={`/products/edit/${product.id}`}>
                                                Sửa
                                            </Link>
                                            {" | "}
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                style={{ color: "red", cursor: "pointer" }}
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;
