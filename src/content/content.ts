// src/content/content.ts

console.log('Teams Extension content script loaded!');

// Wait for page to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

function initializeExtension() {
  console.log('Initializing Teams Extension on:', window.location.href);
  
  // Notify background script that Teams page is loaded
  chrome.runtime.sendMessage({
    type: 'TEAMS_PAGE_LOADED',
    url: window.location.href,
    timestamp: Date.now()
  });
  
  // Add a subtle indicator that extension is active
  addExtensionIndicator();
  
  // Start observing for Teams UI changes
  observeTeamsUI();
}

function addExtensionIndicator() {
  // Create a small indicator to show extension is active
  const indicator = document.createElement('div');
  indicator.id = 'teams-extension-indicator';
  indicator.innerHTML = '🔧'; // Tool emoji to indicate extension is active
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    background: #6264a7;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    cursor: pointer;
  `;
  
  indicator.title = 'Teams Extension Active';
  indicator.addEventListener('click', () => {
    console.log('Extension indicator clicked');
    // Could open popup or show status
  });
  
  document.body.appendChild(indicator);
  
  // Remove indicator after 3 seconds (just for confirmation)
  setTimeout(() => {
    indicator.style.opacity = '0.3';
  }, 3000);
}

function observeTeamsUI() {
  // Observer for detecting Teams UI changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // Log when significant changes happen in Teams UI
        console.log('Teams UI updated:', mutation.target);
        
        // Here you can add logic to detect specific Teams elements
        // For example, new messages, meeting controls, etc.
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('Teams UI observer started');
}

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  switch (message.type) {
    case 'GET_PAGE_INFO':
      sendResponse({
        url: window.location.href,
        title: document.title,
        timestamp: Date.now()
      });
      break;
      
    default:
      sendResponse({ error: 'Unknown message type' });
  }
});