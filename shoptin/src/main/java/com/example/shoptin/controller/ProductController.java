package com.example.shoptin.controller;

import com.example.shoptin.entity.Product;
import com.example.shoptin.service.ProductService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * =========================================================================
 * FILE: ProductController.java
 * GÓI (PACKAGE): com.example.shoptin.controller
 * NHIỆM VỤ: REST Controller tiếp nhận và xử lý toàn bộ các yêu cầu HTTP liên quan đến Sản phẩm.
 * 
 * GIẢI THÍCH KÝ HIỆU & ANNOTATION:
 * - @RestController: Đánh dấu Controller trả về trực tiếp dữ liệu JSON.
 * - @RequestMapping("/api/products"): Định nghĩa tiền tố đường dẫn chung cho toàn bộ các API sản phẩm.
 * - @CrossOrigin(origins = "http://localhost:5173"): Cho phép ứng dụng React gọi API.
 * - @GetMapping: Ánh xạ yêu cầu phương thức HTTP GET (Đọc/Lấy dữ liệu).
 * - @PostMapping: Ánh xạ yêu cầu phương thức HTTP POST (Tạo mới dữ liệu).
 * - @PutMapping: Ánh xạ yêu cầu phương thức HTTP PUT (Cập nhật dữ liệu).
 * - @DeleteMapping: Ánh xạ yêu cầu phương thức HTTP DELETE (Xóa dữ liệu).
 * - @PathVariable: Lấy giá trị biến nằm trực tiếp trên đường dẫn URL (ví dụ: /{id} -> @PathVariable Integer id).
 * - @RequestParam: Lấy tham số truy vấn nằm sau dấu hỏi chấm trên URL (ví dụ: /search?name=laptop -> @RequestParam String name).
 * - @RequestBody: Tự động chuyển đổi chuỗi JSON từ Client gửi lên thành đối tượng Java Product.
 * - ResponseEntity<?>: Lớp tiện ích của Spring để đóng gói dữ liệu phản hồi kèm theo mã trạng thái HTTP (200 OK, 404 NOT FOUND,...).
 * =========================================================================
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    /**
     * Tiêm ProductService thông qua Constructor Injection
     */
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * 1. LẤY TOÀN BỘ DANH SÁCH SẢN PHẨM:
     * Endpoint: GET http://localhost:8080/api/products
     * Quyền hạn: Cho phép cả USER và ADMIN
     * 
     * @return Danh sách sản phẩm dưới dạng mảng JSON [ { ... }, { ... } ]
     */
    @GetMapping
    public List<Product> getAll() {
        return productService.getAll();
    }

    /**
     * 2. TÌM KIẾM SẢN PHẨM THEO TÊN:
     * Endpoint: GET http://localhost:8080/api/products/search?name=...
     * Quyền hạn: Cho phép cả USER và ADMIN
     * 
     * NGUYÊN LÝ HOẠT ĐỘNG:
     * - @RequestParam String name: Lấy từ khóa 'name' từ query parameter.
     * - Nếu danh sách rỗng (không thấy): Trả về HTTP Status 404 NOT_FOUND kèm chuỗi thông báo "Không tìm thấy sản phẩm".
     * - Nếu tìm thấy: Trả về HTTP Status 200 OK kèm danh sách kết quả.
     * 
     * @param name Từ khóa tìm kiếm
     * @return ResponseEntity chứa danh sách sản phẩm hoặc thông báo 404
     */
    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String name) {
        List<Product> products = productService.search(name);
        
        // Kiểm tra nếu danh sách trống (không tìm thấy sản phẩm nào)
        if (products == null || products.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND) // Trả về mã HTTP 404
                    .body("Không tìm thấy sản phẩm"); // Trả về thông báo lỗi
        }
        
        // Nếu tìm thấy, trả về danh sách sản phẩm kèm HTTP 200 OK
        return ResponseEntity.ok(products);
    }    

    /**
     * 3. XEM CHI TIẾT SẢN PHẨM THEO MÃ ID:
     * Endpoint: GET http://localhost:8080/api/products/{id}
     * Quyền hạn: Cho phép cả USER và ADMIN
     * 
     * @param id Mã sản phẩm cần xem chi tiết
     * @return Thông tin chi tiết sản phẩm kèm HTTP 200 OK hoặc báo 404 nếu không tìm thấy
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Product product = productService.getById(id);

        if (product == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy sản phẩm");
        }

        return ResponseEntity.ok(product);
    }

    /**
     * 4. THÊM MỚI SẢN PHẨM:
     * Endpoint: POST http://localhost:8080/api/products
     * Quyền hạn: BẮT BUỘC QUYỀN ADMIN (SecurityConfig chặn nếu là USER)
     * 
     * @param product Dữ liệu sản phẩm mới dạng JSON gửi trong Request Body
     * @return Sản phẩm sau khi thêm thành công kèm mã ID vừa sinh
     */
    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.create(product);
    }

    /**
     * 5. CẬP NHẬT SẢN PHẨM THEO ID:
     * Endpoint: PUT http://localhost:8080/api/products/{id}
     * Quyền hạn: BẮT BUỘC QUYỀN ADMIN
     * 
     * @param id Mã sản phẩm cần cập nhật
     * @param product Thông tin mới cần lưu
     * @return Sản phẩm sau khi đã cập nhật
     */
    @PutMapping("/{id}")
    public Product update(
            @PathVariable Integer id,
            @RequestBody Product product) {
        return productService.update(id, product);
    }

    /**
     * 6. XÓA SẢN PHẨM THEO ID:
     * Endpoint: DELETE http://localhost:8080/api/products/{id}
     * Quyền hạn: BẮT BUỘC QUYỀN ADMIN
     * 
     * @param id Mã sản phẩm cần xóa
     * @return Chuỗi thông báo kết quả: "Xóa sản phẩm thành công" hoặc "Không tìm thấy sản phẩm"
     */
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        if (productService.delete(id)) {
            return "Xóa sản phẩm thành công";
        }
        return "Không tìm thấy sản phẩm";
    }
}
