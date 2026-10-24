package com.example.shoptin.service;

import com.example.shoptin.entity.Product;
import com.example.shoptin.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * =========================================================================
 * FILE: ProductService.java
 * GÓI (PACKAGE): com.example.shoptin.service
 * NHIỆM VỤ: Lớp dịch vụ xử lý toàn bộ logic nghiệp vụ (Business Logic) liên quan đến Sản phẩm.
 * Đóng vai trò cầu nối trung gian giữa tầng Controller (nhận request) và tầng Repository (truy vấn DB).
 * 
 * GIẢI THÍCH KÝ HIỆU & ANNOTATION:
 * - @Service: Báo cho Spring Framework quản lý lớp này là một tầng nghiệp vụ (Business Layer Bean).
 * =========================================================================
 */
@Service
public class ProductService {

    // Khai báo biến repository final để đảm bảo tính bất biến (Immutability)
    private final ProductRepository productRepository;

    /**
     * CONSTRUCTOR TIÊM PHỤ THUỘC (Constructor Dependency Injection):
     * - Đây là cơ chế tiêm phụ thuộc được khuyến nghị hàng đầu trong Spring Framework hiện đại.
     * - Spring tự động tìm kiếm Bean ProductRepository và tiêm vào khi tạo ProductService.
     * 
     * @param productRepository đối tượng Repository để giao tiếp cơ sở dữ liệu
     */
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * 1. LẤY TOÀN BỘ DANH SÁCH SẢN PHẨM:
     * CÔNG THỨC: productRepository.findAll()
     * - Chạy câu lệnh SQL: SELECT * FROM products;
     * 
     * @return Danh sách tất cả sản phẩm List<Product>
     */
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    /**
     * 2. LẤY CHI TIẾT SẢN PHẨM THEO MÃ ID:
     * CÔNG THỨC: productRepository.findById(id).orElse(null)
     * - Chạy câu lệnh SQL: SELECT * FROM products WHERE id = ?;
     * - .orElse(null): Nếu tìm thấy thì trả về Product, nếu không tìm thấy thì trả về giá trị null an toàn (không bị văng lỗi).
     * 
     * @param id Mã định danh sản phẩm cần xem
     * @return Đối tượng Product hoặc null
     */
    public Product getById(Integer id) {
        return productRepository.findById(id).orElse(null);
    }

    /**
     * 3. THÊM MỚI SẢN PHẨM:
     * CÔNG THỨC: productRepository.save(product)
     * - Chạy câu lệnh SQL: INSERT INTO products (name, price, quantity, description, image_url) VALUES (...);
     * - Trả về đối tượng vừa lưu kèm theo ID mới được Database tự động sinh ra.
     * 
     * @param product Thông tin sản phẩm mới cần thêm
     * @return Sản phẩm sau khi đã lưu thành công
     */
    public Product create(Product product) {
        return productRepository.save(product);
    }

    /**
     * 4. CẬP NHẬT THÔNG TIN SẢN PHẨM THEO ID:
     * NGUYÊN LÝ HOẠT ĐỘNG:
     * Bước 1: Tìm sản phẩm cũ trong DB theo ID. Nếu không thấy -> trả về null.
     * Bước 2: Cập nhật các trường: tên, giá, số lượng, mô tả, link ảnh/Base64.
     * Bước 3: Gọi save(oldProduct) để chạy câu lệnh SQL:
     *         UPDATE products SET name = ?, price = ?, quantity = ?, description = ?, image_url = ? WHERE id = ?;
     * 
     * @param id Mã sản phẩm cần sửa
     * @param product Dữ liệu mới gửi lên
     * @return Sản phẩm sau khi cập nhật, hoặc null nếu không tìm thấy
     */
    public Product update(Integer id, Product product) {
        Product oldProduct = productRepository.findById(id).orElse(null);
        if (oldProduct == null) {
            return null; // Không tìm thấy sản phẩm cần cập nhật
        }
        oldProduct.setName(product.getName());
        oldProduct.setPrice(product.getPrice());
        oldProduct.setQuantity(product.getQuantity());
        oldProduct.setDescription(product.getDescription());
        oldProduct.setImageUrl(product.getImageUrl());
        return productRepository.save(oldProduct);
    }

    /**
     * 5. XÓA SẢN PHẨM THEO ID:
     * NGUYÊN LÝ HOẠT ĐỘNG:
     * Bước 1: Kiểm tra xem ID có tồn tại trong CSDL không bằng existsById(id).
     * Bước 2: Nếu không tồn tại -> trả về false.
     * Bước 3: Nếu có -> gọi deleteById(id) để chạy câu lệnh SQL:
     *         DELETE FROM products WHERE id = ?; và trả về true.
     * 
     * @param id Mã sản phẩm cần xóa
     * @return true nếu xóa thành công, false nếu không tìm thấy
     */
    public boolean delete(Integer id) {
        if (!productRepository.existsById(id)) {
            return false;
        }
        productRepository.deleteById(id);
        return true;
    }

    /**
     * 6. TÌM KIẾM SẢN PHẨM THEO TÊN:
     * CÔNG THỨC: findByNameContainingIgnoreCase(name)
     * - Tìm kiếm không phân biệt chữ hoa, chữ thường.
     * 
     * @param name Từ khóa tên sản phẩm
     * @return Danh sách sản phẩm thỏa mãn
     */
    public List<Product> search(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
}
