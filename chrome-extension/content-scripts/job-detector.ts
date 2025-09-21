import { JobSite, JobInfo, JobDetectionResult } from '@smart-resume/types';

interface JobSiteConfig {
  name: JobSite;
  selectors: {
    uploadInputs: string[];
    uploadKeywords: string[];
    jobTitle: string[];
    companyName: string[];
    jobDescription: string[];
    requirements: string[];
  };
  urlPatterns: RegExp[];
}

const JOB_SITE_CONFIGS: JobSiteConfig[] = [
  {
    name: 'linkedin',
    selectors: {
      uploadInputs: [
        'input[type="file"][accept*="pdf"]',
        'input[name*="resume"]',
        'input[name*="cv"]'
      ],
      uploadKeywords: ['Upload resume', 'Upload CV', 'Choose file', 'Attach resume'],
      jobTitle: [
        'h1[data-automation-id="jobPostingHeader"]',
        '.job-details-jobs-unified-top-card__job-title',
        '.t-24.t-bold'
      ],
      companyName: [
        '.job-details-jobs-unified-top-card__company-name',
        '.jobs-unified-top-card__company-name',
        'a[data-control-name="job_details_topcard_company_url"]'
      ],
      jobDescription: [
        '.jobs-description-content__text',
        '.jobs-box__html-content',
        '#job-details'
      ],
      requirements: [
        '.jobs-description-content__text ul',
        '.jobs-description-content__text li'
      ]
    },
    urlPatterns: [/linkedin\.com\/jobs/, /linkedin\.com.*currentJobId/]
  },
  {
    name: 'greenhouse',
    selectors: {
      uploadInputs: [
        'input[type="file"]',
        'input[name="resume"]',
        '.file-input input'
      ],
      uploadKeywords: ['Upload Resume', 'Resume/CV', 'Attach Resume'],
      jobTitle: [
        '.app-title',
        'h1.header',
        '.job-title'
      ],
      companyName: [
        '.company-name',
        '.header .company',
        'img[alt]'
      ],
      jobDescription: [
        '#job_description',
        '.job-post-content',
        '.content'
      ],
      requirements: [
        '#job_description ul',
        '.requirements ul'
      ]
    },
    urlPatterns: [/greenhouse\.io/, /\.greenhouse\.io/]
  },
  {
    name: 'lever',
    selectors: {
      uploadInputs: [
        'input[type="file"]',
        'input[accept*="pdf"]'
      ],
      uploadKeywords: ['Resume', 'CV', 'Upload'],
      jobTitle: [
        '.posting-headline h2',
        '.template-job-page h2'
      ],
      companyName: [
        '.main-header-text-logo',
        '.template-job-page .company'
      ],
      jobDescription: [
        '.posting-content .content',
        '.section-wrapper .content'
      ],
      requirements: [
        '.posting-content ul',
        '.requirements ul'
      ]
    },
    urlPatterns: [/lever\.co/, /\.lever\.co/]
  },
  {
    name: 'workday',
    selectors: {
      uploadInputs: [
        'input[type="file"]',
        'input[data-automation-id*="file"]'
      ],
      uploadKeywords: ['Resume', 'CV Upload', 'Documents'],
      jobTitle: [
        '[data-automation-id="jobPostingHeader"]',
        'h1[data-automation-id]'
      ],
      companyName: [
        '.company-logo img[alt]',
        '[data-automation-id="company"]'
      ],
      jobDescription: [
        '[data-automation-id="jobPostingDescription"]',
        '.jobPostingDescription'
      ],
      requirements: [
        '[data-automation-id="jobPostingDescription"] ul'
      ]
    },
    urlPatterns: [/myworkdayjobs\.com/, /workday\.com/]
  },
  {
    name: 'indeed',
    selectors: {
      uploadInputs: [
        'input[type="file"]',
        'input[accept*="pdf"]'
      ],
      uploadKeywords: ['Upload resume', 'Resume', 'CV'],
      jobTitle: [
        '[data-jk] h1',
        '.jobsearch-JobInfoHeader-title'
      ],
      companyName: [
        '[data-testid="inlineHeader-companyName"]',
        '.jobsearch-InlineCompanyRating'
      ],
      jobDescription: [
        '#jobDescriptionText',
        '.jobsearch-jobDescriptionText'
      ],
      requirements: [
        '#jobDescriptionText ul'
      ]
    },
    urlPatterns: [/indeed\.com\/viewjob/]
  },
  {
    name: 'glassdoor',
    selectors: {
      uploadInputs: [
        'input[type="file"]'
      ],
      uploadKeywords: ['Upload Resume', 'Resume'],
      jobTitle: [
        '[data-test="job-title"]',
        '.css-17x2pwl'
      ],
      companyName: [
        '[data-test="employer-name"]',
        '.css-l2wjgv'
      ],
      jobDescription: [
        '[data-test="job-description"]',
        '.desc'
      ],
      requirements: [
        '[data-test="job-description"] ul'
      ]
    },
    urlPatterns: [/glassdoor\.com\/job-listing/]
  }
];

class JobDetector {
  private currentSite: JobSiteConfig | null = null;
  private isDetected: boolean = false;
  private floatingButton: HTMLElement | null = null;
  private lastUrl: string = '';
  private detectThrottle: number = 0;

  constructor() {
    console.log('JobDetector constructor called');
    this.lastUrl = window.location.href;
    this.detectJobSite();
    this.observePageChanges();
  }

