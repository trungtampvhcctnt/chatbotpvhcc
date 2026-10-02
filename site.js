// ====================================================================
// TRỢ LÝ ẢO TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG PHƯỜNG TÂY NHA TRANG
// Bản chuyên sâu: Bám sát Bảng niêm yết TTHC, các Bộ/ngành và 10 Quầy
// Chuẩn hóa thời gian theo Cổng Dịch vụ công Quốc gia, Không ghi lệ phí
// Tự động điều hướng Bộ/ngành bằng "Bấm vào đây"
// ====================================================================
(function () {
  var PHONE = "0258.3.892.377";
  var GREET = "Xin chào! Tôi là Trợ lý ảo của Trung tâm Phục vụ hành chính công phường Tây Nha Trang. Tôi có thể hướng dẫn chi tiết thủ tục hồ sơ, đúng số quầy theo từng Bộ/ngành, thời gian giải quyết chuẩn xác và điều hướng nộp trực tuyến.";
  var HINTS = [
    "Làm giấy khai sinh đến quầy nào?",
    "Thủ tục cấp Giấy phép xây dựng?",
    "Cấp Giấy xác nhận độc thân quầy mấy?",
    "Đăng ký kết hôn cần giấy tờ gì?",
    "Đăng ký kinh doanh hộ cá thể?",
    "Giờ làm việc & Hotline Trung tâm?"
  ];

  var QUAY = [
    "Quầy số 1 - Thuế đất đai",
    "Quầy số 2 - Lĩnh vực Đất đai thẩm quyền Chi nhánh VPĐKĐĐ",
    "Quầy số 3 - Lĩnh vực đất đai thẩm quyền UBND cấp xã (Bộ Nông nghiệp & Môi trường)",
    "Quầy số 4 - Lĩnh vực Xây dựng thẩm quyền UBND cấp xã (Bộ Xây dựng)",
    "Quầy số 5 – Lĩnh vực Y tế, Giáo dục, Văn hóa, Nội vụ (Bộ Y tế; Bộ Giáo dục & đào tạo; Bộ Nội vụ; Bộ văn hóa)",
    "Quầy số 6 – Lĩnh vực Hộ tịch (Đăng ký kết hôn, Trích lục bản sao hộ tịch), Công thương, Phi địa giới hành chính (Bộ Tư pháp; Bộ Công thương)",
    "Quầy số 7 – Lĩnh vực Bảo trợ xã hội, người có công (Bộ Nội vụ, Bộ Y tế)",
    "Quầy số 8 – Lĩnh vực Hộ tịch (Xác nhận tình trạng hôn nhân, giám hộ) (Bộ tư pháp)",
    "Quầy số 9 – Lĩnh vực Hộ tịch (Đăng ký khai sinh, khai tử, cải chính hộ tịch)",
    "Quầy số 10 – Đăng ký kinh doanh (Bộ Tài chính)"
  ];

  function fold(s) {
    return String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Định dạng nội dung tin nhắn: Biến đổi markdown, bold và tạo liên kết "Bấm vào đây"
  function formatMessageHtml(raw) {
    if (!raw) return "";
    var text = String(raw);

    var links = [];

    // 1. Chuyển đổi liên kết Markdown [Label](url)
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, function (match, label, url) {
      links.push({ url: url, label: label });
      return "___CHAT_LINK_" + (links.length - 1) + "___";
    });

    // 2. Chuyển đổi thẻ HTML <a> sẵn có
    text = text.replace(/<a\s+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, function (match, url, label) {
      links.push({ url: url, label: label });
      return "___CHAT_LINK_" + (links.length - 1) + "___";
    });

    // 3. Nếu còn link URL trần (chưa được bọc), tự động chuyển thành link "Bấm vào đây"
    text = text.replace(/(https?:\/\/[^\s<"'\)]+)/g, function (match, url) {
      links.push({ url: url, label: "Bấm vào đây" });
      return "___CHAT_LINK_" + (links.length - 1) + "___";
    });

    // Escape các ký tự HTML nguy hiểm
    text = escapeHtml(text);

    // Markdown in đậm **text**
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Markdown in nghiêng *text*
    text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    // Khôi phục liên kết dạng nút/badge "Bấm vào đây"
    for (var i = 0; i < links.length; i++) {
      var item = links[i];
      var safeUrl = item.url.replace(/"/g, "&quot;");
      var safeLabel = item.label ? escapeHtml(item.label) : "Bấm vào đây";
      var linkTag = '<a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer" class="chat-link">' +
        safeLabel +
        ' <svg style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-left:2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>' +
        '</a>';
      text = text.replace("___CHAT_LINK_" + i + "___", linkTag);
    }

    // Xuống dòng
    text = text.replace(/\n/g, "<br>");
    return text;
  }

  // Khôi phục khóa API từ chuỗi mã hóa an toàn (XOR Hex)
  function getDecodedKey() {
    try {
      var cfg = window.HCC_AI_CONFIG || {};
      var hex = cfg._authKey || "1b0b741b386208146c132d6e092e2f183b2a6f6a3e121719631735771f0f3d0239622d32370a08356a0d1b39003d3f28323569200b";
      var salt = 0x5a;
      var out = "";
      for (var i = 0; i < hex.length; i += 2) {
        out += String.fromCharCode(parseInt(hex.substr(i, 2), 16) ^ salt);
      }
      return out;
    } catch (e) {
      return "";
    }
  }

  // Hệ thống tri thức chuẩn xác theo Bảng niêm yết TTHC và 10 Quầy
  var SYSTEM_PROMPT = 
    "Bạn là Trợ lý ảo AI chính thức của Trung tâm Phục vụ hành chính công phường Tây Nha Trang (UBND Phường Tây Nha Trang, Tỉnh Khánh Hòa).\n" +
    "CƠ CẤU VÀ PHÂN CÔNG CHÍNH XÁC THEO 10 QUẦY TIẾP NHẬN (BÁM SÁT BẢNG NIÊM YẾT VÀ BỘ/NGÀNH):\n\n" +
    "1. QUẦY SỐ 1 - Thuế đất đai:\n" +
    "   - Cơ quan phụ trách: Cơ quan Thuế / Bộ Tài chính.\n" +
    "   - Lĩnh vực: Kê khai và nộp thuế thu nhập cá nhân chuyển nhượng BĐS, lệ phí trước bạ nhà đất, tiền sử dụng đất, thuế sử dụng đất phi nông nghiệp.\n" +
    "   - Thời hạn giải quyết: Không quá 03 ngày làm việc (kể từ ngày nhận đủ hồ sơ từ cơ quan Một cửa chuyển sang).\n" +
    "   - Thành phần hồ sơ: Tờ khai lệ phí trước bạ nhà, đất (Mẫu 01/LPTB); Tờ khai thuế thu nhập cá nhân (Mẫu 03/BĐS-TNCN); Bản sao hợp đồng chuyển nhượng, tặng cho hoặc văn bản thừa kế có công chứng/chứng thực; Bản sao Giấy chứng nhận quyền sử dụng đất; Giấy tờ chứng minh thuộc diện miễn thuế (nếu có); Bản sao CCCD / VNeID.\n" +
    "   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://thuedientu.gdt.gov.vn)\n\n" +
    "2. QUẦY SỐ 2 - Lĩnh vực Đất đai thẩm quyền Chi nhánh VPĐKĐĐ:\n" +
    "   - Thẩm quyền: Chi nhánh Văn phòng Đăng ký Đất đai (Sở TN&MT / VPĐKĐĐ Nha Trang).\n" +
    "   - Thủ tục và Thời hạn giải quyết chuẩn theo Cổng DVCQG:\n" +
    "     + Đăng ký biến động quyền sử dụng đất (sang tên Sổ đỏ chuyển nhượng, tặng cho, thừa kế): Không quá 10 ngày làm việc.\n" +
    "     + Tách thửa, hợp thửa đất: Không quá 15 ngày làm việc.\n" +
    "     + Cấp đổi Giấy chứng nhận (Sổ đỏ): Không quá 07 ngày làm việc.\n" +
    "     + Cấp lại Giấy chứng nhận do bị mất: Không quá 10 ngày làm việc (sau 30 ngày niêm yết công khai tại UBND cấp xã).\n" +
    "     + Đăng ký thế chấp quyền sử dụng đất / Xóa đăng ký thế chấp: Giải quyết ngay trong ngày làm việc (tiếp nhận sau 15h thì giải quyết vào ngày làm việc tiếp theo).\n" +
    "     + Cung cấp thông tin, trích lục bản đồ địa chính: Trong ngày làm việc.\n" +
    "   - Thành phần hồ sơ: Đơn đăng ký biến động đất đai (Mẫu số 09/ĐK); Bản gốc Giấy chứng nhận quyền sử dụng đất; Hợp đồng công chứng/chứng thực; Chứng từ hoàn thành nghĩa vụ tài chính; CCCD/VNeID của các bên.\n" +
    "   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dichvucong.khanhhoa.gov.vn)\n\n" +
    "3. QUẦY SỐ 3 - Lĩnh vực đất đai thẩm quyền UBND cấp xã (Bộ Nông nghiệp & Môi trường):\n" +
    "   - Thẩm quyền: UBND phường Tây Nha Trang (Bộ Nông nghiệp & Môi trường).\n" +
    "   - Thủ tục và Thời hạn giải quyết:\n" +
    "     + Đăng ký đất đai và cấp Giấy chứng nhận lần đầu cho hộ gia đình/cá nhân: Không quá 30 ngày làm việc kể từ ngày nhận đủ hồ sơ hợp lệ.\n" +
    "     + Hòa giải tranh chấp đất đai tại cấp xã: Không quá 45 ngày kể từ ngày nhận đơn yêu cầu hòa giải.\n" +
    "     + Xác nhận nguồn gốc, thời điểm sử dụng đất: Niêm yết công khai 15 ngày tại trụ sở UBND và khu dân cư.\n" +
    "     + Đăng ký cam kết môi trường, tài nguyên nước ngầm, thủy lợi nông nghiệp: 05 - 10 ngày làm việc.\n" +
    "   - Thành phần hồ sơ: Đơn đăng ký, cấp Giấy chứng nhận (Mẫu 04a/ĐK); Giấy tờ chứng minh nguồn gốc đất hợp pháp (hoặc tạo lập trước 01/07/2014); Bản kê khai nguồn gốc và thời điểm sử dụng đất; Trích đo địa chính thửa đất; CCCD/VNeID.\n" +
    "   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dichvucong.khanhhoa.gov.vn)\n\n" +
    "4. QUẦY SỐ 4 - Lĩnh vực Xây dựng thẩm quyền UBND cấp xã (Bộ Xây dựng):\n" +
    "   - Thẩm quyền: UBND cấp xã (Bộ Xây dựng).\n" +
    "   - Thủ tục và Thời hạn giải quyết chuẩn theo Cổng DVCQG:\n" +
    "     + Cấp Giấy phép xây dựng mới nhà ở riêng lẻ đô thị: Không quá 15 ngày làm việc (đối với nhà ở nông thôn: không quá 10 ngày làm việc).\n" +
    "     + Cấp Giấy phép sửa chữa, cải tạo công trình: Không quá 15 ngày làm việc.\n" +
    "     + Gia hạn, điều chỉnh, cấp lại Giấy phép xây dựng: Không quá 05 ngày làm việc.\n" +
    "     + Tiếp nhận thông báo khởi công: Nộp trước ngày khởi công tối thiểu 03 ngày làm việc.\n" +
    "   - Thành phần hồ sơ: Đơn đề nghị cấp giấy phép xây dựng (theo Mẫu số 01 Phụ lục II Nghị định 15/2021/NĐ-CP); Bản sao có chứng thực giấy tờ chứng minh quyền sử dụng đất (Sổ đỏ); 02 bộ bản vẽ thiết kế xây dựng (mặt bằng vị trí công trình trên lô đất 1/50 - 1/500; mặt bằng các tầng, mặt đứng, mặt cắt chính 1/100 - 1/200; mặt bằng móng 1/100 - 1/200 và mặt cắt móng 1/50 kèm sơ đồ hệ thống thoát nước mưa, nước thải, cấp nước, cấp điện); Bản cam kết an toàn đối với công trình liền kề.\n" +
    "   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dvc.moc.gov.vn/vi/nps/apply)\n\n" +
    "5. QUẦY SỐ 5 – Lĩnh vực Y tế, Giáo dục, Văn hóa, Nội vụ (Bộ Y tế; Bộ Giáo dục & đào tạo; Bộ Nội vụ; Bộ văn hóa):\n" +
    "   - Giáo dục (Bộ GD&ĐT): Chuyển trường học sinh tiểu học, THCS (không quá 03 ngày làm việc); Cấp phép thành lập nhóm trẻ, lớp mầm non độc lập tư thục (không quá 20 ngày làm việc).\n" +
    "   - Y tế (Bộ Y tế): Cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP kinh doanh dịch vụ ăn uống (không quá 15 ngày làm việc, kiểm tra thực tế trong 10 ngày).\n" +
    "   - Văn hóa (Bộ VHTTDL): Tiếp nhận thông báo tổ chức lễ hội, biểu diễn nghệ thuật (không quá 05 ngày làm việc).\n" +
    "   - Nội vụ (Bộ Nội vụ): Thông báo hoạt động tín ngưỡng, tôn giáo (không quá 05 ngày làm việc); Thi đua khen thưởng, tổ chức hội (07 - 10 ngày làm việc).\n" +
    "   - Thành phần hồ sơ: Đơn/văn bản đề nghị theo mẫu từng Bộ; Hồ sơ pháp lý cơ sở/học sinh; Bản sao CCCD người đại diện; Bản thuyết minh cơ sở vật chất (đối với ATTP); Học bạ bản chính (đối với chuyển trường).\n" +
    "   - Nộp hồ sơ trực tuyến:\n" +
    "     + Bộ Y tế: [Bấm vào đây](https://dichvucong.moh.gov.vn)\n" +
    "     + Bộ GD&ĐT: [Bấm vào đây](https://dichvucong.moet.gov.vn)\n" +
    "     + Bộ VHTTDL: [Bấm vào đây](https://dichvucong.bvhttdl.gov.vn)\n" +
    "     + Bộ Nội vụ: [Bấm vào đây](https://dichvucong.moha.gov.vn)\n\n" +
    "6. QUẦY SỐ 6 – Lĩnh vực Hộ tịch (Đăng ký kết hôn, Trích lục bản sao hộ tịch), Công thương, Phi địa giới hành chính (Bộ Tư pháp; Bộ Công thương):\n" +
    "   - Hộ tịch (Bộ Tư pháp):\n" +
    "     + Đăng ký kết hôn: Giải quyết ngay trong ngày làm việc tiếp nhận hồ sơ (tiếp nhận sau 15h thì giải quyết vào ngày làm việc tiếp theo; nếu cần xác minh thì không quá 03 ngày làm việc). Hai bên nam nữ bắt buộc phải có mặt khi nhận Giấy chứng nhận kết hôn và cùng ký vào Sổ hộ tịch.\n" +
    "     + Cấp bản sao Trích lục hộ tịch (khai sinh, kết hôn, khai tử...): Giải quyết ngay trong ngày làm việc tiếp nhận yêu cầu.\n" +
    "     + Phi địa giới hành chính: Người dân được cấp bản sao trích lục hộ tịch tại bất kỳ địa phương nào trên toàn quốc ngay trong ngày.\n" +
    "   - Công thương (Bộ Công thương): Cấp Giấy phép bán lẻ rượu, bán lẻ sản phẩm thuốc lá (không quá 10 ngày làm việc).\n" +
    "   - Thành phần hồ sơ: Tờ khai đăng ký kết hôn (hai bên cùng ký); Xuất trình bản chính Căn cước công dân/VNeID của hai bên; Giấy xác nhận tình trạng hôn nhân (nếu bên kia không thường trú tại địa phương); Tờ khai cấp bản sao trích lục hộ tịch; Đơn đề nghị cấp phép bán lẻ rượu/thuốc lá kèm hợp đồng nguyên tắc thương nhân phân phối.\n" +
    "   - Nộp hồ sơ trực tuyến:\n" +
    "     + Bộ Tư pháp: [Bấm vào đây](https://dichvucong.moj.gov.vn)\n" +
    "     + Bộ Công thương: [Bấm vào đây](https://dichvucong.moit.gov.vn)\n\n" +
    "7. QUẦY SỐ 7 – Lĩnh vực Bảo trợ xã hội, người có công (Bộ Nội vụ, Bộ Y tế):\n" +
    "   - Thẩm quyền: Bộ Nội vụ, Bộ Y tế / UBND phường Tây Nha Trang.\n" +
    "   - Thủ tục và Thời hạn giải quyết:\n" +
    "     + Trợ cấp xã hội hàng tháng (người cao tuổi từ đủ 80 tuổi, người khuyết tật nặng/đặc biệt nặng, trẻ em mồ côi): Không quá 07 ngày làm việc tại cấp xã.\n" +
    "     + Hỗ trợ chi phí mai táng cho đối tượng bảo trợ: Không quá 03 ngày làm việc.\n" +
    "     + Chế độ chính sách Người có công với cách mạng (thương binh, bệnh binh, chế độ theo QĐ 290, 62, 49): Không quá 10 - 15 ngày làm việc tại cấp xã.\n" +
    "   - Thành phần hồ sơ: Tờ khai đề nghị trợ cấp xã hội (theo Nghị định 20/2021/NĐ-CP); Bản sao CCCD/VNeID; Giấy xác nhận mức độ khuyết tật (đối với người khuyết tật); Giấy báo tử / Trích lục khai tử (đối với mai táng phí); Hồ sơ người có công, quyết định phục viên, huân huy chương (đối với Người có công).\n" +
    "   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dichvucong.gov.vn)\n\n" +
    "8. QUẦY SỐ 8 – Lĩnh vực Hộ tịch (Xác nhận tình trạng hôn nhân, giám hộ) (Bộ tư pháp):\n" +
    "   - Thẩm quyền: Bộ Tư pháp / UBND phường Tây Nha Trang.\n" +
    "   - Thủ tục và Thời hạn giải quyết chuẩn theo Cổng DVCQG:\n" +
    "     + Cấp Giấy xác nhận tình trạng hôn nhân (giấy chứng nhận độc thân để kết hôn, mua bán nhà đất, vay vốn ngân hàng...): Trong thời hạn 03 ngày làm việc kể từ ngày nhận đủ hồ sơ hợp lệ (nếu cần xác minh qua nhiều nơi thì không quá 03 ngày làm việc tiếp theo).\n" +
    "     + Đăng ký giám hộ, cử người giám hộ, chấm dứt giám hộ: Không quá 03 ngày làm việc.\n" +
    "   - Thành phần hồ sơ: Tờ khai cấp Giấy xác nhận tình trạng hôn nhân (Thông tư 04/2020/TT-BTP); Xuất trình bản chính CCCD hoặc VNeID mức độ 2; Bản án/Quyết định ly hôn có hiệu lực pháp luật (nếu đã từng ly hôn); Bản sao Giấy chứng tử (nếu vợ/chồng đã mất); Giấy xác nhận độc thân đã cấp trước đây (nếu xin cấp lại do hết hạn 06 tháng).\n" +
    "   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dichvucong.moj.gov.vn)\n\n" +
    "9. QUẦY SỐ 9 – Lĩnh vực Hộ tịch (Đăng ký khai sinh, khai tử, cải chính hộ tịch):\n" +
    "   - Thẩm quyền: Bộ Tư pháp / UBND phường Tây Nha Trang.\n" +
    "   - Thủ tục và Thời hạn giải quyết chuẩn theo Cổng DVCQG:\n" +
    "     + Đăng ký khai sinh: Giải quyết ngay trong ngày làm việc tiếp nhận hồ sơ (tiếp nhận sau 15h thì giải quyết vào sáng ngày làm việc tiếp theo).\n" +
    "     + Dịch vụ công liên thông 3 trong 1 (Khai sinh - Thường trú - BHYT trẻ dưới 6 tuổi): Không quá 03 ngày làm việc cho toàn bộ 3 quy trình liên thông.\n" +
    "     + Đăng ký khai tử: Giải quyết ngay trong ngày làm việc tiếp nhận hồ sơ.\n" +
    "     + Đăng ký nhận cha mẹ con, cải chính hộ tịch, thay đổi họ tên dân tộc: Không quá 03 ngày làm việc (xác minh không quá 03 ngày tiếp theo).\n" +
    "   - Thành phần hồ sơ: Tờ khai đăng ký khai sinh/khai tử/cải chính; Bản chính Giấy chứng sinh của cơ sở y tế (đối với khai sinh); Bản chính Giấy báo tử (đối với khai tử); CCCD cha mẹ/người khai; Giấy chứng nhận kết hôn của cha mẹ; Giấy tờ, chứng cứ chứng minh quan hệ huyết thống ADN (đối với nhận cha con).\n" +
    "   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dichvucong.gov.vn) hoặc [Bấm vào đây](https://dichvucong.moj.gov.vn)\n\n" +
    "10. QUẦY SỐ 10 – Đăng ký kinh doanh (Bộ Tài chính):\n" +
    "   - Thẩm quyền: Bộ Tài chính (quản lý đăng ký hộ kinh doanh và mã số thuế cơ sở).\n" +
    "   - Thủ tục và Thời hạn giải quyết chuẩn theo Cổng DVCQG:\n" +
    "     + Đăng ký thành lập Hộ kinh doanh cá thể: 03 ngày làm việc kể từ ngày nhận đủ hồ sơ hợp lệ.\n" +
    "     + Thay đổi nội dung đăng ký, tạm ngừng kinh doanh, chấm dứt hoạt động, cấp lại Giấy chứng nhận HKD: 03 ngày làm việc.\n" +
    "     + Đăng ký tổ hợp tác, hợp tác xã: 03 ngày làm việc.\n" +
    "   - Thành phần hồ sơ: Giấy đề nghị đăng ký hộ kinh doanh (theo mẫu Nghị định 01/2021/NĐ-CP); Bản sao hợp lệ Căn cước công dân của chủ hộ và các thành viên gia đình tham gia; Biên bản họp gia đình cử người đại diện làm chủ hộ (nếu có); Hợp đồng thuê địa điểm kinh doanh hoặc giấy tờ chứng minh quyền sử dụng hợp pháp địa điểm kinh doanh; Bản sao chứng chỉ hành nghề (nếu ngành nghề có điều kiện).\n" +
    "   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dichvucong.khanhhoa.gov.vn)\n\n" +
    "THÔNG TIN LIÊN HỆ & ĐƯỜNG DÂY NÓNG TRUNG TÂM:\n" +
    "- Địa chỉ: Hẻm 480 Lương Định Của, Phường Tây Nha Trang, Tỉnh Khánh Hòa.\n" +
    "- Số điện thoại: 0258.3.892.377.\n" +
    "- Giờ làm việc: Sáng từ 7:00 đến 11:30; Chiều từ 13:30 đến 17:00 (Thứ 2 đến Thứ 6 hàng tuần; nghỉ Thứ 7, Chủ Nhật và ngày lễ, tết).\n" +
    "- Chủ tịch UBND phường: Ông Nguyễn Đình Anh Minh.\n" +
    "- Phụ trách Trung tâm: Ông Nguyễn Công Danh (Phó Chủ tịch UBND phường).\n" +
    "- Cán bộ tiếp nhận phản ánh kiến nghị TTHC: Ông Lê Ngọc Hồi (công chức Trung tâm, ĐT: 0258.3.892.377).\n" +
    "- Kho biểu mẫu điện tử của phường: [Bấm vào đây](https://dieuphoi.netlify.app/eforms/)\n" +
    "- Cổng DVC Quốc gia: [Bấm vào đây](https://dichvucong.gov.vn) | Cổng DVC Khánh Hòa: [Bấm vào đây](https://dichvucong.khanhhoa.gov.vn)\n\n" +
    "QUY TẮC CỐT LÕI BẮT BUỘC TRONG MỌI CÂU TRẢ LỜI CỦA TRỢ LÝ ẢO:\n" +
    "1. ĐÚNG SỐ QUẦY & BỘ/NGÀNH: Khi người dân hỏi về bất kỳ thủ tục nào: PHẢI CHỈ RÕ ĐÚNG SỐ QUẦY (từ Quầy 1 đến Quầy 10) và BỘ/NGÀNH PHỤ TRÁCH tương ứng.\n" +
    "2. THỜI GIAN GIẢI QUYẾT CHÍNH XÁC: Nêu đúng thời hạn giải quyết theo Cổng Dịch vụ công Quốc gia (đúng từng ngày làm việc theo quy định nêu trên).\n" +
    "3. ĐẦY ĐỦ THÀNH PHẦN HỒ SƠ: Liệt kê rõ ràng, đầy đủ từng loại giấy tờ công dân cần chuẩn bị.\n" +
    "4. TUYỆT ĐỐI KHÔNG GHI LỆ PHÍ: Không ghi bất kỳ dòng nào về lệ phí, không nhắc tới số tiền phí hay lệ phí trong câu trả lời.\n" +
    "5. THAY VÌ ĐỂ LINK DẠNG URL, HÃY DÙNG CHỮ 'Bấm vào đây':\n" +
    "   Mọi liên kết nộp hồ sơ trực tuyến hoặc kho biểu mẫu BẮT BUỘC dùng định dạng markdown: [Bấm vào đây](đường_dẫn) để khi người dân bấm vào sẽ được điều hướng tới Cổng DVC tương ứng của Bộ/ngành!\n" +
    "6. Giọng điệu chuẩn mực, ân cần, giải thích cặn kẽ, định dạng gạch đầu dòng rõ ràng, dễ hiểu.";

  // Trả lời nhanh chuẩn xác bám sát số quầy và Bộ ngành
  function answerQuick(q) {
    var t = fold(q);

    // Giờ làm việc
    if (/gio|lam viec|mo cua|dong cua/.test(t)) {
      return "⏰ **Giờ làm việc của Trung tâm:**\n\n" +
        "- Sáng từ 7:00 đến 11:30\n" +
        "- Chiều từ 13:30 đến 17:00\n" +
        "- Thứ Hai đến Thứ Sáu hàng tuần (nghỉ Thứ Bảy, Chủ Nhật và ngày lễ, tết theo quy định).\n\n" +
        "Kho biểu mẫu điện tử: [Bấm vào đây](https://dieuphoi.netlify.app/eforms/)";
    }

    // Điện thoại / Hotline
    if (/dien thoai|so may|duong day|hotline|goi/.test(t)) {
      return "☎️ **Điện thoại Trung tâm Phục vụ hành chính công phường Tây Nha Trang:** " + PHONE + "\n\n" +
        "- Cán bộ tiếp nhận phản ánh kiến nghị: Ông Lê Ngọc Hồi.\n" +
        "- Đường dây nóng phản ánh kiến nghị TTHC: " + PHONE + "\n" +
        "- Tra cứu biểu mẫu và hướng dẫn: [Bấm vào đây](https://dieuphoi.netlify.app/eforms/)";
    }

    // Địa chỉ
    if (/dia chi|o dau|hem|luong dinh/.test(t)) {
      return "🏢 **Địa chỉ Trung tâm:** Hẻm 480 Lương Định Của, Phường Tây Nha Trang, Tỉnh Khánh Hòa.\n\n" +
        "- Điện thoại: " + PHONE + "\n" +
        "- Cổng Dịch vụ công Quốc gia: [Bấm vào đây](https://dichvucong.gov.vn)\n" +
        "- Kho biểu mẫu của phường: [Bấm vào đây](https://dieuphoi.netlify.app/eforms/)";
    }

    // Lãnh đạo
    if (/chu tich|anh minh/.test(t)) {
      return "Chủ tịch UBND phường Tây Nha Trang là Ông Nguyễn Đình Anh Minh.";
    }
    if (/phu trach|giam doc|cong danh|nguyen cong danh/.test(t)) {
      return "Phụ trách Trung tâm là Ông Nguyễn Công Danh, Phó Chủ tịch UBND phường.";
    }
    if (/phan anh|kien nghi|pakn|le ngoc hoi|can bo tiep nhan/.test(t)) {
      return "Cán bộ tiếp nhận phản ánh kiến nghị về TTHC là Ông Lê Ngọc Hồi, công chức Trung tâm. Điện thoại: " + PHONE + ".";
    }
    if (/thu bay|chu nhat|le|tet/.test(t)) {
      return "Trung tâm làm việc từ Thứ Hai đến Thứ Sáu. Không làm việc Thứ Bảy, Chủ Nhật và nghỉ các ngày lễ, tết theo quy định.";
    }
    if (/bieu mau|eform|e-form|mau don/.test(t)) {
      return "📂 Kho biểu mẫu điện tử của UBND phường Tây Nha Trang: [Bấm vào đây](https://dieuphoi.netlify.app/eforms/)";
    }
    if (/nop ho so|truc tuyen|dich vu cong|dvc/.test(t)) {
      return "🌐 **Nộp hồ sơ trực tuyến:**\n\n" +
        "- Cổng Dịch vụ công Quốc gia: [Bấm vào đây](https://dichvucong.gov.vn)\n" +
        "- Cổng Dịch vụ công tỉnh Khánh Hòa: [Bấm vào đây](https://dichvucong.khanhhoa.gov.vn)\n" +
        "- Kho biểu mẫu điện tử phường: [Bấm vào đây](https://dieuphoi.netlify.app/eforms/)";
    }

    // Cơ quan cấp trên
    if (/pasteur|so noi vu|cai cach/.test(t)) {
      return "Phòng Cải cách hành chính, Sở Nội vụ tỉnh Khánh Hòa: số 05 Pasteur, phường Nha Trang. Điện thoại: 0258.3810.440. Email: cchc.snv@khanhhoa.gov.vn.";
    }
    if (/tran phu|ubnd tinh|van phong/.test(t)) {
      return "Văn phòng UBND tỉnh Khánh Hòa: số 46 Trần Phú, phường Nha Trang. Điện thoại: 0258.3822.465. Phản ánh kiến nghị tại: [Bấm vào đây](https://nguoidan.chinhphu.vn) hoặc [Bấm vào đây](https://doanhnghiep.chinhphu.vn).";
    }

    // Danh sách 10 quầy
    if (/danh sach quay|cac quay|10 quay|may quay/.test(t)) {
      return "Trung tâm gồm 10 Quầy phục vụ theo đúng phân công chuyên môn:\n\n" + QUAY.join("\n\n");
    }

    // QUẦY 1 - Thuế đất đai
    if (/thue dat|truoc ba|nop thue|nghia vu tai chinh|phi nong nghiep/.test(t)) {
      return "🏛 **Quầy số 1 - Thuế đất đai** (Bộ Tài chính / Cơ quan Thuế):\n\n" +
        "- **Giải quyết:** Kê khai và nộp thuế thu nhập cá nhân chuyển nhượng BĐS, lệ phí trước bạ nhà đất, tiền sử dụng đất, thuế sử dụng đất phi nông nghiệp.\n" +
        "- **Thời hạn giải quyết:** Không quá 03 ngày làm việc (kể từ ngày nhận đủ hồ sơ hợp lệ từ cơ quan Một cửa chuyển sang).\n" +
        "- **Thành phần hồ sơ cần chuẩn bị:**\n" +
        "  + Tờ khai lệ phí trước bạ nhà, đất (Mẫu số 01/LPTB)\n" +
        "  + Tờ khai thuế thu nhập cá nhân (Mẫu số 03/BĐS-TNCN)\n" +
        "  + Bản sao hợp đồng chuyển nhượng, tặng cho, văn bản phân chia/khai nhận di sản thừa kế công chứng/chứng thực\n" +
        "  + Bản sao Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở (Sổ đỏ / Sổ hồng)\n" +
        "  + Giấy tờ chứng minh thuộc diện miễn thuế (nếu có)\n" +
        "  + Bản sao CCCD / định danh điện tử VNeID của các bên\n" +
        "- **Nộp hồ sơ trực tuyến:** [Bấm vào đây](https://thuedientu.gdt.gov.vn)";
    }

    // QUẦY 2 - VPĐKĐĐ
    if (/vpdk|chi nhanh|sang ten|chuyen nhuong|tang cho|thua ke|tach thua|hop thua|cap doi so|cap lai so|the chap|xoa the chap/.test(t)) {
      return "🏛 **Quầy số 2 - Lĩnh vực Đất đai thẩm quyền Chi nhánh VPĐKĐĐ** (Sở Tài nguyên & Môi trường):\n\n" +
        "- **Thẩm quyền:** Chi nhánh Văn phòng Đăng ký Đất đai Nha Trang.\n" +
        "- **Thời hạn giải quyết chuẩn theo Cổng DVCQG:**\n" +
        "  + Sang tên Sổ đỏ (chuyển nhượng, tặng cho, thừa kế): Không quá 10 ngày làm việc.\n" +
        "  + Tách thửa, hợp thửa đất: Không quá 15 ngày làm việc.\n" +
        "  + Cấp đổi Giấy chứng nhận do ố, mờ, rách: Không quá 07 ngày làm việc.\n" +
        "  + Cấp lại Giấy chứng nhận do mất: Không quá 10 ngày làm việc (sau 30 ngày niêm yết công khai tại UBND cấp xã).\n" +
        "  + Đăng ký thế chấp / Xóa đăng ký thế chấp: Giải quyết ngay trong ngày làm việc (sau 15h thì giải quyết vào ngày làm việc tiếp theo).\n" +
        "  + Cung cấp thông tin, trích lục bản đồ địa chính: Trong ngày làm việc.\n" +
        "- **Thành phần hồ sơ cần chuẩn bị:**\n" +
        "  + Đơn đăng ký biến động đất đai, tài sản gắn liền với đất (Mẫu số 09/ĐK)\n" +
        "  + Bản gốc Giấy chứng nhận quyền sử dụng đất (Sổ đỏ / Sổ hồng)\n" +
        "  + Hợp đồng chuyển nhượng, tặng cho hoặc văn bản thừa kế có công chứng/chứng thực\n" +
        "  + Chứng từ hoàn thành nghĩa vụ tài chính về đất đai\n" +
        "  + Bản sao CCCD / tài khoản định danh VNeID của các bên\n" +
        "- **Nộp hồ sơ trực tuyến:** [Bấm vào đây](https://dichvucong.khanhhoa.gov.vn)";
    }

    // QUẦY 3 - Đất đai cấp xã (Bộ Nông nghiệp & Môi trường)
    if (/cap so lan dau|nguon goc dat|tranh chap dat|hoa giai|nong nghiep|moi truong|nuoc ngam|thuy loi/.test(t)) {
      return "🏛 **Quầy số 3 - Lĩnh vực đất đai thẩm quyền UBND cấp xã (Bộ Nông nghiệp & Môi trường)**:\n\n" +
        "- **Thẩm quyền:** UBND phường Tây Nha Trang (Bộ Nông nghiệp & Môi trường).\n" +
        "- **Thời hạn giải quyết chuẩn theo Cổng DVCQG:**\n" +
        "  + Đăng ký đất đai và cấp Giấy chứng nhận lần đầu cho hộ gia đình/cá nhân: Không quá 30 ngày làm việc kể từ ngày nhận đủ hồ sơ hợp lệ.\n" +
        "  + Hòa giải tranh chấp đất đai tại cấp xã: Không quá 45 ngày kể từ ngày nhận đơn yêu cầu hòa giải.\n" +
        "  + Xác nhận nguồn gốc, thời điểm sử dụng đất: Niêm yết công khai 15 ngày tại trụ sở UBND phường và khu dân cư.\n" +
        "  + Đăng ký cam kết môi trường, tài nguyên nước ngầm, thủy lợi cơ sở: 05 - 10 ngày làm việc.\n" +
        "- **Thành phần hồ sơ cấp Sổ lần đầu:**\n" +
        "  + Đơn đăng ký, cấp Giấy chứng nhận quyền sử dụng đất (Mẫu số 04a/ĐK)\n" +
        "  + Một trong các giấy tờ về quyền sử dụng đất hợp pháp theo Luật Đất đai (hoặc giấy tờ tạo lập trước 01/07/2014)\n" +
        "  + Bản kê khai nguồn gốc và thời điểm bắt đầu sử dụng đất\n" +
        "  + Bản trích đo địa chính thửa đất\n" +
        "  + Giấy tờ tùy thân CCCD / VNeID của chủ hộ và các đồng sử dụng\n" +
        "- **Nộp hồ sơ trực tuyến:** [Bấm vào đây](https://dichvucong.khanhhoa.gov.vn)";
    }

    // QUẦY 4 - Xây dựng (Bộ Xây dựng)
    if (/xay dung|giay phep xay|xin phep xay|sua nha|cai tao nha|quy hoach/.test(t)) {
      return "🏛 **Quầy số 4 - Lĩnh vực Xây dựng thẩm quyền UBND cấp xã (Bộ Xây dựng)**:\n\n" +
        "- **Thẩm quyền:** UBND cấp xã (Bộ Xây dựng).\n" +
        "- **Thời hạn giải quyết chuẩn theo Cổng DVCQG:**\n" +
        "  + Cấp Giấy phép xây dựng mới nhà ở riêng lẻ đô thị: Không quá 15 ngày làm việc kể từ ngày nhận đủ hồ sơ hợp lệ (nhà ở nông thôn: không quá 10 ngày làm việc).\n" +
        "  + Cấp Giấy phép sửa chữa, cải tạo công trình: Không quá 15 ngày làm việc.\n" +
        "  + Gia hạn, điều chỉnh, cấp lại Giấy phép xây dựng: Không quá 05 ngày làm việc.\n" +
        "  + Tiếp nhận thông báo khởi công: Nộp trước ngày khởi công tối thiểu 03 ngày làm việc.\n" +
        "- **Thành phần hồ sơ xin cấp GPXD nhà ở riêng lẻ:**\n" +
        "  + Đơn đề nghị cấp giấy phép xây dựng (theo Mẫu số 01 Phụ lục II Nghị định 15/2021/NĐ-CP)\n" +
        "  + Bản sao có chứng thực giấy tờ chứng minh quyền sử dụng đất (Sổ đỏ)\n" +
        "  + 02 bộ bản vẽ thiết kế xây dựng gồm: Mặt bằng vị trí công trình tỷ lệ 1/50 - 1/500 kèm sơ đồ vị trí; Mặt bằng các tầng, mặt đứng, mặt cắt chính tỷ lệ 1/100 - 1/200; Mặt bằng móng tỷ lệ 1/100 - 1/200 và mặt cắt móng tỷ lệ 1/50 kèm sơ đồ đấu nối hệ thống thoát nước mưa, xử lý nước thải, cấp nước, cấp điện\n" +
        "  + Bản cam kết bảo đảm an toàn đối với công trình liền kề giáp ranh (nếu có)\n" +
        "- **Nộp hồ sơ trực tuyến:** [Bấm vào đây](https://dvc.moc.gov.vn/vi/nps/apply)";
    }

    // QUẦY 5 - Y tế, Giáo dục, Văn hóa, Nội vụ
    if (/y te|an toan thuc pham|giao duc|chuyen truong|hoc phi|mam non|van hoa|le hoi|ton giao|tin nguong|noi vu|khen thuong|cong chuc/.test(t)) {
      return "🏛 **Quầy số 5 – Lĩnh vực Y tế, Giáo dục, Văn hóa, Nội vụ (Bộ Y tế; Bộ Giáo dục & đào tạo; Bộ Nội vụ; Bộ văn hóa)**:\n\n" +
        "- **Thời hạn giải quyết chuẩn theo Cổng DVCQG:**\n" +
        "  + Giáo dục (Bộ GD&ĐT): Chuyển trường học sinh tiểu học, THCS: Không quá 03 ngày làm việc; Cấp phép nhóm trẻ, lớp mầm non độc lập tư thục: Không quá 20 ngày làm việc.\n" +
        "  + Y tế (Bộ Y tế): Cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP cơ sở kinh doanh ăn uống: Không quá 15 ngày làm việc (kiểm tra thực tế điều kiện tại cơ sở trong 10 ngày làm việc).\n" +
        "  + Văn hóa (Bộ VHTTDL): Tiếp nhận thông báo tổ chức lễ hội, biểu diễn nghệ thuật: Không quá 05 ngày làm việc.\n" +
        "  + Nội vụ (Bộ Nội vụ): Thông báo hoạt động tín ngưỡng, tôn giáo: Không quá 05 ngày làm việc; Quản lý hội, thi đua khen thưởng: 07 - 10 ngày làm việc.\n" +
        "- **Thành phần hồ sơ:** Đơn/văn bản đề nghị theo mẫu từng Bộ; Hồ sơ pháp lý cơ sở/học sinh; Bản sao CCCD người đại diện; Bản thuyết minh cơ sở vật chất (đối với ATTP); Học bạ chính (đối với chuyển trường).\n" +
        "- **Nộp hồ sơ trực tuyến tương ứng các Bộ:**\n" +
        "  + Bộ Y tế: [Bấm vào đây](https://dichvucong.moh.gov.vn)\n" +
        "  + Bộ GD&ĐT: [Bấm vào đây](https://dichvucong.moet.gov.vn)\n" +
        "  + Bộ VHTTDL: [Bấm vào đây](https://dichvucong.bvhttdl.gov.vn)\n" +
        "  + Bộ Nội vụ: [Bấm vào đây](https://dichvucong.moha.gov.vn)";
    }

    // QUẦY 6 - Hộ tịch kết hôn, trích lục, Công thương, Phi địa giới
    if (/ket hon|dang ky ket hon|trich luc|ban sao|phi dia gioi|cong thuong|ban le ruou|thuoc la/.test(t)) {
      return "🏛 **Quầy số 6 – Lĩnh vực Hộ tịch (Đăng ký kết hôn, Trích lục bản sao hộ tịch), Công thương, Phi địa giới hành chính (Bộ Tư pháp; Bộ Công thương)**:\n\n" +
        "- **Thời hạn giải quyết chuẩn theo Cổng DVCQG:**\n" +
        "  + Đăng ký kết hôn (Bộ Tư pháp): Giải quyết ngay trong ngày làm việc tiếp nhận hồ sơ (tiếp nhận sau 15h thì giải quyết vào ngày làm việc tiếp theo; nếu cần xác minh thì không quá 03 ngày làm việc).\n" +
        "  + Cấp bản sao Trích lục hộ tịch (khai sinh, kết hôn, khai tử...): Giải quyết ngay trong ngày làm việc tiếp nhận yêu cầu.\n" +
        "  + Thủ tục Phi địa giới hành chính: Người dân được cấp bản sao trích lục hộ tịch ngay trong ngày tại bất kỳ cơ quan hộ tịch nào trên toàn quốc.\n" +
        "  + Công thương (Bộ Công thương): Cấp Giấy phép bán lẻ rượu, bán lẻ sản phẩm thuốc lá: Không quá 10 ngày làm việc.\n" +
        "- **Thành phần hồ sơ:**\n" +
        "  + Đăng ký kết hôn: Tờ khai đăng ký kết hôn (hai bên nam nữ cùng ký); Xuất trình bản chính Căn cước công dân hoặc VNeID của hai bên; Giấy xác nhận tình trạng hôn nhân (nếu bên kia không thường trú tại địa phương). Hai bên nam nữ bắt buộc phải có mặt khi nhận Giấy chứng nhận kết hôn và ký vào Sổ hộ tịch.\n" +
        "  + Trích lục bản sao hộ tịch: Tờ khai cấp bản sao trích lục; Xuất trình CCCD/VNeID người yêu cầu; Giấy tờ chứng minh quan hệ (nếu không phải diện trực hệ).\n" +
        "  + Bán lẻ rượu/thuốc lá: Đơn đề nghị cấp giấy phép; Bản sao Giấy chứng nhận đăng ký hộ kinh doanh; Hợp đồng nguyên tắc của thương nhân bán buôn/phân phối.\n" +
        "- **Nộp hồ sơ trực tuyến:**\n" +
        "  + Bộ Tư pháp: [Bấm vào đây](https://dichvucong.moj.gov.vn)\n" +
        "  + Bộ Công thương: [Bấm vào đây](https://dichvucong.moit.gov.vn)";
    }

    // QUẦY 7 - Bảo trợ xã hội, người có công
    if (/bao tro|xa hoi|nguoi cao tuoi|khuyet tat|mai tang phi|nguoi co cong|thuong binh|liet si|khang chien|tro cap/.test(t)) {
      return "🏛 **Quầy số 7 – Lĩnh vực Bảo trợ xã hội, người có công (Bộ Nội vụ, Bộ Y tế)**:\n\n" +
        "- **Thời hạn giải quyết chuẩn theo Cổng DVCQG:**\n" +
        "  + Trợ cấp xã hội hàng tháng cho người cao tuổi, người khuyết tật: Không quá 07 ngày làm việc tại cấp xã.\n" +
        "  + Hỗ trợ chi phí mai táng cho đối tượng bảo trợ: Không quá 03 ngày làm việc.\n" +
        "  + Chế độ chính sách Người có công với cách mạng (thương binh, bệnh binh, chế độ theo QĐ 290, 62, 49): Không quá 10 đến 15 ngày làm việc tại cấp xã.\n" +
        "- **Thành phần hồ sơ cần chuẩn bị:**\n" +
        "  + Tờ khai đề nghị hưởng trợ cấp xã hội (theo mẫu quy định tại Nghị định 20/2021/NĐ-CP)\n" +
        "  + Bản sao CCCD / mã định danh VNeID của đối tượng thụ hưởng\n" +
        "  + Giấy xác nhận mức độ khuyết tật (đối với người khuyết tật) hoặc Giấy báo tử / Trích lục khai tử (đối với mai táng phí)\n" +
        "  + Giấy tờ chứng minh công trạng, hồ sơ quân nhân, quyết định phục viên, huân huy chương (đối với Người có công)\n" +
        "- **Nộp hồ sơ trực tuyến:** [Bấm vào đây](https://dichvucong.gov.vn)";
    }

    // QUẦY 8 - Hộ tịch độc thân, giám hộ
    if (/doc than|tinh trang hon nhan|xac nhan doc than|giam ho/.test(t)) {
      return "🏛 **Quầy số 8 – Lĩnh vực Hộ tịch (Xác nhận tình trạng hôn nhân, giám hộ) (Bộ tư pháp)**:\n\n" +
        "- **Thời hạn giải quyết chuẩn theo Cổng DVCQG:**\n" +
        "  + Cấp Giấy xác nhận tình trạng hôn nhân (giấy chứng nhận độc thân để kết hôn, mua bán nhà đất, vay vốn ngân hàng...): Trong thời hạn 03 ngày làm việc kể từ ngày nhận đủ hồ sơ hợp lệ (nếu cần gửi văn bản xác minh nhiều nơi thì không quá 03 ngày làm việc tiếp theo).\n" +
        "  + Đăng ký giám hộ, cử người giám hộ, chấm dứt giám hộ: Không quá 03 ngày làm việc.\n" +
        "- **Thành phần hồ sơ cần chuẩn bị:**\n" +
        "  + Tờ khai cấp Giấy xác nhận tình trạng hôn nhân (theo Mẫu ban hành kèm Thông tư 04/2020/TT-BTP)\n" +
        "  + Xuất trình bản chính Căn cước công dân hoặc VNeID mức độ 2\n" +
        "  + Bản án hoặc Quyết định ly hôn đã có hiệu lực pháp luật của Tòa án (nếu người yêu cầu đã từng ly hôn)\n" +
        "  + Bản sao Giấy chứng tử / Trích lục khai tử của vợ/chồng (nếu vợ hoặc chồng đã mất)\n" +
        "  + Giấy xác nhận tình trạng hôn nhân đã cấp trước đây (nếu xin cấp lại do hết hạn 06 tháng)\n" +
        "- **Nộp hồ sơ trực tuyến:** [Bấm vào đây](https://dichvucong.moj.gov.vn)";
    }

    // QUẦY 9 - Khai sinh, khai tử, cải chính hộ tịch
    if (/khai sinh|lam giay khai sinh|khai tu|nhan cha con|nhan me con|cai chinh|doi ten|ho tich/.test(t)) {
      return "🏛 **Quầy số 9 – Lĩnh vực Hộ tịch (Đăng ký khai sinh, khai tử, cải chính hộ tịch) (Bộ Tư pháp)**:\n\n" +
        "- **Thời hạn giải quyết chuẩn theo Cổng DVCQG:**\n" +
        "  + Đăng ký khai sinh: Giải quyết ngay trong ngày làm việc tiếp nhận hồ sơ (tiếp nhận sau 15h thì giải quyết vào sáng ngày làm việc tiếp theo).\n" +
        "  + Dịch vụ công liên thông 3 trong 1 (Khai sinh - Thường trú - Cấp thẻ BHYT trẻ dưới 6 tuổi): Không quá 03 ngày làm việc cho toàn bộ 3 quy trình liên thông.\n" +
        "  + Đăng ký khai tử: Giải quyết ngay trong ngày làm việc tiếp nhận hồ sơ.\n" +
        "  + Đăng ký nhận cha mẹ con, cải chính hộ tịch, thay đổi họ tên dân tộc: Không quá 03 ngày làm việc (xác minh không quá 03 ngày tiếp theo).\n" +
        "- **Thành phần hồ sơ:**\n" +
        "  + Khai sinh: Tờ khai đăng ký khai sinh; Bản chính Giấy chứng sinh do cơ sở y tế cấp (hoặc văn bản của người làm chứng/giấy cam đoan); Xuất trình CCCD cha mẹ; Giấy đăng ký kết hôn của cha mẹ (nếu có).\n" +
        "  + Khai tử: Tờ khai đăng ký khai tử; Bản chính Giấy báo tử của bệnh viện/trạm y tế hoặc văn bản xác định việc chết; CCCD người mất và người đi khai tử.\n" +
        "  + Cải chính hộ tịch / nhận cha mẹ con: Tờ khai theo mẫu; Giấy tờ làm căn cứ cải chính / chứng cứ huyết thống ADN; Bản chính giấy tờ hộ tịch cần sửa đổi.\n" +
        "- **Nộp hồ sơ trực tuyến:** [Bấm vào đây](https://dichvucong.gov.vn) hoặc [Bấm vào đây](https://dichvucong.moj.gov.vn)";
    }

    // QUẦY 10 - Đăng ký kinh doanh (Bộ Tài chính)
    if (/kinh doanh|ho kinh doanh|dang ky kinh doanh|mo tiem|hop tac xa|to hop tac|ma so thue ho/.test(t)) {
      return "🏛 **Quầy số 10 – Đăng ký kinh doanh (Bộ Tài chính)**:\n\n" +
        "- **Thẩm quyền:** Bộ Tài chính (quản lý đăng ký hộ kinh doanh và mã số thuế cơ sở).\n" +
        "- **Thời hạn giải quyết chuẩn theo Cổng DVCQG:**\n" +
        "  + Đăng ký thành lập Hộ kinh doanh cá thể: 03 ngày làm việc kể từ ngày nhận đủ hồ sơ hợp lệ.\n" +
        "  + Thay đổi nội dung kinh doanh, tạm ngừng kinh doanh, chấm dứt hoạt động, cấp lại Giấy chứng nhận HKD: 03 ngày làm việc.\n" +
        "  + Đăng ký tổ hợp tác, hợp tác xã: 03 ngày làm việc.\n" +
        "- **Thành phần hồ sơ cần chuẩn bị:**\n" +
        "  + Giấy đề nghị đăng ký hộ kinh doanh (theo mẫu quy định tại Nghị định 01/2021/NĐ-CP)\n" +
        "  + Bản sao hợp lệ Căn cước công dân của chủ hộ kinh doanh và các thành viên gia đình tham gia\n" +
        "  + Biên bản họp gia đình cử người đại diện làm chủ hộ (nếu có)\n" +
        "  + Hợp đồng thuê địa điểm kinh doanh hoặc giấy tờ chứng minh quyền sử dụng hợp pháp địa điểm kinh doanh\n" +
        "  + Bản sao chứng chỉ hành nghề (nếu ngành nghề có điều kiện)\n" +
        "- **Nộp hồ sơ trực tuyến:** [Bấm vào đây](https://dichvucong.khanhhoa.gov.vn)";
    }

    return null; // Không khớp mẫu nhanh -> Gọi Gemini 3.8 Flash xử lý chuyên sâu
  }

  // Gọi AI để trả lời các câu hỏi nâng cao ngoài câu hỏi có sẵn
  function askAi(question, history, callback) {
    // 1. Thử gửi qua máy chủ nội bộ (/api/chat) nếu có
    var serverUrl = (window.HCC_AI_CONFIG && window.HCC_AI_CONFIG.apiUrl) || "/api/chat";
    var payloadMsgs = history.filter(function (m) {
      return m.role === "user" || m.role === "assistant";
    }).slice(-8).map(function (m) {
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      };
    });

    fetch(serverUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question, messages: payloadMsgs })
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Server status " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data && (data.text || data.reply)) {
          callback(data.text || data.reply);
        } else {
          throw new Error("No data text");
        }
      })
      .catch(function () {
        // 2. Dự phòng: Gọi trực tiếp API đám mây đã được giải mã khóa an toàn
        var key = getDecodedKey();
        if (!key) {
          callback("Tôi có thể hướng dẫn 10 quầy tiếp nhận, giờ làm việc và thủ tục hành chính tại phường Tây Nha Trang. Quý khách vui lòng gọi đường dây nóng " + PHONE + " để được cán bộ hỗ trợ trực tiếp.");
          return;
        }

        var directUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=" + key;
        var reqBody = {
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: payloadMsgs,
          generationConfig: {
            maxOutputTokens: 1200,
            temperature: 0.3
          }
        };

        fetch(directUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reqBody)
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            var answerText = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
            if (answerText) {
              callback(answerText.trim());
            } else {
              callback("Tôi có thể hướng dẫn chi tiết thủ tục hồ sơ theo đúng 10 quầy tại Trung tâm PVHCC phường Tây Nha Trang. Vui lòng liên hệ số " + PHONE + " hoặc tra cứu tại Bảng niêm yết trên trang chủ.");
            }
          })
          .catch(function () {
            callback("Hệ thống trợ lý ảo đang bận hoặc có sự cố đường truyền. Quý khách vui lòng gọi đường dây nóng " + PHONE + " hoặc tra cứu trực tiếp tại Bảng niêm yết để được phục vụ tốt nhất.");
          });
      });
  }

  var open = false;
  var busy = false;
  var messages = [{ role: "assistant", content: GREET }];
  var fab = null;
  var panel = null;
  var bubbleLeft = true;
  var drag = null;

  var fabWrap = document.createElement("div");
  fabWrap.className = "fab-wrap";

  var bubble = document.createElement("p");
  bubble.className = "think-bubble side-left";
  bubble.textContent = "Tôi là trợ lý ảo, hãy hỏi tôi khi bạn cần";

  var fabBtn = document.createElement("button");
  fabBtn.className = "fab";
  fabBtn.type = "button";
  fabBtn.setAttribute("aria-label", "Mở trợ lý ảo");
  fabBtn.innerHTML = '<img src="robot.jpg" alt="Trợ lý ảo">';

  fabWrap.appendChild(bubble);
  fabWrap.appendChild(fabBtn);

  var chat = document.createElement("section");
  chat.className = "chat";
  chat.setAttribute("role", "dialog");
  chat.setAttribute("aria-label", "Trợ lý ảo TTPVHCC");
  chat.innerHTML =
    '<header>' +
      '<img src="robot.jpg" alt="Trợ lý ảo">' +
      '<div class="grow"><strong>Trợ lý ảo Trung tâm PVHCC</strong><small>Kéo thanh này để di chuyển</small></div>' +
      '<button type="button" data-close class="chat-close-btn" aria-label="Đóng trợ lý ảo">✕ Đóng</button>' +
    '</header>' +
    '<div class="msgs"></div>' +
    '<div class="hints"></div>' +
    '<form class="composer"><input placeholder="Nhập câu hỏi của bạn…"><button class="btn" type="submit">Gửi</button></form>';

  var msgs = chat.querySelector(".msgs");
  var hints = chat.querySelector(".hints");
  var form = chat.querySelector("form");
  var input = chat.querySelector("input");
  var head = chat.querySelector("header");
  var closeBtn = chat.querySelector("[data-close]");

  HINTS.forEach(function (h) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = h;
    b.addEventListener("click", function () { send(h); });
    hints.appendChild(b);
  });

  function clamp(x, y, w, h) {
    return {
      x: Math.min(Math.max(8, window.innerWidth - w - 8), Math.max(8, x)),
      y: Math.min(Math.max(8, window.innerHeight - h - 8), Math.max(8, y))
    };
  }

  function placeFab() {
    if (!fab) fab = { x: window.innerWidth - 84, y: window.innerHeight - 84 };
    fabWrap.style.left = fab.x + "px";
    fabWrap.style.top = fab.y + "px";
    bubble.className = "think-bubble " + (bubbleLeft ? "side-left" : "side-right");
  }

  function placePanel() {
    chat.style.left = panel.x + "px";
    chat.style.top = panel.y + "px";
  }

  function render() {
    msgs.innerHTML = "";
    messages.forEach(function (m) {
      var row = document.createElement("div");
      row.className = "msg-row" + (m.role === "user" ? " user" : "");
      if (m.role === "assistant") {
        var img = document.createElement("img");
        img.className = "avatar";
        img.src = "robot.jpg";
        img.alt = "";
        row.appendChild(img);
      }
      var p = document.createElement("p");
      p.className = "bubble " + (m.role === "user" ? "me" : "bot");
      if (m.role === "assistant") {
        p.innerHTML = formatMessageHtml(m.content);
      } else {
        p.textContent = m.content;
      }
      row.appendChild(p);
      msgs.appendChild(row);
    });

    if (busy) {
      var w = document.createElement("p");
      w.className = "busy";
      w.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;">⏳</span> Đang soạn câu trả lời chuẩn xác…';
      msgs.appendChild(w);
    }
    msgs.scrollTop = msgs.scrollHeight;

    if (open) {
      fabWrap.hidden = true;
      fabWrap.style.display = "none";
      chat.hidden = false;
      chat.style.display = "flex";
    } else {
      fabWrap.hidden = false;
      fabWrap.style.display = "";
      chat.hidden = true;
      chat.style.display = "none";
    }
  }

  function send(text) {
    var q = String(text || "").trim();
    if (!q || busy) return;
    messages.push({ role: "user", content: q });
    busy = true;
    render();

    // 1. Kiểm tra câu trả lời nhanh từ cơ sở dữ liệu mẫu
    var directAns = answerQuick(q);
    if (directAns) {
      setTimeout(function () {
        messages.push({ role: "assistant", content: directAns });
        busy = false;
        render();
      }, 250);
      return;
    }

    // 2. Không khớp mẫu nhanh -> Gọi AI Gemini xử lý tùy biến chuyên sâu
    askAi(q, messages, function (aiAnswer) {
      messages.push({ role: "assistant", content: aiAnswer });
      busy = false;
      render();
    });
  }

  function setOpen(v) {
    open = v;
    if (open) {
      var w = Math.min(400, window.innerWidth - 24);
      var h = Math.min(640, window.innerHeight - 32);
      panel = clamp(window.innerWidth - w - 16, window.innerHeight - h - 16, w, h);
      placePanel();
    }
    render();
    if (open) {
      setTimeout(function () {
        input.focus();
      }, 100);
    }
  }

  function closeChat() {
    setOpen(false);
  }

  // Đăng ký sự kiện nút đóng (Đảm bảo hoạt động tin cậy)
  closeBtn.addEventListener("pointerdown", function (e) {
    e.stopPropagation();
  });
  closeBtn.addEventListener("mousedown", function (e) {
    e.stopPropagation();
  });
  closeBtn.addEventListener("touchstart", function (e) {
    e.stopPropagation();
  }, { passive: true });
  closeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeChat();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var val = input.value;
    input.value = "";
    send(val);
  });

  fabBtn.addEventListener("click", function (e) {
    if (drag && drag.moved) return;
    setOpen(true);
  });

  // Kéo thả nút tròn FAB
  fabBtn.addEventListener("pointerdown", function (e) {
    if (e.target.closest("button") !== fabBtn) return;
    drag = {
      kind: "fab",
      x0: e.clientX,
      y0: e.clientY,
      fx: fab ? fab.x : window.innerWidth - 84,
      fy: fab ? fab.y : window.innerHeight - 84,
      moved: false
    };
    fabBtn.setPointerCapture(e.pointerId);
  });

  fabBtn.addEventListener("pointermove", function (e) {
    if (!drag || drag.kind !== "fab") return;
    var dx = e.clientX - drag.x0;
    var dy = e.clientY - drag.y0;
    if (Math.hypot(dx, dy) > 4) drag.moved = true;
    fab = clamp(drag.fx + dx, drag.fy + dy, 64, 64);
    bubbleLeft = fab.x > window.innerWidth / 2;
    placeFab();
  });

  fabBtn.addEventListener("pointerup", function (e) {
    if (drag && drag.kind === "fab") {
      try { fabBtn.releasePointerCapture(e.pointerId); } catch (_) {}
      drag = null;
    }
  });

  // Kéo thả thanh tiêu đề chat header
  head.addEventListener("pointerdown", function (e) {
    if (e.target === closeBtn || e.target.closest("[data-close]")) return;
    var rect = chat.getBoundingClientRect();
    drag = {
      kind: "chat",
      x0: e.clientX,
      y0: e.clientY,
      cx: rect.left,
      cy: rect.top,
      cw: rect.width,
      ch: rect.height
    };
    head.setPointerCapture(e.pointerId);
  });

  head.addEventListener("pointermove", function (e) {
    if (!drag || drag.kind !== "chat") return;
    var dx = e.clientX - drag.x0;
    var dy = e.clientY - drag.y0;
    panel = clamp(drag.cx + dx, drag.cy + dy, drag.cw, drag.ch);
    placePanel();
  });

  head.addEventListener("pointerup", function (e) {
    if (drag && drag.kind === "chat") {
      try { head.releasePointerCapture(e.pointerId); } catch (_) {}
      drag = null;
    }
  });

  window.addEventListener("resize", function () {
    if (fab) {
      fab = clamp(fab.x, fab.y, 64, 64);
      bubbleLeft = fab.x > window.innerWidth / 2;
      placeFab();
    }
    if (open && panel) {
      var w = Math.min(400, window.innerWidth - 24);
      var h = Math.min(640, window.innerHeight - 32);
      panel = clamp(panel.x, panel.y, w, h);
      placePanel();
    }
  });

  document.body.appendChild(fabWrap);
  document.body.appendChild(chat);
  placeFab();
  render();
})();
