import React, { useState, useRef, useCallback } from 'react';

interface LaTeXEditorProps {
  latexCode?: string;
  setLatexCode: (code: string) => void;
}

export const LaTeXEditor: React.FC<LaTeXEditorProps> = ({ 
  latexCode = '', 
  setLatexCode 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Insert text at cursor position
  const insertAtCursor = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = latexCode.substring(start, end);
    const newText = latexCode.substring(0, start) + before + selectedText + after + latexCode.substring(end);
    
    setLatexCode(newText);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, [latexCode, setLatexCode]);

  // Toolbar actions
  const handleBold = () => insertAtCursor('\\textbf{', '}');
  const handleItalic = () => insertAtCursor('\\textit{', '}');
  const handleHeading = () => insertAtCursor('\\section*{', '}\n');
  const handleBulletList = () => insertAtCursor('\\begin{itemize}\n    \\item ', '\n\\end{itemize}\n');
  const handleNumberedList = () => insertAtCursor('\\begin{enumerate}\n    \\item ', '\n\\end{enumerate}\n');
  const handleLink = () => insertAtCursor('\\href{url}{', '}');

  // Syntax highlighting for display
  const highlightSyntax = (code: string) => {
    const lines = code.split('\n');
    return lines.map((line, index) => {
      let highlighted = line
        // Commands (backslash followed by word)
        .replace(/(\\[a-zA-Z]+)/g, '<span class="syntax-command">$1</span>')
        // Brackets
        .replace(/([{}])/g, '<span class="syntax-bracket">$1</span>')
        // Comments (% to end of line)
        .replace(/(%.*)$/g, '<span class="syntax-comment">$1</span>');
      
      return (
        <div key={index} className="line">
          <span className="line-number">{index + 1}</span>
          <span 
            className="line-content" 
            dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }}
          />
        </div>
      );
    });
  };

  return (
    <div className="latex-editor">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button className="toolbar-button" onClick={handleBold} title="Bold (\\textbf)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
            </svg>
          </button>
          <button className="toolbar-button" onClick={handleItalic} title="Italic (\\textit)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
            </svg>
          </button>
          
          <div className="toolbar-divider" />
          
          <button className="toolbar-button" onClick={handleHeading} title="Section heading">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 4v3h5.5v12h3V7H19V4z"/>
            </svg>
          </button>
          
          <div className="toolbar-divider" />
          
          <button className="toolbar-button" onClick={handleBulletList} title="Bullet list">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
            </svg>
          </button>
          <button className="toolbar-button" onClick={handleNumberedList} title="Numbered list">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
            </svg>
          </button>
          
          <div className="toolbar-divider" />
          
          <button className="toolbar-button" onClick={handleLink} title="Hyperlink">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
            </svg>
          </button>
        </div>

        <div className="file-info">
          <span className="file-name">resume.tex</span>
        </div>
      </div>

      {/* Editor with line numbers */}
      <div className="editor-content custom-scrollbar">
        <div className="editor-inner line-numbers">
          {highlightSyntax(latexCode)}
        </div>
        
        {/* Hidden textarea for actual editing */}
        <textarea
          ref={textareaRef}
          value={latexCode}
          onChange={(e) => setLatexCode(e.target.value)}
          className="latex-textarea"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'text',
            resize: 'none',
            padding: '16px',
            paddingLeft: '48px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: '22px',
          }}
          spellCheck={false}
        />
      </div>
    </div>
  );
};