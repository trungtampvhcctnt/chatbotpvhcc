# CỔNG DỊCH VỤ CÔNG & TRỢ LÝ ẢO TTPVHCC TÂY NHA TRANG

Cổng Thông tin Dịch vụ Hành chính công, Bốc số quầy điện tử, Tra cứu hồ sơ Một cửa và Trợ lý ảo AI thông minh Trung tâm Phục vụ Hành chính công Tây Nha Trang - Tỉnh Khánh Hòa.

---

## 🌟 Các chức năng chính đã hoàn thiện:

1. **Trợ lý ảo AI (Đã sửa lỗi nút đóng & tích hợp API máy chủ):**
   - **Nút đóng (✕) & Thu nhỏ (-):** Đã sửa triệt để, hoạt động 100% mượt mà, hỗ trợ phím `Escape`.
   - **API máy chủ:** Tích hợp endpoint `/api/chat` kết nối Gemini 3.8 Flash, tự động tra cứu dữ liệu thực tế từ cơ sở dữ liệu TTHC và hồ sơ Một cửa của TTPVHCC Tây Nha Trang.
   - **Tối ưu hóa phản hồi:** Gợi ý câu hỏi nhanh (Chips), thẻ thủ tục tương tác có nút bấm lấy số, xem hồ sơ, nộp hồ sơ, sao chép câu trả lời.
   - **Cài đặt API:** Có nút bánh răng ⚙️ cho phép người dùng tùy biến API Key hoặc endpoint máy chủ nếu muốn.

2. **Kiosk Bốc số quầy điện tử:**
   - Đăng ký vé số thứ tự online, hiển thị số đang gọi, thời gian dự kiến và số người đang đợi.
   - In vé / chụp màn hình vé điện tử.

3. **Tra cứu hồ sơ Một cửa điện tử:**
   - Tra cứu tiến độ xử lý 5 bước chuẩn hóa Một cửa (Mã hồ sơ mẫu: `H74-260901-0028`, `KH-00129-2026`).

4. **Niêm yết Thủ tục hành chính (TTHC):**
   - Bộ lọc theo 6 lĩnh vực lớn (Đất đai, Xây dựng, Hộ tịch, Kinh doanh, Lao động, Công an/VNeID).

5. **Đường dây nóng & Tiếp nhận phản ánh kiến nghị:**
   - Danh bạ hotline các bộ phận và form gửi ý kiến trực tuyến đến lãnh đạo Trung tâm.

---

## 🚀 HƯỚNG DẪN ĐƯA LÊN GITHUB & TỰ ĐỘNG TRIỂN KHAI GITHUB PAGES (CHẠY HTML):

### Cách 1: Tải trực tiếp gói ZIP từ giao diện Web
1. Mở ứng dụng web, bấm nút **"Xuất bản GitHub Pages"** ở góc trên bên phải.
2. Chọn tab **"2. Tải trọn gói ZIP (1-Click)"** và bấm **"Tải ngay gói ZIP"**.
3. Giải nén và đẩy lên repository GitHub.

### Cách 2: Sử dụng dòng lệnh Git (Chỉ 3 bước)
\`\`\`bash
# 1. Khởi tạo git và thêm toàn bộ mã nguồn
git init
git add .
git commit -m "Khoi tao he thong TTPVHCC Tay Nha Trang"

# 2. Đổi tên nhánh chính và liên kết kho lưu trữ GitHub của bạn
git branch -M main
git remote add origin https://github.com/TÊN_TÀI_KHOẢN_CỦA_BẠN/TÊN_REPO.git

# 3. Đẩy lên GitHub
git push -u origin main
\`\`\`

### Cách 3: Kích hoạt GitHub Pages trên repository GitHub:
1. Vào repository GitHub vừa tạo > chọn **Settings**.
2. Chọn mục **Pages** ở danh mục bên trái.
3. Trong phần **Build and deployment**:
   - Mục **Source**: Chọn **GitHub Actions**.
4. GitHub sẽ tự động đọc file `.github/workflows/deploy.yml` và xuất bản website của bạn tại:
   \`https://<TÊN_TÀI_KHOẢN>.github.io/<TÊN_REPO>/\`

---

## 📂 Cấu trúc thư mục:
- `src/` : Mã nguồn React 19 + TypeScript + Vite.
- `server/api-handler.ts` : API Handler máy chủ cho `/api/chat`, `/api/procedures`, `/api/applications`.
- `github-pages/` : Bản HTML tĩnh độc lập chạy trực tiếp trên trình duyệt hoặc GitHub Pages.
- `.github/workflows/deploy.yml` : File cấu hình GitHub Actions tự động deploy Pages.
- `metadata.json` : Cấu hình tên và mô tả ứng dụng AI Studio.
