import React, { useState } from 'react';
import { X, Settings, Volume2, VolumeX, Monitor, Github, Key, Check, RotateCcw } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGitHubExport: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenGitHubExport 
}) => {
  if (!isOpen) return null;

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('ttpvhcc_sound_enabled') !== 'false';
  });

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('ttpvhcc_user_api_key') || '';
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ttpvhcc_sound_enabled', String(soundEnabled));
    localStorage.setItem('ttpvhcc_user_api_key', apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Cấu hình Bảng Kiosk & Trợ lý ảo</h3>
              <p className="text-xs text-slate-400">Thiết lập hiển thị, âm thanh và kết nối GitHub Pages</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block text-xs">Âm thanh chuông gọi số & thông báo</span>
              <span className="text-slate-500 text-[11px]">Phát âm chuông khi bốc số quầy hoặc trợ lý ảo phản hồi</span>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 font-bold ${
                soundEnabled 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'bg-slate-200 border-slate-300 text-slate-600'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span>{soundEnabled ? 'Đang bật' : 'Đang tắt'}</span>
            </button>
          </div>

          {/* Fullscreen Kiosk Mode */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block text-xs">Chế độ toàn màn hình Kiosk điện tử</span>
              <span className="text-slate-500 text-[11px]">Phù hợp cho màn hình cảm ứng đặt tại sảnh chờ</span>
            </div>
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Toàn màn hình</span>
            </button>
          </div>

          {/* API Key settings */}
          <div className="space-y-1.5 pt-1">
            <label className="block font-bold text-slate-800 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-red-600" />
              <span>Khóa API Gemini (Tùy chọn bổ sung):</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Mặc định sử dụng API Key máy chủ tích hợp sẵn"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-400">
              Hệ thống đã tích hợp sẵn Gemini 3.8 Flash từ máy chủ. Quý khách chỉ cần nhập nếu muốn dùng khóa cá nhân.
            </p>
          </div>

          {/* GitHub Pages 1-Click Action */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <Github className="w-4 h-4 text-emerald-400" />
                <span>Triển khai lên GitHub Pages</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                HTML Tĩnh
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Tải trọn gói file ZIP chứa các trang HTML độc lập và workflow GitHub Actions để website tự động chạy trên GitHub Pages.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenGitHubExport();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <span>Mở công cụ xuất bản GitHub Pages</span>
            </button>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {saved ? <Check className="w-4 h-4" /> : null}
              <span>{saved ? 'Đã lưu cấu hình' : 'Lưu thiết lập'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 px-4 rounded-xl cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
