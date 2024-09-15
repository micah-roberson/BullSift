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
    const PROMPT_2 = "List the sources mentioned in this article and flag any that are known to be unreliable. Summarize in less than 100 words.";
    const PROMPT_3 = "Highlight discrepancies between the article's claims and known facts. Summarize in less than 100 words.";
    const PROMPT_4 = "Analyze the emotional tone of the article and note if it's biased. Summarize in less than 100 words.";
    const PROMPT_5 = "Provide a veracity score (0-5 where 5 is very fake and 0 is truthful) for the article based on credibility and bias. In case of Satire it should be prompted as fake news. Answer in the format of '{Yes/No}, {confidence score between 0-5}, {< 50 word explanation}',  {short statement of what type of bias: Political or Satire or Academic} , e.g. 'No, 4, The articaly says .... It is biased politically'";

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
            console.log("setting apiresponse")
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
    console.log("calling api")
    document.addEventListener("DOMContentLoaded", extractPageData);
} else {
    console.log("calling api")
    extractPageData();
}
