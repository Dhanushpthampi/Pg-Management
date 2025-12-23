import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay show-mobile"
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            top: '61px', /* Start below header */
            background: 'rgba(0,0,0,0.5)',
            zIndex: 15
          }}
        />
      )}

      <div className="main-content-wrapper">
        <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="main-content">
          <Outlet />
        </div>
      </div>

      <style>{`
        .app-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        
        .main-content-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          width: 100%;
        }

        .main-content {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }

        @media (max-width: 768px) {
           .main-content {
             padding: 15px;
           }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
