import React, { useState, useEffect } from 'react';
import { JobAnalysisPanel } from './JobAnalysisPanel';
import { AISuggestionsPanel } from './AISuggestionsPanel';
import { LaTeXEditor } from './LaTeXEditor';
import { ResumePreview } from './ResumePreview';
import { Header } from './Header';

interface ResumeEditorProps {
  currentUrl: string;
  jobTabId?: number;
}

const DEFAULT_LATEX = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}

\\begin{document}

\\begin{center}
{\\Large \\textbf{John Doe}} \\\\
\\vspace{2mm}
johndoe@email.com | (555) 123-4567 | San Francisco, CA \\\\
\\vspace{2mm}
linkedin.com/in/johndoe | github.com/johndoe
\\end{center}

\\section*{Professional Summary}
Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications and leading cross-functional teams.

\\section*{Experience}
\\textbf{Senior Software Engineer} - TechCorp Inc. \\hfill San Francisco, CA \\\\
\\textit{January 2021 - Present} \\\\
\\begin{itemize}
    \\item Led development of microservices architecture, reducing system latency by 40\\%
    \\item Mentored 5 junior developers and conducted code reviews
    \\item Implemented CI/CD pipelines using GitHub Actions and Docker
\\end{itemize}

\\textbf{Software Engineer} - StartupXYZ \\hfill Remote \\\\
\\textit{June 2018 - December 2020} \\\\
\\begin{itemize}
    \\item Built React-based dashboard serving 10,000+ daily active users
    \\item Optimized database queries, improving response time by 60\\%
\\end{itemize}

\\section*{Education}
\\textbf{Bachelor of Science in Computer Science} - University of California \\hfill 2018

\\section*{Skills}
JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, AWS, Docker, Git

\\end{document}`;

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ currentUrl, jobTabId }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'suggestions' | 'editor'>('editor');
  const [latexContent, setLatexContent] = useState<string>(DEFAULT_LATEX);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [zoom, setZoom] = useState(100);

  // Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Mark as unsaved when content changes
  useEffect(() => {
    setIsSaved(false);
    const saveTimeout = setTimeout(() => {
      setIsSaved(true);
    }, 2000);
    return () => clearTimeout(saveTimeout);
  }, [latexContent]);

  const handleClose = () => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'closeOverlay' }, '*');
    } else {
      window.close();
    }
  };

  const handleDownload = () => {
    // TODO: Implement actual PDF compilation
    alert('PDF download will be implemented with LaTeX compilation service');
  };

  const handleRecompile = () => {
    // Force re-render of preview
    const temp = latexContent;
    setLatexContent('');
    setTimeout(() => setLatexContent(temp), 100);
  };

  return (
    <div className={`resume-editor ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onClose={handleClose}
        onDownload={handleDownload}
        isSaved={isSaved}
      />

      {/* Main Content */}
      <div className="resume-editor-content">
        {/* Left Side - Editor Panel */}
        <div className="editor-tabs">
          {/* Tab Buttons (visible when not in editor mode) */}
          {activeTab !== 'editor' && (
            <div className="tab-buttons">
              <button 
                className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
                onClick={() => setActiveTab('analysis')}
              >
                Job Analysis
              </button>
              <button 
                className={`tab-button ${activeTab === 'suggestions' ? 'active' : ''}`}
                onClick={() => setActiveTab('suggestions')}
              >
                AI Suggestions
              </button>
            </div>
          )}
          
          {/* Tab Content */}
          <div className={activeTab === 'editor' ? 'editor-content custom-scrollbar' : 'tab-content custom-scrollbar'}>
            {activeTab === 'analysis' && (
              <JobAnalysisPanel currentUrl={currentUrl} jobTabId={jobTabId} />
            )}
            {activeTab === 'suggestions' && <AISuggestionsPanel />}
            {activeTab === 'editor' && (
              <LaTeXEditor 
                latexCode={latexContent} 
                setLatexCode={setLatexContent} 
              />
            )}
          </div>
        </div>

        {/* Right Side - Resume Preview */}
        <ResumePreview
          latexContent={latexContent}
          zoom={zoom}
          setZoom={setZoom}
          onRecompile={handleRecompile}
        />
      </div>
    </div>
  );
};
