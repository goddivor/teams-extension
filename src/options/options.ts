// src/options/options.ts

document.addEventListener('DOMContentLoaded', initializeOptions);

function initializeOptions() {
  console.log('Options page initialized');
  
  // Set install time
  const installTimeElement = document.getElementById('installTime');
  if (installTimeElement) {
    installTimeElement.textContent = new Date().toLocaleString('fr-FR');
  }
  
  // Bind button events
  bindEvents();
}

function bindEvents() {
  // Open Teams button
  const openTeamsBtn = document.getElementById('openTeams');
  openTeamsBtn?.addEventListener('click', () => {
    chrome.tabs.create({
      url: 'https://teams.live.com/v2'
    });
  });
  
  // Test extension button
  const testExtensionBtn = document.getElementById('testExtension');
  testExtensionBtn?.addEventListener('click', async () => {
    try {
      // Query for Teams tabs
      const tabs = await chrome.tabs.query({
        url: ['https://teams.live.com/*', 'https://*.teams.microsoft.com/*']
      });
      
      if (tabs.length === 0) {
        alert('Aucun onglet Teams trouvé. Ouvrez Teams d\'abord!');
        return;
      }
      
      // Send test message to content script
      const tab = tabs[0];
      const response = await chrome.tabs.sendMessage(tab.id!, {
        type: 'GET_PAGE_INFO'
      });
      
      alert(`Extension testée avec succès!
URL: ${response.url}
Titre: ${response.title}
Timestamp: ${new Date(response.timestamp).toLocaleString('fr-FR')}`);
      
    } catch (error) {
      console.error('Test failed:', error);
      alert('Erreur lors du test. Vérifiez la console.');
    }
  });
  
  // View logs button
  const viewLogsBtn = document.getElementById('viewLogs');
  viewLogsBtn?.addEventListener('click', () => {
    // Open Chrome DevTools console
    alert('Ouvrez les outils de développement (F12) pour voir les logs de l\'extension.');
  });
}