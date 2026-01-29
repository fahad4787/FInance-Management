import { useState } from 'react';
import { FiX, FiMenu } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 w-full ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="w-full max-w-[1800px] mx-auto px-6 py-4 flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-primary-600"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        <div className="overflow-auto h-[calc(100vh-73px)] w-full">
          <div className="w-full max-w-[1800px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
