import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiX, FiMenu } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-slate-100/90">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 w-full ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-card">
          <div className="w-full max-w-[1800px] mx-auto px-6 py-4 flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-600 hover:text-primary-600"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>
        <main className="overflow-auto h-[calc(100vh-73px)] w-full">
          <div className="w-full max-w-[1800px] mx-auto relative">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
