# Smart Resume Editor - Chrome Extension

A Chrome extension that provides AI-powered resume editing and optimization directly within job application websites.

## 📁 Project Structure

```
chrome-extension/
├── src/                          # Source files
│   ├── popup/                    # Extension popup UI
│   │   ├── index.tsx            # Popup entry point
│   │   ├── PopupApp.tsx         # Main popup component
│   │   ├── styles.css           # Popup styles
│   │   └── index.html           # Popup HTML template
│   ├── sidebar/                  # Side panel UI
│   │   ├── index.tsx            # Sidebar entry point
│   │   ├── styles.css           # Sidebar styles
│   │   ├── index.html           # Sidebar HTML template
│   │   └── components/          # Sidebar components
│   │       ├── SidePanel.tsx    # Main sidebar container
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── JobAnalysisPanel.tsx
│   │       ├── AISuggestionsPanel.tsx
│   │       └── LaTeXEditor.tsx
│   ├── content-scripts/          # Content scripts for job sites
│   │   ├── content-script.ts    # Main content script
│   │   ├── job-detector.ts      # Job posting detection logic
│   │   └── content-styles.css   # Content script styles
│   ├── background/               # Background service worker
│   │   └── service-worker.ts    # Extension background script
│   └── globals.d.ts             # TypeScript global declarations
├── icons/                        # Extension icons
├── dist/                         # Built extension files
├── manifest.json                 # Extension manifest
├── package.json                  # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── webpack.config.js            # Build configuration
└── README.md                    # This file
```

## 🚀 Development

### Prerequisites

- Node.js (v16 or higher)
- pnpm (for workspace management)

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start development build with watching:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### Available Scripts

- `npm run dev` - Development build with file watching
- `npm run build` - Production build
- `npm run clean` - Clean the dist directory
- `npm run type-check` - TypeScript type checking

## 🛠️ Key Features

### Popup Component (`src/popup/`)
- Quick access to extension features
- Open side panel functionality
- Settings and options access

### Sidebar Components (`src/sidebar/`)
- **Job Analysis Panel**: Detects and analyzes job postings
- **AI Suggestions Panel**: Provides AI-powered resume improvement suggestions
- **LaTeX Editor**: In-browser LaTeX resume editor with templates

### Content Scripts (`src/content-scripts/`)
- **Job Detection**: Automatically detects job postings on major job sites
- **Skills Highlighting**: Highlights relevant skills mentioned in job descriptions
- **Data Extraction**: Extracts job requirements and company information

### Background Service Worker (`src/background/`)
- **Job Site Monitoring**: Tracks when users visit job posting pages
- **Cross-component Communication**: Handles messages between popup, sidebar, and content scripts
- **Data Storage**: Manages resume data and user preferences

## 🏗️ Build Process

The extension uses Webpack to bundle TypeScript/React source files:

1. **TypeScript Compilation**: All `.ts` and `.tsx` files are compiled using `ts-loader`
2. **CSS Processing**: CSS files are processed with `style-loader` and `css-loader`
3. **Asset Copying**: Static assets (manifest, icons, CSS) are copied to dist
4. **HTML Generation**: HTML files are generated for popup and sidebar

### Build Outputs

- `popup.js` - Popup React application
- `sidebar.js` - Sidebar React application  
- `content-script.js` - Content script for job sites
- `service-worker.js` - Background service worker
- `popup/index.html` - Popup HTML page
- `sidebar/index.html` - Sidebar HTML page
- `manifest.json` - Extension manifest
- `icons/` - Extension icons
- `content-styles.css` - Styles for content script injection

## 🔧 Configuration

### TypeScript (`tsconfig.json`)
- Target: ES2020
- Module: ESNext
- JSX: react-jsx
- Chrome types included

### Webpack (`webpack.config.js`)
- Development mode with source maps
- Multiple entry points for different components
- CSS and TypeScript processing
- Static asset copying

### Manifest (`manifest.json`)
- Manifest V3 format
- Permissions for job sites and storage
- Side panel and popup configuration
- Content script injection rules

## 🌐 Supported Job Sites

- LinkedIn Jobs
- Indeed
- Glassdoor
- Monster
- ZipRecruiter
- Simply Hired
- CareerBuilder
- And more...

## 📝 Extension APIs Used

- **chrome.tabs** - Tab management and communication
- **chrome.storage** - Data persistence
- **chrome.sidePanel** - Side panel functionality
- **chrome.action** - Popup and badge management
- **chrome.contextMenus** - Right-click context menus
- **chrome.runtime** - Background script messaging

## 🔒 Security

- Content Security Policy configured for extension pages
- Host permissions limited to job sites only
- No external script loading
- All assets bundled locally

## 📱 User Interface

### Popup (350x400px)
- Clean, modern interface
- Quick access buttons
- Responsive design

### Side Panel (Full height)
- Tabbed interface for different features
- Scrollable content areas
- Professional styling

### Content Script Overlays
- Non-intrusive highlighting
- Floating action buttons
- Contextual notifications

## 🧪 Testing

The extension can be loaded as an unpacked extension in Chrome:

1. Build the extension: `npm run build`
2. Open Chrome Extensions page: `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist/` folder

## 🚀 Deployment

For Chrome Web Store deployment:

1. Build production version: `npm run build`
2. Zip the `dist/` folder contents
3. Upload to Chrome Web Store Developer Dashboard

---

Built with ❤️ using React, TypeScript, and Webpack