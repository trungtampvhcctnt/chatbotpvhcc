import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Clock, 
  DollarSign, 
  Building, 
  FileText, 
  Sparkles, 
  Ticket, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';
import { CchcLogo } from '../CchcLogo.tsx';

interface CategoryModalProps {
  category: {
    id: string;
    name: string;
    count: string;
    ministry: string;
  } | null;
  onClose: () => void;
  procedures: any[];
  onAskChatbot: (title: string) => void;
  onTakeTicket: (counterName: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  onClose,
  procedures,
  onAskChatbot,
  onTakeTicket
}) => {
  if (!category) return null;

  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter procedures belonging to this category or matching keywords
  const categoryProcedures = procedures.filter((p: any) => {
    const isCat = p.category.toLowerCase().includes(category.name.toLowerCase()) || 
      category.name.toLowerCase().includes(p.category.toLowerCase());
    if (!searchKeyword) return isCat;
    const q = searchKeyword.toLowerCase().trim();
    return isCat && (p.title.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <CchcLogo variant="gold" className="w-10 h-10 flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-yellow-300 uppercase tracking-widest">
                  LĨNH VỰC NIÊM YẾT
                </span>
                <span className="text-xs bg-white text-red-700 font-extrabold px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight">{category.name}</h3>
              <p className="text-xs text-white/80">{category.ministry}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search inside category */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder={`Tìm kiếm thủ tục trong lĩnh vực ${category.name}...`}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Procedures List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50/50">
          {categoryProcedures.length === 0 ? (
            <div className="text-center py-10 space-y-2 bg-white rounded-2xl border border-slate-200 p-6">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Chưa có thông tin thủ tục cho từ khóa này</p>
              <p className="text-xs text-slate-500">Quý khách có thể hỏi Trợ lý ảo AI ở góc màn hình để được tra cứu tức thì.</p>
              <button
                onClick={() => {
                  onClose();
                  onAskChatbot(`Thủ tục thuộc lĩnh vực ${category.name}`);
                }}
                className="mt-2 inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Hỏi Trợ lý ảo AI ngay</span>
              </button>
            </div>
          ) : (
            categoryProcedures.map((proc: any) => {
              const isExpanded = expandedId === proc.id;
              return (
                <div 
                  key={proc.id}
                  className="bg-white border border-slate-200 hover:border-red-300 rounded-2xl p-4 shadow-xs transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="font-mono text-slate-400">Mã: {proc.code}</span>
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          {proc.level}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                        {proc.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : proc.id)}
                      className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors flex items-center gap-1 cursor-pointer self-start flex-shrink-0"
                    >
                      <span>{isExpanded ? 'Thu gọn' : 'Xem hồ sơ'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Summary Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs text-slate-600 border border-slate-100">
                    <div>⏱ Thời gian: <strong className="text-slate-900">{proc.duration}</strong></div>
                    <div>💰 Lệ phí: <strong className="text-slate-900">{proc.fee}</strong></div>
                    <div>📍 Quầy: <strong className="text-red-700">{proc.counter}</strong></div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-100 space-y-3 text-xs animate-in fade-in duration-150">
                      <div>
                        <strong className="text-slate-900 block font-bold mb-1">📄 Giấy tờ hồ sơ cần nộp:</strong>
                        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-1">
                          {proc.documents.map((doc: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-1.5 text-slate-800">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <strong className="text-slate-900 block font-bold mb-1">🔄 Trình tự các bước giải quyết:</strong>
                        <div className="space-y-1 pl-1 text-slate-700">
                          {proc.steps.map((st: string, idx: number) => (
                            <div key={idx} className="leading-relaxed">{st}</div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            onClose();
                            onAskChatbot(proc.title);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          <span>Hỏi Trợ lý ảo AI thủ tục này</span>
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onTakeTicket(proc.counter);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Lấy số quầy ({proc.counter.split('-')[0]})</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">Niêm yết công khai tại TTPVHCC phường Tây Nha Trang</span>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl cursor-pointer"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>
  );
};
