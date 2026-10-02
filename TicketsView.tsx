import React, { useState } from 'react';
import { 
  Ticket, 
  Clock, 
  Users, 
  CheckCircle2, 
  Printer, 
  QrCode, 
  AlertCircle, 
  Phone, 
  User, 
  CreditCard,
  Building,
  Volume2
} from 'lucide-react';
import proceduresData from '../../data/procedures.json';

interface TicketData {
  ticketNumber: string;
  counterName: string;
  counterId: number;
  applicantName: string;
  phone: string;
  createdAt: string;
  estimatedTime: string;
  waitingCount: number;
}

export const TicketsView: React.FC = () => {
  const [selectedCounterId, setSelectedCounterId] = useState<number>(1);
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [generatedTicket, setGeneratedTicket] = useState<TicketData | null>(null);
  const [isCallingSound, setIsCallingSound] = useState(false);

  const prefixMap: Record<number, string> = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'K'
  };

  const handleGenerateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !phone.trim()) {
      alert('Vui lòng nhập đầy đủ Họ và tên và Số điện thoại!');
      return;
    }

    const counter = proceduresData.counters.find(c => c.id === selectedCounterId) || proceduresData.counters[0];
    const prefix = prefixMap[selectedCounterId] || 'A';
    const randomNum = Math.floor(Math.random() * 20) + 45;
    const ticketNumber = `${prefix}-${String(randomNum).padStart(3, '0')}`;

    const now = new Date();
    const estTime = new Date(now.getTime() + (counter.waitingCount * 12 + 5) * 60000);

    const ticket: TicketData = {
      ticketNumber,
      counterName: counter.name,
      counterId: counter.id,
      applicantName: applicantName.trim(),
      phone: phone.trim(),
      createdAt: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      estimatedTime: estTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      waitingCount: counter.waitingCount + 1
    };

    setGeneratedTicket(ticket);
    playChime();
  };

  const playChime = () => {
    setIsCallingSound(true);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      // AudioContext may be blocked before interaction
    }
    setTimeout(() => setIsCallingSound(false), 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
          <Ticket className="w-4 h-4" />
          <span>HỆ THỐNG BỐC SỐ QUẦY ĐIỆN TỬ (E-KIOSK ONLINE)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Lấy Phiếu Số Thứ Tự Trực Tuyến & Theo Dõi Quầy
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Chủ động lấy số thứ tự trước khi đến Trung tâm, không cần xếp hàng chen lấn, nhận thông báo lượt gọi qua điện thoại.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Ticket Generator Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span>📝</span>
              <span>Đăng ký nhận phiếu số thứ tự</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Miễn phí 100%</span>
          </div>

          <form onSubmit={handleGenerateTicket} className="space-y-4">
            {/* Choose Counter / Domain */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                1. Chọn Quầy / Lĩnh vực cần nộp hồ sơ (*):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {proceduresData.counters.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCounterId(c.id)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                      selectedCounterId === c.id
                        ? 'border-red-600 bg-red-50/70 text-red-900 ring-2 ring-red-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                    }`}
                  >
                    <span className="font-bold block leading-snug">{c.name}</span>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                      <span>Đang gọi: <strong className="text-red-700">{c.currentTicket}</strong></span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                        {c.waitingCount} người chờ
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Applicant Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Họ và tên người nộp (*):</span>
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Số điện thoại nhận tin (*):</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0912345678"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>Số CCCD / Định danh VNeID (Tùy chọn):</span>
              </label>
              <input
                type="text"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                placeholder="Nhập 12 số CCCD gắn chip"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 active:scale-98 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Xác nhận lấy phiếu số thứ tự ngay</span>
            </button>
          </form>
        </div>

        {/* Right column: Generated Ticket Card & Realtime Board */}
        <div className="lg:col-span-5 space-y-6">
          {generatedTicket ? (
            <div className="bg-white border-2 border-red-500 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                VÉ ĐIỆN TỬ
              </div>

              <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-200">
                <div className="text-[11px] font-bold text-red-700 uppercase tracking-widest">
                  TTPVHCC TÂY NHA TRANG
                </div>
                <h4 className="text-sm font-extrabold text-slate-900">{generatedTicket.counterName}</h4>
              </div>

              {/* Big ticket number */}
              <div className="text-center py-2 bg-red-50/80 rounded-2xl border border-red-100">
                <span className="text-xs font-bold text-slate-500 block uppercase">SỐ THỨ TỰ CỦA QUÝ KHÁCH</span>
                <span className="text-5xl font-black text-red-700 tracking-tight font-mono block my-1">
                  {generatedTicket.ticketNumber}
                </span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Phía trước có {generatedTicket.waitingCount - 1} người đang chờ</span>
                </span>
              </div>

              {/* Details table */}
              <div className="text-xs text-slate-700 space-y-1.5 bg-slate-50 p-3 rounded-xl">
                <div className="flex justify-between">
                  <span className="text-slate-500">Họ và tên:</span>
                  <strong className="text-slate-900">{generatedTicket.applicantName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <span className="font-mono text-slate-900 font-bold">{generatedTicket.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Giờ lấy phiếu:</span>
                  <span>{generatedTicket.createdAt}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 text-red-700 font-bold">
                  <span>Dự kiến phục vụ:</span>
                  <span className="font-mono">{generatedTicket.estimatedTime}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In vé / Lưu ảnh</span>
                </button>
                <button
                  onClick={playChime}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="Thử âm thanh gọi loa"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400">
                Vui lòng có mặt trước giờ hẹn 10 phút và lắng nghe loa thông báo tại sảnh chờ.
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Ticket className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-amber-950 text-base">Chưa có vé số nào được chọn</h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Vui lòng chọn quầy và nhập thông tin ở bảng bên trái để hệ thống Kiosk cấp số thứ tự tự động cho Quý khách.
              </p>
            </div>
          )}

          {/* Quick Counter Summary */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Bảng số đang gọi tại Trung tâm</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </h4>
            <div className="space-y-2 text-xs">
              {proceduresData.counters.map(c => (
                <div key={c.id} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                  <span className="text-slate-700 font-medium">{c.name.split('-')[0]}</span>
                  <span className="font-mono font-extrabold bg-slate-100 text-red-700 px-2 py-0.5 rounded">
                    {c.currentTicket}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
