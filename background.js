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
  
  function changeIconIntelligent(){
    chrome.storage.local.get(['currentUrl'], (result) => {
      const currentUrl = result.currentUrl;
  
      if (!currentUrl) {
          console.log("No URL found.");
          return;
      }
      console.log(currentUrl);
  
      // Your API endpoint
      const apiUrl = 'https://bullsiftapi.onrender.com/generate';
  
      // Prepare the request body
      const requestBody = {
        prompt: `Is the following link at risk of containing any fake or suspicious information? Respond with only 'yes' or 'no'. URL: ${currentUrl}`
      };
  
      // Make the API call using fetch
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      .then(response => response.json())
      .then(data => {
        // Check the API response
        const result = data?.generations[0]?.text.trim().toLowerCase();
        console.log(result);
        if (result === "no") {
          console.log("no!");
          // Set icon to bullsift1 (fraudulent website icon)
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
        } else if (result === "yes") {
          console.log("yes!");
          // Set icon to bullsift2 (non-fraudulent website icon)
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
        } else {
          console.log("Unexpected response from the API");
        }
      })
      .catch(error => {
        console.error('Error fetching from API:', error);
      });
    });
  }
    