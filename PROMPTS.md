# Resume Editor Chrome Extension - Prompt Engineering Guide

## Project Overview
Build a Chrome extension that allows real-time resume editing during job applications, with LaTeX-based formatting, AI-powered keyword optimization, and automatic version control.

## How to Use This Prompt Document with GitHub Copilot

### Setup Instructions:
1. **Create Project Structure First**:
   ```bash
   mkdir smart-resume-editor
   cd smart-resume-editor
   mkdir -p chrome-extension backend webapp docs
   ```

2. **Place this file as `PROMPTS.md` in your project root**

3. **Open in VSCode with Copilot**:
   - Open the file in split view
   - Reference sections using `@workspace` or `#file:PROMPTS.md`
   - Use inline comments like `// See PROMPTS.md section 3.1`

4. **Copilot Commands to Use**:
   - `/explain` - Understand complex sections
   - `/fix` - Debug implementation issues
   - `/tests` - Generate test cases
   - `@workspace` - Reference this document context

---

## 1. Core Architecture Prompts

### 1.1 Chrome Extension Manifest
```prompt
Create a Chrome extension manifest.json (V3) with:
- Permissions for activeTab, storage, clipboardWrite, and contextMenus
- Content scripts that detect job application pages on LinkedIn, Greenhouse, Lever, Workday
- Service worker for background processing
- Side panel capability for split-screen editing
- Host permissions for all job sites
- Web accessible resources for LaTeX editor iframe
Include comments explaining each permission's purpose
```

### 1.2 Project Structure
```prompt
Generate the complete project structure for a monorepo containing:
- Chrome extension with TypeScript and React
- Node.js backend with Express/Fastify for API
- Next.js webapp for dashboard
- Shared types package
- Docker compose for local development
- GitHub Actions CI/CD pipelines
Use pnpm workspaces for dependency management
Include all necessary config files (tsconfig, eslint, prettier)
```

---

## 2. Chrome Extension Implementation

### 2.1 Content Script - Job Detection
```prompt
Create a TypeScript content script that:
1. Detects job application pages by looking for:
   - File upload inputs with accept="application/pdf"
   - Keywords like "Upload Resume", "CV", "Choose File"
   - Job description sections with class/id containing "description", "requirements"
2. Extracts job information:
   - Company name from page title, URL, or DOM elements
   - Job title from headings or meta tags
   - Full job description text
   - Required skills using NLP patterns
3. Injects a floating button "Edit Resume with AI"
4. Communicates with service worker using Chrome messaging
Handle all major job platforms with specific selectors for each
```

### 2.2 Side Panel UI
```prompt
Build a React component for Chrome extension side panel that:
1. Splits the screen 50/50 with the job application
2. Shows job description analysis on top:
   - Extracted keywords highlighted
   - Required skills vs your skills matrix
   - Match percentage score
3. Embeds LaTeX editor in middle section using:
   - CodeMirror with LaTeX syntax highlighting
   - Real-time compilation preview
   - Smart field detection (name, email, skills)
4. AI suggestions panel at bottom:
   - Shows rewrite suggestions for bullet points
   - One-click application of suggestions
   - Explanation of why each change improves match
Use Tailwind CSS for styling with dark mode support
Include loading states and error boundaries
```

### 2.3 LaTeX Editor Integration
```prompt
Integrate Overleaf's open-source editor:
1. Set up a sandboxed iframe with the editor
2. Implement two-way communication using postMessage:
   - Send: LaTeX content, compile triggers, theme settings
   - Receive: Compiled PDF, compile errors, cursor position
3. Create custom toolbar with:
   - Quick insert buttons for common resume sections
   - Template switcher (ATS-friendly, Academic, Creative)
   - Font and margin adjusters
4. Implement smart detection of resume fields:
   - Parse LaTeX for \name{}, \email{}, \section{} commands
   - Create editable form fields for quick updates
   - Sync changes back to LaTeX source
Handle LaTeX compilation using either:
- Client-side: TeXLive.js WebAssembly
- Server-side: Node.js with texlive Docker container
```

---

## 3. Backend API Implementation

