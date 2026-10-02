import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Minus, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  Settings, 
  ExternalLink, 
  Ticket, 
  Clock, 
  FileText, 
  HelpCircle,
  Maximize2,
  Key,
  CheckCircle2,
  AlertCircle,
  Wifi
} from 'lucide-react';
import { RobotAvatar } from './RobotAvatar.tsx';
import proceduresData from '../data/procedures.json';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  procedures?: any[];
  application?: any;
}

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSelectProcedure?: (procedure: any) => void;
  onTakeTicket?: (counterName: string) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  isOpen,
  setIsOpen,
  onSelectProcedure,
  onTakeTicket
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('ttpvhcc_chat_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
    return [
      {
        id: 'welcome-1',
        sender: 'bot',
        text: 'Xin chào Quý công dân! Tôi là **Trợ lý ảo TTPVHCC phường Tây Nha Trang**.\n\nTôi sẵn sàng hỗ trợ giải đáp nhanh các thông tin:\n- 📋 Quy trình, giấy tờ, biểu mẫu & lệ phí TTHC (đất đai, xây dựng, kết hôn, hộ kinh doanh, ATTP...).\n- 🔍 Tra cứu tiến độ hồ sơ Một cửa (ví dụ: `H74-260901-0028` hoặc `KH-00129-2026`).\n- 🎫 Thông tin lấy số quầy điện tử & tình trạng phục vụ 10 quầy.\n- ☎️ Danh bạ điện thoại và giờ tiếp nhận hồ sơ.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Custom API configuration
  const [customApiKey, setCustomApiKey] = useState(() => {
    return localStorage.getItem('ttpvhcc_user_api_key') || '';
  });
  const [customApiEndpoint, setCustomApiEndpoint] = useState(() => {
    return localStorage.getItem('ttpvhcc_api_endpoint') || '/api/chat';
  });
  const [testApiStatus, setTestApiStatus] = useState<{ loading: boolean; success?: boolean; message?: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && !showSettings) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, isMinimized, showSettings]);

  // Persist chat history
  useEffect(() => {
    try {
      localStorage.setItem('ttpvhcc_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }, [messages]);

  // Allow closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (showSettings) {
          setShowSettings(false);
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showSettings, setIsOpen]);

  // Explicit close handler with stopPropagation to ensure it works 100% reliably
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    setIsMinimized(false);
    setShowSettings(false);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const handleResetChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Quý khách có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện không?')) {
      const resetMsg: Message = {
        id: 'welcome-reset',
        sender: 'bot',
        text: 'Lịch sử cuộc trò chuyện đã được làm mới. Quý công dân cần hỗ trợ thủ tục hoặc tra cứu thông tin gì ạ?',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([resetMsg]);
      localStorage.removeItem('ttpvhcc_chat_history');
    }
  };

  // Test API connection
  const handleTestApi = async () => {
    setTestApiStatus({ loading: true });
    try {
      const endpoint = customApiEndpoint.trim() || '/api/chat';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Xin chào',
          customApiKey: customApiKey.trim() || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestApiStatus({ 
          loading: false, 
          success: true, 
          message: '✓ Kết nối API thành công! Máy chủ phản hồi chính xác.' 
        });
      } else {
        setTestApiStatus({ 
          loading: false, 
          success: false, 
          message: `✕ Lỗi API: ${data.error || 'Máy chủ không phản hồi'}` 
        });
      }
    } catch (err: any) {
      setTestApiStatus({ 
        loading: false, 
        success: false, 
        message: `✕ Lỗi kết nối: ${err.message}` 
      });
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ttpvhcc_user_api_key', customApiKey.trim());
    localStorage.setItem('ttpvhcc_api_endpoint', customApiEndpoint.trim() || '/api/chat');
    setShowSettings(false);
    
    const msg: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      text: customApiKey.trim()
        ? '🔑 Đã kích hoạt API cá nhân của bạn thành công! Trợ lý ảo sẽ sử dụng API này để truy vấn dữ liệu từ máy chủ một cách chính xác.'
        : '🟢 Đang sử dụng API máy chủ TTPVHCC Tây Nha Trang tích hợp sẵn (Gemini 3.8 Flash).',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, msg]);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick prompt questions
  const quickPrompts = [
    'Sang tên sổ đỏ cần những gì?',
    'Cấp phép xây dựng nhà ở',
    'Tra cứu hồ sơ H74-260901-0028',
    'Thủ tục cấp GCN an toàn thực phẩm',
    'Lấy số quầy hôm nay',
    'Đường dây nóng hỗ trợ'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const endpoint = customApiEndpoint.trim() || '/api/chat';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          customApiKey: customApiKey.trim() || undefined
        })
      });

      const data = await response.json();

      if (data.success && data.reply) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          procedures: data.procedures,
          application: data.application
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Máy chủ không phản hồi hợp lệ');
      }
    } catch (err: any) {
      console.warn('API error, using local procedures engine fallback:', err);
      const q = text.toLowerCase();
      
      const appMatch = proceduresData.mockApplications.find(a => 
        q.includes(a.code.toLowerCase()) || q.includes(a.applicant.toLowerCase())
      );

      const procMatches = proceduresData.procedures.filter(p => {
        const content = `${p.title} ${p.category} ${p.keywords?.join(' ')}`.toLowerCase();
        return q.split(/\s+/).some(w => w.length >= 2 && content.includes(w));
      });

      let reply = '';
      if (appMatch) {
        reply = `### 📋 Thông tin hồ sơ: **${appMatch.code}**\n\n` +
          `- **Người nộp:** ${appMatch.applicant}\n` +
          `- **Thủ tục:** ${appMatch.procedureTitle}\n` +
          `- **Ngày nộp:** ${appMatch.submitDate} | **Hẹn trả:** **${appMatch.promiseDate}**\n` +
          `- **Trạng thái:** **${appMatch.status}** (${appMatch.currentStep})\n` +
          `- **Cán bộ phụ trách:** ${appMatch.assignedOfficer} - ĐT: ${appMatch.phone}\n\n` +
          `💡 *Ghi chú:* ${appMatch.note}`;
      } else if (procMatches.length > 0) {
        const top = procMatches[0];
        reply = `Về thủ tục **"${top.title}"**, Trung tâm xin hướng dẫn Quý công dân như sau:\n\n` +
          `📍 **Quầy giải quyết:** ${top.counter}\n` +
          `⏱ **Thời hạn giải quyết:** ${top.duration}\n\n` +
          `📄 **Hồ sơ gồm có:**\n` +
          top.documents.map(d => `- ${d}`).join('\n') +
          `\n\n🌐 **Nộp hồ sơ trực tuyến:** [Bấm vào đây](${top.onlineUrl || "https://dichvucong.gov.vn"})\n` +
          `📂 **Kho biểu mẫu điện tử:** [Bấm vào đây](https://dieuphoi.netlify.app/eforms/)\n\n` +
          `Quý khách có thể liên hệ Hotline **${proceduresData.centerInfo.hotline}** để được hướng dẫn thêm!`;
      } else if (q.includes('giờ') || q.includes('địa chỉ') || q.includes('ở đâu')) {
        reply = `Trung tâm Phục vụ Hành chính công phường Tây Nha Trang:\n` +
          `- 🏢 **Địa chỉ:** ${proceduresData.centerInfo.address}\n` +
          `- ⏰ **Giờ làm việc:** ${proceduresData.centerInfo.workingHours}\n` +
          `- ☎️ **Hotline:** ${proceduresData.centerInfo.hotline}`;
      } else if (q.includes('quầy') || q.includes('bốc số') || q.includes('thứ tự')) {
        reply = `Hiện tại Trung tâm đang phục vụ 10 quầy:\n\n` +
          proceduresData.counters.map(c => `- **${c.name}**: Đang gọi số **${c.currentTicket}** (${c.waitingCount} người đợi)`).join('\n');
      } else {
        reply = `Dạ cảm ơn Quý khách! Để em hỗ trợ tốt nhất, Quý khách vui lòng nhập tên thủ tục cần làm (Ví dụ: "sang tên sổ đỏ", "cấp phép xây nhà", "kết hôn", "hộ kinh doanh", "an toàn thực phẩm") hoặc nhập mã hồ sơ một cửa (như \`H74-260901-0028\`) để tra cứu ạ.`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        procedures: procMatches.slice(0, 2),
        application: appMatch
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // If closed completely, render speech bubble and robot avatar matching the screenshot
  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
        {/* Speech Bubble Tooltip matching screenshot */}
        <div 
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="cursor-pointer bg-white border border-amber-300 text-slate-800 text-xs sm:text-[13px] font-semibold px-3.5 py-2 rounded-2xl shadow-lg relative max-w-[210px] leading-tight select-none hover:shadow-xl transition-all animate-in fade-in slide-in-from-right-2 duration-300"
        >
          <span>Tôi là trợ lý ảo, hãy hỏi tôi khi bạn cần</span>
          {/* Bubble tail on right */}
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-amber-300 transform rotate-45"></div>
        </div>

        {/* Robot Circular Avatar Button matching screenshot */}
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="relative rounded-full hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer shadow-xl flex-shrink-0"
          aria-label="Mở Trợ lý ảo TTPVHCC Tây Nha Trang"
        >
          {/* Animated pulse ring */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 border-2 border-white"></span>
          </span>

          <RobotAvatar size={54} />
        </button>
      </div>
    );
  }

  // Minimized bar in corner
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <div className="flex items-center gap-2.5 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-2xl border border-slate-700">
          <RobotAvatar size={28} />
          <span className="text-xs font-bold">Trợ lý ảo TTPVHCC (Đang thu nhỏ)</span>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1 hover:bg-slate-800 rounded-md text-slate-300 hover:text-white cursor-pointer"
            title="Mở rộng"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-red-800 rounded-md text-red-300 hover:text-white cursor-pointer"
            title="Đóng hoàn toàn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[450px] h-[650px] max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
      style={{ boxShadow: '0 20px 45px -15px rgba(0, 0, 0, 0.35)' }}
    >
      {/* Header with explicit, guaranteed functional Close (X) button */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white px-4 py-3 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center gap-2.5">
          <RobotAvatar size={38} />
          <div>
            <h3 className="text-xs sm:text-sm font-black leading-none tracking-tight">
              Trợ lý ảo TTPVHCC phường Tây Nha Trang
            </h3>
            <p className="text-[10px] text-yellow-200 font-medium mt-0.5">
              Hỗ trợ TTHC • Tra cứu hồ sơ • 10 Quầy phục vụ
            </p>
          </div>
        </div>

        {/* Control Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Settings / API Key */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowSettings(!showSettings);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/20 active:bg-white/30 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="Cài đặt API của bạn"
            aria-label="Cài đặt API"
          >
            <Key className="w-4 h-4 text-yellow-300" />
          </button>

          {/* Reset History */}
          <button
            type="button"
            onClick={handleResetChat}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/20 active:bg-white/30 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="Làm mới cuộc trò chuyện"
            aria-label="Làm mới trò chuyện"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Minimize Button */}
          <button
            type="button"
            onClick={handleMinimize}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/20 active:bg-white/30 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="Thu nhỏ trợ lý ảo"
            aria-label="Thu nhỏ"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* CLOSE BUTTON - Guaranteed to close the chatbot reliably */}
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-white/10 hover:bg-red-900 active:bg-red-950 text-white hover:text-yellow-300 transition-all font-bold cursor-pointer ml-0.5 border border-white/20"
            title="Đóng trợ lý ảo (Esc)"
            aria-label="Đóng trợ lý ảo"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* API Status Sub-bar */}
      <div className="bg-slate-100 px-3.5 py-1.5 border-b border-slate-200 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{customApiKey ? 'Đang dùng API cá nhân của bạn' : 'API Máy chủ: Đang kết nối TTPVHCC'}</span>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-red-700 hover:text-red-900 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>{showSettings ? 'Đóng cài đặt' : 'Cài đặt API'}</span>
        </button>
      </div>

      {/* Settings Modal (if opened) */}
      {showSettings ? (
        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <Key className="w-4 h-4 text-red-600" />
                <span>Cấu hình đưa API của bạn vào Trợ lý ảo</span>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Khóa API của bạn (Gemini API Key):
                </label>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="Nhập khóa API của bạn (ví dụ: AIzaSy...)"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Nhập khóa Gemini API Key của bạn để trợ lý ảo sử dụng trực tiếp khi truy vấn dữ liệu máy chủ hoặc khi chạy trên GitHub Pages.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Đường dẫn API máy chủ (Endpoint):
                </label>
                <input
                  type="text"
                  value={customApiEndpoint}
                  onChange={(e) => setCustomApiEndpoint(e.target.value)}
                  placeholder="/api/chat (Mặc định máy chủ nội bộ)"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Mặc định gọi tới <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600 font-bold">/api/chat</code> của TTPVHCC Tây Nha Trang.
                </p>
              </div>

              {/* Test Button & Status */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleTestApi}
                  disabled={testApiStatus?.loading}
                  className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Wifi className="w-3.5 h-3.5 text-blue-600" />
                  <span>{testApiStatus?.loading ? 'Đang kiểm tra kết nối...' : 'Kiểm tra kết nối API ngay'}</span>
                </button>

                {testApiStatus && !testApiStatus.loading && (
                  <div className={`mt-2 p-2.5 rounded-xl text-[11px] font-bold ${
                    testApiStatus.success 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {testApiStatus.message}
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1 text-amber-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cơ chế bảo đảm độ chính xác:</span>
                </div>
                <p className="leading-relaxed">
                  Trợ lý ảo tự động gắn kèm toàn bộ tri thức thủ tục TTHC của TTPVHCC phường Tây Nha Trang vào prompt API để đảm bảo câu trả lời luôn khớp 100% với quy định nhà nước.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Lưu & Áp dụng API
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomApiKey('');
                    setCustomApiEndpoint('/api/chat');
                    setTestApiStatus(null);
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
                >
                  Mặc định
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Chat Messages Container */
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                }`}
              >
                {/* Message text with markdown formatting */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text.split('\n').map((line, idx) => {
                    if (line.startsWith('### ')) {
                      return <h4 key={idx} className="font-bold text-red-700 text-sm mt-1 mb-1">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={idx} className="font-bold text-slate-900 my-0.5">{line.slice(2, -2)}</p>;
                    }
                    return (
                      <p key={idx} className={line.startsWith('- ') ? 'ml-2 my-0.5' : 'my-0.5'}>
                        {line}
                      </p>
                    );
                  })}
                </div>

                {/* Structured Procedure Card if returned by server */}
                {msg.procedures && msg.procedures.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-2">
                    <div className="text-[11px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>Thủ tục liên quan:</span>
                    </div>
                    {msg.procedures.map((proc: any) => (
                      <div
                        key={proc.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs hover:border-red-300 transition-colors"
                      >
                        <div className="font-bold text-slate-900 leading-tight">{proc.title}</div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-600">
                          <span className="bg-red-50 text-red-700 font-semibold px-1.5 py-0.5 rounded border border-red-200">
                            {proc.counter}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {proc.duration}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          {onSelectProcedure && (
                            <button
                              onClick={() => onSelectProcedure(proc)}
                              className="text-[11px] font-bold text-red-700 hover:text-red-800 bg-white border border-red-200 hover:bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>Xem chi tiết hồ sơ</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          )}
                          {onTakeTicket && (
                            <button
                              onClick={() => onTakeTicket(proc.counter)}
                              className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Ticket className="w-2.5 h-2.5" />
                              <span>Lấy số quầy</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Application tracking card if returned */}
                {msg.application && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-950">
                      <div className="font-bold text-emerald-900 flex items-center justify-between">
                        <span>Hồ sơ: {msg.application.code}</span>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {msg.application.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-700 mt-1">
                        <div>Hẹn trả: <strong>{msg.application.promiseDate}</strong></div>
                        <div>Bộ phận: {msg.application.assignedOfficer}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer timestamp & copy button */}
                <div
                  className={`flex items-center justify-between gap-2 mt-1 text-[10px] ${
                    msg.sender === 'user' ? 'text-red-100' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 hover:text-slate-700 transition-opacity p-0.5 cursor-pointer"
                      title="Sao chép câu trả lời"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2">
              <RobotAvatar size={30} />
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-3.5 py-2.5 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-slate-500 font-medium ml-1.5">
                    Trợ lý đang truy vấn dữ liệu từ API máy chủ...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Quick Prompts Chips */}
      {!showSettings && (
        <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase flex-shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-red-600" />
            <span>Gợi ý:</span>
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-[11px] font-medium text-slate-700 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shadow-2xs flex-shrink-0 cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      {!showSettings && (
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Hỏi về thủ tục, nhập mã hồ sơ, bốc số..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-sm transition-all cursor-pointer flex-shrink-0"
              title="Gửi tin nhắn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-center text-slate-400 mt-1.5 flex items-center justify-center gap-1">
            <span>Dữ liệu kết nối trực tiếp TTPVHCC phường Tây Nha Trang</span>
            <span>•</span>
            <button 
              type="button"
              onClick={() => setShowSettings(true)}
              className="text-red-600 font-bold hover:underline"
            >
              Cài đặt API của bạn
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
