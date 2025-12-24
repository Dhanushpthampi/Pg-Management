import React from 'react';

const Loader = ({ fullScreen = false }) => {
    return (
        <div className={`loader-container ${fullScreen ? 'fullscreen' : ''}`}>
            <div className="loader"></div>
            <style>{`
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 40px;
        }
        .loader-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 9999;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(4px);
        }
        .loader {
          width: 48px;
          height: 48px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Loader;
