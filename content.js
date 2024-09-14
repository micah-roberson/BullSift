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

    const PROMPT_1 = `Identify sensationalist or exaggerated phrases in the article below. Please answer in 100 words or less. Article: ${pageData.mainContent}`;
    const PROMPT_2 =
        "Based on the credibility of the sources, consistency with known facts, and presence of emotional or biased language, provide a Yes/No answer as to whether the article is fake news, and provide a number confidence score only for the following article between 0-100 for how confident you are in your prediction. Answer in the format of '{Yes/No}, {confidence score}', e.g. 'No, 95'";
    const PROMPT_3 =
        "Highlight discrepancies between the article's claims and known facts. Summarize in less than 100 words.";
    const PROMPT_4 = "Check the credibility of sources mentioned in the article. Summarize in less than 100 words.";
    const PROMPT_5 =
        "In this case, satirical news should be classified as fake news. Based on the credibility of the sources, consistency with known facts, and presence of emotional or biased language, provide a Yes/No answer as to whether the article is fake news, and provide a number confidence score only for the following article between 0-100 for how confident you are in your prediction.  Answer in the format of '{Yes/No}, {confidence score}, {< 100 word explanation}', e.g. 'No, 95'";

    // Make POST request to the API with the specified body format
    // TODO: change to https://bullsiftapi.onrender.com/generate
    function generateResponse(prompt) {
        return fetch("http://localhost:3000/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });
    }

    generateResponse(PROMPT_1);
    generateResponse(PROMPT_2);
    generateResponse(PROMPT_3);
    generateResponse(PROMPT_4);
    generateResponse(PROMPT_5)
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
