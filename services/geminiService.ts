import { GoogleGenAI, Type } from "@google/genai";

const createAIClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing. AI features will run in simulation mode.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- CORE ANALYSIS (Flash Lite for Speed) ---
export const fastAnalyze = async (input: string): Promise<string> => {
  const ai = createAIClient();
  if (!navigator.onLine || !ai) throw new Error("OFFLINE_MODE");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest', // High speed
      contents: input,
      config: {
        systemInstruction: "Tu es un assistant ultra-rapide pour Yann's Note. Réponds en 1 phrase concise.",
      }
    });
    return response.text || "Pas de réponse.";
  } catch (error) {
    console.error("Fast AI Error:", error);
    throw new Error("AI_ERROR");
  }
};

// --- COMPLEX REASONING (Pro + Thinking) ---
export const deepThinkingAnalysis = async (input: string, context: string): Promise<string> => {
  const ai = createAIClient();
  if (!navigator.onLine || !ai) throw new Error("OFFLINE_MODE");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Contexte: ${context}. Analyse approfondie demandée: ${input}`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking
      }
    });
    return response.text || "Analyse complexe échouée.";
  } catch (error) {
    console.error("Thinking Error:", error);
    throw new Error("AI_ERROR");
  }
};

// --- CHAOS ANALYSIS (SME/Accounting) ---
export const analyzeChaos = async (input: string, context: string): Promise<string> => {
    const ai = createAIClient();
    if (!navigator.onLine || !ai) throw new Error("OFFLINE_MODE");

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Contexte: ${context}. Analyse ces données en vrac (texte, reçus, notes) et structure-les en un rapport professionnel, comptable ou organisationnel.`,
            config: {
                systemInstruction: "Tu es un assistant expert pour les PME. Transforme le chaos en clarté."
            }
        });
        return response.text || "Analyse échouée.";
    } catch (error) {
        console.error("Chaos Error:", error);
        throw new Error("AI_ERROR");
    }
};

// --- GOOGLE SEARCH GROUNDING ---
export const marketResearch = async (query: string): Promise<{text: string, sources: any[]}> => {
  const ai = createAIClient();
  if (!navigator.onLine || !ai) throw new Error("OFFLINE_MODE");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Recherche des informations récentes sur le marché camerounais pour : ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    
    const text = response.text || "Aucune information trouvée.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Search Error:", error);
    throw new Error("AI_ERROR");
  }
};

// --- GOOGLE MAPS GROUNDING ---
export const findLocalResources = async (query: string, location?: {lat: number, lng: number}): Promise<{text: string, chunks: any[]}> => {
  const ai = createAIClient();
  if (!navigator.onLine || !ai) throw new Error("OFFLINE_MODE");

  const defaultLoc = { latitude: 3.8480, longitude: 11.5021 }; // Yaoundé

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Trouve les lieux suivants au Cameroun : ${query}`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
            retrievalConfig: {
                latLng: location ? { latitude: location.lat, longitude: location.lng } : defaultLoc
            }
        }
      }
    });
    
    return {
        text: response.text || "Lieux non trouvés.",
        chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Maps Error:", error);
    throw new Error("AI_ERROR");
  }
};

// --- IMAGE GENERATION ---
export const generateMarketingAsset = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string> => {
  const ai = createAIClient();
  if (!navigator.onLine || !ai) throw new Error("OFFLINE_MODE");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw new Error("AI_ERROR");
  }
};

// --- AUDIO TRANSCRIPTION ---
export const transcribeAudio = async (base64Audio: string): Promise<string> => {
    const ai = createAIClient();
    if (!navigator.onLine || !ai) throw new Error("OFFLINE_MODE");

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'audio/mp3', data: base64Audio } },
                    { text: "Transcribe this audio strictly verbatim." }
                ]
            }
        });
        return response.text || "Transcription failed";
    } catch (error) {
        console.error("Transcription Error:", error);
        throw new Error("AI_ERROR");
    }
}

// --- CHATBOT ---
export const chatWithYann = async (message: string, history: any[]): Promise<string> => {
    const ai = createAIClient();
    if (!navigator.onLine || !ai) throw new Error("OFFLINE_MODE");

    try {
        const chat = ai.chats.create({
            model: 'gemini-3-pro-preview',
            history: history,
            config: {
                systemInstruction: "Tu es Yann, un consultant expert et bienveillant. Réponds aux questions des étudiants et PME.",
            }
        });
        
        const result = await chat.sendMessage({ message });
        return result.text || "...";
    } catch (error) {
        throw new Error("AI_ERROR");
    }
}