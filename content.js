function extractPageData() {
    const pageData = {
        pageTitle: document.title,
        metaDescription: document.querySelector('meta[name="description"]')?.content || "",
        headings: Array.from(document.querySelectorAll("h1, h2, h3")).map((h) => h.innerText),
        links: Array.from(document.links).map((link) => ({ href: link.href, text: link.innerText })),
        mainContent: document.querySelector("main")?.innerText || document.body.innerText,
        images: Array.from(document.images).map((img) => ({ src: img.src, alt: img.alt })),
    };

    // Make POST request to the API with the specified body format
    fetch("https://bullsiftapi.onrender.com/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // prompt: "Is the following article fake news? " + pageData.mainContent,
            prompt: `Analyze the following article text and identify any language that appears sensationalist or exaggerated. Provide phrases that seem manipulative and indicate whether the claims in those phrases are supported by factual evidence: ${pageData.mainContent}`,
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
