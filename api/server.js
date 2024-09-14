const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Parse incoming JSON requests

app.post('/generate', async (req, res) => {
    const { prompt } = req.body; // Get the prompt from the client

    try {
        // Make a request to Cohere API
        const response = await axios.post(
            'https://api.cohere.ai/v1/generate',
            {
                model: 'command', // Use 'command' model for text generation
                prompt: prompt,
                max_tokens: 100 // Adjust token limit as needed
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.COHERE_API_KEY}`, // API key stored in environment variables
                    'Content-Type': 'application/json'
                }
            }
        );

        // Send the generated text back to the client
        res.json(response.data);
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate text' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
