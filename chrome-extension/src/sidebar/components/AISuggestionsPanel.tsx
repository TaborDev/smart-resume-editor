import React, { useState } from 'react';

export const AISuggestionsPanel: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSuggestions = async () => {
    if (!resumeText.trim()) return;
    
    setIsGenerating(true);
    try {
      // TODO: Integrate with AI service
      // For now, provide mock suggestions
      const mockSuggestions = [
        "Add more quantifiable achievements with specific metrics",
        "Include relevant keywords from the job description",
        "Strengthen action verbs in bullet points",
        "Add a professional summary section",
        "Include relevant certifications or training"
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-suggestions-panel">
      <div className="panel-header">
        <h3>AI Suggestions</h3>
      </div>

      <div className="resume-input">
        <label htmlFor="resume-text">Paste your resume text:</label>
        <textarea
          id="resume-text"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your current resume text here to get AI-powered suggestions..."
          rows={8}
          className="resume-textarea"
        />
        <button
          onClick={generateSuggestions}
          disabled={!resumeText.trim() || isGenerating}
          className="btn-primary"
        >
          {isGenerating ? 'Generating...' : 'Get AI Suggestions'}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions-list">
          <h4>Suggestions for Improvement:</h4>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index} className="suggestion-item">
                <span className="suggestion-text">{suggestion}</span>
                <button 
                  className="apply-btn"
                  onClick={() => {
                    // TODO: Implement suggestion application
                    console.log('Apply suggestion:', suggestion);
                  }}
                >
                  Apply
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};