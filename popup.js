document.addEventListener('DOMContentLoaded', () => {
  let totalPoints = localStorage.getItem('totalPoints') ? parseInt(localStorage.getItem('totalPoints')) : 0;

  const totalPointsDisplay = document.getElementById("totalPoints");
  totalPointsDisplay.textContent = totalPoints;

  const slider = document.getElementById("confidenceSlider");
  const confidenceDisplay = document.getElementById("confidenceValue");

  slider.addEventListener('input', function() {
    confidenceDisplay.textContent = `${slider.value} %`;
  });

  const answerButton = document.getElementById("answerButton");

  // Create the "Congratulations on 100 points" text, hidden initially
  const congratulationsText = document.createElement('div');
  congratulationsText.textContent = 'Congratulations on 100 points!';
  congratulationsText.style.display = 'none'; // Hidden initially
  congratulationsText.style.textAlign = 'center';
  congratulationsText.style.marginTop = '20px';
  congratulationsText.style.fontSize = '18px';
  congratulationsText.style.fontWeight = 'bold';
  congratulationsText.style.color = 'green';

  document.body.appendChild(congratulationsText); // Append the congratulatory text to the body or container

  answerButton.addEventListener('click', () => {
    const yesOption = document.getElementById('yesOption').checked;
    const noOption = document.getElementById('noOption').checked;

    if (!yesOption && !noOption) {
      alert('Please select Yes or No.');
      return;
    }

    document.getElementById('questionSection').classList.add('hidden'); // Hide question section
    answerButton.classList.add('hidden');

    const resultSection = document.getElementById('resultSection');
    resultSection.classList.remove('hidden');

    const pointsText = document.getElementById('pointsText');
    
    // Generate random number between 0 and 100
    const randomNumber = Math.floor(Math.random() * 101);

    // Determine correct answer based on random number
    let correctAnswer;
    if (randomNumber >= 0 && randomNumber <= 50) {
      correctAnswer = 'yes';
    } else {
      correctAnswer = 'no';
    }

    // Get the confidence value
    const confidenceValue = parseInt(slider.value);

    // Calculate points to award or deduct
    const pointsToAwardOrDeduct = Math.round((confidenceValue / 100) * 15); // Percentage of 15 points based on confidence

    if ((correctAnswer === 'yes' && yesOption) || (correctAnswer === 'no' && noOption)) {
      // User answered correctly, award points based on confidence
      pointsText.textContent = `+${pointsToAwardOrDeduct} points!`;
      pointsText.classList.add("points-positive");
      pointsText.classList.remove("points-negative");
      totalPoints += pointsToAwardOrDeduct;
    } else {
      // User answered incorrectly, lose points based on confidence
      pointsText.textContent = `-${pointsToAwardOrDeduct} points!`;
      pointsText.classList.add("points-negative");
      pointsText.classList.remove("points-positive");
      totalPoints -= pointsToAwardOrDeduct;
    }

    totalPointsDisplay.textContent = totalPoints;
    localStorage.setItem('totalPoints', totalPoints);

    // Show "Congratulations" text when points reach 100
    if (totalPoints >= 100) {
      congratulationsText.style.display = 'block'; // Show the congratulations text
    }

    // Fetch page data and API response from chrome.storage.local
    chrome.storage.local.get(["pageData", "apiResponse"], function (result) {
      if (result.pageData) {
        document.getElementById("activeTabTitle").textContent = result.pageData.pageTitle;
        // Display other pageData if needed
      }

      if (result.apiResponse) {
        displayApiResponse(result.apiResponse);
      } else {
        document.getElementById("explanationBox").textContent = "No API response available."; // Use the explanation box
      }
    });
  });

  const restartButton = document.getElementById("restartButton");
  restartButton.addEventListener('click', () => {
    document.getElementById('questionSection').classList.remove('hidden'); // Show question section again
    answerButton.classList.remove('hidden');

    document.getElementById('resultSection').classList.add('hidden');

    slider.value = 50;
    confidenceDisplay.textContent = "50 %";

    document.getElementById('yesOption').checked = false;
    document.getElementById('noOption').checked = false;

    const pointsText = document.getElementById('pointsText');
    pointsText.classList.remove('points-positive', 'points-negative');
    pointsText.textContent = '';

    congratulationsText.style.display = 'none'; // Hide congratulations text on restart
  });
});

// Function to display the API response in the explanation box
function displayApiResponse(apiResponse) {
  const responseElement = document.getElementById("explanationBox"); // Use explanationBox as the outlined box

  // Clear any existing content
  responseElement.innerHTML = "";

  // Create and append elements based on the structure of apiResponse
  for (const [key, value] of Object.entries(apiResponse)) {
    const item = document.createElement("div");
    item.innerHTML = `<strong>${key}:</strong> ${value}`;
    responseElement.appendChild(item);
  }
}

