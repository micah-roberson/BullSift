// document.addEventListener("DOMContentLoaded", () => {
//   // null here defaults to active tab of current window
//   chrome.tabs.executeScript(null, {
//     code: `
//       document.querySelector("title").innerText;
//     `
//   }, response => {
//     const pageData = response[0];

//     if (!pageData) {
//       console.log("Could not get data from page.");
//       return;
//     }

//     document.getElementById("activeTabTitle").innerText = pageData;
//   });
// });

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