### 3.1 Core API Endpoints
```prompt
Create a REST API with the following endpoints:

POST /api/compile
- Accept LaTeX source code
- Compile using Docker texlive container
- Return PDF as base64 or URL
- Cache compiled results with hash of source
- Include error handling for LaTeX errors

POST /api/analyze-job
- Accept job description text
- Extract keywords using NLP (spaCy or compromise.js)
- Categorize skills (technical, soft, tools, certifications)
- Return structured data with importance scores

POST /api/optimize-resume
- Accept current resume LaTeX and job description
- Use OpenAI GPT-4 to suggest rewrites
- Maintain context about user's actual experience
- Return line-by-line suggestions with explanations
- Include confidence scores for each suggestion

POST /api/versions
- Save resume version with metadata
- Link to job application URL and company
- Store diff from previous version
- Enable rollback to any version

Implement rate limiting, authentication with JWT, and request validation
Use Redis for caching and session management
```

### 3.2 Database Schema
```prompt
Design PostgreSQL database schema with Prisma ORM:

User table:
- id, email, password_hash
- subscription_tier (free, pro, enterprise)
- created_at, updated_at

Resume table:
- id, user_id, title
- latex_source (text)
- compiled_pdf_url
- template_type
- created_at, updated_at

Application table:
- id, user_id, resume_id
- company_name, job_title
- job_url, job_description
- keywords_extracted (jsonb)
- match_score
- status (draft, applied, interview, rejected, accepted)
- applied_at

ResumeVersion table:
- id, application_id, resume_id
- latex_diff (text)
- changes_summary (jsonb)
- version_number
- created_at

Suggestion table:
- id, application_id
- original_text, suggested_text
- suggestion_type (keyword, action_verb, quantification)
- was_applied (boolean)
- effectiveness_score

Include indexes for performance and migrations setup
```

### 3.3 AI Integration Service
```prompt
Create an AI service class that:

1. Keyword Extraction:
   - Use TF-IDF to find important terms
   - Cross-reference with skill databases (LinkedIn Skills)
   - Weight technical skills higher than soft skills

2. Bullet Point Optimization:
   const prompt = `
   Resume bullet: "${original}"
   Job requires: ${keywords.join(', ')}
   
   Rewrite this bullet to:
   - Keep the same achievement/impact
   - Naturally incorporate relevant keywords
   - Use stronger action verbs
   - Maintain truthfulness
   - Add quantification if possible
   
   Return JSON:
   {
     "rewritten": "new text",
     "keywords_added": ["kw1", "kw2"],
     "confidence": 0.95,
     "explanation": "why this is better"
   }`

3. ATS Score Calculation:
   - Keyword density analysis
   - Format compliance checking
   - Section detection accuracy
   - Return score 0-100 with breakdown

4. Implement fallbacks:
   - Primary: OpenAI GPT-4
   - Fallback: Anthropic Claude
   - Local: Basic keyword replacement

Include retry logic, error handling, and response caching
```

---

## 4. Web Application Dashboard

### 4.1 Next.js Dashboard Pages
```prompt
Create Next.js 14 app with app router:

/dashboard - Main view showing:
- Resume library with thumbnails
- Recent applications with status
- Analytics (response rate, keywords that work)
- Quick actions (new resume, clone template)

/editor - Full-screen editor with:
- Monaco editor for LaTeX
- Live PDF preview
- Version history sidebar
- Collaborative editing support

/applications - Application tracker:
- Kanban board view (Applied, Interview, Offer, Rejected)
- Timeline view with all interactions
- Company research notes
- Interview preparation links

/analytics - Insights dashboard:
- Most successful keywords
- Response rate by resume version
- Time to response analytics
- Industry trends from all users (anonymized)

/settings - User preferences:
- Default templates
- AI customization preferences
- Integration settings (Google Drive, Dropbox)
- Billing and subscription

Use shadcn/ui components, implement RSC where possible
Add proper loading.tsx and error.tsx boundaries
```

### 4.2 Real-time Collaboration
```prompt
Implement real-time features using Socket.io:

1. Live cursor positions in shared editing
2. Commenting system on resume sections
3. Real-time compilation status
4. Notification system for:
   - Application status updates
   - AI suggestion availability
   - Collaboration requests

WebSocket events to implement:
- resume:compile:start
- resume:compile:complete
- resume:compile:error
- suggestion:new
- version:saved
- collaborator:joined
- cursor:moved
- comment:added

Include presence indicators and conflict resolution
```

---

## 5. AI/LLM Features Implementation

