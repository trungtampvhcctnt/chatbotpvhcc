import React from 'react';
import { CchcLogo } from './CchcLogo.tsx';
import { Bell, Github, Sparkles } from 'lucide-react';

interface SiteHeaderProps {
  onOpenExportModal: () => void;
  onOpenChatbot: () => void;
  onResetToHome: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  onOpenExportModal,
  onOpenChatbot,
  onResetToHome
}) => {
  return (
    <header className="w-full bg-[#b91c1c] text-white shadow-md">
      {/* Top Banner with Logo, Title, Subtitle, and GitHub export button */}
      <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-red-800/60">
        <div 
          onClick={onResetToHome} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <CchcLogo variant="gold" className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 drop-shadow-sm group-hover:scale-105 transition-transform" />
          <div>
            <h1 className="text-xs sm:text-base font-black tracking-tight leading-tight uppercase font-sans">
              TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG PHƯỜNG TÂY NHA TRANG
            </h1>
            <p className="text-[11px] text-white/90 font-medium tracking-wide">
              Hành chính phục vụ
            </p>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExportModal}
            className="hidden sm:flex items-center gap-1.5 bg-black/20 hover:bg-black/40 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 transition-all cursor-pointer"
            title="Đưa lên GitHub & tự động triển khai GitHub Pages"
          >
            <Github className="w-3.5 h-3.5 text-emerald-300" />
            <span>GitHub Pages</span>
          </button>
        </div>
      </div>

      {/* Marquee Ticker matching screenshot */}
      <div className="bg-[#991b1b] text-white text-xs py-1 px-4 overflow-hidden relative border-t border-red-800">
        <div className="whitespace-nowrap animate-marquee font-medium flex items-center gap-8">
          <span>Trung tâm Phục vụ hành chính công phường Tây Nha Trang kính chào quý khách!</span>
          <span>Trung tâm Phục vụ hành chính công phường Tây Nha Trang kính chào quý khách!</span>
          <span>Trung tâm Phục vụ hành chính công phường Tây Nha Trang kính chào quý khách!</span>
          <span>Trung tâm Phục vụ hành chính công phường Tây Nha Trang kính chào quý khách!</span>
        </div>
      </div>
    </header>
  );
};
