document.addEventListener('DOMContentLoaded', () => {
  console.log("popup starting")
  // Fetch isWebsiteSafe from chrome.storage.local
  chrome.storage.local.get(['isWebsiteSafe'], function(result) {
    const isWebsiteSafe = result.isWebsiteSafe;
    let totalPoints = localStorage.getItem('totalPoints') ? parseInt(localStorage.getItem('totalPoints')) : 0;

    const totalPointsDisplay = document.getElementById("totalPoints");
    totalPointsDisplay.textContent = totalPoints;

    if (isWebsiteSafe) {
      // If website is safe, show the disabledPage and hide other sections
      document.getElementById('disabledPage').classList.remove('hidden'); // Show the safe page message
      document.getElementById('questionSection').classList.add('hidden'); // Hide question section
      document.getElementById('resultSection').classList.add('hidden'); // Hide result section
      document.getElementById('answerButton').classList.add('hidden'); // Hide answer button
    } else {
      document.getElementById('disabledPage').classList.add('hidden'); // Show the safe page message
      // Website is not safe, continue with normal functionality

      const slider = document.getElementById("confidenceSlider");
      const confidenceDisplay = document.getElementById("confidenceValue");

      slider.addEventListener('input', function() {
        confidenceDisplay.textContent = `${slider.value}`;
      });

      const answerButton = document.getElementById("answerButton");

      // Create the "Congratulations on 100 points" text, hidden initially
    //   const congratulationsText = document.createElement('div');
    //   congratulationsText.textContent = 'Congratulations on 100 points!';
    //   congratulationsText.style.display = 'none'; // Hidden initially
    //   congratulationsText.style.textAlign = 'center';
    //   congratulationsText.style.marginTop = '20px';
    //   congratulationsText.style.fontSize = '18px';
    //   congratulationsText.style.fontWeight = 'bold';
    //   congratulationsText.style.color = 'green';

    //   document.body.appendChild(congratulationsText); // Append the congratulatory text to the body or container

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

        const pointsText = document.getElementById("pointsText");

        // Determine correct answer based on random number
        let correctAnswer;
        chrome.storage.local.get(["apiResponse"], function (result) {
            if (result.apiResponse) {
                console.log(result.apiResponse["data5"]);

                // Assuming that the score is a number in the format {score}, the first part of the response
                const score = parseInt(result.apiResponse["data5"].response.split(",")[0]);
                console.log(score);

                // Set correctAnswer based on the score
                correctAnswer = score >= 50 ? "yes" : "no";

                proceedWithCode();
            } else {
                // Wait for apiResponse to be available
                const checkApiResponse = setInterval(() => {
                    chrome.storage.local.get(["apiResponse"], function (newResult) {
                        if (newResult.apiResponse) {
                            clearInterval(checkApiResponse);
                            const score = parseInt(result.apiResponse["data5"].response.split(",")[0]);
                            console.log(score);

                            // Set correctAnswer based on the score
                            correctAnswer = score >= 50 ? "yes" : "no";
                            // Continue with the rest of the code here
                            proceedWithCode();
                        }
                    });
                }, 100); // Check every 100ms
            }
        });

        function proceedWithCode() {
            // Get the confidence value
            const confidenceValue = parseInt(slider.value);

            // Calculate points to award or deduct
            const pointsToAwardOrDeduct = Math.round((confidenceValue / 100) * 15); // Percentage of 15 points based on confidence
            // TODO: check answerSubmitted variable

            if ((correctAnswer === "yes" && yesOption) || (correctAnswer === "no" && noOption)) {
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
            localStorage.setItem("totalPoints", totalPoints);

            // Show "Congratulations" text when points reach 100
            // if (totalPoints >= 100) {
            //     congratulationsText.style.display = "block"; // Show the congratulations text
            // }

            // Fetch page data and API response from chrome.storage.local
            chrome.storage.local.get(["apiResponse"], function (result) {
                console.log("helloooo");
                console.log(result.apiResponse);
                if (result.apiResponse) {
                    displayApiResponse(result.apiResponse);
                } else {
                    document.getElementById("explanationBox").textContent = "No API response available."; // Use the explanation box
                }
            });
        }
    });

    const restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", () => {
        chrome.storage.local.set({ answerSubmitted: true });
        document.getElementById("questionSection").classList.remove("hidden"); // Show question section again
        answerButton.classList.remove("hidden");

        document.getElementById("resultSection").classList.add("hidden");

        slider.value = 50;
        confidenceDisplay.textContent = "50";

        document.getElementById("yesOption").checked = false;
        document.getElementById("noOption").checked = false;

        const pointsText = document.getElementById("pointsText");
        pointsText.classList.remove("points-positive", "points-negative");
        pointsText.textContent = "";

        // congratulationsText.style.display = 'none'; // Hide congratulations text on restart
      });
    }
  });
});

// Function to display the API response in the explanation box
function displayApiResponse(apiResponse) {
    const responseElement = document.getElementById("explanationBox"); // Use explanationBox as the outlined box

    // Clear any existing content
    responseElement.innerHTML = "";

    console.log("Heres the api response: ");
    console.log(apiResponse);


    // Create and append elements based on the structure of apiResponse
    for (const [key, value] of Object.entries(apiResponse)) {
        if (key == "data5") {
            continue;
        }
        const item = document.createElement("div");
        item.innerHTML = `<strong>${value.response}`;
        responseElement.appendChild(item);
    }
}
