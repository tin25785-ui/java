# Shop Client - ReactJS SPA (Buổi 06, 07)

Giao diện Single Page Application (SPA) viết bằng **React 19 + Vite + React Router + Axios**.

## Các tính năng chính:
- **Đăng nhập xác thực JWT**: Lưu trữ token vào `localStorage`, tự động đính kèm vào header `Authorization: Bearer <token>` qua Axios Interceptor.
- **Phân quyền người dùng (Role-based Authorization)**:
  - Tài khoản **ADMIN**: Hiển thị nút "Thêm sản phẩm", các nút "Sửa" và "Xóa" trên danh sách, cho phép truy cập trang thêm/sửa sản phẩm.
  - Tài khoản **USER**: Chỉ có quyền xem sản phẩm và chi tiết sản phẩm. Các nút thêm/sửa/xóa được ẩn, các trang thêm/sửa được bảo vệ bằng `ProtectedRoute` (nếu cố tình vào link trực tiếp sẽ bị từ chối).
- **Hỗ trợ Đăng nhập Nhanh**: Trên trang Login có sẵn 2 nút nạp thông tin tài khoản mẫu (`admin` / `admin123` và `user` / `user123`) giúp kiểm thử và chấm bài thuận tiện nhất.
- **Tìm kiếm sản phẩm**: Tìm kiếm trực tiếp theo tên sản phẩm.
- **Header điều hướng**: Hiển thị huy hiệu vai trò `[ADMIN]` / `[USER]`, họ tên người dùng và nút Đăng xuất.

## Cài đặt & Khởi chạy:
```bash
cd shop-client
npm install
npm run dev
```
Truy cập: `http://localhost:5173`
