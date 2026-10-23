import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, searchProducts, deleteProduct } from "../services/productService";
import { useAuth } from "../context/AuthContext";

/**
 * =========================================================================
 * FILE: ProductList.jsx
 * NHIỆM VỤ: Trang hiển thị bảng danh sách sản phẩm.
 * PHÂN QUYỀN GIAO DIỆN (THEO ĐÚNG ĐỀ BÀI):
 *   - Nếu là ADMIN: Hiển thị nút "+ Thêm sản phẩm", trong bảng có đủ 3 nút [Xem], [Sửa], [Xóa].
 *   - Nếu là USER : Ẩn nút "+ Thêm sản phẩm", trong bảng CHỈ HIỂN THỊ DUY NHẤT nút [Xem].
 * =========================================================================
 */
function ProductList() {
    const [products, setProducts] = useState([]);       // Danh sách sản phẩm
    const [searchName, setSearchName] = useState("");   // Từ khóa tìm kiếm
    const [loading, setLoading] = useState(false);      // Trạng thái đang tải
    const [errorMessage, setErrorMessage] = useState("");
    const { isAdmin, user } = useAuth();                // Lấy quyền và thông tin user hiện tại

    // Hàm gọi API tải danh sách sản phẩm từ backend
    const loadProducts = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (err) {
            console.error(err);
            setErrorMessage("Không thể tải danh sách sản phẩm. Vui lòng kiểm tra kết nối!");
        } finally {
            setLoading(false);
        }
    };

    // useEffect: Tự động chạy ngay khi màn hình vừa nạp xong
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadProducts();
    }, []);

    // Xử lý khi bấm nút Tìm kiếm
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchName.trim()) {
            loadProducts();
            return;
        }
        setLoading(true);
        setErrorMessage("");
        try {
            const response = await searchProducts(searchName.trim());
            setProducts(response.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setProducts([]); // Không tìm thấy sản phẩm nào
            } else {
                setErrorMessage("Lỗi khi tìm kiếm sản phẩm!");
            }
        } finally {
            setLoading(false);
        }
    };

    // Đặt lại tìm kiếm
    const handleResetSearch = () => {
        setSearchName("");
        loadProducts();
    };

    // Xử lý Xóa sản phẩm (CHỈ ADMIN MỚI ĐƯỢC PHÉP)
    const handleDelete = async (id, name) => {
        if (!isAdmin) {
            alert("Bạn không có quyền xóa sản phẩm này (Chỉ ADMIN mới có quyền xóa)!");
            return;
        }

        // Hiện hộp thoại xác nhận trước khi xóa
        if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" (ID: ${id})?`)) {
            try {
                await deleteProduct(id);
                alert("Xóa sản phẩm thành công!");
                loadProducts(); // Tải lại danh sách sau khi xóa
            } catch (err) {
                console.error(err);
                const msg = err.response?.data?.message || "Xóa sản phẩm thất bại!";
                alert(msg);
            }
        }
    };

    return (
        <div className="card">
            {/* Header của bảng: Hiển thị vai trò và nút Thêm sản phẩm */}
            <div className="card-head">
                <div>
                    <h2>Danh sách sản phẩm</h2>
                    <p className="card-subtitle">
                        Đang đăng nhập với vai trò:{" "}
                        <span className={`badge-role ${isAdmin ? "badge-admin" : "badge-user"}`}>
                            {user?.role || "GUEST"}
                        </span>
                        {" - "}
                        {isAdmin
                            ? "Toàn quyền: Xem, Thêm, Sửa, Xóa"
                            : "Chỉ được phép Xem thông tin sản phẩm"}
                    </p>
                </div>

                {/* CHỈ ADMIN MỚI THẤY NÚT THÊM SẢN PHẨM */}
                {isAdmin && (
                    <Link to="/products/add" className="btn btn-primary">
                        + Thêm sản phẩm
                    </Link>
                )}
            </div>

            {/* Thanh tìm kiếm sản phẩm */}
            <form onSubmit={handleSearch} className="search-bar">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm theo tên..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                    Tìm kiếm
                </button>
                {searchName && (
                    <button type="button" className="btn btn-soft" onClick={handleResetSearch}>
                        Đặt lại
                    </button>
                )}
            </form>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {/* Bảng dữ liệu sản phẩm */}
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: "60px" }}>ID</th>
                            <th>Tên sản phẩm</th>
                            <th className="num">Giá</th>
                            <th className="num">Số lượng</th>
                            <th style={{ width: isAdmin ? "200px" : "90px" }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="loading">
                                    Đang tải dữ liệu sản phẩm...
                                </td>
                            </tr>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td className="name">{product.name}</td>
                                    <td className="num">
                                        {product.price ? product.price.toLocaleString("vi-VN") : 0} ₫
                                    </td>
                                    <td className="num">{product.quantity}</td>
                                    <td className="actions">
                                        {/* TẤT CẢ MỌI NGƯỜI (USER VÀ ADMIN) ĐỀU CÓ NÚT XEM */}
                                        <Link to={`/products/${product.id}`} className="btn btn-soft">
                                            Xem
                                        </Link>

                                        {/* CHỈ ADMIN MỚI THẤY VÀ BẤM ĐƯỢC NÚT SỬA VÀ NÚT XÓA */}
                                        {isAdmin && (
                                            <>
                                                <Link
                                                    to={`/products/edit/${product.id}`}
                                                    className="btn btn-soft"
                                                >
                                                    Sửa
                                                </Link>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                >
                                                    Xóa
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="empty">
                                    Không tìm thấy sản phẩm nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductList;