### 5.1 Intelligent Rewriting System
```prompt
Build a context-aware rewriting system:

1. Context Preservation:
   - Extract the core achievement from original text
   - Identify quantifiable metrics to preserve
   - Maintain technical accuracy

2. Keyword Integration:
   - Map job keywords to resume sections
   - Find semantically similar terms already in resume
   - Replace strategically without keyword stuffing

3. Style Adaptation:
   - Detect job posting tone (formal, casual, technical)
   - Match action verbs to seniority level
   - Adjust technical depth based on role

4. Scoring Algorithm:
   - Keyword match: 40%
   - Semantic similarity: 30%
   - ATS compliance: 20%
   - Readability: 10%

Example transformation:
Input: "Built a web application using React"
Job Keywords: ["Angular", "TypeScript", "large-scale", "performance"]
Output: "Architected a large-scale web application using TypeScript and modern frameworks, optimizing performance for 10K+ concurrent users"

Include explanations for each change
```

### 5.2 Smart Templates
```prompt
Create an intelligent template system:

1. Template Selection:
   - Analyze job description to recommend template
   - Tech roles: Clean, minimal, GitHub-style
   - Creative roles: Modern, visual elements
   - Executive: Professional, achievement-focused

2. Dynamic Sections:
   - Auto-reorder sections based on job requirements
   - Hide/show sections based on relevance
   - Adjust space allocation per section

3. Content Generation:
   - Generate summary statement from experience
   - Create skill categories from job description
   - Suggest missing sections

4. Format Optimization:
   - Adjust margins for content fit
   - Smart line breaking to avoid orphans
   - Font size optimization for readability

Include A/B testing capability for templates
```

---

## 6. Monetization Implementation

### 6.1 Subscription Tiers
```prompt
Implement Stripe subscription system:

Free Tier:
- 5 resume edits per month
- Basic keyword extraction
- 1 template
- Local storage only

Pro Tier ($9.99/month):
- Unlimited edits
- AI rewrites (100/month)
- All templates
- Cloud storage
- Version history
- ATS score

Enterprise ($29.99/month):
- Everything in Pro
- Unlimited AI rewrites
- API access
- Team collaboration
- Custom templates
- Priority compilation
- Advanced analytics

Implementation:
- Stripe checkout integration
- Usage tracking with Redis
- Graceful degradation when limits hit
- Upgrade prompts at strategic points
- Free trial with credit card
```

### 6.2 Usage Tracking
```prompt
Create a comprehensive usage tracking system:

1. Track user actions:
   - Resume edits per session
   - AI suggestions used/ignored
   - Compilation frequency
   - Feature utilization

2. Performance metrics:
   - Compilation time
   - AI response time
   - Error rates
   - User session duration

3. Business metrics:
   - Conversion funnel
   - Feature adoption rates
   - Churn prediction signals
   - Revenue per user

4. Implementation:
   - Use Mixpanel or Amplitude
   - Custom analytics dashboard
   - Weekly email reports
   - Alerts for anomalies

Include GDPR compliance and data anonymization
```

---

## 7. Development Workflow Prompts

### 7.1 Testing Strategy
```prompt
Create comprehensive test suites:

Unit Tests (Jest):
- LaTeX parser functions
- Keyword extraction algorithms
- PDF generation service
- API endpoint handlers

Integration Tests (Playwright):
- Chrome extension installation
- Job site detection on real sites
- End-to-end resume editing flow
- Payment flow testing

E2E Tests:
- Full user journey from install to job application
- Multi-user collaboration scenarios
- Subscription upgrade/downgrade
- Data export/import

Performance Tests (K6):
- LaTeX compilation under load
- Concurrent user editing
- AI service response times
- Database query optimization

Include CI/CD pipeline configuration for automated testing
```

### 7.2 Deployment Configuration
```prompt
Create production deployment configuration:

1. Docker Compose for local development:
   - Next.js webapp
   - Node.js API
   - PostgreSQL database
   - Redis cache
   - TeXLive compilation service

2. Kubernetes manifests for production:
   - Deployments with HPA
   - Services and Ingress
   - ConfigMaps and Secrets
   - Persistent volumes for LaTeX cache

3. GitHub Actions workflows:
   - Test on PR
   - Build and push Docker images
   - Deploy to staging on merge to main
   - Production deployment with approval

4. Monitoring setup:
   - Prometheus metrics
   - Grafana dashboards
   - Error tracking with Sentry
   - Log aggregation with ELK stack

Include rollback procedures and health checks
```

---

## 8. Security Implementation

