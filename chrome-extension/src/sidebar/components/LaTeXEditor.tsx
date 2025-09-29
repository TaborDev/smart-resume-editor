import React, { useState } from 'react';

export const LaTeXEditor: React.FC = () => {
  const [latexCode, setLatexCode] = useState(`\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}

\\begin{document}

\\begin{center}
{\\Large \\textbf{Your Name}} \\\\
\\vspace{2mm}
Your Email | Your Phone | Your Location \\\\
\\vspace{2mm}
LinkedIn Profile | Portfolio URL
\\end{center}

\\section*{Professional Summary}
Write a compelling professional summary here...

\\section*{Experience}
\\textbf{Job Title} - Company Name \\hfill Date Range \\\\
\\begin{itemize}
    \\item Achievement or responsibility with quantifiable results
    \\item Another key accomplishment
\\end{itemize}

\\section*{Education}
\\textbf{Degree} - University Name \\hfill Graduation Date

\\section*{Skills}
Technical Skills, Programming Languages, Tools, etc.

\\end{document}`);

  const [isCompiling, setIsCompiling] = useState(false);

  const compileLatex = async () => {
    setIsCompiling(true);
    try {
      // TODO: Integrate with LaTeX compilation service
      console.log('Compiling LaTeX:', latexCode);
      
      // Simulate compilation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, just show success message
      alert('LaTeX compiled successfully! (Mock compilation)');
    } catch (error) {
      console.error('Error compiling LaTeX:', error);
      alert('Error compiling LaTeX. Please check your syntax.');
    } finally {
      setIsCompiling(false);
    }
  };

  const downloadPDF = () => {
    // TODO: Implement PDF download
    alert('PDF download would be implemented here');
  };

  const insertTemplate = (template: string) => {
    const templates = {
      section: '\\section*{Section Title}\nContent here...\n\n',
      experience: '\\textbf{Job Title} - Company Name \\hfill Date Range \\\\\n\\begin{itemize}\n    \\item Achievement or responsibility\n\\end{itemize}\n\n',
      education: '\\textbf{Degree} - University Name \\hfill Graduation Date\n\n'
    };
    
    const templateText = templates[template as keyof typeof templates] || '';
    setLatexCode(prev => prev + templateText);
  };

  return (
    <div className="latex-editor">
      <div className="panel-header">
        <h3>LaTeX Resume Editor</h3>
        <div className="editor-actions">
          <button
            onClick={compileLatex}
            disabled={isCompiling}
            className="btn-primary"
          >
            {isCompiling ? 'Compiling...' : 'Compile'}
          </button>
          <button
            onClick={downloadPDF}
            className="btn-secondary"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="template-buttons">
        <button onClick={() => insertTemplate('section')} className="template-btn">
          Add Section
        </button>
        <button onClick={() => insertTemplate('experience')} className="template-btn">
          Add Experience
        </button>
        <button onClick={() => insertTemplate('education')} className="template-btn">
          Add Education
        </button>
      </div>

      <div className="editor-container">
        <textarea
          value={latexCode}
          onChange={(e) => setLatexCode(e.target.value)}
          className="latex-textarea"
          placeholder="Write your LaTeX resume code here..."
          spellCheck={false}
        />
      </div>

      <div className="editor-help">
        <h4>Quick Tips:</h4>
        <ul>
          <li><code>\\textbf{'{text}'}</code> - Bold text</li>
          <li><code>\\textit{'{text}'}</code> - Italic text</li>
          <li><code>\\begin{'{itemize}'} \\item Text \\end{'{itemize}'}</code> - Bullet points</li>
          <li><code>\\hfill</code> - Right align (for dates)</li>
        </ul>
      </div>
    </div>
  );
};