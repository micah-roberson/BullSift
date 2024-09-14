document.addEventListener('DOMContentLoaded', () => {
    const changeIconButton = document.getElementById('changeIconButton');
    const urlDisplay = document.getElementById('currentUrl');
    const counterDisplay = document.getElementById('urlChangeCounter');
  
    // Fetch the current URL and URL change counter from chrome.storage.local
    chrome.storage.local.get(['currentUrl', 'urlChangeCount'], (data) => {
      if (data.currentUrl) {
        urlDisplay.textContent = `Current URL: ${data.currentUrl}`;
      } else {
        urlDisplay.textContent = "No URL available.";
      }
  
      if (data.urlChangeCount) {
        counterDisplay.textContent = `URL change count: ${data.urlChangeCount}`;
      } else {
        counterDisplay.textContent = "URL change count: 0";
      }
    });
  
    // Change the icon when the button is clicked
    changeIconButton.addEventListener('click', () => {
      chrome.action.setIcon({
        path: {
          "16": "icons/bullsift2-16.png",
          "48": "icons/bullsift2-48.png",
          "128": "icons/bullsift2-128.png"
        }
      }, () => {
        if (chrome.runtime.lastError) {
          console.error(`Error setting icon: ${chrome.runtime.lastError.message}`);
        } else {
          console.log("Icon changed to bullsift2!");
        }
      });
    });
  });
  