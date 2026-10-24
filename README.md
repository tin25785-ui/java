# Đồ Án Buổi 06 & 07: Xác Thực Phân Quyền JWT & Ứng Dụng SPA Quản Lý Sản Phẩm

- **Sinh viên thực hiện**: Nguyễn Trung Tín
- **Mã số sinh viên**: 2124110028
- **Tên dự án**: **shoptin**
- **Cấu trúc bố cục**: Được sắp xếp chuẩn 100% theo mẫu tham chiếu `MySQL/shop` của giảng viên.

---

## 📌 1. Giới Thiệu Dự Án

Dự án gồm 2 phần được phân chia rõ ràng:
1. **Backend (`shoptin`)**: RESTful API xây dựng bằng **Spring Boot 4 / Java 25**, xác thực và phân quyền bằng **JWT (JSON Web Token)** với **Spring Security 6**, hỗ trợ cả **SQLite** (chạy ngay) và **MySQL** (khi có CSDL).
2. **Frontend (`shop-client`)**: Giao diện **Single Page Application (SPA)** viết bằng **ReactJS (Vite)**, **Axios**, **React Router DOM**.

---

## 🔐 2. Phân Quyền & Tài Khoản Mặc Định

Dữ liệu mẫu được tự động khởi tạo khi chạy server:

| Username | Password | Quyền (Role) | Chức năng được phép |
| :--- | :--- | :--- | :--- |
| **`admin`** | `123456` | `ADMIN` | Xem danh sách, Chi tiết, Thêm mới, Sửa, Xóa sản phẩm |
| **`user`** | `123456` | `USER` | Chỉ xem danh sách và xem chi tiết sản phẩm |

---

## 🚀 3. Hướng Dẫn Khởi Chạy

### A. Chạy Backend (Spring Boot - Port 8080)
```bash
cd shoptin
./mvnw spring-boot:run
```
- API chạy tại: `http://localhost:8080`

### B. Chạy Frontend (React Vite - Port 5173)
```bash
cd shop-client
npm install
npm run dev
```
- Truy cập trình duyệt: `http://localhost:5173`

---

## 📂 4. Cấu Trúc Bố Cục Thư Mục Chuẩn

```text
d:\buoi4_nguyentrungtin_2124110028/
│
├── shoptin/                                         # Backend Spring Boot (giữ tên shoptin)
│   ├── src/main/java/com/example/shoptin/
│   │   ├── ShoptinApplication.java                  # File chạy chính + nạp dữ liệu mẫu
│   │   ├── controller/
│   │   │   ├── AuthController.java                  # Đăng nhập (/api/auth/login)
│   │   │   ├── HomeController.java                  # Trang chủ ("/")
│   │   │   └── ProductController.java               # CRUD & Tìm kiếm sản phẩm
│   │   ├── entity/
│   │   │   ├── Product.java                         # Thực thể bảng products
│   │   │   └── User.java                            # Thực thể bảng users
│   │   ├── repository/
│   │   │   ├── ProductRepository.java               # Giao tiếp bảng products
│   │   │   └── UserRepository.java                  # Giao tiếp bảng users
│   │   ├── security/
│   │   │   ├── JwtFilter.java                       # Bộ lọc giải mã JWT
│   │   │   └── SecurityConfig.java                  # Cấu hình Security & CORS
│   │   └── service/
│   │       ├── JwtService.java                      # Xử lý tạo và giải mã JWT
│   │       └── ProductService.java                  # Nghiệp vụ sản phẩm
│   ├── src/main/resources/
│   │   └── application.properties                   # Cấu hình cổng 8080, SQLite / MySQL
│   └── pom.xml
│
└── shop-client/                                     # Frontend React (SPA)
    ├── src/
    │   ├── assets/                                  # Hình ảnh & icon
    │   ├── components/
    │   │   └── ProductForm.jsx
    │   ├── pages/
    │   │   ├── Login.jsx                            # Trang đăng nhập
    │   │   ├── ProductList.jsx                      # Danh sách sản phẩm
    │   │   ├── ProductDetail.jsx                    # Chi tiết sản phẩm
    │   │   ├── ProductAdd.jsx                       # Thêm sản phẩm (ADMIN)
    │   │   └── ProductEdit.jsx                      # Sửa sản phẩm (ADMIN)
    │   ├── services/
    │   │   ├── authService.js                       # Quản lý token, role, logout
    │   │   └── productService.js                    # Gọi API sản phẩm với Axios
    │   ├── App.css
    │   ├── App.jsx                                  # Header & Điều hướng Routes
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```
