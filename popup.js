document.addEventListener("DOMContentLoaded", () => {
    // null here defaults to active tab of current window
    chrome.tabs.executeScript(
        null,
        {
            code: `
      // Get the title
      const pageTitle = document.title;
      
      // Get meta description
      const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
      
      // Get all headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText);
      
      // Get all links
      const links = Array.from(document.links).map(link => ({ href: link.href, text: link.innerText }));
      
      // Get main content (assuming there's a <main> tag, otherwise fallback to body)
      const mainContent = document.querySelector('main')?.innerText || document.body.innerText;
      
      // Get all images
      const images = Array.from(document.images).map(img => ({ src: img.src, alt: img.alt }));

      // Return an object with all pieces of information
      ({ pageTitle, metaDescription, headings, links, mainContent, images });
    `,
        },
        (response) => {
            const pageData = response[0];
            console.log(response);
            console.log(pageData.mainContent);

            if (!pageData) {
                console.log("Could not get data from page.");
                return;
            }

            document.getElementById("activeTabTitle").innerText = pageData.pageTitle;
        }
    );
});
