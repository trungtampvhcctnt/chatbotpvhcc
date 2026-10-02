import React, { useState } from 'react';
import { X, Star, ThumbsUp, CheckCircle2, User, Building } from 'lucide-react';
import proceduresData from '../../data/procedures.json';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [selectedCounterId, setSelectedCounterId] = useState<number>(1);
  const [rating, setRating] = useState<number>(5);
  const [attitude, setAttitude] = useState<string>('Rất hài lòng');
  const [timeliness, setTimeliness] = useState<string>('Đúng hạn');
  const [feedback, setFeedback] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const selectedCounter = proceduresData.counters.find(c => c.id === selectedCounterId) || proceduresData.counters[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-rose-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[11px] font-bold text-yellow-300 uppercase tracking-widest">
              ĐÁNH GIÁ SỰ HÀI LÒNG CỦA NGƯỜI DÂN
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight">
              Phiếu Đánh Giá Chất Lượng 10 Quầy Phục Vụ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-extrabold text-slate-900">Cảm ơn Quý công dân đã đánh giá!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Ý kiến đánh giá của Quý khách đối với <strong>{selectedCounter.name}</strong> đã được ghi nhận vào hệ thống đánh giá cán bộ công chức của UBND phường Tây Nha Trang.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-2 bg-slate-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Hoàn tất
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Counter selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Chọn Quầy giao dịch cần đánh giá (Tổng số 10 quầy):
                </label>
                <select
                  value={selectedCounterId}
                  onChange={(e) => setSelectedCounterId(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                >
                  {proceduresData.counters.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} - Cán bộ phụ trách: {c.officer}
                    </option>
                  ))}
                </select>
              </div>

              {/* Star Rating */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
                <span className="block font-bold text-slate-700">2. Mức độ hài lòng chung:</span>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star 
                        className={`w-7 h-7 ${
                          star <= rating 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-slate-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-700 block">
                  {rating === 5 && '★★★★★ Rất hài lòng'}
                  {rating === 4 && '★★★★ Hài lòng'}
                  {rating === 3 && '★★★ Bình thường'}
                  {rating === 2 && '★★ Chưa hài lòng'}
                  {rating === 1 && '★ Rất không hài lòng'}
                </span>
              </div>

              {/* Criteria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    3. Tinh thần, thái độ của cán bộ tiếp nhận:
                  </label>
                  <select
                    value={attitude}
                    onChange={(e) => setAttitude(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Rất hài lòng">Niềm nở, tận tình, chu đáo</option>
                    <option value="Hài lòng">Đúng mực, lịch sự</option>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Chưa hài lòng">Còn thiếu nhiệt tình</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    4. Thời gian tiếp nhận và xử lý:
                  </label>
                  <select
                    value={timeliness}
                    onChange={(e) => setTimeliness(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Đúng hạn">Rất nhanh chóng, không phải chờ lâu</option>
                    <option value="Bình thường">Đúng hẹn theo phiếu bốc số</option>
                    <option value="Chậm trễ">Chờ đợi lâu hơn dự kiến</option>
                  </select>
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  5. Ý kiến đóng góp nâng cao chất lượng phục vụ (Tùy chọn):
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Nhập ý kiến đóng góp hoặc khen ngợi cán bộ phục vụ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Gửi phiếu đánh giá
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
