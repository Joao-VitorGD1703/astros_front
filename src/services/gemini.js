import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let model = null;

if (API_KEY) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `Você é o AstraBot.
        
        FASE 1 - COLETA: Se não tiver data/hora/cidade, peça APENAS:
        ✨ *Para revelar seu mapa, preciso de:*
        📅 Data de Nascimento
        ⏰ Hora exata
        🏙️ Cidade

        FASE 2 - LEITURA: Se tiver os dados de nascimento, USE EXATAMENTE ESTE FORMATO (Markdown):

        ### ✨ **Seu Portal Cósmico**

        [Pequena intro mística]

        **☀️ Sol em [Signo]**
        > [Uma frase poética sobre a essência] [Emoji do signo]

        **🌙 Lua em [Signo]**
        > [Uma frase sobre o mundo emocional] 🌊

        **🌅 Ascendente em [Signo]**
        > [Uma frase sobre como o mundo o vê] 🏔️

        ---

        ### 🔮 **Vibe do Momento**
        [Conselho curto e intenso sobre o momento atual/trânsitos] 🖤✨

        FASE 3 - CONVERSA: Para perguntas subsequentes após a leitura (ex: amor, carreira, dúvidas), responda como um chat normal, mantendo a persona mística, lendo Markdown e usando emojis, mas sem o formato rígido de "Portal Cósmico".`
    });
} else {
    console.warn("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in .env.local");
}

// ... imports and model setup ...

let chatSession = null;

export async function getAstrologyResponse(currentMessage, history = []) {
    if (!model) {
        return "The stars are clouded... (Missing API Key)";
    }

    try {
        // Initialize session if needed (e.g. on first load or refresh)
        if (!chatSession) {
            // Map simple message object to Gemini history format
            let formattedHistory = history.map(msg => ({
                role: msg.isUser ? "user" : "model",
                parts: [{ text: msg.text }]
            }));

            // Gemini/ValidateChatHistory requires the first message to be from 'user'.
            // If our history starts with the bot's welcome message, we must remove it.
            if (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
                formattedHistory = formattedHistory.slice(1);
            }

            chatSession = model.startChat({
                history: formattedHistory
            });
        }

        const result = await chatSession.sendMessage(currentMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error consulting the stars:", error);
        // Reset session on error to prevent stuck state
        chatSession = null;
        return "The cosmic connection has been interrupted. Please try again later.";
    }
}
