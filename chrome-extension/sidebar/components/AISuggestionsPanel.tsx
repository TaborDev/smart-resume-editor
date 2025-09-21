import React, { useState } from 'react';
import { AISuggestion } from '@smart-resume/types';

interface AISuggestionsPanelProps {
  suggestions: AISuggestion[];
  onApplySuggestion: (suggestion: AISuggestion) => void;
  darkMode: boolean;
  isLoading: boolean;
}

export const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({
  suggestions,
  onApplySuggestion,
  darkMode,
  isLoading
}) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  const getSuggestionTypeIcon = (type: string) => {
    switch (type) {
      case 'keyword': return '🔑';
      case 'action_verb': return '⚡';
      case 'quantification': return '📊';
      default: return '💡';
    }
  };

  const getSuggestionTypeColor = (type: string) => {
    switch (type) {
      case 'keyword': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900';
      case 'action_verb': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900';
      case 'quantification': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Generating AI suggestions...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          AI Suggestions
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {suggestions.filter(s => !s.wasApplied).length} pending
        </div>
      </div>

      {/* Suggestions List */}
      <div className="flex-1 overflow-y-auto">
        {suggestions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-4">
            <div>
              <div className="text-4xl mb-2">🤖</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Upload a resume to get AI suggestions
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`border rounded-lg p-3 transition-all ${
                  suggestion.wasApplied 
                    ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 opacity-60' 
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-sm'
                }`}
              >
                {/* Suggestion Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getSuggestionTypeIcon(suggestion.suggestionType)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      getSuggestionTypeColor(suggestion.suggestionType)
                    }`}>
                      {suggestion.suggestionType.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-medium ${
                      getConfidenceColor(suggestion.confidence)
                    }`}>
                      {Math.round(suggestion.confidence * 100)}%
                    </span>
                  </div>
                  
                  {!suggestion.wasApplied && (
                    <button
                      onClick={() => onApplySuggestion(suggestion)}
                      className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                    >
                      Apply
                    </button>
                  )}
                  
                  {suggestion.wasApplied && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      ✓ Applied
                    </span>
                  )}
                </div>

                {/* Original Text */}
                <div className="mb-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Original:
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded border">
                    {suggestion.originalText}
                  </div>
                </div>

                {/* Suggested Text */}
                <div className="mb-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Suggested:
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900 p-2 rounded border border-blue-200 dark:border-blue-700">
                    {suggestion.suggestedText}
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <button
                    onClick={() => setExpandedSuggestion(
                      expandedSuggestion === suggestion.id ? null : suggestion.id
                    )}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {expandedSuggestion === suggestion.id ? 'Hide' : 'Show'} explanation
                  </button>
                  
                  {expandedSuggestion === suggestion.id && (
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 p-2 rounded">
                      {suggestion.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};