  private detectJobSite(): void {
    // Throttle detection to prevent excessive calls
    const now = Date.now();
    if (now - this.detectThrottle < 1000) {
      return;
    }
    this.detectThrottle = now;

    const currentUrl = window.location.href;
    console.log('Detecting job site for URL:', currentUrl);
    
    this.currentSite = JOB_SITE_CONFIGS.find(config =>
      config.urlPatterns.some(pattern => pattern.test(currentUrl))
    ) || null;

    console.log('Detected site:', this.currentSite?.name || 'none');
    
    if (this.currentSite) {
      console.log('Job site detected:', this.currentSite.name);
      this.checkForJobApplication();
    } else {
      console.log('No matching job site found for URL:', currentUrl);
    }
  }

  private checkForJobApplication(): void {
    if (!this.currentSite) return;
    
    console.log('Checking for job application elements...');
    const hasUploadInput = this.hasUploadInput();
    const hasUploadKeywords = this.hasUploadKeywords();
    
    console.log('Has upload input:', hasUploadInput);
    console.log('Has upload keywords:', hasUploadKeywords);
    console.log('Already detected:', this.isDetected);

    if ((hasUploadInput || hasUploadKeywords) && !this.isDetected) {
      console.log('Job application detected! Extracting job info...');
      this.isDetected = true;
      this.extractJobInfo();
      // TEMPORARILY DISABLE floating button to test
      // this.injectFloatingButton();
      console.log('Skipping floating button injection for debugging');
    }
  }

  private hasUploadInput(): boolean {
    if (!this.currentSite) return false;

    return this.currentSite.selectors.uploadInputs.some(selector => {
      const elements = document.querySelectorAll(selector);
      return elements.length > 0;
    });
  }

  private hasUploadKeywords(): boolean {
    if (!this.currentSite) return false;

    const bodyText = document.body.innerText.toLowerCase();
    
    return this.currentSite.selectors.uploadKeywords.some(keyword =>
      bodyText.includes(keyword.toLowerCase())
    );
  }

  private extractJobInfo(): JobInfo | null {
    if (!this.currentSite) return null;

    const jobInfo: JobInfo = {
      url: window.location.href,
      siteName: this.currentSite.name,
      jobTitle: this.extractText(this.currentSite.selectors.jobTitle),
      companyName: this.extractText(this.currentSite.selectors.companyName),
      jobDescription: this.extractJobDescription(),
      requirements: this.extractRequirements(),
      extractedAt: new Date().toISOString()
    };

    // Send job info to service worker
    chrome.runtime.sendMessage({
      type: 'JOB_DETECTED',
      data: jobInfo
    });

    return jobInfo;
  }

  private extractText(selectors: string[]): string {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.textContent?.trim() || '';
      }
    }
    return '';
  }

  private extractJobDescription(): string {
    if (!this.currentSite) return '';

    for (const selector of this.currentSite.selectors.jobDescription) {
      const element = document.querySelector(selector);
      if (element) {
        return this.cleanText(element.textContent || '');
      }
    }
    return '';
  }

  private extractRequirements(): string[] {
    if (!this.currentSite) return [];

    const requirements: string[] = [];
    
    for (const selector of this.currentSite.selectors.requirements) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const text = element.textContent?.trim();
        if (text && text.length > 10) {
          requirements.push(this.cleanText(text));
        }
      });
    }

    return requirements;
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[\r\n]+/g, '\n')
      .trim();
  }

  private extractSkills(text: string): string[] {
    const skillPatterns = [
      /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|PHP|Ruby|Go|Rust|Swift|Kotlin|Scala)\b/gi,
      /\b(React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Laravel|Rails)\b/gi,
      /\b(Docker|Kubernetes|AWS|Azure|GCP|Jenkins|Git|GitHub|GitLab|Jira|Confluence)\b/gi,
      /\b(PostgreSQL|MySQL|MongoDB|Redis|DynamoDB|Elasticsearch)\b/gi
    ];

    const skills = new Set<string>();
    
    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => skills.add(match));
      }
    });

    return Array.from(skills);
  }

  private injectFloatingButton(): void {
    if (this.floatingButton) return;

    console.log('Injecting floating button...');
    this.floatingButton = document.createElement('div');
    this.floatingButton.id = 'smart-resume-floating-button';
    this.floatingButton.innerHTML = `
      <div class="smart-resume-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
        <span>Edit Resume with AI</span>
      </div>
    `;

    document.body.appendChild(this.floatingButton);
    console.log('Floating button injected successfully');

    this.floatingButton.addEventListener('click', () => {
      console.log('Floating button clicked, opening side panel...');
      this.openSidePanel();
    });
  }

  private openSidePanel(): void {
    console.log('Attempting to open side panel...');
    chrome.runtime.sendMessage({
      type: 'OPEN_SIDE_PANEL',
      data: {
        jobInfo: this.extractJobInfo()
      }
    }).then(() => {
      console.log('Side panel message sent successfully');
    }).catch((error) => {
      console.error('Error sending side panel message:', error);
    });
  }

  private observePageChanges(): void {
    // Only watch for URL changes, not all DOM mutations
    const checkUrlChange = () => {
      const currentUrl = location.href;
      if (currentUrl !== this.lastUrl) {
        console.log('URL changed from', this.lastUrl, 'to', currentUrl);
        this.lastUrl = currentUrl;
        this.isDetected = false;
        if (this.floatingButton) {
          this.floatingButton.remove();
          this.floatingButton = null;
        }
        // Wait for page to settle before detecting
        setTimeout(() => {
          this.detectJobSite();
        }, 1500);
      }
    };

    // Check for URL changes periodically (for SPAs like LinkedIn)
    setInterval(checkUrlChange, 2000);

    // Also listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', () => {
      setTimeout(checkUrlChange, 500);
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new JobDetector();
  });
} else {
  new JobDetector();
}