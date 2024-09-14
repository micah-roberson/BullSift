document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["pageData"], function (result) {
        if (result.pageData) {
            document.getElementById("activeTabTitle").innerText = result.pageData.pageTitle;
            console.log(result.pageData);
        } else {
            console.log("No page data available");
        }
    });
});
