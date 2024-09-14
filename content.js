function extractPageData() {
    const pageData = {
        pageTitle: document.title,
        metaDescription: document.querySelector('meta[name="description"]')?.content || "",
        headings: Array.from(document.querySelectorAll("h1, h2, h3")).map((h) => h.innerText),
        links: Array.from(document.links).map((link) => ({ href: link.href, text: link.innerText })),
        mainContent: document.querySelector("main")?.innerText || document.body.innerText,
        images: Array.from(document.images).map((img) => ({ src: img.src, alt: img.alt })),
    };

    // chrome.storage.local.set({ pageData: pageData }, function () {
    //     console.log("Page data saved");
    // });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", extractPageData);
} else {
    extractPageData();
}
