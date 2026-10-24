package com.example.shoptin.service;

import com.example.shoptin.entity.Product;
import com.example.shoptin.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * =========================================================================
 * SERVICE: ProductService
 * Nhiệm vụ: Xử lý nghiệp vụ logic cho sản phẩm:
 * - getAll: Lấy tất cả danh sách sản phẩm
 * - getById: Lấy chi tiết sản phẩm theo id
 * - create: Thêm mới sản phẩm
 * - update: Cập nhật thông tin sản phẩm
 * - delete: Xóa sản phẩm
 * - search: Tìm kiếm sản phẩm theo tên
 * =========================================================================
 */
@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // 1. LẤY TẤT CẢ SẢN PHẨM
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    // 2. LẤY CHI TIẾT SẢN PHẨM THEO ID
    public Product getById(Integer id) {
        return productRepository.findById(id).orElse(null);
    }

    // 3. THÊM MỚI SẢN PHẨM
    public Product create(Product product) {
        return productRepository.save(product);
    }

    // 4. CẬP NHẬT SẢN PHẨM THEO ID
    public Product update(Integer id, Product product) {
        Product oldProduct = productRepository.findById(id).orElse(null);
        if (oldProduct == null) {
            return null;
        }
        oldProduct.setName(product.getName());
        oldProduct.setPrice(product.getPrice());
        oldProduct.setQuantity(product.getQuantity());
        oldProduct.setDescription(product.getDescription());
        return productRepository.save(oldProduct);
    }

    // 5. XÓA SẢN PHẨM THEO ID
    public boolean delete(Integer id) {
        if (!productRepository.existsById(id)) {
            return false;
        }
        productRepository.deleteById(id);
        return true;
    }

    // 6. TÌM KIẾM SẢN PHẨM THEO TÊN
    public List<Product> search(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
}
