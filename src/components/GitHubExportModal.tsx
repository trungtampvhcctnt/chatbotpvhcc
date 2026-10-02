import React, { useState } from 'react';
import { 
  X, 
  Github, 
  Download, 
  Copy, 
  Check, 
  CheckCircle2, 
  Terminal, 
  FileCode, 
  ExternalLink, 
  Globe, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import JSZip from 'jszip';
import proceduresData from '../data/procedures.json';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'workflow' | 'download'>('guide');
  const [copied, setCopied] = useState<string | null>(null);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const gitCommands = `# Bước 1: Khởi tạo git và thêm toàn bộ mã nguồn
git init
git add .
git commit -m "Khoi tao Cong DVC & Tro ly ao TTPVHCC Tay Nha Trang"

# Bước 2: Kết nối với kho lưu trữ GitHub của bạn
# (Thay USERNAME và REPO_NAME bằng tài khoản GitHub của bạn)
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Bước 3: Đẩy mã nguồn lên GitHub (Tự động kích hoạt GitHub Pages)
git push -u origin main`;

  const githubWorkflowYaml = `name: Triển khai TTPVHCC Tây Nha Trang lên GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Triển khai thư mục HTML tĩnh chạy trực tiếp
          path: './github-pages'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  // Function to generate and download the full ZIP bundle
  const handleDownloadZip = async () => {
    setIsGeneratingZip(true);
    try {
      const zip = new JSZip();

      // 1. .nojekyll
      zip.file('.nojekyll', '');

      // 2. .github/workflows/deploy.yml
      const ghDir = zip.folder('.github')?.folder('workflows');
      if (ghDir) {
        ghDir.file('deploy.yml', githubWorkflowYaml);
      }

      // 3. README.md
      const readmeContent = `# CỔNG DỊCH VỤ CÔNG & TRỢ LÝ ẢO TTPVHCC TÂY NHA TRANG

Hệ thống Cổng Dịch vụ Hành chính công, Bốc số quầy điện tử, Tra cứu hồ sơ Một cửa và Trợ lý ảo AI thông minh Trung tâm Phục vụ Hành chính công Tây Nha Trang - Tỉnh Khánh Hòa.

## 🚀 Tính năng chính
1. **Trang chủ & Bảng niêm yết TTHC:** Tích hợp đầy đủ thư mục /niem-yet hiển thị toàn bộ thủ tục hành chính.
2. **Kho biểu mẫu điện tử E-Form:** Kê khai trực tuyến, xem trước, in ấn và xuất file Word (.doc) 13 thủ tục.
3. **Phiếu đánh giá 10 Quầy:** Đánh giá mức độ hài lòng của công dân.
4. **Đường dây nóng:** Thông tin liên hệ các đồng chí lãnh đạo và cán bộ Một cửa.
5. **Trợ lý ảo AI thông minh:** Bám sát 10 quầy, chuẩn thời gian Cổng DVCQG, tự động điều hướng link 'Bấm vào đây' đúng Bộ/ngành.

## 📦 Cách đưa lên GitHub Pages trong 1 phút:
1. Giải nén toàn bộ file ZIP này vào thư mục dự án trên máy tính.
2. Chạy các lệnh Git sau:
\`\`\`bash
git init
git add .
git commit -m "Deploy TTPVHCC Tay Nha Trang đầy đủ niem-yet và eform"
git branch -M main
git remote add origin https://github.com/TÊN_TÀI_KHOẢN/TÊN_REPO.git
git push -u origin main --force
\`\`\`
3. Vào **GitHub Repository > Settings > Pages**:
   - **Source:** Chọn **Deploy from a branch** (chọn branch \`main\` / thư mục \`/ (root)\`).
   - Hoặc chọn **GitHub Actions** để tự động triển khai.
`;
      zip.file('README.md', readmeContent);

      // 4. procedures.json
      zip.file('procedures.json', JSON.stringify(proceduresData, null, 2));

      // 5. Fetch and add ALL real files into the root & github-pages folder
      const filesToBundle = [
        { path: 'index.html', isBinary: false },
        { path: 'site.css', isBinary: false },
        { path: 'site.js', isBinary: false },
        { path: 'chat-config.js', isBinary: false },
        { path: 'phieu.html', isBinary: false },
        { path: 'duong-day.html', isBinary: false },
        { path: 'eform.html', isBinary: false },
        { path: 'logo-hcc.png', isBinary: true },
        { path: 'robot.jpg', isBinary: true },
        { path: 'niem-yet/index.html', isBinary: false },
        { path: 'niem-yet/css/style.css', isBinary: false },
        { path: 'niem-yet/icons/logo-cchc.png', isBinary: true },
        { path: 'niem-yet/js/config.js', isBinary: false },
        { path: 'niem-yet/js/data-loader.js', isBinary: false },
        { path: 'niem-yet/js/constants.js', isBinary: false },
        { path: 'niem-yet/js/niemyet.js', isBinary: false },
        { path: 'niem-yet/HUONG_DAN.txt', isBinary: false }
      ];

      const ghPagesDir = zip.folder('github-pages');
      if (ghPagesDir) {
        ghPagesDir.file('.nojekyll', '');
        ghPagesDir.file('procedures.json', JSON.stringify(proceduresData, null, 2));
      }

      for (const item of filesToBundle) {
        try {
          const res = await fetch('/' + item.path);
          if (res.ok) {
            if (item.isBinary) {
              const buffer = await res.arrayBuffer();
              zip.file(item.path, buffer);
              if (ghPagesDir) ghPagesDir.file(item.path, buffer);
            } else {
              const text = await res.text();
              zip.file(item.path, text);
              if (ghPagesDir) ghPagesDir.file(item.path, text);
            }
          }
        } catch (e) {
          console.warn('Could not fetch file for zip:', item.path, e);
        }
      }

      // Generate the zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TTPVHCC-Tay-Nha-Trang-GitHub-Pages.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to create ZIP:', err);
      alert('Không thể tạo file ZIP. Vui lòng thử lại!');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  // Helper function to generate clean standalone HTML
  const generateStandaloneHtml = () => {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TTPVHCC Tây Nha Trang - Cổng Dịch vụ công & Trợ lý ảo AI</title>
  <meta name="description" content="Trung tâm Phục vụ Hành chính công Tây Nha Trang - Tỉnh Khánh Hòa">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .chat-scroll::-webkit-scrollbar { width: 5px; }
    .chat-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
  <!-- Top Quốc hiệu -->
  <div class="bg-red-700 text-white text-xs py-1.5 px-4 shadow-sm">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
      <div class="font-bold text-yellow-300 tracking-wider">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM • Độc lập - Tự do - Hạnh phúc</div>
      <div>Hotline: <strong class="text-yellow-200">0258.3822.456</strong> | T2 - T6: 07h30 - 17h00</div>
    </div>
  </div>

  <!-- Header -->
  <header class="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-bold shadow-md text-xl border-2 border-yellow-300">
          🏛️
        </div>
        <div>
          <div class="text-[11px] font-bold text-red-700 tracking-wider uppercase">UBND TỈNH KHÁNH HÒA • TP. NHA TRANG</div>
          <h1 class="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG TÂY NHA TRANG</h1>
          <p class="text-xs text-slate-500 font-medium">Bản Triển khai HTML tĩnh Tự động (GitHub Pages Ready)</p>
        </div>
      </div>
      <button onclick="toggleChat(true)" class="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer">
        <span>🤖</span>
        <span>Hỏi Trợ lý ảo AI</span>
      </button>
    </div>
  </header>

  <!-- Hero Banner -->
  <main class="flex-1 max-w-7xl mx-auto px-4 py-6 w-full space-y-6">
    <div class="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 rounded-2xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div class="max-w-2xl relative z-10 space-y-3">
        <span class="inline-block bg-yellow-400/20 text-yellow-300 font-bold text-xs px-2.5 py-1 rounded-full border border-yellow-400/30">
          ★ CÔNG DÂN LÀ TRUNG TÂM PHỤC VỤ ★
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Hệ thống Tiếp nhận & Trả kết quả Hiện đại</h2>
        <p class="text-sm text-slate-100 leading-relaxed">
          Giải quyết thủ tục hành chính công khai, minh bạch, chính xác và đúng hẹn. Hỗ trợ người dân bốc số quầy điện tử, tra cứu hồ sơ và trợ lý AI 24/7.
        </p>
        <div class="flex flex-wrap gap-2.5 pt-2">
          <a href="#procedures" class="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs sm:text-sm shadow-sm transition-all">
            📋 Xem Danh mục Thủ tục
          </a>
          <a href="#tracking" class="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-lg text-xs sm:text-sm transition-all">
            🔍 Tra cứu hồ sơ Một cửa
          </a>
          <button onclick="toggleChat(true)" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs sm:text-sm shadow-sm transition-all">
            🤖 Mở Trợ lý ảo AI
          </button>
        </div>
      </div>
    </div>

    <!-- Quick search & Procedures list -->
    <div id="procedures" class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>📋</span>
            <span>Danh mục Thủ tục hành chính niêm yết</span>
          </h3>
          <p class="text-xs text-slate-500">Tra cứu nhanh hồ sơ, giấy tờ, mức thu lệ phí và quy trình các bước</p>
        </div>
        <input 
          id="search-input" 
          type="text" 
          oninput="filterProcedures(this.value)" 
          placeholder="Tìm tên thủ tục (sổ đỏ, xây nhà, kết hôn...)" 
          class="border border-slate-300 rounded-lg px-3 py-2 text-xs w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
      </div>

      <div id="procedures-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Rendered by JS -->
      </div>
    </div>

    <!-- Application Tracking Section -->
    <div id="tracking" class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
        <span>🔍</span>
        <span>Tra cứu tiến độ hồ sơ Một cửa điện tử</span>
      </h3>
      <div class="flex gap-2 max-w-lg">
        <input 
          id="app-code-input" 
          type="text" 
          placeholder="Nhập mã hồ sơ (Ví dụ: H74-260901-0028, KH-00129-2026)" 
          class="flex-1 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-red-500"
        >
        <button onclick="lookupApp()" class="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer">
          Tra cứu
        </button>
      </div>
      <div id="app-result"></div>
    </div>
  </main>

  <!-- Floating Chatbot Widget (Guarantee close & open) -->
  <div id="chat-widget" class="hidden fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-300 overflow-hidden">
    <!-- Chat Header with explicit CLOSE BUTTON -->
    <div class="bg-gradient-to-r from-red-700 to-rose-700 text-white px-4 py-3 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-yellow-300">🤖</div>
        <div>
          <h4 class="text-xs sm:text-sm font-bold leading-none">Trợ lý ảo TTPVHCC Tây Nha Trang</h4>
          <span class="text-[10px] text-yellow-200">Hỗ trợ TTHC & Hồ sơ 24/7</span>
        </div>
      </div>
      <button 
        onclick="toggleChat(false)" 
        class="w-7 h-7 flex items-center justify-center rounded-md bg-white/10 hover:bg-red-900 text-white font-bold cursor-pointer transition-colors border border-white/20"
        title="Đóng trợ lý ảo"
      >
        ✕
      </button>
    </div>

    <!-- Messages -->
    <div id="chat-messages" class="flex-1 p-3.5 space-y-3 overflow-y-auto chat-scroll bg-slate-50 text-xs">
      <div class="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs max-w-[90%] space-y-1">
        <p class="font-bold text-red-700">Dạ chào Quý công dân!</p>
        <p class="text-slate-700">Em là Trợ lý ảo TTPVHCC Tây Nha Trang. Quý khách có thể hỏi em về thủ tục làm sổ đỏ, cấp phép xây dựng nhà, khai sinh, kết hôn, hoặc nhập mã số hồ sơ để tra cứu tiến độ ạ.</p>
      </div>
    </div>

    <!-- Chat input -->
    <div class="p-2.5 bg-white border-t border-slate-200 flex gap-2">
      <input 
        id="chat-input" 
        type="text" 
        onkeypress="if(event.key==='Enter') sendChatMessage()" 
        placeholder="Nhập câu hỏi hoặc mã hồ sơ..." 
        class="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      >
      <button onclick="sendChatMessage()" class="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer">
        Gửi
      </button>
    </div>
  </div>

  <!-- Chat floating trigger button -->
  <button 
    id="chat-trigger" 
    onclick="toggleChat(true)" 
    class="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-red-600 to-amber-600 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 border-2 border-yellow-300 hover:scale-105 transition-all cursor-pointer"
  >
    <span class="text-lg">🤖</span>
    <span class="text-xs font-extrabold pr-1 hidden sm:inline">Trợ lý ảo TTPVHCC</span>
  </button>

  <footer class="bg-slate-900 text-slate-400 text-xs py-6 mt-12 border-t border-slate-800 text-center">
    <div class="max-w-7xl mx-auto px-4 space-y-2">
      <div class="text-white font-bold">TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG TÂY NHA TRANG - TỈNH KHÁNH HÒA</div>
      <div>Địa chỉ: Số 02 Đường 23/10, Phường Phương Sơn, TP. Nha Trang • Điện thoại: 0258.3822.456</div>
      <div class="text-slate-500">Mã nguồn sẵn sàng triển khai tự động lên GitHub Pages</div>
    </div>
  </footer>

  <script>
    const data = ${JSON.stringify(proceduresData)};

    function renderProcedures(list) {
      const container = document.getElementById('procedures-list');
      container.innerHTML = list.map(p => \`
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-red-300 transition-all hover:shadow-xs">
          <div class="space-y-2">
            <span class="inline-block bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded">\${p.category}</span>
            <h4 class="font-bold text-slate-900 text-xs sm:text-sm leading-snug">\${p.title}</h4>
            <div class="text-slate-500 text-[11px] space-y-1">
              <div>⏱ Thời gian: <strong class="text-slate-700">\${p.duration}</strong></div>
              <div>💰 Lệ phí: <strong class="text-slate-700">\${p.fee}</strong></div>
              <div>📍 Quầy: <strong class="text-red-700">\${p.counter}</strong></div>
            </div>
          </div>
          <button onclick="askBotAbout('\${p.title}')" class="mt-3 w-full bg-white border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold py-1.5 rounded-lg transition-colors cursor-pointer">
            Hỏi trợ lý ảo thủ tục này 🤖
          </button>
        </div>
      \`).join('');
    }

    function filterProcedures(term) {
      const q = term.toLowerCase().trim();
      const filtered = data.procedures.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) || 
        (p.keywords && p.keywords.some(k => k.toLowerCase().includes(q)))
      );
      renderProcedures(filtered);
    }

    function lookupApp() {
      const code = document.getElementById('app-code-input').value.trim().toUpperCase();
      const resultDiv = document.getElementById('app-result');
      if (!code) {
        resultDiv.innerHTML = '<p class="text-xs text-red-600 font-medium">Vui lòng nhập mã hồ sơ!</p>';
        return;
      }
      const app = data.mockApplications.find(a => a.code.toUpperCase() === code);
      if (app) {
        resultDiv.innerHTML = \`
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-2 text-emerald-950">
            <div class="flex justify-between items-center font-bold text-sm text-emerald-900">
              <span>Hồ sơ: \${app.code}</span>
              <span class="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded">\${app.status}</span>
            </div>
            <p><strong>Người nộp:</strong> \${app.applicant} | <strong>Thủ tục:</strong> \${app.procedureTitle}</p>
            <p><strong>Ngày tiếp nhận:</strong> \${app.submitDate} | <strong>Ngày hẹn trả:</strong> \${app.promiseDate}</p>
            <p><strong>Bước hiện tại:</strong> \${app.currentStep}</p>
            <p class="text-[11px] text-slate-600 bg-white p-2 rounded border border-emerald-100">💡 \${app.note}</p>
          </div>
        \`;
      } else {
        resultDiv.innerHTML = \`
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
            Không tìm thấy hồ sơ với mã "\${code}". Vui lòng kiểm tra lại giấy hẹn hoặc liên hệ hotline 0258.3822.456.
          </div>
        \`;
      }
    }

    function toggleChat(show) {
      const widget = document.getElementById('chat-widget');
      const trigger = document.getElementById('chat-trigger');
      if (show) {
        widget.classList.remove('hidden');
        trigger.classList.add('hidden');
      } else {
        widget.classList.add('hidden');
        trigger.classList.remove('hidden');
      }
    }

    function askBotAbout(procTitle) {
      toggleChat(true);
      document.getElementById('chat-input').value = 'Hướng dẫn làm thủ tục ' + procTitle;
      sendChatMessage();
    }

    function sendChatMessage() {
      const input = document.getElementById('chat-input');
      const text = input.value.trim();
      if (!text) return;
      input.value = '';

      const msgContainer = document.getElementById('chat-messages');
      // User message
      msgContainer.innerHTML += \`
        <div class="flex justify-end">
          <div class="bg-red-600 text-white rounded-2xl rounded-tr-xs p-2.5 max-w-[85%] text-xs shadow-xs">
            \${text}
          </div>
        </div>
      \`;
      msgContainer.scrollTop = msgContainer.scrollHeight;

      // Bot reply from procedures data
      setTimeout(() => {
        const q = text.toLowerCase();
        let reply = '';
        const app = data.mockApplications.find(a => q.includes(a.code.toLowerCase()));
        const proc = data.procedures.find(p => q.includes(p.title.toLowerCase()) || (p.keywords && p.keywords.some(k => q.includes(k.toLowerCase()))));

        if (app) {
          reply = \`<b>Kết quả tra cứu hồ sơ: \${app.code}</b><br>Người nộp: \${app.applicant}<br>Tình trạng: \${app.status}<br>Hẹn trả: \${app.promiseDate}<br>Cán bộ phụ trách: \${app.assignedOfficer}\`;
        } else if (proc) {
          reply = \`<b>\${proc.title}</b><br>📍 Quầy: \${proc.counter}<br>⏱ Thời hạn: \${proc.duration}<br>💰 Lệ phí: \${proc.fee}<br><br><b>Hồ sơ cần nộp:</b><br>\${proc.documents.map(d => '- ' + d).join('<br>')}\`;
        } else {
          reply = 'Dạ Trung tâm Phục vụ Hành chính công Tây Nha Trang xin ghi nhận. Quý khách có thể xem thông tin các thủ tục bên dưới hoặc liên hệ số điện thoại 0258.3822.456 để được giải đáp trực tiếp ạ.';
        }

        msgContainer.innerHTML += \`
          <div class="flex justify-start">
            <div class="bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-xs p-3 max-w-[88%] text-xs shadow-xs space-y-1">
              \${reply}
            </div>
          </div>
        \`;
        msgContainer.scrollTop = msgContainer.scrollHeight;
      }, 500);
    }

    // Init
    renderProcedures(data.procedures);
  </script>
</body>
</html>`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold leading-tight flex items-center gap-2">
                <span>Triển khai lên GitHub Pages & Chạy HTML</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Tự động 100%
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Chạy website độc lập trên máy chủ tĩnh GitHub Pages với đầy đủ trợ lý ảo, bốc số quầy & tra cứu hồ sơ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 px-5 pt-3 border-b border-slate-200 flex gap-2">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-white text-slate-900 shadow-xs border-t-2 border-red-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Terminal className="w-4 h-4 text-red-600" />
            <span>1. Hướng dẫn 3 bước</span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'download'
                ? 'bg-white text-slate-900 shadow-xs border-t-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>2. Tải trọn gói ZIP (1-Click)</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'workflow'
                ? 'bg-white text-slate-900 shadow-xs border-t-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileCode className="w-4 h-4 text-blue-600" />
            <span>3. File GitHub Actions</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">Hệ thống đã cấu hình sẵn sàng cho GitHub Pages</h4>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      Mã nguồn đã được tối ưu hóa với file <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200">.nojekyll</code>, workflow tự động triển khai <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200">.github/workflows/deploy.yml</code> và bản HTML tĩnh có thể chạy trực tiếp trong trình duyệt không cần máy chủ Node.js.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 1 */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50/50">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">1</span>
                  <span>Tạo một kho lưu trữ mới trên GitHub (New Repository)</span>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  Truy cập <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5 font-semibold">github.com/new <ExternalLink className="w-3 h-3" /></a>, đặt tên repository (ví dụ: <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">ttpvhcc-tay-nha-trang</code>) và chọn chế độ <strong>Public</strong>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">2</span>
                    <span>Đẩy mã nguồn lên GitHub bằng Terminal (hoặc tải gói ZIP và tải lên)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('git', gitCommands)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copied === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied === 'git' ? 'Đã sao chép' : 'Sao chép lệnh'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 text-slate-200 text-xs p-3 rounded-lg overflow-x-auto font-mono leading-relaxed ml-8">
                  {gitCommands}
                </pre>
              </div>

              {/* Step 3 */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50/50">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">3</span>
                  <span>Bật tính năng GitHub Pages tự động</span>
                </div>
                <div className="text-xs text-slate-600 pl-8 space-y-1.5">
                  <p>1. Vào repository trên GitHub, chọn tab <strong>Settings</strong>.</p>
                  <p>2. Ở thanh bên trái, chọn mục <strong>Pages</strong>.</p>
                  <p>3. Trong phần <strong>Build and deployment &gt; Source</strong>: Chọn <strong>GitHub Actions</strong>.</p>
                  <p>4. GitHub Actions sẽ tự động chạy file workflow và website của bạn sẽ hoạt động tại link:</p>
                  <div className="bg-blue-50 border border-blue-200 text-blue-900 font-mono p-2 rounded-md font-bold text-xs mt-1">
                    https://&lt;username&gt;.github.io/&lt;repository-name&gt;/
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 rounded-2xl p-5 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Tải trọn gói ZIP mã nguồn HTML & GitHub Pages</h4>
                  <p className="text-xs text-slate-600 max-w-lg mx-auto mt-1">
                    Bao gồm toàn bộ file HTML tĩnh độc lập, quy trình bốc số, tra cứu tiến độ, trợ lý ảo có nút đóng/mở mượt mà, file cấu hình <code className="font-mono text-emerald-700">.github/workflows/deploy.yml</code> và file <code className="font-mono text-emerald-700">.nojekyll</code>.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-left">
                  {/* Gói 1: Web tĩnh & GitHub Pages */}
                  <div className="bg-white border-2 border-emerald-300 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                          KHUYÊN DÙNG (NHẸ & NHANH)
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">~590 KB</span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm">Gói Web Tĩnh & GitHub Pages</h5>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Chạy ngay trực tiếp không cần cài đặt. Đầy đủ Cổng DVC, Bảng niêm yết TTHC, Trợ lý ảo AI, Kho 13 biểu mẫu E-Form, Đường dây nóng và Phiếu đánh giá.
                      </p>
                    </div>
                    <div className="pt-3">
                      <a
                        href="/ttpvhcc-tay-nha-trang-static.zip"
                        download="ttpvhcc-tay-nha-trang-static.zip"
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer text-center"
                      >
                        <Download className="w-4 h-4" />
                        <span>Tải gói Web Tĩnh (.zip)</span>
                      </a>
                    </div>
                  </div>

                  {/* Gói 2: Toàn bộ mã nguồn Full Project */}
                  <div className="bg-white border-2 border-slate-300 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-indigo-100 text-indigo-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                          TOÀN BỘ MÃ NGUỒN
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">~2.5 MB</span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm">Full Source Code (React + Vite + Server)</h5>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Chứa toàn bộ mã nguồn TypeScript, React components, API proxy backend Express, cấu hình Tailwind CSS và kho dữ liệu gốc.
                      </p>
                    </div>
                    <div className="pt-3">
                      <a
                        href="/ttpvhcc-tay-nha-trang-full-project.zip"
                        download="ttpvhcc-tay-nha-trang-full-project.zip"
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer text-center"
                      >
                        <Download className="w-4 h-4" />
                        <span>Tải Full Source Code (.zip)</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleDownloadZip}
                    disabled={isGeneratingZip}
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 active:bg-slate-950 disabled:opacity-60 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer"
                  >
                    {isGeneratingZip ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Đang đóng gói file ZIP trực tiếp...</span>
                      </>
                    ) : zipSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Đã tạo và tải file thành công!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span>Hoặc tạo lại gói ZIP tùy biến ngay trong trình duyệt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-600" />
                  <span>Cấu trúc gói file tải về:</span>
                </div>
                <div className="font-mono bg-white p-3 rounded-lg border border-slate-200 space-y-1 text-slate-800 text-[11px]">
                  <div>📦 TTPVHCC-Tay-Nha-Trang/</div>
                  <div className="pl-4">├── 📄 index.html <span className="text-slate-400 font-sans">(Trang chủ Cổng DVC & Trợ lý ảo AI & Kiosk)</span></div>
                  <div className="pl-4">├── 📄 eform.html <span className="text-slate-400 font-sans">(Kho 13 biểu mẫu điện tử E-Form)</span></div>
                  <div className="pl-4">├── 📄 duong-day.html & phieu.html <span className="text-slate-400 font-sans">(Đường dây nóng & Phiếu đánh giá)</span></div>
                  <div className="pl-4">├── 📄 site.css & site.js <span className="text-slate-400 font-sans">(CSS hoạt ảnh bồng bềnh + JS 10 quầy)</span></div>
                  <div className="pl-4">├── 📁 niem-yet/ <span className="text-slate-400 font-sans">(Thư mục Bảng niêm yết TTHC đầy đủ)</span></div>
                  <div className="pl-4">├── 📄 README.md & .nojekyll <span className="text-slate-400 font-sans">(Tài liệu & cấu hình GitHub Pages)</span></div>
                  <div className="pl-4">└── 📁 .github/workflows/deploy.yml <span className="text-slate-400 font-sans">(Tự động deploy)</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">File cấu hình: .github/workflows/deploy.yml</h4>
                  <p className="text-xs text-slate-500">Đặt file này trong thư mục dự án của bạn để GitHub tự động xuất bản website khi push code.</p>
                </div>
                <button
                  onClick={() => copyToClipboard('yaml', githubWorkflowYaml)}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copied === 'yaml' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'yaml' ? 'Đã sao chép' : 'Sao chép YAML'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 text-slate-200 text-xs p-4 rounded-xl overflow-x-auto font-mono leading-relaxed border border-slate-800">
                {githubWorkflowYaml}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Hỗ trợ tùy biến API máy chủ hoặc chạy hoàn toàn offline không cần backend.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file ZIP</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
