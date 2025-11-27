import React, { useState } from 'react';

type Suggestion = {
  id: string;
  text: string;
  type: 'addition' | 'improvement' | 'correction';
  priority: 'high' | 'medium' | 'low';
};

export const AISuggestionsPanel: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async () => {
    if (!resumeText.trim()) {
      setError('Please enter your resume text');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('YOUR_BACKEND_API/suggestions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: resumeText })
      // });
      // const data = await response.json();
      // setSuggestions(data.suggestions);
      
      // Temporary empty state until API is implemented
      setSuggestions([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate suggestions';
      setError(errorMessage);
      console.error('Error generating suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-suggestions-panel">
      <div className="panel-header">
        <h3>AI-Powered Resume Suggestions</h3>
        <p className="text-muted">Get personalized suggestions to improve your resume for this job</p>
      </div>

      <div className="resume-input">
        <label htmlFor="resume-text" className="input-label">
          Paste your resume text:
          <span className="required-indicator">*</span>
        </label>
        <textarea
          id="resume-text"
          value={resumeText}
          onChange={(e) => {
            setResumeText(e.target.value);
            setError(null); // Clear error when user types
          }}
          placeholder="Paste your current resume text here to get AI-powered suggestions..."
          rows={8}
          className={`resume-textarea ${error ? 'error' : ''}`}
          disabled={isLoading}
        />
        {error && <div className="error-message">{error}</div>}
        <button
          onClick={generateSuggestions}
          disabled={isLoading || !resumeText.trim()}
          className="btn-primary"
        >
          {isLoading ? 'Generating...' : 'Get AI Suggestions'}
        </button>
      </div>

      {suggestions.length > 0 ? (
        <div className="suggestions-list">
          <h4>Suggestions for Improvement:</h4>
          <ul>
            {suggestions.map((suggestion) => (
              <li key={suggestion.id} className={`suggestion-item ${suggestion.priority}`}>
                <span className={`suggestion-type ${suggestion.type}`}>
                  {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}:
                </span>
                <span className="suggestion-text">{suggestion.text}</span>
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
      ) : isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing your resume...</p>
        </div>
      ) : (
        <div className="empty-state">
          <p>No suggestions yet. Click "Get AI Suggestions" to analyze your resume.</p>
        </div>
      )}
    </div>
  );
};