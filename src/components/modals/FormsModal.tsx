import React, { useState } from 'react';
import { X, FileText, Download, Search, CheckCircle, ExternalLink, Printer } from 'lucide-react';
import proceduresData from '../../data/procedures.json';

interface FormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskChatbot: (formName: string) => void;
}

export const FormsModal: React.FC<FormsModalProps> = ({ isOpen, onClose, onAskChatbot }) => {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const [downloadedForm, setDownloadedForm] = useState<string | null>(null);

  const formsList = [
    { name: "Tờ khai đăng ký khai sinh (Liên thông 3 trong 1 - Quầy 9)", category: "HỘ TỊCH", file: "To-khai-khai-sinh.docx", size: "195 KB", eformId: "ef_khaisinh" },
    { name: "Tờ khai đăng ký khai tử (Quầy 9)", category: "HỘ TỊCH", file: "To-khai-khai-tu.docx", size: "185 KB", eformId: "ef_khaitu" },
    { name: "Tờ khai đăng ký kết hôn (Quầy 6)", category: "HỘ TỊCH", file: "To-khai-ket-hon.docx", size: "180 KB", eformId: "ef_kethon" },
    { name: "Tờ khai cấp Giấy xác nhận tình trạng hôn nhân / Độc thân (Quầy 8)", category: "HỘ TỊCH", file: "To-khai-xac-nhan-doc-than.docx", size: "175 KB", eformId: "ef_doc_than" },
    { name: "Đơn đề nghị cấp Giấy phép xây dựng nhà ở riêng lẻ (Mẫu 01 - Quầy 4)", category: "XÂY DỰNG", file: "Mau-01-GPXD.pdf", size: "245 KB", eformId: "ef_gpxd" },
    { name: "Đơn đăng ký biến động đất đai, tài sản gắn liền với đất (Mẫu 09/ĐK - Quầy 2)", category: "ĐẤT ĐAI", file: "Mau-09-DK-Dat-dai.pdf", size: "320 KB", eformId: "ef_biendong_dat" },
    { name: "Đơn đăng ký, cấp Giấy chứng nhận quyền sử dụng đất lần đầu (Mẫu 04a/ĐK - Quầy 3)", category: "ĐẤT ĐAI", file: "Mau-04a-Cap-GCN-lan-dau.pdf", size: "290 KB", eformId: "ef_cap_gcn_landau" },
    { name: "Giấy đề nghị đăng ký thành lập Hộ kinh doanh cá thể (Quầy 10)", category: "ĐĂNG KÝ KINH DOANH", file: "Mau-HKD-01.docx", size: "210 KB", eformId: "ef_dangky_hkd" },
    { name: "Tờ khai Lệ phí trước bạ nhà, đất (Mẫu số 01/LPTB - Quầy 1)", category: "THUẾ ĐẤT ĐAI", file: "Mau-01-LPTB.pdf", size: "230 KB", eformId: "ef_thue_truocba" },
    { name: "Đơn xin chuyển trường học sinh Tiểu học, THCS (Quầy 5)", category: "GIÁO DỤC", file: "Don-xin-chuyen-truong.docx", size: "160 KB", eformId: "ef_chuyentruong" },
    { name: "Đơn đề nghị cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP (Quầy 5)", category: "AN TOÀN THỰC PHẨM", file: "Mau-ATTP-01.pdf", size: "280 KB", eformId: "ef_attp" },
    { name: "Tờ khai đề nghị trợ cấp xã hội hàng tháng theo NĐ 20/2021/NĐ-CP (Quầy 7)", category: "BẢO TRỢ XÃ HỘI", file: "Mau-Tro-cap-BTXH.docx", size: "220 KB", eformId: "ef_btxh" },
    { name: "Giấy ủy quyền giải quyết thủ tục hành chính tại TTPVHCC", category: "THỦ TỤC CHUNG", file: "Giay-uy-quyen-TTHC.docx", size: "170 KB", eformId: "ef_uyquyen_tthc" }
  ];

  const filteredForms = formsList.filter(f => 
    !searchTerm || 
    f.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleDownload = (formName: string) => {
    setDownloadedForm(formName);
    // Create dummy text blob simulating official government form
    const sampleText = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\n${formName.toUpperCase()}\n\nKính gửi: UBND phường Tây Nha Trang\n\nTôi tên là: ........................................................\nNgày sinh: ...../...../......... Số CCCD: ....................\nĐịa chỉ thường trú: ................................................\nSố điện thoại: ....................................................\n\nNội dung đề nghị giải quyết:\n....................................................................\n\nTôi xin cam đoan các thông tin kê khai trên là hoàn toàn đúng sự thật.\n\nNha Trang, ngày ..... tháng ..... năm 2026\nNgười làm đơn\n(Ký và ghi rõ họ tên)`;
    
    const blob = new Blob([sampleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadedForm(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-rose-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-yellow-300 uppercase tracking-widest">
                KHO DỮ LIỆU ĐIỆN TỬ
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                Kho Biểu Mẫu Điện Tử UBND Phường Tây Nha Trang
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner E-Form */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
            <span className="text-base">✍</span>
            <span>Kho Biểu Mẫu Điện Tử E-Form: Nhập trực tuyến, in ấn và tải file Word (.doc) ngay!</span>
          </div>
          <a
            href="eform.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <span>Mở Kho E-Form TTHC</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm biểu mẫu (xây dựng, đất đai, kết hôn, hộ kinh doanh...)"
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/50">
          {filteredForms.map((form, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-red-300 transition-colors"
            >
              <div className="space-y-1 flex-1">
                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded uppercase">
                  {form.category}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {form.name}
                </h4>
                <div className="text-[11px] text-slate-500">
                  Định dạng: <span className="font-mono font-semibold">{form.file}</span> ({form.size})
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
                <a
                  href={`eform.html?form=${form.eformId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Mở E-Form kê khai trực tuyến và in ấn"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Điền E-Form</span>
                </a>
                <button
                  onClick={() => handleDownload(form.name)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadedForm === form.name ? 'Đã tải' : 'Tải mẫu'}</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onAskChatbot(`Hướng dẫn điền ${form.name}`);
                  }}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="Hỏi trợ lý ảo cách điền mẫu này"
                >
                  <span>Hỏi AI</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Tất cả biểu mẫu đều đúng quy chuẩn Bộ Tư pháp và UBND Tỉnh Khánh Hòa</span>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-1.5 rounded-xl cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
