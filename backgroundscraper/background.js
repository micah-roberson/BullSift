// Listen for tab updates (e.g., when the URL changes within the tab)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      // Store the updated URL in chrome.storage.local
      chrome.storage.local.set({ currentUrl: changeInfo.url }, () => {
        console.log("URL updated (onUpdated): " + changeInfo.url);
      });
  
      // Call the function to randomly change the icon with a 50% chance
      randomlyChangeIcon();
    }
  });
  
  // Listen for tab selection (switching between tabs)
  chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      // Store the active tab's URL in chrome.storage.local
      chrome.storage.local.set({ currentUrl: tab.url }, () => {
        console.log("URL updated (onActivated): " + tab.url);
      });
  
      // Call the function to randomly change the icon with a 50% chance
      randomlyChangeIcon();
    });
  });
  
  // Function to randomly change the icon with a 50% chance
  function randomlyChangeIcon() {
    // Generate a random number between 0 and 1
    const randomValue = Math.random();
  
    // 50% chance to change the icon to either bullsift1 or bullsift2
    if (randomValue < 0.5) {
      // Set icon to bullsift1
      chrome.action.setIcon({
        path: {
          "16": "icons/bullsift1-16.png",
          "48": "icons/bullsift1-48.png",
          "128": "icons/bullsift1-128.png"
        }
      }, () => {
        if (chrome.runtime.lastError) {
          console.error(`Error setting icon to bullsift1: ${chrome.runtime.lastError.message}`);
        } else {
          console.log("Icon changed to bullsift1!");
        }
      });
    } else {
      // Set icon to bullsift2
      chrome.action.setIcon({
        path: {
          "16": "icons/bullsift2-16.png",
          "48": "icons/bullsift2-48.png",
          "128": "icons/bullsift2-128.png"
        }
      }, () => {
        if (chrome.runtime.lastError) {
          console.error(`Error setting icon to bullsift2: ${chrome.runtime.lastError.message}`);
        } else {
          console.log("Icon changed to bullsift2!");
        }
      });
    }
  }
  