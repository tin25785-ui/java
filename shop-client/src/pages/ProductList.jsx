import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import { Link } from "react-router-dom";
import { getRole } from "../services/authService";

/**
 * =========================================================================
 * TRANG DANH SÁCH SẢN PHẨM: ProductList.jsx
 * - Giao diện Card bo góc, bảng dữ liệu hiện đại, hỗ trợ tìm kiếm trực tiếp
 * - Phân quyền rõ ràng:
 *   + ADMIN: Hiển thị đầy đủ nút "+ Thêm sản phẩm", "Sửa", "Xóa"
 *   + USER: Chỉ hiển thị nút "Xem" chi tiết, ẩn toàn bộ thao tác chỉnh sửa
 * =========================================================================
 */
function ProductList() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // Lấy quyền hạn hiện tại ("ADMIN" hoặc "USER")
    const role = getRole();

    // Hàm gọi API tải danh sách sản phẩm
    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await getProducts();
            setProducts(response.data || []);
        } catch (err) {
            console.error("Lỗi khi tải danh sách sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        getProducts()
            .then(response => {
                if (isMounted) {
                    setProducts(response.data || []);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error("Lỗi khi tải danh sách sản phẩm:", err);
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Xử lý xóa sản phẩm (Chỉ dành cho ADMIN)
    const handleDelete = async (id, name) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" (ID: ${id})?`)) {
            try {
                await deleteProduct(id);
                loadProducts();
            } catch (err) {
                console.error("Lỗi khi xóa sản phẩm:", err);
                alert("Không thể xóa sản phẩm. Vui lòng kiểm tra lại quyền hạn!");
            }
        }
    };

    // Lọc danh sách sản phẩm theo từ khóa tìm kiếm
    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page">
            <div className="card">
                <div className="card-head">
                    <div>
                        <h2>Danh Sách Sản Phẩm</h2>
                        <p className="card-subtitle">
                            Quản lý thông tin danh mục hàng hóa trong hệ thống
                        </p>
                    </div>

                    {/* Nút thêm mới chỉ hiển thị cho tài khoản ADMIN */}
                    {role === "ADMIN" && (
                        <Link to="/products/add" className="btn btn-primary">
                            + Thêm Sản Phẩm Mới
                        </Link>
                    )}
                </div>

                {/* Thanh tìm kiếm sản phẩm tiện lợi */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="🔍 Tìm kiếm sản phẩm theo tên hoặc mô tả..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="btn btn-soft"
                            onClick={() => setSearchTerm("")}
                        >
                            Xóa lọc
                        </button>
                    )}
                </div>

                {/* Bảng hiển thị danh sách sản phẩm */}
                {loading ? (
                    <div className="loading">⏳ Đang tải dữ liệu sản phẩm từ máy chủ...</div>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: "60px" }}>ID</th>
                                    <th>Tên Sản Phẩm</th>
                                    <th className="num">Đơn Giá</th>
                                    <th className="num" style={{ width: "100px" }}>Số Lượng</th>
                                    <th>Mô Tả</th>
                                    <th style={{ width: "180px", textAlign: "center" }}>Thao Tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="empty">
                                            {searchTerm
                                                ? `Không tìm thấy sản phẩm nào khớp với từ khóa "${searchTerm}".`
                                                : "Hiện chưa có sản phẩm nào trong cơ sở dữ liệu."}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map(product => (
                                        <tr key={product.id}>
                                            <td style={{ fontWeight: "600", color: "var(--muted)" }}>
                                                #{product.id}
                                            </td>
                                            <td className="name">
                                                <Link to={`/products/${product.id}`} style={{ textDecoration: "none", fontWeight: "600" }}>
                                                    {product.name}
                                                </Link>
                                            </td>
                                            <td className="num" style={{ fontWeight: "600", color: "#0d9488" }}>
                                                {Number(product.price).toLocaleString("vi-VN")} đ
                                            </td>
                                            <td className="num">
                                                <span style={{
                                                    padding: "2px 8px",
                                                    borderRadius: "12px",
                                                    backgroundColor: product.quantity > 5 ? "#e6f4ea" : "#fce8e6",
                                                    color: product.quantity > 5 ? "#137333" : "#c5221f",
                                                    fontWeight: "600",
                                                    fontSize: "0.85rem"
                                                }}>
                                                    {product.quantity}
                                                </span>
                                            </td>
                                            <td style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                                                {product.description || "—"}
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <div className="actions" style={{ justifyContent: "center" }}>
                                                    <Link to={`/products/${product.id}`} className="btn btn-soft" title="Xem chi tiết">
                                                        Xem
                                                    </Link>

                                                    {/* Quyền ADMIN: Hiện thêm 2 nút Sửa và Xóa */}
                                                    {role === "ADMIN" && (
                                                        <>
                                                            <Link to={`/products/edit/${product.id}`} className="btn btn-soft" title="Sửa sản phẩm">
                                                                Sửa
                                                            </Link>

                                                            <button
                                                                onClick={() => handleDelete(product.id, product.name)}
                                                                className="btn btn-danger"
                                                                title="Xóa sản phẩm"
                                                            >
                                                                Xóa
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductList;
