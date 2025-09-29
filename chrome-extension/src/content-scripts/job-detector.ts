interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  salary?: string;
  jobType?: string;
}

export class JobDetector {
  private jobSiteSelectors = {
    linkedin: {
      title: '.job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title',
      company: '.job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name',
      location: '.job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__bullet',
      description: '.jobs-description__content, .jobs-box__html-content',
      container: '.job-details, .jobs-unified-top-card'
    },
    indeed: {
      title: '[data-testid="jobTitle"], .jobTitle',
      company: '[data-testid="companyName"], .companyName',
      location: '[data-testid="jobLocation"], .locationsContainer',
      description: '#jobDescriptionText, .jobDescription',
      container: '.jobsearch-JobComponent, .job_seen_beacon'
    },
    glassdoor: {
      title: '.css-17x2pwl, .jobTitle',
      company: '.css-l2wjgv, .employerName',
      location: '.css-1buaf54, .location',
      description: '.jobDescriptionContent, .desc',
      container: '.jobDetails, .jobContainer'
    },
    monster: {
      title: '.jobTitle, h1[data-testid="svx-jobTitle"]',
      company: '.company, [data-testid="svx-companyName"]',
      location: '.location, [data-testid="svx-jobLocation"]',
      description: '.jobDescription, [data-testid="svx-jobDescription"]',
      container: '.jobview, .job-description'
    }
  };

  detectJobPosting(): boolean {
    const url = window.location.href.toLowerCase();
    
    // Check if we're on a known job site
    const jobSites = [
      'linkedin.com/jobs',
      'indeed.com',
      'glassdoor.com',
      'monster.com'
    ];

    return jobSites.some(site => url.includes(site));
  }

  getCurrentJobSite(): string | null {
    const url = window.location.href.toLowerCase();
    
    if (url.includes('linkedin.com/jobs')) return 'linkedin';
    if (url.includes('indeed.com')) return 'indeed';
    if (url.includes('glassdoor.com')) return 'glassdoor';
    if (url.includes('monster.com')) return 'monster';
    
    return null;
  }

  extractJobData(): JobData | null {
    const jobSite = this.getCurrentJobSite();
    if (!jobSite || !this.jobSiteSelectors[jobSite as keyof typeof this.jobSiteSelectors]) {
      return null;
    }

    const selectors = this.jobSiteSelectors[jobSite as keyof typeof this.jobSiteSelectors];
    
    try {
      const title = this.getTextContent(selectors.title) || 'Job Title Not Found';
      const company = this.getTextContent(selectors.company) || 'Company Not Found';
      const location = this.getTextContent(selectors.location) || 'Location Not Found';
      const description = this.getTextContent(selectors.description) || 'Description Not Found';
      
      const requirements = this.extractRequirements(description);
      const skills = this.extractSkills(description);
      
      return {
        title,
        company,
        location,
        description,
        requirements,
        skills
      };
    } catch (error) {
      console.error('Error extracting job data:', error);
      return null;
    }
  }

  private getTextContent(selector: string): string {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      if (element.textContent?.trim()) {
        return element.textContent.trim();
      }
    }
    return '';
  }

  private extractRequirements(description: string): string[] {
    const requirements: string[] = [];
    const text = description.toLowerCase();
    
    // Common requirement patterns
    const patterns = [
      /(?:required|must have|needed|essential)[\s\S]*?(?=\n|$)/gi,
      /(?:experience with|proficient in|knowledge of)[\s\S]*?(?=\n|$)/gi,
      /(?:\d+\+?\s*years?)[\s\S]*?(?=\n|$)/gi
    ];

    patterns.forEach(pattern => {
      const matches = description.match(pattern);
      if (matches) {
        requirements.push(...matches.map(match => match.trim()));
      }
    });

    return requirements.slice(0, 10); // Limit to 10 requirements
  }

  private extractSkills(description: string): string[] {
    const commonSkills = [
      // Programming Languages
      'javascript', 'python', 'java', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
      'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql',
      
      // Web Technologies
      'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
      'jquery', 'bootstrap', 'sass', 'less', 'webpack', 'babel',
      
      // Databases
      'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sqlite',
      
      // Cloud & DevOps
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible',
      'github actions', 'gitlab ci', 'circleci',
      
      // Tools & Frameworks
      'git', 'jira', 'confluence', 'slack', 'figma', 'sketch', 'photoshop', 'illustrator',
      
      // Methodologies
      'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'tdd', 'microservices',
      
      // Data & Analytics
      'machine learning', 'artificial intelligence', 'data science', 'big data', 'analytics',
      'tableau', 'power bi', 'excel'
    ];

    const foundSkills: string[] = [];
    const text = description.toLowerCase();

    commonSkills.forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(text)) {
        foundSkills.push(skill);
      }
    });

    return foundSkills;
  }

  highlightSkills(skills: string[]): void {
    if (!skills || skills.length === 0) return;

    const jobSite = this.getCurrentJobSite();
    if (!jobSite) return;

    const selectors = this.jobSiteSelectors[jobSite as keyof typeof this.jobSiteSelectors];
    const descriptionElement = document.querySelector(selectors.description);

    if (!descriptionElement) return;

    let html = descriptionElement.innerHTML;

    skills.forEach(skill => {
      const regex = new RegExp(`\\b(${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
      html = html.replace(regex, '<mark style="background-color: #fbbf24; padding: 2px 4px; border-radius: 3px;">$1</mark>');
    });

    descriptionElement.innerHTML = html;
  }
}