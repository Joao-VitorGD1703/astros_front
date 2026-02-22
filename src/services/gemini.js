const API_BASE_URL = 'https://astrologic-latest.onrender.com';

export async function getAstrologyResponse(currentMessage, history = []) {
    try {
        // Map simple message object to Gemini history format needed by the backend
        let formattedHistory = history.map(msg => ({
            role: msg.isUser ? "user" : "model",
            parts: [{ text: msg.text }]
        }));

        // ValidateChatHistory requires the first message to be from 'user'.
        // If our history starts with the bot's welcome message, we must remove it.
        if (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
            formattedHistory = formattedHistory.slice(1);
        }

        const response = await fetch(`${API_BASE_URL}/api/astro/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentMessage,
                history: formattedHistory
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Error consulting the stars:", error);
        return "The cosmic connection has been interrupted. Please try again later.";
    }
}
