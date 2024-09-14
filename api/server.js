const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { CohereClient } = require("cohere-ai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY, // Store your API key in .env file
});

let chatHistory = []; // Store this in your application state

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    try {
        const stream = await cohere.chatStream({
            model: "command-r-plus-08-2024",
            message: prompt,
            temperature: 0.3,
            chatHistory: chatHistory,
            promptTruncation: "AUTO",
            connectors: [{ id: "web-search" }],
        });

        let generatedText = "";

        for await (const chat of stream) {
            if (chat.eventType === "text-generation") {
                generatedText += chat.text;
            }
        }

        // Update chat history for next call
        chatHistory.push({ role: "USER", message: prompt });
        chatHistory.push({ role: "CHATBOT", message: generatedText });

        res.json({ response: generatedText });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate text" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
