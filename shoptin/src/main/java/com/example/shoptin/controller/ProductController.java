package com.example.shoptin.controller;

import com.example.shoptin.entity.Product;
import com.example.shoptin.service.ProductService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * =========================================================================
 * CONTROLLER: ProductController
 * Nhiệm vụ: Tiếp nhận và xử lý các yêu cầu HTTP liên quan đến Sản phẩm (/api/products):
 * 1. GET /api/products : Lấy danh sách tất cả sản phẩm
 * 2. GET /api/products/search?name=... : Tìm kiếm sản phẩm theo tên
 * 3. GET /api/products/{id} : Xem chi tiết 1 sản phẩm
 * 4. POST /api/products : Thêm sản phẩm mới (Yêu cầu ADMIN)
 * 5. PUT /api/products/{id} : Sửa sản phẩm (Yêu cầu ADMIN)
 * 6. DELETE /api/products/{id} : Xóa sản phẩm (Yêu cầu ADMIN)
 * =========================================================================
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // 1. LẤY TẤT CẢ SẢN PHẨM
    @GetMapping
    public List<Product> getAll() {
        return productService.getAll();
    }

    // 2. TÌM KIẾM SẢN PHẨM THEO TÊN
    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String name) {
        List<Product> products = productService.search(name);
        
        // Kiểm tra nếu danh sách trống (không tìm thấy sản phẩm nào)
        if (products == null || products.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND) // Trả về HTTP 404
                    .body("Không tìm thấy sản phẩm"); // Trả về chuỗi thông báo
        }
        
        // Nếu tìm thấy, trả về danh sách sản phẩm kèm HTTP 200 OK
        return ResponseEntity.ok(products);
    }    

    // 3. XEM CHI TIẾT SẢN PHẨM THEO ID
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

    // 4. THÊM MỚI SẢN PHẨM (Yêu cầu quyền ADMIN)
    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.create(product);
    }

    // 5. CẬP NHẬT SẢN PHẨM (Yêu cầu quyền ADMIN)
    @PutMapping("/{id}")
    public Product update(
            @PathVariable Integer id,
            @RequestBody Product product) {
        return productService.update(id, product);
    }

    // 6. XÓA SẢN PHẨM (Yêu cầu quyền ADMIN)
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        if (productService.delete(id)) {
            return "Xóa sản phẩm thành công";
        }
        return "Không tìm thấy sản phẩm";
    }
}