### 8.1 Security Measures
```prompt
Implement comprehensive security:

1. Authentication:
   - JWT with refresh tokens
   - OAuth2 (Google, GitHub, LinkedIn)
   - 2FA with TOTP
   - Session management

2. Data Protection:
   - Encrypt resume content at rest
   - TLS for all communications
   - Sanitize LaTeX input to prevent injection
   - Rate limiting per endpoint

3. Chrome Extension Security:
   - Content Security Policy
   - Isolated worlds for content scripts
   - Secure message passing
   - Permission minimization

4. API Security:
   - Input validation with Joi/Zod
   - SQL injection prevention
   - XSS protection
   - CORS configuration

Include security headers and regular dependency updates
```

---

## 9. Performance Optimization

### 9.1 Optimization Strategies
```prompt
Implement performance optimizations:

1. LaTeX Compilation:
   - Cache compiled PDFs with hash keys
   - Incremental compilation for small changes
   - Parallel compilation for multiple versions
   - CDN distribution of PDFs

2. Frontend Performance:
   - Code splitting by route
   - Lazy loading of editor components
   - Virtual scrolling for long lists
   - Image optimization with next/image

3. API Optimization:
   - Database connection pooling
   - Query optimization with indexes
   - Response compression
   - GraphQL for flexible queries

4. AI Service Optimization:
   - Response streaming for long completions
   - Batching similar requests
   - Caching common suggestions
   - Fallback to simpler models for basic tasks

Include performance monitoring and alerting
```

---

## 10. Launch Strategy

### 10.1 MVP Features
```prompt
Define MVP scope for 4-week sprint:

Week 1:
- Basic Chrome extension that detects job pages
- Simple LaTeX editor integration
- Manual save/load functionality

Week 2:
- Job description extraction
- Keyword highlighting
- Basic PDF compilation

Week 3:
- AI rewriting for single bullet points
- Version saving with metadata
- Simple web dashboard

Week 4:
- Polish UI/UX
- Bug fixes
- Beta user onboarding
- Basic analytics

Post-MVP priorities:
1. Subscription system
2. Advanced AI features
3. Collaboration tools
4. Mobile app
```

---

## Usage Instructions for Developers

### With GitHub Copilot:
1. **Starting a new file**: Copy relevant section from this doc as initial comment
2. **Inline hints**: Use `// Implement section 3.2 from PROMPTS.md`
3. **Complex features**: Break down into smaller prompts from subsections
4. **Debugging**: Reference specific error handling from section 8

### With Cursor AI:
1. Use `@PROMPTS.md` to reference this document
2. Ask "Implement [section] following the architecture in PROMPTS.md"
3. Use Cmd+K for inline generation with context

### With ChatGPT/Claude:
1. Copy entire relevant sections as context
2. Ask for specific implementations
3. Iterate with "Following the pattern in [section], create..."

### Code Review Checklist:
- [ ] Matches architecture from section 1
- [ ] Includes error handling from section 8.1
- [ ] Has tests as per section 7.1
- [ ] Performance optimized per section 9
- [ ] Security measures from section 8 applied

---

## Quick Reference Commands

```bash
# Start development
pnpm install
pnpm dev

# Run specific service
pnpm --filter chrome-extension dev
pnpm --filter backend dev
pnpm --filter webapp dev

# Testing
pnpm test
pnpm test:e2e
pnpm test:integration

# Build for production
pnpm build
pnpm docker:build
pnpm deploy:staging

# Chrome extension
pnpm --filter chrome-extension build
# Load unpacked from ./chrome-extension/dist
```

---

## Additional Prompts for Specific Features

### LaTeX Template Generator
```prompt
Create a LaTeX resume template generator that:
- Accepts JSON schema of user data
- Generates clean, ATS-friendly LaTeX
- Supports multiple styles (compact, detailed, academic)
- Includes proper spacing and formatting
- Handles special characters escaping
```

### Job Board Integration
```prompt
Build adapters for major job boards:
- LinkedIn: Extract job ID, easy apply detection
- Greenhouse: Handle multi-step applications
- Lever: Extract custom questions
- Workday: Navigate through iframes
- Indeed: Handle quick apply
Include fallback patterns for unknown sites
```

### Analytics Dashboard
```prompt
Create analytics dashboard showing:
- Application funnel visualization
- Keyword effectiveness over time
- Industry trends from aggregated data
- Response rate by company size
- Geographic application distribution
Use D3.js for visualizations, ensure responsive design
```

---

This prompt document is your blueprint. Start with section 1, build incrementally, and use the prompts to guide GitHub Copilot in generating production-ready code.