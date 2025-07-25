// src/popup/popup.ts

document.addEventListener('DOMContentLoaded', initializePopup);

async function initializePopup() {
  console.log('Popup initialized');
  
  // Check if we're on a Teams page
  await checkTeamsStatus();
  
  // Bind events
  bindEvents();
}

async function checkTeamsStatus() {
  const statusElement = document.getElementById('status');
  if (!statusElement) return;
  
  try {
    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab.url?.includes('teams.live.com') || tab.url?.includes('teams.microsoft.com')) {
      statusElement.innerHTML = '<span>🟢</span><span>Actif sur Teams</span>';
      
      // Try to get page info from content script
      try {
        const response = await chrome.tabs.sendMessage(tab.id!, {
          type: 'GET_PAGE_INFO'
        });
        console.log('Page info:', response);
      } catch (error) {
        console.log('Content script not responding:', error);
      }
      
    } else {
      statusElement.innerHTML = '<span>🟡</span><span>Non sur Teams</span>';
    }
  } catch (error) {
    statusElement.innerHTML = '<span>🔴</span><span>Erreur</span>';
    console.error('Status check failed:', error);
  }
}

function bindEvents() {
  // Open Teams button
  const openTeamsBtn = document.getElementById('openTeams');
  openTeamsBtn?.addEventListener('click', () => {
    chrome.tabs.create({
      url: 'https://teams.live.com/v2'
    });
    window.close(); // Close popup after opening Teams
  });
  
  // Open options button
  const openOptionsBtn = document.getElementById('openOptions');
  openOptionsBtn?.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
    window.close(); // Close popup after opening options
  });
}