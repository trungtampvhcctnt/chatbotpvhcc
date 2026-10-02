import React from 'react';
import { X, Megaphone, CheckCircle2, AlertTriangle, ShieldCheck, PhoneCall, ExternalLink } from 'lucide-react';
import proceduresData from '../../data/procedures.json';

interface PaknModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHotline: () => void;
}

export const PaknModal: React.FC<PaknModalProps> = ({ isOpen, onClose, onOpenHotline }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-200 uppercase tracking-widest">
                QUY TRÌNH TIẾP NHẬN & XỬ LÝ
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                Hướng Dẫn Phản Ánh, Kiến Nghị (PAKN)
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1.5 text-amber-900">
            <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-amber-800">
              <ShieldCheck className="w-4 h-4" />
              <span>Nội dung tiếp nhận phản ánh, kiến nghị:</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hành vi chậm trễ, gây phiền hà hoặc không thực hiện đúng quy định TTHC.</li>
              <li>Sự không thống nhất, không đồng bộ, không hợp pháp của quy định TTHC.</li>
              <li>Quy định TTHC không còn phù hợp với thực tế gây khó khăn cho người dân, doanh nghiệp.</li>
              <li>Thái độ phục vụ của cán bộ, công chức làm việc tại 10 quầy TTPVHCC.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm">Các kênh tiếp nhận PAKN của phường Tây Nha Trang:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-1">
                <strong className="text-slate-900 block font-bold">1. Tổng đài & Đường dây nóng:</strong>
                <p className="text-slate-600">Gọi số <strong className="text-red-700">{proceduresData.centerInfo.hotline}</strong> hoặc hotline Lãnh đạo <strong className="text-red-700">{proceduresData.centerInfo.complaintHotline}</strong>.</p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-1">
                <strong className="text-slate-900 block font-bold">2. Hòm thư góp ý trực tiếp:</strong>
                <p className="text-slate-600">Đặt tại sảnh chờ tầng 1 TTPVHCC phường Tây Nha Trang (Số 02 Đường 23/10).</p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-1">
                <strong className="text-slate-900 block font-bold">3. Cổng DVC Quốc gia:</strong>
                <p className="text-slate-600">Gửi trực tuyến qua chuyên mục PAKN trên Cổng <code className="font-mono text-blue-600">dichvucong.gov.vn</code>.</p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-1">
                <strong className="text-slate-900 block font-bold">4. Email công vụ:</strong>
                <p className="text-slate-600 font-mono text-blue-700">{proceduresData.centerInfo.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <strong className="text-slate-900 block font-bold mb-1">Thời hạn xử lý và trả lời:</strong>
            <p className="text-slate-600">
              Không quá <strong>05 ngày làm việc</strong> kể từ ngày tiếp nhận đối với phản ánh thuộc thẩm quyền, hoặc chuyển cơ quan có thẩm quyền xử lý theo quy định.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenHotline();
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Gửi phản ánh trực tuyến ngay</span>
          </button>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
