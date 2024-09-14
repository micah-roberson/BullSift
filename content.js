// Function to call when navigating to a new page
function clearChatHistory() {
    fetch("http://localhost:3000/clear-history", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => console.log(data.message))
        .catch((error) => console.error("Error clearing chat history:", error));
}

// Call this function when the page loads or when navigation occurs
clearChatHistory();

function extractPageData() {
    const pageData = {
        mainContent: document.querySelector("main")?.innerText || document.body.innerText,
    };

    console.log(pageData);
    // Make POST request to the API with the specified body format
    // TODO: change to https://bullsiftapi.onrender.com/generate
    fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // prompt: "Is the following article fake news? " + pageData.mainContent,
            prompt: `Based on the credibility of the sources, consistency with known facts, and presence of emotional or biased language, provide a Yes/No answer as to whether the article is fake news, and provide a number confidence score only for the following article between 0-100 for how confident you are in your prediction. Answer in the format of '{Yes/No}, {confidence score}', e.g. 'No, 95': ${pageData.mainContent}`,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("API Success:", data);
            // Store the response data
            chrome.storage.local.set({ apiResponse: data }, function () {
                console.log("API response saved");
            });
        })
        .catch((error) => {
            console.error("API Error:", error);
        });

    // Still store the original page data
    chrome.storage.local.set({ pageData: pageData }, function () {
        console.log("Page data saved");
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", extractPageData);
} else {
    extractPageData();
}
