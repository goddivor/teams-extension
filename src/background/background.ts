// src/background/background.ts

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Teams Extension installed:', details.reason);
  
  if (details.reason === 'install') {
    // Open Teams web page on first install
    chrome.tabs.create({
      url: 'https://teams.live.com/v2'
    });
    
    // Open options page for initial setup
    chrome.runtime.openOptionsPage();
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  switch (message.type) {
    case 'TEAMS_PAGE_LOADED':
      console.log('Teams page loaded in tab:', sender.tab?.id);
      // Could trigger badge update or other actions
      break;
      
    default:
      console.log('Unknown message type:', message.type);
  }
  
  sendResponse({ success: true });
});

// Optional: Handle tab updates to detect Teams navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('teams.live.com')) {
    console.log('Teams tab updated:', tabId);
  }
});