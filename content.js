// Function to call when navigating to a new page
function clearChatHistory() {
    fetch("https://bullsiftapi.onrender.com/clear-history", {
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

async function extractPageData() {
    const pageData = {
        mainContent: document.querySelector("main")?.innerText || document.body.innerText,
    };
    console.log(pageData);

    const PROMPT_1 = `Identify sensationalist or exaggerated phrases in the article below. Please answer in 100 words or less. Article: ${pageData.mainContent}`;
    const PROMPT_2 = "List the sources mentioned in this article and flag any that are known to be unreliable. Summarize in less than 100 words.";
    const PROMPT_3 = "Highlight discrepancies between the article's claims and known facts. Summarize in less than 100 words.";
    const PROMPT_4 = "Analyze the emotional tone of the article and note if it's biased. Summarize in less than 100 words.";
    const PROMPT_5 = "Consider satire to be fake news and misinformation. Based on the credibility of the sources, consistency with known facts, and presence of emotional or biased language, provide a veracity score for the following article (0-100, where 0 is very true, and 100 is very false) and justify your reasoning for the score. Answer in the format of '{score between 0-100}, {< 50 word explanation},  {short statement of what type of bias: Political or Satire or Academic}'.";

    // Make POST request to the API with the specified body format
    // TODO: change to https://bullsiftapi.onrender.com/generate
    // function generateResponse(prompt) {
    //     return fetch("http://localhost:3000/generate", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ prompt }),
    //     });
    // }

    async function generateResponse(prompt) {
        return fetch("https://bullsiftapi.onrender.com/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });
    }

    // generateResponse(PROMPT_1);
    // generateResponse(PROMPT_2);
    // generateResponse(PROMPT_3);
    // generateResponse(PROMPT_4);
    // generateResponse(PROMPT_5)
    //     .then((response) => response.json())
    //     .then((data) => {
    //         console.log("API Success:", data);
    //         // Store the response data
    //         console.log("setting apiresponse")
    //         chrome.storage.local.set({ apiResponse: data }, function () {
    //             console.log("API response saved");
    //         });
    //     })
    //     .catch((error) => {
    //         console.error("API Error:", error);
    //     });

    try {
        // Call generateResponse sequentially and wait for each one to complete
        const response1 = await generateResponse(PROMPT_1);
        const data1 = await response1.json();
        console.log("API Success for PROMPT_1:", data1);

        const response2 = await generateResponse(PROMPT_2);
        const data2 = await response2.json();
        console.log("API Success for PROMPT_2:", data2);

        const response3 = await generateResponse(PROMPT_3);
        const data3 = await response3.json();
        console.log("API Success for PROMPT_3:", data3);

        const response4 = await generateResponse(PROMPT_4);
        const data4 = await response4.json();
        console.log("API Success for PROMPT_4:", data4);

        const response5 = await generateResponse(PROMPT_5);
        const data5 = await response5.json();
        console.log("API Success for PROMPT_5:", data5);

        // Store the final response
        const apiResponse = { data1, data2, data3, data4, data5 };
        console.log("setting apiResponse");
        chrome.storage.local.set({ apiResponse: apiResponse }, function () {
            console.log("API responses saved");
        });

    } catch (error) {
        console.error("API Error:", error);
    }

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
