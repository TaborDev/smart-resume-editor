import React from 'react';

interface ResumePreviewProps {
  latexContent: string;
  zoom: number;
  setZoom: (zoom: number) => void;
  onRecompile: () => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  latexContent,
  zoom,
  setZoom,
  onRecompile,
}) => {
  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 150));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 50));
  const handleResetZoom = () => setZoom(100);

  // Parse LaTeX content to display a formatted resume preview
  // This is a simplified parser that shows the content in a styled format
  const parseLatexToPreview = (latex: string) => {
    // Extract content between \begin{document} and \end{document}
    const docMatch = latex.match(/\\begin{document}([\s\S]*?)\\end{document}/);
    if (!docMatch) return null;

    const content = docMatch[1];

    // Parse name from center block
    const nameMatch = content.match(/\\textbf{([^}]+)}/);
    const name = nameMatch ? nameMatch[1] : 'Your Name';

    // Parse contact info (lines after name in center block)
    const centerMatch = content.match(/\\begin{center}([\s\S]*?)\\end{center}/);
    let contactLines: string[] = [];
    if (centerMatch) {
      const centerContent = centerMatch[1];
      const lines = centerContent.split('\\\\').slice(1).map(line => 
        line.replace(/\\vspace{[^}]+}/g, '')
            .replace(/\\textbf{([^}]+)}/g, '$1')
            .trim()
      ).filter(line => line && !line.includes('\\Large'));
      contactLines = lines;
    }

    // Parse sections
    const sections: { title: string; content: string }[] = [];
    const sectionRegex = /\\section\*{([^}]+)}([\s\S]*?)(?=\\section\*|\\end{document})/g;
    let match;
    while ((match = sectionRegex.exec(content)) !== null) {
      sections.push({
        title: match[1],
        content: match[2].trim()
      });
    }

    return { name, contactLines, sections };
  };

  const parseExperienceEntry = (content: string) => {
    const entries: any[] = [];
    const entryRegex = /\\textbf{([^}]+)}([^\\]*?)\\hfill([^\\]*?)\\\\[\s\S]*?\\textit{([^}]+)}([\s\S]*?)(?=\\textbf|$)/g;
    let match;
    
    while ((match = entryRegex.exec(content)) !== null) {
      const itemsMatch = match[5].match(/\\item\s+([^\n\\]+)/g);
      const items = itemsMatch ? itemsMatch.map(item => 
        item.replace('\\item', '').trim()
      ) : [];
      
      entries.push({
        title: match[1].trim(),
        subtitle: match[2].replace(/\s*-\s*/, '').trim(),
        location: match[3].trim(),
        date: match[4].trim(),
        items
      });
    }
    
    return entries;
  };

  const parsed = parseLatexToPreview(latexContent);

  return (
    <div className="resume-preview">
      {/* Preview Toolbar */}
      <div className="preview-toolbar">
        <div className="preview-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span>Resume Preview</span>
          <span className="preview-status">Ready</span>
        </div>

        <div className="preview-controls">
          {/* Zoom Controls */}
          <div className="zoom-controls">
            <button className="zoom-button" onClick={handleZoomOut} title="Zoom out">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span className="zoom-level" onClick={handleResetZoom} style={{ cursor: 'pointer' }}>
              {zoom}%
            </span>
            <button className="zoom-button" onClick={handleZoomIn} title="Zoom in">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="preview-content custom-scrollbar">
        <div 
          className="resume-paper"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {parsed ? (
            <div className="resume-content">
              {/* Header */}
              <div className="resume-header">
                <h1 className="resume-name">{parsed.name}</h1>
                {parsed.contactLines.map((line, i) => (
                  <p key={i} className="resume-contact">{line}</p>
                ))}
              </div>

              <hr className="resume-divider" />

              {/* Sections */}
              {parsed.sections.map((section, idx) => (
                <div key={idx} className="resume-section">
                  <h2 className="resume-section-title">{section.title}</h2>
                  
                  {section.title.toLowerCase() === 'experience' ? (
                    parseExperienceEntry(section.content).map((entry, entryIdx) => (
                      <div key={entryIdx} className="resume-entry">
                        <div className="resume-entry-header">
                          <span className="resume-entry-title">{entry.title}</span>
                          <span className="resume-entry-location">{entry.location}</span>
                        </div>
                        <div className="resume-entry-subtitle">
                          <span>{entry.subtitle}</span>
                          <span>{entry.date}</span>
                        </div>
                        {entry.items.length > 0 && (
                          <ul className="resume-list">
                            {entry.items.map((item: string, itemIdx: number) => (
                              <li key={itemIdx}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  ) : section.title.toLowerCase() === 'education' ? (
                    <div className="resume-entry">
                      <div className="resume-entry-header">
                        <span className="resume-entry-title">
                          {section.content.match(/\\textbf{([^}]+)}/)?.[1] || section.content}
                        </span>
                        <span className="resume-entry-location">
                          {section.content.match(/\\hfill\s*(.+)/)?.[1]?.replace(/\\/g, '').trim() || ''}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', lineHeight: '1.6' }}>
                      {section.content
                        .replace(/\\textbf{([^}]+)}/g, '$1')
                        .replace(/\\textit{([^}]+)}/g, '$1')
                        .replace(/\\hfill/g, '')
                        .replace(/\\\\/g, '')
                        .replace(/\\begin{itemize}|\\end{itemize}/g, '')
                        .replace(/\\item\s*/g, ', ')
                        .trim()
                        .replace(/^,\s*/, '')
                      }
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No content to preview</h3>
              <p>Start typing in the LaTeX editor to see your resume.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recompile Button */}
      <button className="recompile-button" onClick={onRecompile}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
        </svg>
        Recompile
      </button>
    </div>
  );
};
