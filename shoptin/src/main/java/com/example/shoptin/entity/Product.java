package com.example.shoptin.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * =========================================================================
 * FILE: Product.java
 * NHIỆM VỤ: Thực thể (Entity) đại diện cho bảng "products" dưới cơ sở dữ liệu.
 * CÁC CỘT:
 *   - id          : Khóa chính tự tăng (Primary Key)
 *   - name        : Tên sản phẩm
 *   - price       : Giá bán (kiểu số thực double)
 *   - quantity    : Số lượng tồn kho (kiểu số nguyên int)
 *   - description : Mô tả thông tin chi tiết của sản phẩm
 * =========================================================================
 */
@Entity             // Khai báo cho Hibernate biết class này tương ứng với 1 bảng dữ liệu
@Table(name = "products") // Chỉ định tên bảng dưới database là "products"
public class Product {

    // 1. KHÓA CHÍNH: Tự động tăng số 1, 2, 3... do database sinh ra
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 2. CÁC THUỘC TÍNH SẢN PHẨM
    private String name;        // Tên sản phẩm
    private double price;       // Giá bán của sản phẩm
    private int quantity;       // Số lượng sản phẩm trong kho
    private String description; // Mô tả thông tin chi tiết của sản phẩm

    // 3. CONSTRUCTOR MẶC ĐỊNH (Không tham số)
    // Bắt buộc phải có để JPA/Hibernate có thể tự động tạo Object khi truy vấn dữ liệu từ DB
    public Product() {
    }

    // 4. HÀM GETTER / SETTER CHO ID
    public Integer getId() {
        return id; // Lấy mã ID sản phẩm
    }

    public void setId(Integer id) {
        this.id = id; // Gán mã ID cho sản phẩm
    }

    // 5. HÀM GETTER / SETTER CHO NAME
    public String getName() {
        return name; // Lấy tên sản phẩm
    }

    public void setName(String name) {
        this.name = name; // Gán tên sản phẩm
    }

    // 6. HÀM GETTER / SETTER CHO PRICE
    public double getPrice() {
        return price; // Lấy giá bán sản phẩm
    }

    public void setPrice(double price) {
        this.price = price; // Gán giá bán sản phẩm
    }

    // 7. HÀM GETTER / SETTER CHO QUANTITY
    public int getQuantity() {
        return quantity; // Lấy số lượng tồn kho
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity; // Gán số lượng tồn kho
    }

    // 8. HÀM GETTER / SETTER CHO DESCRIPTION
    public String getDescription() {
        return description; // Lấy mô tả sản phẩm
    }

    public void setDescription(String description) {
        this.description = description; // Gán mô tả sản phẩm
    }
}
