// Listen for tab updates (e.g., when the URL changes within the tab)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    // Store the updated URL in chrome.storage.local
    chrome.storage.local.set({ currentUrl: changeInfo.url }, () => {
      console.log("URL updated (onUpdated): " + changeInfo.url);
    });

    chrome.storage.local.set({ answerSubmitted: false });

    // Call the function to check the URL's safety and change the icon intelligently
    changeIconIntelligent();
  }
});

// Listen for tab selection (switching between tabs)
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    // Store the active tab's URL in chrome.storage.local
    chrome.storage.local.set({ currentUrl: tab.url }, () => {
      console.log("URL updated (onActivated): " + tab.url);
    });

    chrome.storage.local.set({ answerSubmitted: false });

    // Call the function to check the URL's safety and change the icon intelligently
    changeIconIntelligent();
  });
});

// Function to randomly change the icon with a 50% chance
function randomlyChangeIcon() {
  const randomValue = Math.random();

  if (randomValue < 0.5) {
    setIcon('bullsift1');
    chrome.storage.local.set({ isWebsiteSafe: true });
  } else {
    setIcon('bullsift2');
    chrome.storage.local.set({ isWebsiteSafe: false });
  }
}

// Helper function to change the icon
function setIcon(iconName) {
  chrome.action.setIcon({
    path: {
      "16": `icons/${iconName}-16.png`,
      "48": `icons/${iconName}-48.png`,
      "128": `icons/${iconName}-128.png`
    }
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(`Error setting icon to ${iconName}: ${chrome.runtime.lastError.message}`);
    } else {
      console.log(`Icon changed to ${iconName}!`);
    }
  });
}

// Main function to intelligently change the icon based on API response
function changeIconIntelligent() {
  fetch("http://localhost:3000/clear-history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message); // Logs "Chat history cleared"
    })
    .catch((error) => {
      console.error("Error clearing chat history:", error);
    });
  chrome.storage.local.get(['currentUrl'], (result) => {
    const currentUrl = result.currentUrl;

    if (!currentUrl) {
      console.log("No URL found.");
      return;
    }

    console.log("Checking URL: " + currentUrl);

    const apiUrl = 'http://localhost:3000/generate';
    const prompt = `Is the following link at risk of containing any fake or suspicious information? Respond with only 'yes' or 'no', with no period. URL: ${currentUrl}`;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const result = data?.response?.trim().toLowerCase();
        if (result === "no") {
          console.log("URL is safe, changing icon accordingly.");
          randomlyChangeIcon();
          //setIcon('bullsift1');
          chrome.storage.local.set({ isWebsiteSafe: true });
        } else if (result === "yes") {
          console.log("URL might be unsafe, changing icon accordingly.");
          setIcon('bullsift2');
          chrome.storage.local.set({ isWebsiteSafe: false });
        } else {
          console.log("Unexpected response from API:", result);
          //randomlyChangeIcon();
        }
      })
      .catch(error => {
        console.error('Error fetching from API:', error);
        // Default to random icon change on API failure
        //randomlyChangeIcon();
      });
  });
}
