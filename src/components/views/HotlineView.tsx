import React, { useState } from 'react';
import { 
  Phone, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  Building2,
  FileCheck
} from 'lucide-react';
import proceduresData from '../../data/procedures.json';

export const HotlineView: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('Thái độ phục vụ');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !content.trim()) {
      alert('Vui lòng điền đầy đủ các thông tin có dấu (*)');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setContent('');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
          <Phone className="w-4 h-4" />
          <span>ĐƯỜNG DÂY NÓNG & TIẾP NHẬN PHẢN ÁNH KIẾN NGHỊ</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Danh Bạ Hỗ Trợ & Kênh Tiếp Nhận Ý Kiến Nhân Dân
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Trung tâm Phục vụ Hành chính công Tây Nha Trang cam kết lắng nghe, xử lý nhanh chóng mọi phản ánh của công dân và doanh nghiệp.
        </p>
      </div>

      {/* Hotline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proceduresData.hotlines.map((h, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổ phụ trách</span>
                <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <PhoneCall className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{h.dept}</h3>
              <p className="text-xs text-slate-500">{h.desc}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <a 
                href={`tel:${h.phone.replace(/[^0-9]/g, '')}`}
                className="text-base font-black text-red-600 font-mono hover:underline flex items-center gap-1.5"
              >
                <span>{h.phone}</span>
              </a>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
                Bấm gọi ngay
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Feedback Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span>📩</span>
                <span>Gửi phản ánh kiến nghị trực tuyến</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ý kiến phản ánh về thủ tục, thái độ cán bộ công vụ, chậm trễ hồ sơ...
              </p>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-extrabold text-emerald-950 text-base">Gửi phản ánh thành công!</h4>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                Cảm ơn Quý công dân đã đóng góp ý kiến. Bộ phận tiếp nhận & Giám sát TTPVHCC Tây Nha Trang đã ghi nhận và sẽ phản hồi qua số điện thoại của Quý khách trong thời gian sớm nhất.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-emerald-700 bg-white border border-emerald-300 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Gửi phản ánh khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Họ và tên Quý khách (*):
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Số điện thoại liên hệ (*):
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Lĩnh vực / Chủ đề phản ánh:
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="Thái độ phục vụ">Tinh thần, thái độ phục vụ của cán bộ tiếp nhận</option>
                  <option value="Chậm trễ hồ sơ">Hồ sơ quá hạn chưa có kết quả</option>
                  <option value="Hướng dẫn thủ tục">Cần làm rõ hồ sơ giấy tờ yêu cầu</option>
                  <option value="Cơ sở vật chất">Cơ sở vật chất sảnh chờ, quầy giao dịch, kiosk</option>
                  <option value="Khác">Nội dung đóng góp ý kiến khác</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Nội dung chi tiết kiến nghị, phản ánh (*):
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Mô tả cụ thể sự việc, ngày giờ, quầy số hoặc mã hồ sơ liên quan nếu có..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Gửi phản ánh tới Lãnh đạo Trung tâm</span>
              </button>
            </form>
          )}
        </div>

        {/* Office Info & Map Box */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-600" />
              <span>Trụ sở làm việc & Giờ đón tiếp</span>
            </h3>
          </div>

          <div className="space-y-3.5 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">Địa chỉ trụ sở:</strong>
                <span>{proceduresData.centerInfo.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">Giờ làm việc (Thứ 2 đến Thứ 6):</strong>
                <span>{proceduresData.centerInfo.workingHours}</span>
                <span className="block text-slate-400 mt-0.5">(Thứ 7, Chủ nhật và ngày Lễ nghỉ theo quy định)</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">Hộp thư điện tử công vụ:</strong>
                <span className="font-mono text-blue-700">{proceduresData.centerInfo.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Chính sách tiếp nhận & xử lý</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Mọi ý kiến phản ánh, kiến nghị chính đáng của tổ chức, cá nhân đều được lưu trữ bảo mật và báo cáo trực tiếp Lãnh đạo Trung tâm trong vòng 24 giờ làm việc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
