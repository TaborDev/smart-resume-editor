import React, { useState, useEffect } from 'react';

interface JobAnalysisPanelProps {
  currentUrl: string;
}

export const JobAnalysisPanel: React.FC<JobAnalysisPanelProps> = ({ currentUrl }) => {
  const [isJobPage, setIsJobPage] = useState(false);
  const [jobData, setJobData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Check if current page is a job listing
    const jobSites = ['linkedin.com/jobs', 'indeed.com', 'glassdoor.com', 'monster.com'];
    const isJob = jobSites.some(site => currentUrl.includes(site));
    setIsJobPage(isJob);
  }, [currentUrl]);

  const analyzeJobPosting = async () => {
    setIsAnalyzing(true);
    try {
      // Send message to content script to extract job data
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        const response = await chrome.tabs.sendMessage(tab.id, { 
          action: 'extractJobData' 
        });
        setJobData(response);
      }
    } catch (error) {
      console.error('Error analyzing job posting:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isJobPage) {
    return (
      <div className="job-analysis-panel">
        <div className="empty-state">
          <h3>No Job Posting Detected</h3>
          <p>Navigate to a job posting on LinkedIn, Indeed, or other job sites to analyze requirements and get resume suggestions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-analysis-panel">
      <div className="panel-header">
        <h3>Job Analysis</h3>
        <button
          onClick={analyzeJobPosting}
          disabled={isAnalyzing}
          className="btn-primary"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Job'}
        </button>
      </div>

      {jobData && (
        <div className="job-data">
          <div className="job-section">
            <h4>Job Title</h4>
            <p>{jobData.title}</p>
          </div>
          
          <div className="job-section">
            <h4>Company</h4>
            <p>{jobData.company}</p>
          </div>
          
          <div className="job-section">
            <h4>Key Requirements</h4>
            <ul>
              {jobData.requirements?.map((req: string, index: number) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          
          <div className="job-section">
            <h4>Skills Mentioned</h4>
            <div className="skills-tags">
              {jobData.skills?.map((skill: string, index: number) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};