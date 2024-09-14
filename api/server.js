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

// Endpoint to clear chat history
app.post("/clear-history", (req, res) => {
    console.log("cleared chat history");
    chatHistory = [];
    res.json({ message: "Chat history cleared" });
});

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;
    console.log(chatHistory);

    try {
        const stream = await cohere.chatStream({
            model: "command-r-08-2024",
            message: prompt,
            temperature: 0.3,
            chatHistory: chatHistory,
            promptTruncation: "AUTO",
            connectors: [{ id: "web-search" }],
            // tools: [
            //     {
            //         name: "internet_search",
            //         description: "Search the internet for current information",
            //     },
            // ],
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

        // console.log(chatHistory);
        res.json({ response: generatedText });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate text" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
