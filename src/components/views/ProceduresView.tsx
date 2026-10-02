import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  DollarSign, 
  Building, 
  Ticket, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  CheckCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import proceduresData from '../../data/procedures.json';

interface ProceduresViewProps {
  onAskChatbot: (procTitle: string) => void;
  onTakeTicket: (counterId: number) => void;
}

export const ProceduresView: React.FC<ProceduresViewProps> = ({
  onAskChatbot,
  onTakeTicket
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    'Tất cả',
    'Đất đai & Môi trường',
    'Xây dựng & Quy hoạch',
    'Tư pháp & Hộ tịch',
    'Đăng ký Kinh doanh',
    'Công an & Định danh điện tử',
    'Lao động - Thương binh & Xã hội'
  ];

  const filteredProcedures = proceduresData.procedures.filter((proc) => {
    const matchesCategory = selectedCategory === 'Tất cả' || proc.category === selectedCategory;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      proc.title.toLowerCase().includes(q) || 
      proc.code.toLowerCase().includes(q) ||
      proc.category.toLowerCase().includes(q) ||
      (proc.keywords && proc.keywords.some(k => k.toLowerCase().includes(q)));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>BẢNG NIÊM YẾT THỦ TỤC HÀNH CHÍNH (TTHC)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Danh mục Thủ tục Hành chính Chi nhánh Tây Nha Trang
            </h2>
            <p className="text-xs text-slate-500">
              Công khai hồ sơ giấy tờ, thời hạn giải quyết, biểu mẫu tờ khai và mức thu lệ phí theo quy định hiện hành.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-red-100 text-red-800 px-3 py-1 rounded-full border border-red-200">
              {filteredProcedures.length} thủ tục
            </span>
          </div>
        </div>

        {/* Search bar & Category filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm thủ tục (ví dụ: sang tên sổ đỏ, xây nhà, kết hôn, mở quán kinh doanh, CCCD...)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-medium"
            />
          </div>

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 px-3 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Procedures List */}
      <div className="space-y-3">
        {filteredProcedures.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">Không tìm thấy thủ tục phù hợp với từ khóa</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Quý khách có thể thử tìm kiếm với từ khóa khác (ví dụ "sổ đỏ", "xây dựng", "hộ tịch") hoặc hỏi trực tiếp Trợ lý ảo AI ở góc màn hình.
            </p>
            <button
              onClick={() => onAskChatbot(searchTerm || 'thủ tục hành chính')}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Hỏi Trợ lý ảo AI ngay</span>
            </button>
          </div>
        ) : (
          filteredProcedures.map((proc) => {
            const isExpanded = expandedId === proc.id;
            return (
              <div
                key={proc.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                        {proc.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Mã TTHC: {proc.code}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {proc.level}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {proc.title}
                    </h3>
                  </div>

                  {/* Top Action button */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-start">
                    <button
                      onClick={() => onAskChatbot(proc.title)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Hỏi trợ lý ảo giải thích thủ tục này"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Hỏi AI tư vấn</span>
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : proc.id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
                      title={isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Key metadata grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Thời hạn: <strong className="text-slate-900">{proc.duration}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <ExternalLink className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Nộp trực tuyến: <a href={proc.onlineUrl || "https://dichvucong.gov.vn"} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">Bấm vào đây</a></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Quầy giải quyết: <strong className="text-red-700">{proc.counter}</strong></span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-4 text-xs animate-in fade-in duration-150">
                    {/* Documents required */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm text-red-800">
                        <FileText className="w-4 h-4" />
                        <span>Thành phần hồ sơ, giấy tờ cần chuẩn bị:</span>
                      </h4>
                      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 space-y-1.5">
                        {proc.documents.map((doc, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2 text-slate-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0"></span>
                            <span className="leading-relaxed">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step by step process */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm text-blue-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>Trình tự các bước thực hiện:</span>
                      </h4>
                      <div className="space-y-2 pl-1">
                        {proc.steps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2.5 text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex flex-wrap gap-2.5">
                      <button
                        onClick={() => onTakeTicket(1)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Lấy số quầy cho thủ tục này</span>
                      </button>

                      <button
                        onClick={() => onAskChatbot(proc.title)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Nhờ trợ lý ảo AI kiểm tra hồ sơ trước khi nộp</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
