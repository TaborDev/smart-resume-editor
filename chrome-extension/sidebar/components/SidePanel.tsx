import React, { useState, useEffect } from 'react';
import { JobInfo, JobAnalysisResponse, AISuggestion } from '@smart-resume/types';
import { JobAnalysisPanel } from './JobAnalysisPanel';
import { LaTeXEditor } from './LaTeXEditor';
import { AISuggestionsPanel } from './AISuggestionsPanel';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';

interface SidePanelState {
  jobInfo: JobInfo | null;
  jobAnalysis: JobAnalysisResponse | null;
  resumeLatex: string;
  suggestions: AISuggestion[];
  isLoading: boolean;
  error: string | null;
  darkMode: boolean;
}

export const SidePanel: React.FC = () => {
  const [state, setState] = useState<SidePanelState>({
    jobInfo: null,
    jobAnalysis: null,
    resumeLatex: '',
    suggestions: [],
    isLoading: true,
    error: null,
    darkMode: false
  });

  useEffect(() => {
    initializeSidePanel();
  }, []);

  const initializeSidePanel = async () => {
    try {
      // Get current tab info
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;

      // Load job info from storage
      const result = await chrome.storage.local.get(`job_${tab.id}`);
      const jobInfo = result[`job_${tab.id}`] as JobInfo;

      if (jobInfo) {
        setState(prev => ({ ...prev, jobInfo }));
        await analyzeJob(jobInfo);
      }

      // Load user's resume from storage
      const resumeResult = await chrome.storage.local.get('currentResume');
      if (resumeResult.currentResume) {
        setState(prev => ({ 
          ...prev, 
          resumeLatex: resumeResult.currentResume,
          isLoading: false 
        }));
      } else {
        // Load default template
        loadDefaultTemplate();
      }

      // Check dark mode preference
      const themeResult = await chrome.storage.local.get('darkMode');
      setState(prev => ({ 
        ...prev, 
        darkMode: themeResult.darkMode || false 
      }));

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to initialize',
        isLoading: false 
      }));
    }
  };

  const analyzeJob = async (jobInfo: JobInfo) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const response = await fetch('http://localhost:3001/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: jobInfo.jobDescription,
          jobTitle: jobInfo.jobTitle,
          companyName: jobInfo.companyName
        })
      });

      if (!response.ok) throw new Error('Failed to analyze job');

      const analysis: JobAnalysisResponse = await response.json();
      setState(prev => ({ ...prev, jobAnalysis: analysis }));

      // Get AI suggestions if we have a resume
      if (state.resumeLatex) {
        await getAISuggestions(jobInfo, state.resumeLatex);
      }

    } catch (error) {
      console.error('Job analysis failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to analyze job description' 
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const getAISuggestions = async (jobInfo: JobInfo, resumeLatex: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeLatex,
          jobDescription: jobInfo.jobDescription
        })
      });

      if (!response.ok) throw new Error('Failed to get suggestions');

      const result = await response.json();
      setState(prev => ({ ...prev, suggestions: result.suggestions }));

    } catch (error) {
      console.error('AI suggestions failed:', error);
    }
  };

  const loadDefaultTemplate = () => {
    const defaultLatex = `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{banking}
\\moderncvcolor{blue}
\\usepackage[utf8]{inputenc}
\\usepackage[scale=0.75]{geometry}

\\name{Your}{Name}
\\title{Job Title}
\\address{Address Line 1}{Address Line 2}{City, State ZIP}
\\phone[mobile]{+1~(555)~123~4567}
\\email{your.email@example.com}
\\homepage{linkedin.com/in/yourprofile}

\\begin{document}
\\makecvtitle

\\section{Experience}
\\cventry{2020--Present}{Software Engineer}{Company Name}{City, ST}{}{
\\begin{itemize}
\\item Developed and maintained web applications using React and Node.js
\\item Collaborated with cross-functional teams to deliver features
\\item Improved application performance by 25\\%
\\end{itemize}}

\\section{Education}
\\cventry{2016--2020}{Bachelor of Science in Computer Science}{University Name}{City, ST}{}{GPA: 3.8/4.0}

\\section{Skills}
\\cvitem{Languages}{JavaScript, TypeScript, Python, Java}
\\cvitem{Frameworks}{React, Node.js, Express, Django}
\\cvitem{Tools}{Git, Docker, AWS, Jenkins}

\\end{document}`;

    setState(prev => ({ 
      ...prev, 
      resumeLatex: defaultLatex,
      isLoading: false 
    }));
  };

  const handleResumeChange = async (newLatex: string) => {
    setState(prev => ({ ...prev, resumeLatex: newLatex }));
    
    // Save to storage
    await chrome.storage.local.set({ currentResume: newLatex });

    // Get new suggestions if job info available
    if (state.jobInfo) {
      await getAISuggestions(state.jobInfo, newLatex);
    }
  };

  const applySuggestion = async (suggestion: AISuggestion) => {
    const updatedLatex = state.resumeLatex.replace(
      suggestion.originalText,
      suggestion.suggestedText
    );
    
    await handleResumeChange(updatedLatex);
    
    // Mark suggestion as applied
    setState(prev => ({
      ...prev,
      suggestions: prev.suggestions.map(s => 
        s.id === suggestion.id ? { ...s, wasApplied: true } : s
      )
    }));
  };

  const toggleDarkMode = async () => {
    const newDarkMode = !state.darkMode;
    setState(prev => ({ ...prev, darkMode: newDarkMode }));
    await chrome.storage.local.set({ darkMode: newDarkMode });
  };

  if (state.isLoading) {
    return <LoadingSpinner />;
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️ Error</div>
          <div className="text-sm text-gray-600">{state.error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`h-full flex flex-col ${state.darkMode ? 'dark' : ''}`}>
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Smart Resume Editor
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {state.darkMode ? '☀️' : '🌙'}
              </button>
              <div className="w-3 h-3 bg-green-500 rounded-full" title="Connected" />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
          {/* Job Analysis Panel - Top Section */}
          {state.jobInfo && (
            <div className="h-1/3 border-b border-gray-200 dark:border-gray-700">
              <JobAnalysisPanel 
                jobInfo={state.jobInfo}
                analysis={state.jobAnalysis}
                resumeLatex={state.resumeLatex}
                darkMode={state.darkMode}
              />
            </div>
          )}

          {/* LaTeX Editor - Middle Section */}
          <div className={`${state.jobInfo ? 'h-1/3' : 'h-2/3'} border-b border-gray-200 dark:border-gray-700`}>
            <LaTeXEditor
              value={state.resumeLatex}
              onChange={handleResumeChange}
              darkMode={state.darkMode}
              jobKeywords={state.jobAnalysis?.keywords || []}
            />
          </div>

          {/* AI Suggestions Panel - Bottom Section */}
          <div className="h-1/3">
            <AISuggestionsPanel
              suggestions={state.suggestions}
              onApplySuggestion={applySuggestion}
              darkMode={state.darkMode}
              isLoading={state.isLoading}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};