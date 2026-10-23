# Shoptin - Bài Tập Buổi 06, 07 (JWT & Phân Quyền)

**Học phần:** LẬP TRÌNH JAVA  
**Sinh viên:** Nguyễn Trung Tín - 2124110028  
**Công nghệ:** Spring Boot + Spring Security + JJWT + SQLite / MySQL + React SPA  

---

## 1. Mục tiêu & Tính năng đã hoàn thành
- ✅ **Xác thực người dùng bằng JWT (JSON Web Token)**: Tạo token khi login, truyền Bearer token qua header `Authorization`.
- ✅ **Phân quyền 2 nhóm tài khoản**:
  - **`ADMIN`**: Toàn quyền **Xem, Thêm, Sửa, Xóa** sản phẩm.
  - **`USER`**: **Chỉ được Xem** sản phẩm. Mọi thao tác Thêm, Sửa, Xóa bị từ chối với mã lỗi `403 Forbidden`.
- ✅ **Bảo mật Spring Security**: Stateless session, lọc xác thực JWT qua `OncePerRequestFilter`, phân quyền URL rõ ràng.
- ✅ **Lưu trữ dữ liệu**: Sử dụng SQLite (`shoptin.db`) tiện lợi, không phụ thuộc service ngoài, tự động khởi tạo bảng `users` và `products`.
- ✅ **Tích hợp SPA ReactJS**: Giao diện đẹp, tự động gửi token, phân quyền giao diện (ẩn các nút thêm/sửa/xóa khi đăng nhập bằng tài khoản USER).
- ✅ **Kiểm thử đầy đủ với Postman Collection**: Tự động lưu token sau khi đăng nhập để kiểm thử nhanh.

---

## 2. Tài khoản thử nghiệm mặc định
Hệ thống tự động khởi tạo 2 tài khoản mẫu trong cơ sở dữ liệu (`DataSeeder`):

| Loại tài khoản | Username | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (ADMIN)** | `admin` | `admin123` | **Xem, Thêm, Sửa, Xóa** sản phẩm |
| **Khách hàng (USER)** | `user` | `user123` | **Chỉ Xem** sản phẩm |

---

## 3. Danh sách RESTful API (`http://localhost:8080`)

| Method | Endpoint | Quyền truy cập | Mô tả |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Công khai (Public) | Đăng nhập nhận JWT Token và thông tin user |
| `GET` | `/api/auth/me` | USER, ADMIN | Lấy thông tin tài khoản đang đăng nhập |
| `GET` | `/api/products` | USER, ADMIN | Xem toàn bộ danh sách sản phẩm |
| `GET` | `/api/products/{id}` | USER, ADMIN | Xem chi tiết 1 sản phẩm |
| `GET` | `/api/products/search?name=...` | USER, ADMIN | Tìm kiếm sản phẩm theo tên |
| `POST` | `/api/products` | **Chỉ ADMIN** (USER gọi bị `403 Forbidden`) | Thêm sản phẩm mới |
| `PUT` | `/api/products/{id}` | **Chỉ ADMIN** (USER gọi bị `403 Forbidden`) | Cập nhật thông tin sản phẩm |
| `DELETE`| `/api/products/{id}` | **Chỉ ADMIN** (USER gọi bị `403 Forbidden`) | Xóa sản phẩm |

---

## 4. Hướng dẫn chạy chương trình

### 4.1. Khởi chạy Backend (Spring Boot)
1. Mở terminal tại thư mục `shoptin`:
   ```bash
   cd d:\buoi4_nguyentrungtin_2124110028\shoptin
   .\mvnw.cmd spring-boot:run
   ```
2. Backend chạy tại: `http://localhost:8080`.

### 4.2. Khởi chạy Frontend (ReactJS SPA)
1. Mở terminal tại thư mục `shop-client`:
   ```bash
   cd d:\buoi4_nguyentrungtin_2124110028\shop-client
   npm run dev
   ```
2. Frontend chạy tại: `http://localhost:5173`.
3. Mở trình duyệt và truy cập `http://localhost:5173`:
   - Bấm nút đăng nhập nhanh **ADMIN** (`admin` / `admin123`) để trải nghiệm thêm, sửa, xóa sản phẩm.
   - Bấm nút đăng nhập nhanh **USER** (`user` / `user123`) để trải nghiệm chế độ chỉ xem sản phẩm (nút thêm, sửa, xóa sẽ bị ẩn và bảo vệ).

---

## 5. Kiểm thử bằng Postman
1. Mở ứng dụng **Postman**.
2. Chọn **Import** -> chọn file [`Shoptin.postman_collection.json`](file:///d:/buoi4_nguyentrungtin_2124110028/shoptin/Shoptin.postman_collection.json).
3. Chạy theo thứ tự:
   - **1.1 Đăng nhập ADMIN**: Tự động lưu `admin_token`.
   - **1.2 Đăng nhập USER**: Tự động lưu `user_token`.
   - **2.1 - 2.4**: Kiểm tra chức năng xem danh sách và chi tiết.
   - **2.5**: Thử gọi API khi chưa có Token -> nhận về `401 Unauthorized`.
   - **3.1 - 3.2**: Thử thêm sản phẩm (ADMIN thành công `201`, USER bị chặn `403 Forbidden`).
   - **4.1 - 4.2**: Thử sửa sản phẩm (ADMIN thành công `200`, USER bị chặn `403 Forbidden`).
   - **5.1 - 5.2**: Thử xóa sản phẩm (USER bị chặn `403 Forbidden`, ADMIN thành công `200`).
