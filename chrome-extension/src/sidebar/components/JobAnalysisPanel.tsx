import React, { useState, useEffect } from 'react';

interface JobAnalysisPanelProps {
  currentUrl: string;
  jobTabId?: number;
}

export const JobAnalysisPanel: React.FC<JobAnalysisPanelProps> = ({ currentUrl, jobTabId }) => {
  const [isJobPage, setIsJobPage] = useState(false);
  const [jobData, setJobData] = useState<{
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    skills: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if current page is a job listing
    const jobSites = ['linkedin.com/jobs', 'indeed.com', 'glassdoor.com', 'monster.com'];
    const isJob = jobSites.some(site => currentUrl.includes(site));
    setIsJobPage(isJob);
  }, [currentUrl]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      let targetTabId = jobTabId;

      if (!targetTabId) {
        // Fallback: Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        targetTabId = tab?.id;
      }
      
      if (!targetTabId) {
        throw new Error('Could not identify target tab');
      }

      // Send message to the content script to extract job data
      const response = await chrome.tabs.sendMessage(targetTabId, { 
        action: 'extractJobData' 
      });

      if (response && response.data) {
        setJobData(response.data);
      } else {
        throw new Error('No job data found on this page');
      }
    } catch (err) {
      console.error('Error analyzing job:', err);
      setError('Failed to analyze job. Make sure you are on a job posting page and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isJobPage) {
    return (
      <div className="job-analysis-panel">
        <div className="empty-state">
          <h3>No Job Posting Detected</h3>
          <p>Navigate to a job posting on LinkedIn, Indeed, Glassdoor, or Monster to analyze requirements and get resume suggestions.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-analysis-panel">
        <div className="empty-state">
          <h3>Error Analyzing Job</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-analysis-panel">
      <div className="panel-header">
        <h3>Job Analysis</h3>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !!error}
          className="btn-primary"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Job'}
        </button>
      </div>

      {jobData ? (
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
            <h4>Location</h4>
            <p>{jobData.location}</p>
          </div>
          
          <div className="job-section">
            <h4>Key Requirements</h4>
            <ul>
              {jobData.requirements && jobData.requirements.length > 0 ? (
                jobData.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))
              ) : (
                <li>No specific requirements found</li>
              )}
            </ul>
          </div>
          
          <div className="job-section">
            <h4>Skills Mentioned</h4>
            <div className="skills-tags">
              {jobData.skills && jobData.skills.length > 0 ? (
                jobData.skills.map((skill: string, index: number) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))
              ) : (
                <p>No specific skills mentioned</p>
              )}
            </div>
          </div>
          
          <div className="job-section">
            <h4>Job Description</h4>
            <div className="job-description">
              {jobData.description.length > 500 ? (
                <>
                  <div className="description-preview">
                    {jobData.description.substring(0, 500)}...
                  </div>
                  <button 
                    className="show-more-btn"
                    onClick={(e) => {
                      const preview = (e.target as HTMLElement).previousElementSibling as HTMLElement;
                      if (preview) {
                        preview.textContent = jobData.description;
                        (e.target as HTMLElement).style.display = 'none';
                      }
                    }}
                  >
                    Show more
                  </button>
                </>
              ) : (
                <p>{jobData.description}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <h3>No Job Data Found</h3>
          <p>Click the "Analyze Job" button to extract job data from this page.</p>
        </div>
      )}
    </div>
  );
};