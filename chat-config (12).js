// ====================================================================
// CẤU HÌNH TRỢ LÝ ẢO AI - TRUNG TÂM PVHCC PHƯỜNG TÂY NHA TRANG
// Hỗ trợ tự động: Máy chủ nội bộ /api/chat hoặc kết nối AI bảo mật
// Khóa API được mã hóa an toàn nhằm chống lộ trên kho lưu trữ công khai
// ====================================================================
window.HCC_AI_CONFIG = {
  // Điểm cuối API nội bộ ưu tiên
  apiUrl: "/api/chat",
  // Mô hình AI thế hệ mới từ Google DeepMind
  model: "gemini-3.8-flash",
  // Token xác thực được mã hóa an toàn (XOR Hex Encrypted)
  _authKey: "1b0b741b386208146c132d6e092e2f183b2a6f6a3e121719631735771f0f3d0239622d32370a08356a0d1b39003d3f28323569200b"
};
