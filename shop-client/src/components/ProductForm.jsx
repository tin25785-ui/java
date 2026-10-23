/**
 * =========================================================================
 * FILE: ProductForm.jsx
 * NHIỆM VỤ: Form nhập liệu dùng chung cho cả trang Thêm mới và Sửa sản phẩm.
 * THAM SỐ TRUYỀN VÀO (PROPS):
 *   - product    : Đối tượng sản phẩm { name, price, quantity, description }
 *   - onChange   : Hàm bắt sự kiện khi người dùng gõ vào các ô input
 *   - onSubmit   : Hàm xử lý khi bấm nút gửi form
 *   - submitLabel: Nhãn chữ hiển thị trên nút bấm ("Thêm sản phẩm" hoặc "Cập nhật")
 * =========================================================================
 */
function ProductForm({ product, onChange, onSubmit, submitLabel }) {
    return (
        <form className="form" onSubmit={onSubmit}>
            {/* Ô nhập tên sản phẩm */}
            <div className="field">
                <label htmlFor="name">Tên sản phẩm</label>
                <input id="name" name="name" value={product.name} onChange={onChange} required />
            </div>

            {/* Hàng ngang chứa Giá và Số lượng */}
            <div className="field-row">
                <div className="field">
                    <label htmlFor="price">Giá (₫)</label>
                    <input id="price" name="price" type="number" min="0" value={product.price} onChange={onChange} required />
                </div>
                <div className="field">
                    <label htmlFor="quantity">Số lượng</label>
                    <input id="quantity" name="quantity" type="number" min="0" value={product.quantity} onChange={onChange} required />
                </div>
            </div>

            {/* Ô nhập mô tả sản phẩm */}
            <div className="field">
                <label htmlFor="description">Mô tả</label>
                <textarea id="description" name="description" rows="3" value={product.description} onChange={onChange} />
            </div>

            {/* Nút bấm Submit form */}
            <button type="submit" className="btn btn-primary">{submitLabel}</button>
        </form>
    );
}

export default ProductForm;
