import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import { Link } from "react-router-dom";
import { getRole } from "../services/authService";

/**
 * =========================================================================
 * FILE: ProductList.jsx
 * THƯ MỤC: src/pages/
 * NHIỆM VỤ: Giao diện Trang Danh Sách Sản Phẩm trong hệ thống.
 * 
 * GIẢI THÍCH KÝ HIỆU & CÔNG THỨC:
 * 1. Phân quyền hiển thị (Role-based UI Rendering):
 *    - role === "ADMIN" : Cho phép hiển thị nút "+ Thêm Sản Phẩm Mới", nút "Sửa" và "Xóa".
 *    - role === "USER"  : Tự động ẩn các thao tác chỉnh sửa, chỉ hiển thị nút "Xem" chi tiết.
 * 2. CÔNG THỨC LỌC TÌM KIẾM TRỰC TIẾP (Client-side Search Filter):
 *    products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
 *    - Chuyển cả tên sản phẩm và từ khóa về chữ thường (toLowerCase) để không phân biệt HOA / thường.
 *    - Sử dụng includes() để kiểm tra sự tồn tại của từ khóa trong chuỗi tên hoặc mô tả.
 * 3. CÔNG THỨC ĐỊNH DẠNG TIỀN TỆ VIỆT NAM (VND):
 *    Number(product.price).toLocaleString("vi-VN")
 *    - Tự động thêm dấu chấm ngăn cách hàng nghìn, hàng triệu (ví dụ: 15000000 -> "15.000.000 đ").
 * =========================================================================
 */
function ProductList() {
    // 1. CÁC BIẾN TRẠNG THÁI:
    const [products, setProducts] = useState([]);         // Mảng danh sách sản phẩm lấy từ Backend
    const [searchTerm, setSearchTerm] = useState("");     // Từ khóa tìm kiếm nhập trong ô input
    const [loading, setLoading] = useState(true);          // Trạng thái đang tải dữ liệu

    // 2. LẤY QUYỀN HẠN CỦA TÀI KHOẢN TỪ TOKEN ("ADMIN" HOẶC "USER")
    const role = getRole();

    /**
     * HÀM GỌI API LẤY DANH SÁCH SẢN PHẨM:
     * - Gửi GET request tới Backend.
     * - Cập nhật dữ liệu vào biến state products.
     */
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

    /**
     * HOOK useEffect: Tự động gọi API nạp dữ liệu khi Component vừa được gắn vào màn hình (Mounting).
     * Sử dụng biến cờ isMounted để tránh lỗi rò rỉ bộ nhớ (Memory Leak) nếu component bị gỡ bỏ trước khi API trả về.
     */
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
            isMounted = false; // Dọn dẹp khi unmount
        };
    }, []);

    /**
     * HÀM XỬ LÝ XÓA SẢN PHẨM (Chỉ dành cho ADMIN):
     * CÔNG THỨC: window.confirm(...) -> Hộp thoại xác nhận trước khi xóa tránh người dùng bấm nhầm
     * 
     * @param {number|string} id Mã sản phẩm cần xóa
     * @param {string} name Tên sản phẩm
     */
    const handleDelete = async (id, name) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" (ID: #${id})?`)) {
            try {
                // Gọi API DELETE tới Backend
                await deleteProduct(id);
                // Tải lại danh sách sản phẩm mới nhất sau khi xóa
                loadProducts();
            } catch (err) {
                console.error("Lỗi khi xóa sản phẩm:", err);
                alert("Không thể xóa sản phẩm. Vui lòng kiểm tra lại quyền hạn!");
            }
        }
    };

    /**
     * CÔNG THỨC LỌC DANH SÁCH THEO TỪ KHÓA TÌM KIẾM:
     * Kiểm tra xem tên hoặc mô tả sản phẩm có chứa từ khóa searchTerm hay không.
     */
    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page">
            <div className="card">
                {/* Phần đầu Card: Tiêu đề và Nút Thêm mới */}
                <div className="card-head">
                    <div>
                        <h2>Danh Sách Sản Phẩm</h2>
                        <p className="card-subtitle">
                            Quản lý thông tin danh mục hàng hóa trong hệ thống
                        </p>
                    </div>

                    {/* TOÁN TỬ ĐIỀU KIỆN (Logical AND &&): Chỉ ADMIN mới thấy nút Thêm mới */}
                    {role === "ADMIN" && (
                        <Link to="/products/add" className="btn btn-primary">
                            + Thêm Sản Phẩm Mới
                        </Link>
                    )}
                </div>

                {/* Thanh tìm kiếm sản phẩm */}
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

                {/* Bảng dữ liệu hiển thị danh sách sản phẩm */}
                {loading ? (
                    <div className="loading">⏳ Đang tải dữ liệu sản phẩm từ máy chủ...</div>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: "60px" }}>ID</th>
                                    <th style={{ width: "70px", textAlign: "center" }}>Hình Ảnh</th>
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
                                        <td colSpan="7" className="empty">
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

                                            {/* CỘT HÌNH ẢNH: Hiển thị ảnh link Web hoặc Base64 từ máy */}
                                            <td style={{ textAlign: "center" }}>
                                                {product.imageUrl ? (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                                                        onError={(e) => { e.target.src = "https://placehold.co/100x100?text=SP"; }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: "1.4rem" }}>📦</span>
                                                )}
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
                                                {/* CÔNG THỨC TOÁN TỬ 3 NGÔI: Đổi màu sắc số lượng cảnh báo tồn kho */}
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
                                                    {/* Nút Xem chi tiết: Cả USER và ADMIN đều có */}
                                                    <Link to={`/products/${product.id}`} className="btn btn-soft" title="Xem chi tiết">
                                                        Xem
                                                    </Link>

                                                    {/* PHÂN QUYỀN ADMIN: Chỉ hiển thị nút Sửa và Xóa cho Quản trị viên */}
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
