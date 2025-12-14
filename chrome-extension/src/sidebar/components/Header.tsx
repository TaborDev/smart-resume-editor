import React from 'react';

interface HeaderProps {
  activeTab: 'analysis' | 'suggestions' | 'editor';
  setActiveTab: (tab: 'analysis' | 'suggestions' | 'editor') => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onClose: () => void;
  onDownload: () => void;
  isSaved?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onClose,
  onDownload,
  isSaved = true,
}) => {
  return (
    <header className="app-header">
      {/* Left Section */}
      <div className="header-left">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo-icon">R</div>
          <span className="logo-text">Smart Resume Editor</span>
        </div>

        <div className="header-divider" />

        {/* Navigation Tabs */}
        <nav className="header-nav">
          <button
            className={`nav-button ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Job Analysis
          </button>
          <button
            className={`nav-button ${activeTab === 'suggestions' ? 'active' : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Suggestions
          </button>
          <button
            className={`nav-button ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            LaTeX Editor
          </button>
        </nav>
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Save Status */}
        <div className="save-status">
          <span className="save-indicator" style={{ background: isSaved ? '#22c55e' : '#f59e0b' }} />
          <span>{isSaved ? 'All changes saved' : 'Unsaved changes'}</span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          className="icon-button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>

        {/* Close Button */}
        <button className="btn-secondary" onClick={onClose}>
          Close
        </button>

        {/* Download Button */}
        <button className="btn-primary" onClick={onDownload}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download PDF
        </button>
      </div>
    </header>
  );
};
