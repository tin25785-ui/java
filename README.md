# Đồ Án Buổi 06 & 07: Xác Thực Phân Quyền JWT & Ứng Dụng SPA Quản Lý Sản Phẩm

- **Sinh viên thực hiện**: Nguyễn Trung Tín
- **Mã số sinh viên**: 2124110028
- **Môn học**: Lập trình Java Web / Công nghệ phần mềm

---

## 📌 1. Giới Thiệu Dự Án

Dự án hoàn chỉnh gồm 2 phần:
1. **Backend (`shoptin`)**: RESTful API xây dựng bằng **Spring Boot 4 / Java 25**, tích hợp **Spring Security 6**, xác thực và phân quyền bằng **JWT (JSON Web Token)**, cơ sở dữ liệu **SQLite/JPA**.
2. **Frontend (`shop-client`)**: Giao diện **Single Page Application (SPA)** viết bằng **ReactJS (Vite)**, thư viện **Axios** (có interceptor tự động gắn Bearer Token), **React Router DOM**, thiết kế giao diện hiện đại với CSS Responsive.

---

## 🔐 2. Phân Quyền & Tài Khoản Mặc Định

Hệ thống tự động khởi tạo dữ liệu mẫu khi khởi động (`DataSeeder.java`):

| Username | Password | Quyền (Role) | Chức năng được phép |
| :--- | :--- | :--- | :--- |
| **`admin`** | `admin123` | `ROLE_ADMIN` | Xem danh sách, Chi tiết, Thêm mới, Sửa, Xóa sản phẩm |
| **`user`** | `user123` | `ROLE_USER` | Chỉ xem danh sách và xem chi tiết sản phẩm |

---

## 🚀 3. Hướng Dẫn Chạy Dự Án

### A. Chạy Backend (Spring Boot - Port 8080)
```bash
cd shoptin
./mvnw spring-boot:run
```
- API chạy tại: `http://localhost:8080`
- File Postman Collection để test API: `shoptin/Shoptin.postman_collection.json`

### B. Chạy Frontend (React Vite - Port 5173)
```bash
cd shop-client
npm install
npm run dev
```
- Truy cập trình duyệt: `http://localhost:5173`

---

## 📂 4. Cấu Trúc Thư Mục

```text
├── shoptin/                         # Backend Spring Boot
│   ├── src/main/java/com/example/shoptin/
│   │   ├── config/                  # Cấu hình Security, JWT, Seeder
│   │   │   ├── DataSeeder.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── JwtUtil.java
│   │   │   └── SecurityConfig.java
│   │   ├── controller/              # AuthController, ProductController
│   │   ├── dto/                     # LoginRequest, LoginResponse, UserDto
│   │   ├── entity/                  # User, Product
│   │   ├── repository/              # UserRepository, ProductRepository
│   │   └── service/                 # ProductService
│   └── Shoptin.postman_collection.json
│
└── shop-client/                     # Frontend React (SPA)
    ├── src/
    │   ├── components/              # Header, ProtectedRoute, ProductForm
    │   ├── context/                 # AuthContext
    │   ├── pages/                   # Login, ProductList, Detail, Add, Edit
    │   └── services/                # api.js (Axios), authService, productService
```
