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
 * NHIỆM VỤ: RESTful API CRUD Quản lý sản phẩm.
 * PHÂN QUYỀN (kết hợp với SecurityConfig):
 *   - GET  /api/products/** : Cho phép cả USER và ADMIN đều được xem.
 *   - POST /api/products    : CHỈ ADMIN mới được thêm (USER bị 403 Forbidden).
 *   - PUT  /api/products/{id}: CHỈ ADMIN mới được sửa (USER bị 403 Forbidden).
 *   - DELETE /api/products/{id}: CHỈ ADMIN mới được xóa (USER bị 403 Forbidden).
 * =========================================================================
 */
@CrossOrigin(origins = "http://localhost:5173") // Mở cổng kết nối cho React
@RestController                                 // Tiếp nhận REST API và tự động trả về định dạng JSON
@RequestMapping("/api/products")                // Tiền tố đường dẫn chung của sản phẩm
public class ProductController {

    private static final String NOT_FOUND_MSG = "Không tìm thấy sản phẩm";

    // Tiêm ProductService để xử lý các logic nghiệp vụ
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * 1. GET /api/products
     * Xem toàn bộ danh sách sản phẩm (USER và ADMIN đều xem được)
     */
    @GetMapping
    public List<Product> getAll() {
        return productService.getAll();
    }

    /**
     * 2. GET /api/products/search?name=laptop
     * Tìm kiếm sản phẩm theo tên qua tham số @RequestParam
     */
    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String name) {
        List<Product> products = productService.search(name);
        if (products == null || products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(NOT_FOUND_MSG);
        }
        return ResponseEntity.ok(products);
    }

    /**
     * 3. GET /api/products/{id}
     * Xem chi tiết 1 sản phẩm theo mã ID qua @PathVariable
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Product product = productService.getById(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(NOT_FOUND_MSG);
        }
        return ResponseEntity.ok(product);
    }

    /**
     * 4. POST /api/products
     * Thêm sản phẩm mới (CHỈ DÀNH RIÊNG CHO ADMIN)
     * Trả về mã HTTP 201 Created khi thành công.
     */
    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product product) {
        product.setId(null); // Luôn bỏ qua id nếu client truyền lên để database tự sinh tăng dần
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(product));
    }

    /**
     * 5. PUT /api/products/{id}
     * Cập nhật thông tin sản phẩm theo mã ID (CHỈ DÀNH RIÊNG CHO ADMIN)
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Product product) {
        Product updated = productService.update(id, product);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(NOT_FOUND_MSG);
        }
        return ResponseEntity.ok(updated);
    }

    /**
     * 6. DELETE /api/products/{id}
     * Xóa sản phẩm theo mã ID (CHỈ DÀNH RIÊNG CHO ADMIN)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        if (productService.delete(id)) {
            return ResponseEntity.ok("Xóa sản phẩm thành công");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(NOT_FOUND_MSG);
    }
}
