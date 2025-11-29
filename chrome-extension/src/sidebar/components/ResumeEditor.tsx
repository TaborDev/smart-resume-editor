import React, { useState } from 'react';
import { JobAnalysisPanel } from './JobAnalysisPanel';
import { AISuggestionsPanel } from './AISuggestionsPanel';
import { LaTeXEditor } from './LaTeXEditor';

interface ResumeEditorProps {
  currentUrl: string;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ currentUrl }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'suggestions' | 'editor'>('analysis');
  const [latexContent, setLatexContent] = useState<string>(`\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}

\\begin{document}

\\begin{center}
{\\Large \\textbf{Your Name}} \\\\
\\vspace{2mm}
Your Email | Your Phone | Your Location \\
\\vspace{2mm}
LinkedIn Profile | Portfolio URL
\\end{center}

\\section*{Professional Summary}
Write a compelling professional summary here...

\\section*{Experience}
\\textbf{Job Title} - Company Name \\\\ \hfill Date Range \\
\\begin{itemize}
    \\item Achievement or responsibility with quantifiable results
    \\item Another key accomplishment
\\end{itemize}

\\section*{Education}
\\textbf{Degree} - University Name \hfill Graduation Date

\\section*{Skills}
Technical Skills, Programming Languages, Tools, etc.

\\end{document}`);

  return (
    <div className="resume-editor">
      {/* Left Side - Resume Preview */}
      <div className="resume-preview">
        <div className="preview-container">
          <iframe 
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <script src="https://cdn.jsdelivr.net/npm/latex.js/dist/latex.min.js"></script>
                  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/latex.js/dist/latex.css">
                  <style>
                    body { 
                      margin: 0;
                      padding: 20px;
                      font-family: 'Latin Modern', 'Times New Roman', serif;
                      line-height: 1.6;
                      font-size: 12pt;
                    }
                    .resume {
                      max-width: 8.5in;
                      margin: 0 auto;
                      padding: 1in;
                      background: white;
                      box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    .preview-placeholder {
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      height: 100%;
                      color: #666;
                      font-style: italic;
                    }
                    @page { size: A4; margin: 0; }
                  </style>
                </head>
                <body>
                  <div class="resume">
                    ${latexContent || '<div class="preview-placeholder">Your resume preview will appear here</div>'}
                  </div>
                  ${latexContent ? `
                    <script>
                      try {
                        const options = {
                          format: 'LaTeX',
                          lineWidth: 500
                        };
                        const latex = new latexjs.LaTeX().parse('${latexContent.replace(/\n/g, '\\n').replace(/'/g, "\\'")}');
                        document.querySelector('.resume').innerHTML = '';
                        latex.render(document.querySelector('.resume'));
                      } catch (e) {
                        console.error('Error rendering LaTeX:', e);
                        document.querySelector('.resume').innerHTML = 
                          '<div style="color: red; padding: 20px;">Error rendering LaTeX. Please check your syntax.</div>';
                      }
                    </script>` : ''
                  }
                </body>
              </html>
            `}
            title="Resume Preview"
            className="preview-iframe"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>

      {/* Right Side - Editor Tabs */}
      <div className="editor-tabs">
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
          <button 
            className={`tab-button ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            LaTeX Editor
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'analysis' && <JobAnalysisPanel currentUrl={currentUrl} />}
          {activeTab === 'suggestions' && <AISuggestionsPanel />}
          {activeTab === 'editor' && (
            <LaTeXEditor 
              latexCode={latexContent} 
              setLatexCode={setLatexContent} 
            />
          )}
        </div>
      </div>
    </div>
  );
};
