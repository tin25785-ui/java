import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

/**
 * =========================================================================
 * FILE: main.jsx
 * THƯ MỤC: src/
 * NHIỆM VỤ: Điểm khởi tạo chính (Entry Point) của ứng dụng React Vite phía Client.
 * 
 * GIẢI THÍCH KÝ HIỆU & CƠ CHẾ:
 * - document.getElementById("root"): Tìm phần tử HTML <div id="root"> trong file index.html làm nơi cắm cây Component React.
 * - createRoot(...): Phương thức khởi tạo cây Virtual DOM của React 18+, hỗ trợ cơ chế Concurrent Rendering (xử lý tác vụ đồng thời).
 * - <StrictMode>: Chế độ nghiêm ngặt của React giúp cảnh báo sớm các lỗi tiềm ẩn, phương thức lỗi thời trong quá trình phát triển (Development Mode).
 * =========================================================================
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
