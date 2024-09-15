// Background script to handle extension activation
chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.executeScript(tab.id, { file: 'overlay.js' });
  });
  