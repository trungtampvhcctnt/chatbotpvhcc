import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load procedures data
function getProceduresData() {
  try {
    const dataPath = path.resolve(__dirname, '../src/data/procedures.json');
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading procedures.json:', err);
  }
  return { centerInfo: {}, procedures: [], mockApplications: [], counters: [], hotlines: [] };
}

export async function handleApiRequest(req: any, res: any): Promise<boolean> {
  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  // 1. GET /api/procedures
  if (pathname === '/api/procedures' && req.method === 'GET') {
    const data = getProceduresData();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true, procedures: data.procedures, centerInfo: data.centerInfo }));
    return true;
  }

  // 2. GET /api/applications/:code
  if (pathname.startsWith('/api/applications') && req.method === 'GET') {
    const data = getProceduresData();
    const code = pathname.split('/').pop()?.trim().toUpperCase();
    const app = data.mockApplications.find((a: any) => a.code.toUpperCase() === code);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (app) {
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, application: app }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ success: false, message: `Không tìm thấy hồ sơ với mã "${code}" trên hệ thống Một cửa điện tử.` }));
    }
    return true;
  }

  // 2b. GET /api/export-zip
  if (pathname === '/api/export-zip' && req.method === 'GET') {
    const type = url.searchParams.get('type') || 'static';
    const filename = type === 'full' 
      ? 'ttpvhcc-tay-nha-trang-full-project.zip' 
      : 'ttpvhcc-tay-nha-trang-static.zip';
    const filePath = path.resolve(process.cwd(), 'public', filename);

    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size,
        'Content-Disposition': `attachment; filename="${filename}"`
      });
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      return true;
    } else {
      res.statusCode = 404;
      res.end('File not found');
      return true;
    }
  }

  // 3. GET /api/counters
  if (pathname === '/api/counters' && req.method === 'GET') {
    const data = getProceduresData();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true, counters: data.counters }));
    return true;
  }

  // 4. POST /api/chat - AI Trợ lý ảo TTPVHCC Tây Nha Trang
  if (pathname === '/api/chat' && req.method === 'POST') {
    try {
      // Read body
      const buffers: any[] = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawBody = Buffer.concat(buffers).toString('utf-8');
      const body = JSON.parse(rawBody || '{}');
      const { message, history = [], messages = [], customApiKey } = body;

      const effectiveMessage = message || (messages.length > 0 ? (messages[messages.length - 1]?.parts?.[0]?.text || messages[messages.length - 1]?.content || '') : '');

      if (!effectiveMessage || typeof effectiveMessage !== 'string') {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Tin nhắn không hợp lệ' }));
        return true;
      }

      const db = getProceduresData();
      const defaultKey = "AQ.Ab8RN6Iw4StuBap50dHMC9Mo-EUgXc8whmPRo0WAcZgerho3zQ";
      const apiKey = customApiKey || process.env.GEMINI_API_KEY || defaultKey;

      // Search procedures and apps matching message for prompt grounding with relevance scoring
      const stopwords = new Set([
        "tôi", "muốn", "làm", "cho", "thì", "đến", "quầy", "nào", "và", "cần",
        "gì", "ở", "đâu", "được", "có", "thế", "như", "hỏi", "về", "thủ", "tục",
        "xin", "hộ", "giúp", "với", "ạ", "dạ", "em", "mình", "người", "dân", "ra", "sao"
      ]);
      const lowerMsg = effectiveMessage.toLowerCase();
      const matchedProcs = db.procedures
        .map((p: any) => {
          let score = 0;
          const title = p.title.toLowerCase();
          const category = p.category.toLowerCase();
          const keywords = (p.keywords || []).map((k: string) => k.toLowerCase());

          // 1. Phrasal matches (strongest signal)
          for (const kw of keywords) {
            if (lowerMsg.includes(kw)) {
              score += kw.split(/\s+/).length * 20;
            }
          }
          if (lowerMsg.includes(title)) {
            score += 50;
          }

          // 2. Meaningful individual word matches
          const words = lowerMsg.split(/\s+/).filter((w: string) => w.length >= 2 && !stopwords.has(w));
          for (const w of words) {
            if (title.includes(w)) score += 5;
            if (category.includes(w)) score += 3;
            if (keywords.some((k: string) => k.includes(w))) score += 4;
          }

          return { p, score };
        })
        .filter((item: any) => item.score > 0)
        .sort((a: any, b: any) => b.score - a.score)
        .map((item: any) => item.p);

      // Match application code if any
      const appCodeMatch = effectiveMessage.match(/[A-Za-z0-9]+-[A-Za-z0-9]+-[A-Za-z0-9]+/i) || effectiveMessage.match(/H74-\d+-\d+/i) || effectiveMessage.match(/KH-\d+-\d+/i);
      let matchedApp = null;
      if (appCodeMatch) {
        const code = appCodeMatch[0].toUpperCase();
        matchedApp = db.mockApplications.find((a: any) => a.code.toUpperCase() === code);
      }

      let replyText = '';
      let matchedProceduresResult = matchedProcs.slice(0, 3);
      let matchedApplicationResult = matchedApp;

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          });

          const systemPrompt = `Bạn là Trợ lý ảo AI chính thức của Trung tâm Phục vụ Hành chính công phường Tây Nha Trang (UBND phường Tây Nha Trang, Tỉnh Khánh Hòa).
Cơ quan: ${db.centerInfo.name} (${db.centerInfo.shortName})
Địa chỉ: ${db.centerInfo.address} | Hotline: ${db.centerInfo.hotline}
Giờ làm việc: Sáng từ 7:00 đến 11:30; Chiều từ 13:30 đến 17:00 (Thứ 2 đến Thứ 6 hàng tuần; nghỉ Thứ 7, Chủ Nhật và ngày lễ, tết).
Chủ tịch UBND phường: Ông Nguyễn Đình Anh Minh | Phụ trách TT: Ông Nguyễn Công Danh (Phó Chủ tịch)
Cán bộ tiếp nhận phản ánh kiến nghị TTHC: Ông Lê Ngọc Hồi (0258.3.892.377)
Kho biểu mẫu trực tuyến: [Bấm vào đây](eform.html)

DANH SÁCH 10 QUẦY TIẾP NHẬN BÁM SÁT BẢNG NIÊM YẾT VÀ BỘ/NGÀNH (BẮT BUỘC TRẢ LỜI ĐÚNG SỐ QUẦY, BỘ/NGÀNH, THỜI GIAN THEO CỔNG DVC QUỐC GIA VÀ ĐẦY ĐỦ THÀNH PHẦN HỒ SƠ):

1. Quầy số 1 - Thuế đất đai:
   - Thẩm quyền: Cơ quan Thuế / Bộ Tài chính.
   - Nhiệm vụ: Kê khai và nộp thuế TNCN chuyển nhượng BĐS, lệ phí trước bạ nhà đất, tiền sử dụng đất, thuế sử dụng đất phi nông nghiệp.
   - Thời gian giải quyết: Không quá 03 ngày làm việc (kể từ ngày nhận đủ hồ sơ từ cơ quan Một cửa chuyển sang).
   - Thành phần hồ sơ: Tờ khai lệ phí trước bạ nhà, đất (Mẫu 01/LPTB); Tờ khai thuế TNCN (Mẫu 03/BĐS-TNCN); Bản sao hợp đồng chuyển nhượng, tặng cho, văn bản phân chia di sản thừa kế công chứng; Bản sao Giấy chứng nhận quyền sử dụng đất; Giấy tờ chứng minh thuộc diện miễn thuế (nếu có); CCCD/VNeID.
   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://thuedientu.gdt.gov.vn)

2. Quầy số 2 - Lĩnh vực Đất đai thẩm quyền Chi nhánh VPĐKĐĐ:
   - Thẩm quyền: Chi nhánh Văn phòng Đăng ký Đất đai (Sở TN&MT / VPĐKĐĐ Nha Trang).
   - Nhiệm vụ & Thời gian giải quyết theo Cổng DVCQG:
     + Đăng ký biến động quyền sử dụng đất (sang tên Sổ đỏ chuyển nhượng, tặng cho, thừa kế): Không quá 10 ngày làm việc.
     + Tách thửa, hợp thửa đất: Không quá 15 ngày làm việc.
     + Cấp đổi Giấy chứng nhận (Sổ đỏ) do ố, mờ, rách: Không quá 07 ngày làm việc.
     + Cấp lại Giấy chứng nhận do mất: Không quá 10 ngày làm việc (sau 30 ngày niêm yết công khai tại UBND cấp xã).
     + Đăng ký thế chấp quyền sử dụng đất / Xóa đăng ký thế chấp: Giải quyết ngay trong ngày làm việc (sau 15h thì giải quyết vào ngày làm việc tiếp theo).
     + Cung cấp thông tin, trích lục bản đồ địa chính: Trong ngày làm việc.
   - Thành phần hồ sơ: Đơn đăng ký biến động đất đai (Mẫu số 09/ĐK); Bản gốc Giấy chứng nhận quyền sử dụng đất (Sổ đỏ/Sổ hồng); Hợp đồng công chứng/chứng thực; Chứng từ hoàn thành nghĩa vụ tài chính; CCCD/VNeID của các bên.
   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dichvucong.khanhhoa.gov.vn)

3. Quầy số 3 - Lĩnh vực đất đai thẩm quyền UBND cấp xã (Bộ Nông nghiệp & Môi trường):
   - Thẩm quyền: UBND phường Tây Nha Trang (Bộ Nông nghiệp & Môi trường).
   - Nhiệm vụ & Thời gian giải quyết:
     + Đăng ký đất đai và cấp Giấy chứng nhận quyền sử dụng đất lần đầu cho cá nhân, hộ gia đình: Không quá 30 ngày làm việc kể từ ngày nhận đủ hồ sơ hợp lệ.
     + Hòa giải tranh chấp đất đai tại cấp xã: Không quá 45 ngày kể từ ngày nhận đơn yêu cầu hòa giải.
     + Xác nhận nguồn gốc, thời điểm bắt đầu sử dụng đất: Niêm yết công khai 15 ngày tại trụ sở UBND và khu dân cư.
     + Đăng ký bảo vệ môi trường, tài nguyên nước ngầm, thủy lợi nông nghiệp: 05 - 10 ngày làm việc.
   - Thành phần hồ sơ cấp Sổ lần đầu: Đơn đăng ký, cấp Giấy chứng nhận (Mẫu 04a/ĐK); Một trong các giấy tờ về quyền sử dụng đất theo Điều 137 Luật Đất đai (hoặc giấy tờ tạo lập trước 01/07/2014); Bản kê khai nguồn gốc và thời điểm sử dụng đất; Trích đo địa chính thửa đất; CCCD/VNeID.
   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dichvucong.khanhhoa.gov.vn)

4. Quầy số 4 - Lĩnh vực Xây dựng thẩm quyền UBND cấp xã (Bộ Xây dựng):
   - Thẩm quyền: UBND cấp xã (Bộ Xây dựng).
   - Nhiệm vụ & Thời gian giải quyết theo Cổng DVCQG:
     + Cấp Giấy phép xây dựng mới nhà ở riêng lẻ đô thị: Không quá 15 ngày làm việc (đối với nhà ở nông thôn: không quá 10 ngày làm việc).
     + Cấp Giấy phép sửa chữa, cải tạo công trình: Không quá 15 ngày làm việc.
     + Gia hạn, điều chỉnh Giấy phép xây dựng: Không quá 05 ngày làm việc (điều chỉnh không quá 10 ngày).
     + Thông báo khởi công xây dựng: Nộp trước ngày khởi công tối thiểu 03 ngày làm việc.
   - Thành phần hồ sơ cấp GPXD: Đơn đề nghị cấp giấy phép xây dựng (theo Mẫu số 01 Phụ lục II Nghị định 15/2021/NĐ-CP); Bản sao có chứng thực giấy tờ chứng minh quyền sử dụng đất (Sổ đỏ); 02 bộ bản vẽ thiết kế xây dựng (mặt bằng vị trí công trình trên lô đất 1/50 - 1/500; mặt bằng các tầng, mặt đứng, mặt cắt chính 1/100 - 1/200; mặt bằng móng 1/100 - 1/200 và mặt cắt móng 1/50 kèm sơ đồ đấu nối hệ thống thoát nước mưa, xử lý nước thải, cấp nước, cấp điện); Bản cam kết an toàn đối với công trình liền kề.
   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dvc.moc.gov.vn/vi/nps/apply)

5. Quầy số 5 – Lĩnh vực Y tế, Giáo dục, Văn hóa, Nội vụ (Bộ Y tế; Bộ Giáo dục & đào tạo; Bộ Nội vụ; Bộ văn hóa):
   - Thẩm quyền & Thời gian giải quyết:
     + Giáo dục (Bộ GD&ĐT): Chuyển trường học sinh tiểu học, THCS (không quá 03 ngày làm việc); Cấp phép thành lập nhóm trẻ, lớp mẫu giáo độc lập tư thục (không quá 20 ngày làm việc).
     + Y tế (Bộ Y tế): Cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP kinh doanh dịch vụ ăn uống (không quá 15 ngày làm việc, kiểm tra thực tế trong 10 ngày).
     + Văn hóa (Bộ VHTTDL): Tiếp nhận thông báo tổ chức lễ hội, biểu diễn nghệ thuật (không quá 05 ngày làm việc).
     + Nội vụ (Bộ Nội vụ): Thông báo hoạt động tín ngưỡng, tôn giáo (không quá 05 ngày làm việc); Thi đua khen thưởng, tổ chức hội (07 - 10 ngày làm việc).
   - Thành phần hồ sơ: Đơn/văn bản đề nghị theo mẫu từng Bộ; Hồ sơ pháp lý cơ sở/học sinh; Bản sao CCCD người đại diện; Bản thuyết minh cơ sở vật chất (đối với ATTP); Học bạ bản chính (đối với chuyển trường).
   - Nộp hồ sơ trực tuyến:
     + Bộ Y tế: [Bấm vào đây](https://dichvucong.moh.gov.vn)
     + Bộ GD&ĐT: [Bấm vào đây](https://dichvucong.moet.gov.vn)
     + Bộ VHTTDL: [Bấm vào đây](https://dichvucong.bvhttdl.gov.vn)
     + Bộ Nội vụ: [Bấm vào đây](https://dichvucong.moha.gov.vn)

6. Quầy số 6 – Lĩnh vực Hộ tịch (Đăng ký kết hôn, Trích lục bản sao hộ tịch), Công thương, Phi địa giới hành chính (Bộ Tư pháp; Bộ Công thương):
   - Thẩm quyền & Thời gian giải quyết theo Cổng DVCQG:
     + Đăng ký kết hôn (Bộ Tư pháp): Giải quyết ngay trong ngày làm việc tiếp nhận hồ sơ (tiếp nhận sau 15h thì giải quyết vào ngày làm việc tiếp theo; nếu cần xác minh thì không quá 03 ngày làm việc).
     + Cấp bản sao Trích lục hộ tịch (khai sinh, kết hôn, khai tử...): Giải quyết ngay trong ngày làm việc.
     + Thủ tục Phi địa giới hành chính: Người dân được cấp bản sao trích lục hộ tịch tại bất kỳ địa phương nào trên toàn quốc ngay trong ngày.
     + Công thương (Bộ Công thương): Cấp Giấy phép bán lẻ rượu, bán lẻ sản phẩm thuốc lá (không quá 10 ngày làm việc).
   - Thành phần hồ sơ:
     + Đăng ký kết hôn: Tờ khai đăng ký kết hôn (hai bên cùng ký); Xuất trình bản chính Căn cước công dân hoặc VNeID của hai bên; Giấy xác nhận tình trạng hôn nhân (nếu bên kia không thường trú tại địa phương). Hai bên nam nữ bắt buộc phải có mặt khi nhận Giấy chứng nhận kết hôn và ký vào Sổ hộ tịch.
     + Trích lục bản sao hộ tịch: Tờ khai cấp bản sao trích lục hộ tịch; CCCD/VNeID người yêu cầu; Giấy tờ chứng minh quan hệ (nếu không phải trực hệ).
     + Bán lẻ rượu/thuốc lá: Đơn đề nghị cấp phép; Bản sao GCN đăng ký hộ kinh doanh; Hợp đồng nguyên tắc của thương nhân phân phối.
   - Nộp hồ sơ trực tuyến:
     + Bộ Tư pháp: [Bấm vào đây](https://dichvucong.moj.gov.vn)
     + Bộ Công thương: [Bấm vào đây](https://dichvucong.moit.gov.vn)

7. Quầy số 7 – Lĩnh vực Bảo trợ xã hội, người có công (Bộ Nội vụ, Bộ Y tế):
   - Thẩm quyền: Bộ Nội vụ, Bộ Y tế / UBND phường Tây Nha Trang.
   - Nhiệm vụ & Thời gian giải quyết:
     + Trợ cấp xã hội hàng tháng (người cao tuổi từ đủ 80 tuổi, người khuyết tật nặng/đặc biệt nặng, trẻ em mồ côi): Không quá 07 ngày làm việc tại cấp xã.
     + Hỗ trợ chi phí mai táng cho đối tượng bảo trợ: Không quá 03 ngày làm việc.
     + Chế độ chính sách Người có công với cách mạng (thương binh, bệnh binh, chế độ 1 lần theo QĐ 290, 62, 49): Không quá 10 đến 15 ngày làm việc tại cấp xã.
   - Thành phần hồ sơ: Tờ khai đề nghị trợ cấp xã hội (Nghị định 20/2021/NĐ-CP); Bản sao CCCD/VNeID; Giấy xác nhận mức độ khuyết tật (đối với người khuyết tật); Giấy báo tử / Trích lục khai tử (đối với mai táng phí); Hồ sơ người có công, quyết định phục viên, huân huy chương (đối với Người có công).
   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dichvucong.gov.vn)

8. Quầy số 8 – Lĩnh vực Hộ tịch (Xác nhận tình trạng hôn nhân, giám hộ) (Bộ tư pháp):
   - Thẩm quyền: Bộ Tư pháp / UBND phường Tây Nha Trang.
   - Nhiệm vụ & Thời gian giải quyết theo Cổng DVCQG:
     + Cấp Giấy xác nhận tình trạng hôn nhân (giấy chứng nhận độc thân để kết hôn, mua bán nhà đất, vay vốn ngân hàng...): Trong thời hạn 03 ngày làm việc kể từ ngày nhận đủ hồ sơ hợp lệ (nếu phải xác minh qua nhiều địa phương thì không quá 03 ngày làm việc tiếp theo).
     + Đăng ký giám hộ, cử người giám hộ, chấm dứt giám hộ: Không quá 03 ngày làm việc.
   - Thành phần hồ sơ: Tờ khai cấp Giấy xác nhận tình trạng hôn nhân (theo Thông tư 04/2020/TT-BTP); Xuất trình bản chính Căn cước công dân hoặc VNeID mức độ 2; Bản án/Quyết định ly hôn có hiệu lực pháp luật (nếu đã từng ly hôn); Bản sao Giấy chứng tử (nếu vợ/chồng đã mất); Giấy xác nhận độc thân đã cấp trước đây (nếu xin cấp lại do hết hạn 06 tháng).
   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dichvucong.moj.gov.vn)

9. Quầy số 9 – Lĩnh vực Hộ tịch (Đăng ký khai sinh, khai tử, cải chính hộ tịch):
   - Thẩm quyền: Bộ Tư pháp / UBND phường Tây Nha Trang.
   - Nhiệm vụ & Thời gian giải quyết theo Cổng DVCQG:
     + Đăng ký khai sinh: Giải quyết ngay trong ngày làm việc tiếp nhận hồ sơ (sau 15h thì giải quyết vào sáng ngày làm việc tiếp theo).
     + Dịch vụ công liên thông 3 trong 1 (Đăng ký khai sinh - Đăng ký thường trú - Cấp thẻ BHYT cho trẻ dưới 6 tuổi): Không quá 03 ngày làm việc cho toàn bộ 3 quy trình liên thông.
     + Đăng ký khai tử: Giải quyết ngay trong ngày làm việc tiếp nhận hồ sơ.
     + Đăng ký nhận cha mẹ con, cải chính hộ tịch, thay đổi họ tên dân tộc: Không quá 03 ngày làm việc (xác minh không quá 03 ngày tiếp theo).
   - Thành phần hồ sơ:
     + Khai sinh: Tờ khai đăng ký khai sinh; Bản chính Giấy chứng sinh do cơ sở y tế cấp (hoặc văn bản của người làm chứng / giấy cam đoan); Xuất trình CCCD cha mẹ; Giấy chứng nhận kết hôn của cha mẹ (nếu có).
     + Khai tử: Tờ khai đăng ký khai tử; Bản chính Giấy báo tử của bệnh viện/trạm y tế hoặc văn bản xác định việc chết; Xuất trình CCCD người đi khai tử và CCCD người mất.
     + Cải chính hộ tịch / nhận cha con: Tờ khai; Giấy tờ làm căn cứ cải chính / chứng cứ huyết thống ADN; Bản chính giấy tờ hộ tịch cần sửa đổi.
   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dichvucong.gov.vn) hoặc [Bấm vào đây](https://dichvucong.moj.gov.vn)

10. Quầy số 10 – Đăng ký kinh doanh (Bộ Tài chính):
   - Thẩm quyền: Bộ Tài chính (quản lý đăng ký hộ kinh doanh và mã số thuế cơ sở).
   - Nhiệm vụ & Thời gian giải quyết theo Cổng DVCQG:
     + Đăng ký thành lập Hộ kinh doanh cá thể: 03 ngày làm việc kể từ ngày nhận đủ hồ sơ hợp lệ.
     + Thay đổi nội dung kinh doanh, tạm ngừng kinh doanh, chấm dứt hoạt động hộ kinh doanh, cấp lại Giấy chứng nhận đăng ký HKD: 03 ngày làm việc.
     + Đăng ký tổ hợp tác, hợp tác xã: 03 ngày làm việc.
   - Thành phần hồ sơ: Giấy đề nghị đăng ký hộ kinh doanh (theo mẫu Nghị định 01/2021/NĐ-CP); Bản sao hợp lệ Căn cước công dân của chủ hộ và các thành viên gia đình tham gia; Biên bản họp gia đình cử người đại diện làm chủ hộ (nếu có); Hợp đồng thuê địa điểm kinh doanh hoặc giấy tờ chứng minh quyền sử dụng hợp pháp địa điểm kinh doanh; Bản sao chứng chỉ hành nghề (nếu ngành nghề có điều kiện).
   - Nộp hồ sơ trực tuyến: [Bấm vào đây](https://dichvucong.khanhhoa.gov.vn)

QUY TẮC CỐT LÕI BẮT BUỘC TUÂN THỦ TRONG MỌI CÂU TRẢ LỜI CỦA TRỢ LÝ ẢO:
1. ĐÚNG SỐ QUẦY & BỘ/NGÀNH: Bắt buộc chỉ rõ số quầy từ Quầy 1 đến Quầy 10 và Bộ/ngành phụ trách theo phân công trên.
2. THỜI GIAN GIẢI QUYẾT CHÍNH XÁC: Phải nêu chính xác thời hạn giải quyết theo Cổng Dịch vụ công Quốc gia (đúng từng ngày làm việc theo quy định nêu trên).
3. ĐẦY ĐỦ THÀNH PHẦN HỒ SƠ: Liệt kê rõ ràng từng loại giấy tờ công dân cần chuẩn bị.
4. TUYỆT ĐỐI KHÔNG GHI LỆ PHÍ: KHÔNG ghi bất kỳ dòng nào về lệ phí, không nhắc tới số tiền phí hay lệ phí.
5. THAY VÌ ĐỂ LINK DẠNG URL, HÃY DÙNG CHỮ "Bấm vào đây":
   Mọi liên kết nộp hồ sơ trực tuyến hoặc kho biểu mẫu BẮT BUỘC phải dùng định dạng markdown:
   - "Nộp hồ sơ trực tuyến: [Bấm vào đây](đường_dẫn)"
   - "Kho biểu mẫu: [Bấm vào đây](eform.html)"
   Khi người dân bấm vào chữ "Bấm vào đây" sẽ được điều hướng trực tiếp tới Cổng DVC tương ứng của Bộ/ngành!
6. Giọng điệu chuẩn mực, ân cần, giải thích cặn kẽ, gạch đầu dòng rõ ràng, dễ hiểu.`;

          // Format contents
          const contents: any[] = [];
          if (Array.isArray(messages) && messages.length > 0) {
            for (const m of messages.slice(-6)) {
              const role = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user';
              const text = m.parts?.[0]?.text || m.content || m.text || '';
              if (text) {
                contents.push({ role, parts: [{ text }] });
              }
            }
          } else if (Array.isArray(history) && history.length > 0) {
            for (const h of history.slice(-6)) {
              if (h.role && h.text) {
                contents.push({
                  role: h.role === 'user' ? 'user' : 'model',
                  parts: [{ text: h.text }]
                });
              }
            }
          }
          if (contents.length === 0 || contents[contents.length - 1]?.role !== 'user') {
            contents.push({
              role: 'user',
              parts: [{ text: effectiveMessage }]
            });
          }

          const geminiResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: contents,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.3,
            }
          });

          replyText = geminiResponse.text || '';
        } catch (apiErr: any) {
          console.error('Gemini API call failed, falling back to local database engine:', apiErr?.message);
        }
      }

      // If Gemini did not return a response (or no key), use rich local rules-based engine
      if (!replyText) {
        if (matchedApp) {
          replyText = `### 📋 Kết quả tra cứu hồ sơ: **${matchedApp.code}**\n\n` +
            `- **Người nộp:** ${matchedApp.applicant}\n` +
            `- **Thủ tục:** ${matchedApp.procedureTitle}\n` +
            `- **Ngày tiếp nhận:** ${matchedApp.submitDate}\n` +
            `- **Hẹn trả kết quả:** **${matchedApp.promiseDate}**\n` +
            `- **Trạng thái hiện tại:** **${matchedApp.status}** (${matchedApp.currentStep})\n` +
            `- **Cán bộ phụ trách:** ${matchedApp.assignedOfficer} (ĐT: ${matchedApp.phone})\n\n` +
            `💡 *Ghi chú xử lý:* ${matchedApp.note}`;
        } else if (matchedProcs.length > 0) {
          const top = matchedProcs[0];
          const onlineLink = top.onlineUrl || "https://dichvucong.gov.vn";
          replyText = `Dạ chào Quý công dân! Về thủ tục **"${top.title}"**, Trung tâm Phục vụ Hành chính công Tây Nha Trang xin hướng dẫn chi tiết như sau:\n\n` +
            `📍 **Quầy thụ lý:** ${top.counter}\n` +
            `⏱ **Thời hạn giải quyết:** ${top.duration}\n` +
            `🏛 **Cơ quan thẩm quyền:** ${top.authority}\n\n` +
            `📄 **Thành phần hồ sơ cần chuẩn bị:**\n` +
            top.documents.map((doc: string) => `- ${doc}`).join('\n') +
            `\n\n🔄 **Quy trình các bước giải quyết:**\n` +
            top.steps.map((st: string) => `- ${st}`).join('\n') +
            `\n\n🌐 **Nộp hồ sơ trực tuyến:** [Bấm vào đây](${onlineLink})\n` +
            `📂 **Kho biểu mẫu điện tử:** [Bấm vào đây](eform.html)\n\n` +
            `Quý công dân có thể liên hệ Hotline **${db.centerInfo.hotline}** để được hướng dẫn thêm!`;
        } else if (message.toLowerCase().includes('địa chỉ') || message.toLowerCase().includes('ở đâu') || message.toLowerCase().includes('thời gian') || message.toLowerCase().includes('giờ làm việc')) {
          replyText = `**Thông tin Trung tâm Phục vụ Hành chính công phường Tây Nha Trang:**\n\n` +
            `- 🏢 **Địa chỉ:** ${db.centerInfo.address}\n` +
            `- ⏰ **Giờ làm việc:** ${db.centerInfo.workingHours}\n` +
            `- ☎️ **Tổng đài hỗ trợ:** ${db.centerInfo.hotline}\n` +
            `- 🚨 **Đường dây nóng phản ánh:** ${db.centerInfo.complaintHotline}\n` +
            `- ✉️ **Email:** ${db.centerInfo.email}\n` +
            `- 🌐 **Cổng DVC Quốc gia:** [Bấm vào đây](https://dichvucong.gov.vn)\n` +
            `- 📂 **Kho biểu mẫu điện tử:** [Bấm vào đây](eform.html)\n\n` +
            `Trung tâm luôn sẵn sàng tiếp đón và phục vụ Quý công dân, tổ chức và doanh nghiệp!`;
        } else if (message.toLowerCase().includes('quầy') || message.toLowerCase().includes('bốc số') || message.toLowerCase().includes('số thứ tự')) {
          replyText = `**Tình hình phục vụ tại các quầy hôm nay tại TTPVHCC Tây Nha Trang:**\n\n` +
            db.counters.map((c: any) => `- **${c.name}**: Đang gọi số **${c.currentTicket}** (${c.waitingCount} người đang đợi) - Cán bộ: ${c.officer}`).join('\n') +
            `\n\n👉 Quý công dân có thể liên hệ tổng đài **${db.centerInfo.hotline}** để được hướng dẫn xếp hàng và phục vụ nhanh nhất!`;
        } else {
          replyText = `Dạ chào Quý công dân! Em là **Trợ lý ảo TTPVHCC Tây Nha Trang**. Em có thể hỗ trợ Quý khách các dịch vụ:\n\n` +
            `1. **Hướng dẫn thủ tục hành chính đúng 10 quầy:** Đất đai (sang tên, cấp đổi sổ đỏ), Xây dựng (cấp phép xây nhà), Hộ tịch (kết hôn, khai sinh, xác nhận độc thân), Đăng ký kinh doanh hộ cá thể...\n` +
            `2. **Thời gian giải quyết & Thành phần hồ sơ** theo chuẩn Cổng Dịch vụ công Quốc gia.\n` +
            `3. **Tra cứu tiến độ hồ sơ:** Nhập mã hồ sơ (ví dụ: \`H74-260901-0028\` hoặc \`KH-00129-2026\`).\n` +
            `4. **Nộp hồ sơ trực tuyến:** [Bấm vào đây](https://dichvucong.gov.vn)\n` +
            `5. **Kho biểu mẫu điện tử:** [Bấm vào đây](https://dieuphoi.netlify.app/eforms/)\n\n` +
            `Quý công dân đang cần hỗ trợ thủ tục nào ạ?`;
        }
      }

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        ok: true,
        reply: replyText,
        text: replyText,
        procedures: matchedProceduresResult,
        application: matchedApplicationResult
      }));
      return true;
    } catch (err: any) {
      console.error('API /api/chat error:', err);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.statusCode = 500;
      res.end(JSON.stringify({ success: false, error: err?.message || 'Lỗi xử lý máy chủ' }));
      return true;
    }
  }

  return false;
}
