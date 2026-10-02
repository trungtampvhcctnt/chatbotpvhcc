import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar, 
  Phone, 
  Printer, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import proceduresData from '../../data/procedures.json';

interface TrackingViewProps {
  initialCode?: string;
  onAskChatbot: (query: string) => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  initialCode = '',
  onAskChatbot
}) => {
  const [searchCode, setSearchCode] = useState(initialCode);
  const [activeApplication, setActiveApplication] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setSearchCode(initialCode);
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (codeToSearch?: string) => {
    const code = (codeToSearch || searchCode).trim().toUpperCase();
    if (!code) return;

    setHasSearched(true);
    const found = proceduresData.mockApplications.find(a => a.code.toUpperCase() === code);
    setActiveApplication(found || null);
  };

  const stepsList = [
    { num: 1, title: 'Tiếp nhận hồ sơ', desc: 'Kiểm tra tính hợp lệ & quét mã số số hóa' },
    { num: 2, title: 'Phân công thụ lý', desc: 'Chuyển giao phòng ban chuyên ngành giải quyết' },
    { num: 3, title: 'Thẩm định chuyên môn', desc: 'Kiểm tra thực địa, tính thuế, hồ sơ kỹ thuật' },
    { num: 4, title: 'Phê duyệt & Ký số', desc: 'Lãnh đạo cơ quan có thẩm quyền ký phát hành' },
    { num: 5, title: 'Trả kết quả', desc: 'Nhận bản giấy tại Quầy 06 hoặc tải bản điện tử' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>HỆ THỐNG MỘT CỬA ĐIỆN TỬ TỈNH KHÁNH HÒA</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Tra Cứu Tiến Độ Giải Quyết Hồ Sơ Hành Chính
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Nhập mã số hồ sơ in trên Giấy tiếp nhận và hẹn trả kết quả để kiểm tra tình trạng xử lý theo thời gian thực.
          </p>
        </div>

        {/* Search Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }} 
          className="flex flex-col sm:flex-row gap-2.5 max-w-2xl pt-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Nhập mã hồ sơ (Ví dụ: H74-260901-0028 hoặc KH-00129-2026)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex-shrink-0"
          >
            Tra cứu ngay
          </button>
        </form>

        {/* Sample Code chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-slate-500 font-medium">Mã hồ sơ mẫu tra cứu nhanh:</span>
          {proceduresData.mockApplications.map(app => (
            <button
              key={app.code}
              type="button"
              onClick={() => {
                setSearchCode(app.code);
                handleSearch(app.code);
              }}
              className="font-mono bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              {app.code}
            </button>
          ))}
        </div>
      </div>

      {/* Result Section */}
      {hasSearched && (
        activeApplication ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Top header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Mã hồ sơ:</span>
                  <span className="text-lg font-black font-mono text-blue-700">{activeApplication.code}</span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    activeApplication.status.includes('kết quả')
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {activeApplication.status}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                  {activeApplication.procedureTitle}
                </h3>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onAskChatbot(`Kiểm tra hồ sơ ${activeApplication.code}`)}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hỏi AI tư vấn</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In biên nhận</span>
                </button>
              </div>
            </div>

            {/* Application Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Người nộp hồ sơ:</span>
                <strong className="text-slate-900 font-bold text-sm">{activeApplication.applicant}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Ngày tiếp nhận:</span>
                <strong className="text-slate-900 font-bold text-sm">{activeApplication.submitDate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Hẹn trả kết quả:</span>
                <strong className="text-red-700 font-bold text-sm">{activeApplication.promiseDate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Cán bộ phụ trách:</span>
                <strong className="text-slate-900 font-bold text-sm">{activeApplication.assignedOfficer}</strong>
              </div>
            </div>

            {/* Note & Action notification */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Ghi chú xử lý từ bộ phận Một cửa:</span>
              </div>
              <p className="leading-relaxed pl-5 font-medium">{activeApplication.note}</p>
            </div>

            {/* 5-Step Process Timeline */}
            <div className="space-y-4 pt-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>🔄</span>
                <span>Quy trình 5 bước giải quyết hồ sơ Một cửa:</span>
              </h4>

              <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 py-2">
                {stepsList.map((step, idx) => {
                  const isCurrent = activeApplication.currentStep.toLowerCase().includes(step.title.toLowerCase()) || 
                    (activeApplication.status.includes('kết quả') && idx === 4);
                  const isDone = (activeApplication.status.includes('kết quả')) || (idx < 2);

                  return (
                    <div key={step.num} className="relative">
                      {/* Step Circle Marker */}
                      <span className={`absolute -left-[35px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? 'bg-red-600 text-white ring-4 ring-red-100'
                          : isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isDone ? '✓' : step.num}
                      </span>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h5 className={`font-bold text-xs sm:text-sm ${
                            isCurrent ? 'text-red-700' : isDone ? 'text-slate-900' : 'text-slate-500'
                          }`}>
                            Bước {step.num}: {step.title}
                          </h5>
                          {isCurrent && (
                            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                              Đang thực hiện
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Không tìm thấy mã hồ sơ: {searchCode}</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Vui lòng kiểm tra lại mã số in trên Giấy tiếp nhận hoặc thử tra cứu với các mã hồ sơ mẫu có sẵn trên hệ thống.
            </p>
          </div>
        )
      )}
    </div>
  );
};
