import React from 'react';
import { X, PhoneCall, Phone, MapPin, Clock, Mail, ShieldCheck } from 'lucide-react';
import proceduresData from '../../data/procedures.json';

interface HotlineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HotlineModal: React.FC<HotlineModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
              <PhoneCall className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-yellow-300 uppercase tracking-widest">
                ĐƯỜNG DÂY NÓNG KHẨN CẤP
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                Danh Bạ Hỗ Trợ TTPVHCC Phường Tây Nha Trang
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {proceduresData.hotlines.map((h, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-2 hover:border-red-300 transition-colors">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{h.dept}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">{h.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <a href={`tel:${h.phone.replace(/[^0-9]/g, '')}`} className="text-sm font-black text-red-600 font-mono hover:underline flex items-center gap-1">
                    <span>{h.phone}</span>
                  </a>
                  <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                    Bấm gọi ngay
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Thời gian trực hotline:</span>
            </div>
            <p>Từ 07h30 đến 17h00 các ngày làm việc trong tuần (Thứ 2 đến Thứ 6). Ngoài giờ làm việc, vui lòng gửi phản ánh qua hòm thư điện tử hoặc trợ lý ảo AI.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">Trụ sở: Số 02 Đường 23/10, Phường Phương Sơn (Tây Nha Trang)</span>
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
