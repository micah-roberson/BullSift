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

document.getElementById('send').addEventListener('click', async () => {
  const userInput = document.getElementById('user-input').value;
  const responseDiv = document.getElementById('response');
  
  // Clear previous response
  responseDiv.innerText = 'Generating...';

  // Call the hosted API
  try {
    const response = await fetch('https://bullsiftapi.onrender.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: userInput  // Send the user input as the prompt
      })
    });

    const data = await response.json();
    if (data.generations && data.generations[0]) {
      responseDiv.innerText = data.generations[0].text;  // Display the generated text
    } else {
      responseDiv.innerText = 'No response from API.';
    }
  } catch (error) {
    responseDiv.innerText = 'Error occurred while fetching response.';
    console.error(error);
  }
});