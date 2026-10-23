import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * =========================================================================
 * FILE: main.jsx
 * NHIỆM VỤ: Điểm khởi động (Entry Point) của React DOM.
 * NGUYÊN LÝ HOẠT ĐỘNG:
 *   - Tìm thẻ <div id="root"> trong file index.html.
 *   - Nạp toàn bộ cây Component của <App /> vào để hiển thị lên màn hình trình duyệt.
 * =========================================================================
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
