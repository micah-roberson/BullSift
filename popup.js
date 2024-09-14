document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["pageData", "apiResponse"], function (result) {
        if (result.pageData) {
            document.getElementById("activeTabTitle").textContent = result.pageData.pageTitle;
            // Display other pageData if needed
        }

        if (result.apiResponse) {
            displayApiResponse(result.apiResponse);
        } else {
            document.getElementById("apiResponse").textContent = "No API response available.";
        }
    });
});

function displayApiResponse(apiResponse) {
    const responseElement = document.getElementById("apiResponse");

    // Clear any existing content
    responseElement.innerHTML = "";

    // Create and append elements based on the structure of apiResponse
    for (const [key, value] of Object.entries(apiResponse)) {
        const item = document.createElement("div");
        item.innerHTML = `<strong>${key}:</strong> ${value}`;
        responseElement.appendChild(item);
    }
}
