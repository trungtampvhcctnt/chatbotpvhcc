import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Edit3, 
  FileText, 
  Home, 
  Search, 
  Megaphone, 
  Settings, 
  Building2, 
  Landmark,
  X
} from 'lucide-react';
import { CchcLogo } from '../CchcLogo.tsx';
import proceduresData from '../../data/procedures.json';

interface HomeViewProps {
  onOpenHotlineModal: () => void;
  onOpenRatingModal: () => void;
  onOpenFormsModal: () => void;
  onOpenPaknModal: () => void;
  onOpenConfigModal: () => void;
  onSelectCategory: (category: any) => void;
  onSearchProcedure: (query: string) => void;
  onResetToHome: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenHotlineModal,
  onOpenRatingModal,
  onOpenFormsModal,
  onOpenPaknModal,
  onOpenConfigModal,
  onSelectCategory,
  onSearchProcedure,
  onResetToHome
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Live digital clock matching screenshot (e.g. 17:29:10)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchProcedure(searchQuery.trim());
    }
  };

  const categories = proceduresData.categories || [
    { id: 'cat-attp', name: 'AN TOÀN THỰC PHẨM', count: '01 TTHC', ministry: 'BỘ Y TẾ' },
    { id: 'cat-btxh', name: 'BẢO TRỢ XÃ HỘI', count: '09 TTHC', ministry: 'BỘ Y TẾ' },
    { id: 'cat-dd', name: 'ĐẤT ĐAI', count: '17 TTHC', ministry: 'BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG' },
    { id: 'cat-ht', name: 'HỘ TỊCH', count: '39 TTHC', ministry: 'BỘ TƯ PHÁP' },
    { id: 'cat-ncc', name: 'NGƯỜI CÓ CÔNG', count: '41 TTHC', ministry: 'BỘ NỘI VỤ' },
    { id: 'cat-noxd', name: 'NHÀ Ở VÀ CÔNG SỞ', count: '07 TTHC', ministry: 'BỘ XÂY DỰNG (GIAO THÔNG VẬN...)' },
    { id: 'cat-kd', name: 'ĐĂNG KÝ KINH DOANH', count: '14 TTHC', ministry: 'BỘ KẾ HOẠCH VÀ ĐẦU TƯ' },
    { id: 'cat-ca', name: 'CĂN CƯỚC & ĐỊNH DANH VNeID', count: '12 TTHC', ministry: 'BỘ CÔNG AN' },
    { id: 'cat-ct', name: 'TƯ PHÁP & CHỨNG THỰC', count: '18 TTHC', ministry: 'BỘ TƯ PHÁP' },
    { id: 'cat-ld', name: 'LAO ĐỘNG & VIỆC LÀM', count: '15 TTHC', ministry: 'BỘ LAO ĐỘNG - TBXH' },
    { id: 'cat-gd', name: 'GIÁO DỤC VÀ ĐÀO TẠO', count: '11 TTHC', ministry: 'BỘ GIÁO DỤC VÀ ĐÀO TẠO' },
    { id: 'cat-tc', name: 'THUẾ & TÀI CHÍNH', count: '16 TTHC', ministry: 'BỘ TÀI CHÍNH' }
  ];

  return (
    <div className="w-full space-y-4">
      {/* Top 3 Action Cards (Đường dây nóng, Phiếu đánh giá, Biểu mẫu) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Đường dây nóng */}
        <div 
          onClick={onOpenHotlineModal}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-red-500/80 flex items-center justify-center text-red-600 group-hover:bg-red-50 transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-red-700 transition-colors">
              Đường dây nóng
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thông tin liên hệ, hướng dẫn liên hệ khẩn cấp và hỗ trợ thủ tục.
            </p>
          </div>
        </div>

        {/* Card 2: Phiếu đánh giá (10 Quầy) */}
        <div 
          onClick={onOpenRatingModal}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-red-500/80 flex items-center justify-center text-red-600 group-hover:bg-red-50 transition-colors">
              <Edit3 className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-red-700 transition-colors">
              Phiếu đánh giá
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              10 Quầy.
            </p>
          </div>
        </div>

        {/* Card 3: Biểu mẫu */}
        <div 
          onClick={onOpenFormsModal}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-red-500/80 flex items-center justify-center text-red-600 group-hover:bg-red-50 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-red-700 transition-colors">
              Biểu mẫu
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kho biểu mẫu điện tử của UBND phường Tây Nha Trang.
            </p>
          </div>
        </div>
      </div>

      {/* Main Board Container ("BẢNG NIÊM YẾT THỦ TỤC HÀNH CHÍNH") */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md overflow-hidden flex flex-col">
        {/* Board Header */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-4 border-amber-400">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <CchcLogo variant="gold" className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-red-600 tracking-tight leading-tight uppercase font-sans">
                BẢNG NIÊM YẾT THỦ TỤC HÀNH CHÍNH
              </h2>
              <div className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wide mt-0.5">
                TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG PHƯỜNG TÂY NHA TRANG
              </div>
            </div>
          </div>

          {/* Right: Digital Clock & Split Circle Theme Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-red-600 font-black font-mono text-lg sm:text-xl tracking-wider">
              {currentTime || '17:29:10'}
            </div>
            {/* Split red/white theme circle as seen in screenshot */}
            <div className="w-6 h-6 rounded-full border-2 border-red-600 overflow-hidden flex" title="Chế độ hiển thị">
              <div className="w-1/2 h-full bg-red-600"></div>
              <div className="w-1/2 h-full bg-white"></div>
            </div>
          </div>
        </div>

        {/* Toolbar Row */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center gap-2.5">
          {/* Home Button */}
          <button
            onClick={onResetToHome}
            className="bg-[#c81e1e] hover:bg-red-800 active:scale-95 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Home className="w-4 h-4 fill-white" />
            <span>TRANG CHỦ</span>
          </button>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chạm vào đây để nhập mã hoặc tên thủ tục..."
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-slate-800 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Hướng dẫn PAKN Button */}
          <button
            onClick={onOpenPaknModal}
            className="border border-amber-400 bg-amber-50/70 hover:bg-amber-100 active:scale-95 text-amber-800 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
          >
            <Megaphone className="w-4 h-4 text-amber-700" />
            <span>Hướng dẫn PAKN</span>
          </button>

          {/* Cấu hình Button */}
          <button
            onClick={onOpenConfigModal}
            className="border border-slate-300 bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Cấu hình</span>
          </button>
        </div>

        {/* Categories Grid (The Red Cards) */}
        <div className="p-4 sm:p-6 bg-slate-50/40">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className="group relative bg-[#c81e1e] hover:bg-[#b91c1c] text-white rounded-xl sm:rounded-2xl p-3 sm:p-3.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[175px] sm:min-h-[190px] border border-red-700/60 ring-1 ring-white/10 hover:ring-white/30 hover:scale-[1.02] active:scale-98"
              >
                {/* Top row: small white star & count badge */}
                <div className="flex items-center justify-between">
                  <CchcLogo variant="white" className="w-5 h-5 flex-shrink-0 drop-shadow-xs" />
                  <span className="bg-white text-red-700 font-black text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full shadow-2xs">
                    {cat.count}
                  </span>
                </div>

                {/* Center Title */}
                <div className="my-auto py-2 text-center">
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight leading-snug line-clamp-3 drop-shadow-xs">
                    {cat.name}
                  </h4>
                </div>

                {/* Bottom Ministry */}
                <div className="pt-2 border-t border-red-400/40 text-center">
                  <div className="text-[10px] sm:text-[11px] font-bold text-white/95 uppercase tracking-tighter truncate flex items-center justify-center gap-1">
                    <span className="text-xs">🏛</span>
                    <span className="truncate">{cat.ministry}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
