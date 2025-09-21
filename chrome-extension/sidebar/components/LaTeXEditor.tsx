import React, { useEffect, useRef, useState } from 'react';

interface LaTeXEditorProps {
  value: string;
  onChange: (value: string) => void;
  darkMode: boolean;
  jobKeywords: string[];
}

export const LaTeXEditor: React.FC<LaTeXEditorProps> = ({
  value,
  onChange,
  darkMode,
  jobKeywords
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const compileLatex = async () => {
    setIsCompiling(true);
    setCompileError(null);

    try {
      const response = await fetch('http://localhost:3001/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latexSource: value,
          templateType: 'modern'
        })
      });

      const result = await response.json();

      if (!result.success) {
        setCompileError(result.errors?.join('\n') || 'Compilation failed');
      } else {
        // Open PDF in new tab
        if (result.pdfUrl) {
          window.open(result.pdfUrl, '_blank');
        }
      }
    } catch (error) {
      setCompileError('Failed to compile: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsCompiling(false);
    }
  };

  const insertTemplate = (templateType: 'section' | 'experience' | 'skill') => {
    if (!textareaRef.current) return;

    const templates = {
      section: '\\section{Section Name}\n',
      experience: `\\cventry{2020--Present}{Job Title}{Company Name}{City, ST}{}{
\\begin{itemize}
\\item Bullet point describing achievement
\\item Another accomplishment with metrics
\\end{itemize}}

`,
      skill: '\\cvitem{Category}{Skill 1, Skill 2, Skill 3}\n'
    };

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const template = templates[templateType];
    
    const newValue = value.substring(0, start) + template + value.substring(end);
    onChange(newValue);
    
    // Set cursor position after the inserted template
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + template.length, start + template.length);
    }, 0);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            LaTeX Editor
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => insertTemplate('section')}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Insert Section"
            >
              §
            </button>
            <button
              onClick={() => insertTemplate('experience')}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Insert Experience"
            >
              💼
            </button>
            <button
              onClick={() => insertTemplate('skill')}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Insert Skill"
            >
              ⚡
            </button>
          </div>
        </div>
        
        <button
          onClick={compileLatex}
          disabled={isCompiling}
          className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded flex items-center gap-1"
        >
          {isCompiling ? (
            <>
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
              Compiling...
            </>
          ) : (
            <>📄 Compile PDF</>
          )}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`absolute inset-0 w-full h-full resize-none border-none outline-none p-3 font-mono text-sm leading-relaxed ${
            darkMode 
              ? 'bg-gray-900 text-gray-100' 
              : 'bg-white text-gray-900'
          }`}
          placeholder="Enter your LaTeX resume code here..."
          spellCheck={false}
        />
      </div>

      {/* Status Bar */}
      <div className="px-2 py-1 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        {compileError ? (
          <div className="text-xs text-red-600 dark:text-red-400 truncate">
            Error: {compileError}
          </div>
        ) : jobKeywords.length > 0 ? (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Target keywords: {jobKeywords.slice(0, 3).join(', ')}
            {jobKeywords.length > 3 && ` +${jobKeywords.length - 3} more`}
          </div>
        ) : (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Ready • Press Ctrl+S to save
          </div>
        )}
      </div>
    </div>
  );
};