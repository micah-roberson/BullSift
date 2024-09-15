document.addEventListener("DOMContentLoaded", () => {
    console.log("popup starting");

    // Fetch isWebsiteSafe from chrome.storage.local
    chrome.storage.local.get(["isWebsiteSafe"], function (result) {
        const isWebsiteSafe = result.isWebsiteSafe;
        let totalPoints = localStorage.getItem("totalPoints") ? parseInt(localStorage.getItem("totalPoints")) : 0;
        let pointsEarned = false; // Flag to track if points have already been earned

        const totalPointsDisplay = document.getElementById("totalPoints");
        totalPointsDisplay.textContent = totalPoints;

        // Get the nobadge image, badge image, and logo
        const nobadge = document.getElementById("nobadge");
        const badgeImage = document.getElementById("badgeImage");
        const logoImage = document.querySelector(".logo-container img"); // Get the logo image element
        let badgeVisible = false; // Flag to track badge visibility

        // Function to update the nobadge image based on total points
        const updateBadge = () => {
            if (totalPoints >= 500) {
                nobadge.src = "icons/gold.png";
            } else if (totalPoints >= 150) {
                nobadge.src = "icons/silver.png";
            } else if (totalPoints >= 50) {
                nobadge.src = "icons/bronze.png";
            } else {
                nobadge.src = "icons/nobadge.png";
            }
        };

        // Initial call to set the correct badge based on loaded points
        updateBadge();

        // Toggle badge visibility when the nobadge.png is clicked
        nobadge.addEventListener("click", () => {
            badgeVisible = !badgeVisible; // Toggle the flag
            if (badgeVisible) {
                badgeImage.style.display = "block"; // Show badge
            } else {
                badgeImage.style.display = "none"; // Hide badge
            }
        });

        if (isWebsiteSafe) {
            document.getElementById("disabledPage").classList.remove("hidden"); // Show safe page
            document.getElementById("questionSection").classList.add("hidden"); // Hide question section
            document.getElementById("resultSection").classList.add("hidden"); // Hide result section
            document.getElementById("answerButton").classList.add("hidden"); // Hide answer button
        } else {
            document.getElementById("disabledPage").classList.add("hidden"); // Hide safe page

            const slider = document.getElementById("confidenceSlider");
            const confidenceDisplay = document.getElementById("confidenceValue");

            // Update confidence value display when slider is adjusted
            slider.addEventListener("input", function () {
                confidenceDisplay.textContent = `${slider.value}`;
            });

            const answerButton = document.getElementById("answerButton");

            answerButton.addEventListener("click", () => {
                document.getElementById("questionSection").classList.add("hidden"); // Hide question section
                answerButton.classList.add("hidden");

                const resultSection = document.getElementById("resultSection");
                resultSection.classList.remove("hidden"); // Show result section

                const pointsText = document.getElementById("pointsText");
                const confidenceValue = parseInt(slider.value);

                // Fetch the API response to get the score
                chrome.storage.local.get(["apiResponse"], function (result) {
                    if (result.apiResponse && result.apiResponse["data5"]) {
                        const score = parseInt(result.apiResponse["data5"].response.split(",")[0]);
                        console.log("API Score:", score);

                        // Determine if the confidence value is within ±20 of the score from the API
                        const withinRange = Math.abs(confidenceValue - score) <= 20;

                        // Only award or deduct points if points have not already been earned
                        if (!pointsEarned) {
                            if (withinRange) {
                                totalPoints += 20;
                                pointsText.textContent = `+20 points! (API Score: ${score}, Confidence: ${confidenceValue})`;
                                pointsText.classList.add("points-positive");
                                pointsText.classList.remove("points-negative");

                                // Change the logo back to the original bullsift1.png if correct
                                logoImage.src = "bullsift1.png";
                            } else {
                                totalPoints -= 20;
                                pointsText.textContent = `-20 points! (API Score: ${score}, Confidence: ${confidenceValue})`;
                                pointsText.classList.add("points-negative");
                                pointsText.classList.remove("points-positive");

                                // Change the logo to bullsiftCry.png when the answer is wrong
                                logoImage.src = "icons/bullsiftCry.png";
                            }

                            totalPointsDisplay.textContent = totalPoints;
                            localStorage.setItem("totalPoints", totalPoints);

                            chrome.storage.local.get(["apiResponse"], function (result) {
                                console.log("helloooo");
                                console.log(result.apiResponse);
                                if (result.apiResponse) {
                                    displayApiResponse(result.apiResponse);
                                } else {
                                    document.getElementById("explanationBox").textContent =
                                        "No API response available."; // Use the explanation box
                                }
                            });

                            pointsEarned = true; // Mark that points have been earned

                            // Update the badge after points are updated
                            updateBadge();
                        } else {
                            pointsText.textContent = "No points awarded on subsequent tries.";
                            pointsText.classList.remove("points-positive", "points-negative");
                        }
                    } else {
                        console.log("No API response available.");
                        pointsText.textContent = "Error: No API response available.";
                        pointsText.classList.remove("points-positive", "points-negative");
                    }
                });
            });
        }
    });
});

// Function to display the API response in the explanation box
function displayApiResponse(apiResponse) {
    const responseElement = document.getElementById("explanationBox");
    responseElement.innerHTML = "";

    console.log("Here's the API response:");
    console.log(apiResponse);

    for (const [key, value] of Object.entries(apiResponse)) {
        if (key == "data5") {
            continue;
        }
        const item = document.createElement("div");
        item.innerHTML = `<strong>${value.response}`;
        responseElement.appendChild(item);
    }
}
