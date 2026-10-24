package com.example.shoptin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

/**
 * =========================================================================
 * FILE: Product.java
 * GÓI (PACKAGE): com.example.shoptin.entity
 * NHIỆM VỤ: Lớp thực thể (Entity) đại diện cho bảng "products" dưới cơ sở dữ liệu.
 * 
 * GIẢI THÍCH KÝ HIỆU & ANNOTATION:
 * - @Entity: Khai báo lớp này là một thực thể CSDL quản lý bởi JPA / Hibernate ORM.
 * - @Table(name = "products"): Chỉ định tên bảng trong cơ sở dữ liệu là "products".
 * - @Id: Xác định trường thuộc tính 'id' là KHÓA CHÍNH (Primary Key).
 * - @GeneratedValue(strategy = GenerationType.IDENTITY): Tự động tăng giá trị ID theo từng bản ghi (1, 2, 3...) ở tầng Database.
 * - @Lob (Large Object): Báo cho JPA biết trường dữ liệu này lưu trữ nội dung có kích thước lớn.
 * - @Column(columnDefinition = "TEXT"): Định dạng cột trong DB là kiểu TEXT (chuỗi dài vô hạn),
 *   giúp hỗ trợ lưu trữ cả đường link URL dài lẫn chuỗi ảnh Base64 nén từ máy tính người dùng.
 * =========================================================================
 */
@Entity
@Table(name = "products")
public class Product {

    // 1. KHÓA CHÍNH: Kiểu Integer tự tăng (1, 2, 3...)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 2. TÊN SẢN PHẨM: Kiểu chuỗi ký tự String
    private String name;

    // 3. ĐƠN GIÁ: Kiểu số thực dấu phẩy động double (đơn vị: VNĐ)
    private double price;

    // 4. SỐ LƯỢNG TỒN KHO: Kiểu số nguyên int
    private int quantity;

    // 5. MÔ TẢ CHI TIẾT: Kiểu String lưu trữ đặc điểm, cấu hình, xuất xứ sản phẩm
    private String description;

    // 6. HÌNH ẢNH SẢN PHẨM: Kiểu TEXT hỗ trợ link Web URL hoặc ảnh Base64 chọn từ máy tính
    @Lob
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    /**
     * CONSTRUCTOR MẶC ĐỊNH (Không tham số):
     * - Bắt buộc phải có để JPA/Hibernate tự động tạo đối tượng khi thực thi câu lệnh SQL SELECT.
     */
    public Product() {
    }

    /**
     * CONSTRUCTOR ĐẦY ĐỦ THAM SỐ:
     * - Giúp tạo nhanh một đối tượng Product khi cần thêm mới.
     * 
     * @param name Tên sản phẩm
     * @param price Đơn giá
     * @param quantity Số lượng tồn kho
     * @param description Mô tả
     * @param imageUrl Link ảnh hoặc chuỗi Base64
     */
    public Product(String name, double price, int quantity, String description, String imageUrl) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    // =========================================================================
    // CÁC HÀM GETTER VÀ SETTER:
    // Đảm bảo đóng gói dữ liệu (Encapsulation) trong OOP.
    // =========================================================================

    public Integer getId() {
        return id; // Trả về mã ID sản phẩm
    }

    public void setId(Integer id) {
        this.id = id; // Gán mã ID cho sản phẩm
    }

    public String getName() {
        return name; // Trả về tên sản phẩm
    }

    public void setName(String name) {
        this.name = name; // Gán tên mới cho sản phẩm
    }

    public double getPrice() {
        return price; // Trả về đơn giá của sản phẩm
    }

    public void setPrice(double price) {
        this.price = price; // Cập nhật đơn giá cho sản phẩm
    }

    public int getQuantity() {
        return quantity; // Trả về số lượng tồn kho
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity; // Cập nhật số lượng tồn kho
    }

    public String getDescription() {
        return description; // Trả về mô tả sản phẩm
    }

    public void setDescription(String description) {
        this.description = description; // Cập nhật mô tả sản phẩm
    }

    public String getImageUrl() {
        return imageUrl; // Trả về đường link ảnh hoặc Base64 của sản phẩm
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl; // Cập nhật link ảnh hoặc Base64 mới
    }
}
