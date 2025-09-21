export interface User {
  id: string;
  email: string;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  latexSource: string;
  compiledPdfUrl?: string;
  templateType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  userId: string;
  resumeId: string;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  jobDescription: string;
  keywordsExtracted: string[];
  matchScore: number;
  status: 'draft' | 'applied' | 'interview' | 'rejected' | 'accepted';
  appliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AISuggestion {
  id: string;
  applicationId: string;
  originalText: string;
  suggestedText: string;
  suggestionType: 'keyword' | 'action_verb' | 'quantification';
  wasApplied: boolean;
  effectivenessScore?: number;
  explanation: string;
  confidence: number;
}

export interface CompileRequest {
  latexSource: string;
  templateType?: string;
}

export interface CompileResponse {
  success: boolean;
  pdfUrl?: string;
  errors?: string[];
  warnings?: string[];
}

export interface JobAnalysisRequest {
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
}

export interface JobAnalysisResponse {
  keywords: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  categories: {
    technical: string[];
    soft: string[];
    tools: string[];
    certifications: string[];
  };
}

export interface OptimizationRequest {
  resumeLatex: string;
  jobDescription: string;
  targetSections?: string[];
}

export interface OptimizationResponse {
  suggestions: AISuggestion[];
  overallScore: number;
  scoreBreakdown: {
    keywordMatch: number;
    atsCompliance: number;
    readability: number;
    impact: number;
  };
}

// Job Detection Types
export type JobSite = 
  | 'linkedin' 
  | 'greenhouse' 
  | 'lever' 
  | 'workday' 
  | 'indeed' 
  | 'glassdoor' 
  | 'monster' 
  | 'ziprecruiter' 
  | 'simplyhired' 
  | 'careerbuilder'
  | 'unknown';

export interface JobInfo {
  url: string;
  siteName: JobSite;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  requirements: string[];
  extractedAt: string;
  skills?: string[];
  salaryRange?: string;
  location?: string;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'internship';
}

export interface JobDetectionResult {
  detected: boolean;
  jobInfo?: JobInfo;
  confidence: number;
  errors?: string[];
}

export interface ContentScriptMessage {
  type: 'JOB_DETECTED' | 'OPEN_SIDE_PANEL' | 'ERROR';
  data?: any;
  error?: string;
}