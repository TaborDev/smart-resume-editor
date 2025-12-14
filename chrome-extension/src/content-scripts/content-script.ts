// Content script for detecting and interacting with job postings
import { JobDetector } from './job-detector';

// Initialize job detection
const jobDetector = new JobDetector();

// Create and manage the full-screen overlay
function createOverlay(): HTMLElement {
  // Check if overlay already exists
  let overlay = document.getElementById('smart-resume-overlay');
  if (overlay) {
    return overlay;
  }

  overlay = document.createElement('div');
  overlay.id = 'smart-resume-overlay';
  overlay.className = 'smart-resume-fullscreen-overlay';
  
  overlay.innerHTML = `
    <div class="smart-resume-left-panel">
      <div class="smart-resume-overlay-header">
        <h1 class="smart-resume-overlay-title">Smart Resume Editor</h1>
        <button class="smart-resume-close-overlay" id="smart-resume-close">Close Editor</button>
      </div>
      <div class="smart-resume-tabs">
        <button class="smart-resume-tab active" data-tab="analysis">Job Analysis</button>
        <button class="smart-resume-tab" data-tab="suggestions">AI Suggestions</button>
        <button class="smart-resume-tab" data-tab="editor">LaTeX Editor</button>
      </div>
      <div class="smart-resume-tab-content" id="smart-resume-tab-content">
        <div id="tab-analysis" class="tab-panel active">
          <h3>Job Analysis</h3>
          <button id="analyze-job-btn" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">Analyze Job</button>
          <div id="job-analysis-result" style="margin-top: 20px;"></div>
        </div>
        <div id="tab-suggestions" class="tab-panel" style="display: none;">
          <h3>AI Suggestions</h3>
          <p style="color: #6b7280;">Paste your resume to get AI-powered suggestions.</p>
          <textarea id="resume-input" placeholder="Paste your resume here..." style="width: 100%; min-height: 150px; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; margin-top: 12px; font-family: inherit;"></textarea>
          <button id="get-suggestions-btn" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-top: 12px;">Get Suggestions</button>
          <div id="suggestions-result" style="margin-top: 20px;"></div>
        </div>
        <div id="tab-editor" class="tab-panel" style="display: none;">
          <h3>LaTeX Editor</h3>
          <textarea id="latex-editor" style="width: 100%; min-height: 400px; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-family: 'Monaco', 'Menlo', monospace; font-size: 13px; background: #fafafa;">\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}

\\begin{document}

\\begin{center}
{\\Large \\textbf{Your Name}} \\\\
\\vspace{2mm}
Your Email | Your Phone | Your Location
\\end{center}

\\section*{Professional Summary}
Write a compelling professional summary here...

\\section*{Experience}
\\textbf{Job Title} - Company Name \\hfill Date Range \\\\
\\begin{itemize}
    \\item Achievement or responsibility
\\end{itemize}

\\section*{Education}
\\textbf{Degree} - University Name \\hfill Graduation Date

\\section*{Skills}
Technical Skills, Programming Languages, Tools

\\end{document}</textarea>
        </div>
      </div>
    </div>
    <div class="smart-resume-right-panel">
      <div class="smart-resume-overlay-header">
        <h2 class="smart-resume-overlay-title">Resume Preview</h2>
      </div>
      <div class="smart-resume-preview-content">
        <div class="smart-resume-preview-container">
          <div id="latex-preview" style="padding: 40px; font-family: 'Times New Roman', serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="font-size: 24px; margin: 0;">Your Name</h1>
              <p style="color: #666; margin: 8px 0;">Your Email | Your Phone | Your Location</p>
            </div>
            <h2 style="font-size: 16px; border-bottom: 1px solid #000; padding-bottom: 4px;">Professional Summary</h2>
            <p>Write a compelling professional summary here...</p>
            <h2 style="font-size: 16px; border-bottom: 1px solid #000; padding-bottom: 4px; margin-top: 20px;">Experience</h2>
            <p><strong>Job Title</strong> - Company Name</p>
            <ul><li>Achievement or responsibility</li></ul>
            <h2 style="font-size: 16px; border-bottom: 1px solid #000; padding-bottom: 4px; margin-top: 20px;">Education</h2>
            <p><strong>Degree</strong> - University Name</p>
            <h2 style="font-size: 16px; border-bottom: 1px solid #000; padding-bottom: 4px; margin-top: 20px;">Skills</h2>
            <p>Technical Skills, Programming Languages, Tools</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  
  // Add event listeners
  setupOverlayEventListeners(overlay);
  
  return overlay;
}

function setupOverlayEventListeners(overlay: HTMLElement): void {
  // Close button
  const closeBtn = overlay.querySelector('#smart-resume-close');
  closeBtn?.addEventListener('click', () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Tab switching
  const tabs = overlay.querySelectorAll('.smart-resume-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const tabName = target.dataset.tab;
      
      // Update active tab button
      tabs.forEach(t => t.classList.remove('active'));
      target.classList.add('active');
      
      // Show corresponding panel
      const panels = overlay.querySelectorAll('.tab-panel');
      panels.forEach(panel => {
        (panel as HTMLElement).style.display = 'none';
      });
      const activePanel = overlay.querySelector(`#tab-${tabName}`);
      if (activePanel) {
        (activePanel as HTMLElement).style.display = 'block';
      }
    });
  });

  // Analyze job button
  const analyzeBtn = overlay.querySelector('#analyze-job-btn');
  analyzeBtn?.addEventListener('click', () => {
    const jobData = jobDetector.extractJobData();
    const resultDiv = overlay.querySelector('#job-analysis-result');
    if (resultDiv && jobData) {
      resultDiv.innerHTML = `
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-top: 16px;">
          <h4 style="margin: 0 0 12px 0; color: #111827;">${jobData.title || 'Job Title'}</h4>
          <p style="color: #6b7280; margin: 0 0 8px 0;"><strong>Company:</strong> ${jobData.company || 'N/A'}</p>
          <p style="color: #6b7280; margin: 0 0 8px 0;"><strong>Location:</strong> ${jobData.location || 'N/A'}</p>
          ${jobData.skills && jobData.skills.length > 0 ? `
            <div style="margin-top: 12px;">
              <strong style="color: #374151;">Skills:</strong>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
                ${jobData.skills.map((skill: string) => `<span style="background: #eff6ff; color: #1d4ed8; padding: 4px 8px; border-radius: 12px; font-size: 12px;">${skill}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } else {
      resultDiv!.innerHTML = '<p style="color: #ef4444;">Could not extract job data from this page.</p>';
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

function showOverlay(): void {
  const overlay = createOverlay();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideOverlay(): void {
  const overlay = document.getElementById('smart-resume-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Listen for messages from popup/sidebar
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'extractJobData') {
    const jobData = jobDetector.extractJobData();
    sendResponse(jobData);
    return true;
  }

  if (message.action === 'detectJobPosting') {
    const isJobPage = jobDetector.detectJobPosting();
    sendResponse({ isJobPage });
    return true;
  }

  if (message.action === 'highlightSkills') {
    jobDetector.highlightSkills(message.skills);
    sendResponse({ success: true });
    return true;
  }

  if (message.action === 'openOverlay') {
    showOverlay();
    sendResponse({ success: true });
    return true;
  }

  if (message.action === 'closeOverlay') {
    hideOverlay();
    sendResponse({ success: true });
    return true;
  }
});

// Auto-detect job posting when page loads
document.addEventListener('DOMContentLoaded', () => {
  const isJobPage = jobDetector.detectJobPosting();
  
  if (isJobPage) {
    // Notify background script that we're on a job page
    chrome.runtime.sendMessage({
      action: 'jobPageDetected',
      url: window.location.href
    });
  }
});

// Monitor for dynamic content changes (SPA navigation)
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    
    // Re-check if this is a job page after navigation
    setTimeout(() => {
      const isJobPage = jobDetector.detectJobPosting();
      if (isJobPage) {
        chrome.runtime.sendMessage({
          action: 'jobPageDetected',
          url: window.location.href
        });
      }
    }, 1000); // Wait for content to load
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('Smart Resume Editor content script loaded');