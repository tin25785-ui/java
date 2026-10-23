package com.example.shoptin.service;

import com.example.shoptin.entity.Product;
import com.example.shoptin.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * =========================================================================
 * FILE: ProductService.java
 * NHIỆM VỤ: Tầng xử lý nghiệp vụ (Business Logic) cho các chức năng quản lý sản phẩm.
 * =========================================================================
 */
@Service // Đánh dấu đây là tầng Service được Spring Boot quản lý
public class ProductService {

    // Khai báo biến Repository để giao tiếp với bảng products dưới cơ sở dữ liệu
    private final ProductRepository productRepository;

    // Constructor: Tiêm (Inject) ProductRepository tự động từ Spring
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository; // Gán đối tượng vào biến nội bộ
    }

    /**
     * 1. HÀM LẤY TOÀN BỘ SẢN PHẨM:
     * Gọi hàm findAll() của JpaRepository để lấy danh sách tất cả sản phẩm trong database.
     */
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    /**
     * 2. HÀM LẤY 1 SẢN PHẨM THEO MÃ ID:
     * Dùng findById(id). Nếu tìm thấy thì trả về Product, không tìm thấy thì trả về null.
     */
    public Product getById(Integer id) {
        return productRepository.findById(id).orElse(null);
    }

    /**
     * 3. HÀM TẠO MỚI SẢN PHẨM:
     * Nhận đối tượng Product mới và gọi hàm save() để lưu bản ghi mới xuống SQLite.
     */
    public Product create(Product product) {
        return productRepository.save(product);
    }

    /**
     * 4. HÀM CẬP NHẬT THÔNG TIN SẢN PHẨM:
     * Tìm sản phẩm cũ theo ID. Nếu không có trả về null.
     * Nếu có, cập nhật lại tên, giá, số lượng, mô tả và lưu đè lại vào database.
     */
    public Product update(Integer id, Product product) {
        // Tìm bản ghi sản phẩm cũ trong database
        Product oldProduct = productRepository.findById(id).orElse(null);
        if (oldProduct == null) {
            return null; // Không tìm thấy sản phẩm cần cập nhật
        }
        // Gán các thông tin mới từ client truyền lên
        oldProduct.setName(product.getName());                 // Cập nhật tên mới
        oldProduct.setPrice(product.getPrice());               // Cập nhật giá mới
        oldProduct.setQuantity(product.getQuantity());         // Cập nhật số lượng mới
        oldProduct.setDescription(product.getDescription());   // Cập nhật mô tả mới
        // Lưu lại bản ghi đã chỉnh sửa xuống database
        return productRepository.save(oldProduct);
    }

    /**
     * 5. HÀM XÓA SẢN PHẨM THEO ID:
     * Kiểm tra xem ID có tồn tại trong database không:
     * - Nếu không tồn tại: Trả về false.
     * - Nếu tồn tại: Gọi deleteById(id) để xóa và trả về true.
     */
    public boolean delete(Integer id) {
        if (!productRepository.existsById(id)) {
            return false; // Không tồn tại ID này để xóa
        }
        productRepository.deleteById(id); // Thực thi lệnh xóa
        return true;                      // Xóa thành công
    }

    /**
     * 6. HÀM TÌM KIẾM SẢN PHẨM THEO TÊN:
     * Gọi hàm findByNameContainingIgnoreCase trong ProductRepository để tìm kiếm.
     */
    public List<Product> search(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
}
