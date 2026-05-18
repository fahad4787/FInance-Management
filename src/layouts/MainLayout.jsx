import { useState, useEffect, useCallback } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FiX, FiMenu } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Logo from '../components/Logo';

const DESKTOP_MEDIA = '(min-width: 1024px)';

const MainLayout = () => {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_MEDIA).matches
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_MEDIA).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MEDIA);
    const sync = (matches) => {
      setIsDesktop(matches);
      setIsSidebarOpen(matches);
    };
    sync(mq.matches);
    const onChange = (e) => sync(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (isDesktop || !isSidebarOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isDesktop, isSidebarOpen]);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  return (
    <div className="flex h-screen bg-slate-100/90">
      {!isDesktop && isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-emerald-950/60 lg:hidden"
          aria-label="Close menu"
          onClick={closeSidebar}
        />
      )}
      <Sidebar isOpen={isSidebarOpen} isDesktop={isDesktop} onClose={closeSidebar} />
      <div
        className={`flex-1 min-w-0 transition-all duration-300 w-full ${isSidebarOpen ? 'lg:ml-64' : ''}`}
      >
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-card">
          <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
            <Link
              to="/"
              className="lg:hidden min-w-0 shrink"
              onClick={() => !isDesktop && isSidebarOpen && closeSidebar()}
            >
              <Logo compact />
            </Link>

            <button
              type="button"
              onClick={toggleSidebar}
              className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-600 hover:text-primary-600 shrink-0 ml-auto lg:ml-0"
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen && !isDesktop ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>
        <main className="overflow-auto h-[calc(100vh-57px)] sm:h-[calc(100vh-73px)] w-full min-h-0 min-w-0">
          <div className="w-full min-w-0 max-w-[1800px] mx-auto relative">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
