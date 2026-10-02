import React, { useState } from 'react';
import { SiteHeader } from './components/SiteHeader.tsx';
import { HomeView } from './components/views/HomeView.tsx';
import { Chatbot } from './components/Chatbot.tsx';
import { GitHubExportModal } from './components/GitHubExportModal.tsx';
import { CategoryModal } from './components/modals/CategoryModal.tsx';
import { HotlineModal } from './components/modals/HotlineModal.tsx';
import { RatingModal } from './components/modals/RatingModal.tsx';
import { FormsModal } from './components/modals/FormsModal.tsx';
import { PaknModal } from './components/modals/PaknModal.tsx';
import { ConfigModal } from './components/modals/ConfigModal.tsx';
import proceduresData from './data/procedures.json';

export default function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isHotlineModalOpen, setIsHotlineModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isFormsModalOpen, setIsFormsModalOpen] = useState(false);
  const [isPaknModalOpen, setIsPaknModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const handleSelectCategory = (category: any) => {
    setSelectedCategory(category);
  };

  const handleSearchProcedure = (query: string) => {
    // Open a virtual category or filter
    setSelectedCategory({
      id: 'search-results',
      name: `KẾT QUẢ TÌM KIẾM: "${query.toUpperCase()}"`,
      count: 'TÌM KIẾM',
      ministry: 'CÁC BỘ NGÀNH LIÊN QUAN'
    });
  };

  const handleAskChatbot = (titleOrQuery: string) => {
    setIsChatbotOpen(true);
  };

  const handleTakeTicket = (counterName: string) => {
    // Open rating / info or chatbot
    alert(`Quý khách đã đăng ký lấy số quầy: ${counterName}. Vui lòng kiểm tra màn hình Kiosk tại sảnh chờ.`);
  };

  const handleResetToHome = () => {
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eaedf2] text-slate-900 font-sans selection:bg-red-200 selection:text-red-900">
      {/* Top Banner & Marquee Header */}
      <SiteHeader
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        onResetToHome={handleResetToHome}
      />

      {/* Main Board Content */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <HomeView
          onOpenHotlineModal={() => setIsHotlineModalOpen(true)}
          onOpenRatingModal={() => setIsRatingModalOpen(true)}
          onOpenFormsModal={() => setIsFormsModalOpen(true)}
          onOpenPaknModal={() => setIsPaknModalOpen(true)}
          onOpenConfigModal={() => setIsConfigModalOpen(true)}
          onSelectCategory={handleSelectCategory}
          onSearchProcedure={handleSearchProcedure}
          onResetToHome={handleResetToHome}
        />
      </main>

      {/* Modals */}
      <CategoryModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        procedures={proceduresData.procedures}
        onAskChatbot={handleAskChatbot}
        onTakeTicket={handleTakeTicket}
      />

      <HotlineModal
        isOpen={isHotlineModalOpen}
        onClose={() => setIsHotlineModalOpen(false)}
      />

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
      />

      <FormsModal
        isOpen={isFormsModalOpen}
        onClose={() => setIsFormsModalOpen(false)}
        onAskChatbot={handleAskChatbot}
      />

      <PaknModal
        isOpen={isPaknModalOpen}
        onClose={() => setIsPaknModalOpen(false)}
        onOpenHotline={() => {
          setIsPaknModalOpen(false);
          setIsHotlineModalOpen(true);
        }}
      />

      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onOpenGitHubExport={() => setIsExportModalOpen(true)}
      />

      {/* GitHub Pages 1-Click Export Modal */}
      <GitHubExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Floating AI Assistant with Speech Bubble & Robot Avatar */}
      <Chatbot
        isOpen={isChatbotOpen}
        setIsOpen={setIsChatbotOpen}
        onSelectProcedure={(proc) => {
          setSelectedCategory({
            id: proc.id,
            name: proc.category.toUpperCase(),
            count: 'CHI TIẾT',
            ministry: proc.authority
          });
        }}
        onTakeTicket={handleTakeTicket}
      />
    </div>
  );
}
