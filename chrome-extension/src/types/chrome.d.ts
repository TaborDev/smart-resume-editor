// Type definitions for Chrome Extensions API
// These are basic type definitions - you might need to extend them based on your extension's needs

interface Chrome {
  // Runtime API
  runtime: {
    // Event listeners
    onInstalled: chrome.runtime.InstalledEvent;
    onMessage: chrome.runtime.ExtensionMessageEvent;
    
    // Methods
    getURL: (path: string) => string;
    sendMessage: (
      extensionId: string | undefined,
      message: any,
      options?: chrome.runtime.MessageOptions,
      responseCallback?: (response: any) => void
    ) => void;
    
    // Properties
    id: string;
  };
  
  // Storage API
  storage: {
    local: {
      get: (keys: string | string[] | object | null, callback: (items: { [key: string]: any }) => void) => void;
      set: (items: object, callback?: () => void) => void;
      remove: (key: string | string[], callback?: () => void) => void;
    };
    sync: {
      get: (keys: string | string[] | object | null, callback: (items: { [key: string]: any }) => void) => void;
      set: (items: object, callback?: () => void) => void;
    };
  };
  
  // Tabs API
  tabs: {
    query: (
      queryInfo: chrome.tabs.QueryInfo,
      callback: (result: chrome.tabs.Tab[]) => void
    ) => void;
    get: (tabId: number, callback: (tab: chrome.tabs.Tab) => void) => void;
    create: (createProperties: chrome.tabs.CreateProperties) => void;
    sendMessage: (
      tabId: number,
      message: any,
      options?: chrome.tabs.MessageSendOptions,
      responseCallback?: (response: any) => void
    ) => void;
  };
  
  // Side Panel API (if using Manifest V3)
  sidePanel?: {
    setOptions: (options: { tabId?: number; path: string; enabled: boolean }) => void;
  };
  
  // Action API (for browser action)
  action?: {
    setIcon: (details: {
      tabId?: number;
      path: string | { [key: string]: string };
    }) => void;
  };
  
  // Commands API (for keyboard shortcuts)
  commands?: {
    onCommand: chrome.events.Event<(command: string) => void>;
  };
  
  // Add other Chrome APIs as needed
}

declare var chrome: Chrome;

// If you're using ES modules
export {};
