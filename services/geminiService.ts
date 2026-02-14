
import { GoogleGenAI, Type } from "@google/genai";
import { localProcess } from "./localAiService";

let forceOffline = false;

export const setForceOffline = (status: boolean) => {
    forceOffline = status;
};

export const isAppOffline = () => {
    return forceOffline || !navigator.onLine;
};

const getApiKey = () => {
  try {
    return process.env.API_KEY;
  } catch (e) {
    return null;
  }
};

/**
 * Creates a fresh AI client instance
 */
const createAIClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

/**
 * Smart Orchestrator: Tries Online then Fallback to Local
 */
const orchestrateAI = async (
    onlineCall: (ai: GoogleGenAI) => Promise<any>, 
    localTask: string, 
    input: string
): Promise<{text: string, sources?: any[]}> => {
    if (isAppOffline()) {
        const localResult = await localProcess(input, localTask);
        return { text: localResult };
    }

    try {
        const ai = createAIClient();
        if (!ai) throw new Error("No API Key");
        
        const response = await onlineCall(ai);
        return { 
            text: response.text || "Erreur de réponse.", 
            sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
        };
    } catch (error: any) {
        console.warn(`Online AI failed for ${localTask}, falling back to local...`, error);
        
        // Handle specific "Requested entity was not found" error by resetting key state
        if (error?.message?.includes("Requested entity was not found")) {
            console.error("API Key project invalid or not found.");
        }

        const localResult = await localProcess(input, localTask);
        return { text: `[MODE HORS LIGNE / GRATUIT] \n\n${localResult}` };
    }
};

// --- DAO / TENDER ANALYSIS ---
export const analyzeTender = async (tenderText: string) => {
    return orchestrateAI(
        async (ai) => {
            return ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `En tant qu'expert en marchés publics au Cameroun (Code des Marchés Publics), analyse ce DAO.
                STRUCTURE REQUISE :
                1. **📋 Pièces Administratives (Checklist)** : Liste à puces des documents.
                2. **⚠️ Points de Vigilance** : Pénalités, délais, critères éliminatoires.
                3. **💡 Stratégie Gagnante** : Comment se différencier.
                
                Texte : ${tenderText}`,
            });
        },
        'DAO',
        tenderText
    );
};

// --- PITCH DECK PRO ---
export const generatePitchDeck = async (notes: string) => {
    return orchestrateAI(
        async (ai) => {
            return ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `Transforme ces notes en Pitch Deck Pro (10 slides) pour investisseurs. 
                Notes : ${notes}`,
            });
        },
        'PITCH',
        notes
    );
};

// --- PODCAST EXPRESS ---
export const generatePodcastScript = async (sourceText: string, type: string) => {
    return orchestrateAI(
        async (ai) => {
            return ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Script podcast (15 min) étudiant. Résume : ${sourceText}. Ton: ${type === 'TUTOR' ? 'Enseignant' : 'Étudiant'}.`,
            });
        },
        'PODCAST',
        sourceText
    );
};

// --- GENERAL ANALYSIS ---
export const deepThinkingAnalysis = async (input: string, context: string, learningStyle?: string) => {
    return orchestrateAI(
        async (ai) => {
            return ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `Contexte: ${context}. Question: ${input}. Style: ${learningStyle}. Markdown clair.`,
            });
        },
        'SUMMARY',
        input
    );
};

// --- IMAGE GEN (ROBUST SIMULATION) ---
export const generateMarketingAsset = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string> => {
  const mockImages = [
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535378437327-10f5af706020?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2008&auto=format&fit=crop"
  ];
  const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];

  if (isAppOffline()) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return randomImage; 
  }

  try {
      const ai = createAIClient();
      if (!ai) throw new Error("No API Key");

      const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: { parts: [{ text: prompt }] },
          config: { imageConfig: { imageSize: size, aspectRatio: "1:1" } }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      throw new Error("No image data in response");
  } catch (e) {
      console.warn("Image API failed, using fallback:", e);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return randomImage;
  }
};

// --- IMAGE EDITING (ROBUST SIMULATION) ---
export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
    if (isAppOffline()) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return base64Image;
    }

    try {
        const ai = createAIClient();
        if (!ai) throw new Error("No API Key");

        const base64Data = base64Image.split(',')[1] || base64Image;
        const mimeMatch = base64Image.match(/^data:(.*);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType: mimeType } },
                    { text: prompt }
                ]
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
             if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        throw new Error("No edited image returned");
    } catch (e) {
        console.warn("Edit API failed, using fallback", e);
        return base64Image;
    }
};

// --- VIDEO GENERATION (ROBUST SIMULATION) ---
export const generateVideoFromImage = async (base64Image: string, prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string> => {
    const mockVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
    
    if (isAppOffline()) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return mockVideo;
    }

    try {
        const ai = createAIClient();
        if (!ai) throw new Error("No API Key");

        // Check for Veo API key selection if available on window
        if ((window as any).aistudio && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            if (!hasKey && typeof (window as any).aistudio.openSelectKey === 'function') {
                await (window as any).aistudio.openSelectKey();
            }
        }

        const base64Data = base64Image.split(',')[1] || base64Image;
        const mimeMatch = base64Image.match(/^data:(.*);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            image: { imageBytes: base64Data, mimeType: mimeType },
            prompt: prompt || "Animate this",
            config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) throw new Error("No video URI");

        const apiKey = getApiKey();
        const videoResponse = await fetch(`${downloadLink}&key=${apiKey}`);
        if (!videoResponse.ok) throw new Error("Video fetch failed");
        
        const videoBlob = await videoResponse.blob();
        return URL.createObjectURL(videoBlob);
    } catch (e) {
        console.warn("Video API failed, using fallback:", e);
        return mockVideo;
    }
};

// --- BRAIN AGENT ---
export const brainAgent = async (context: string, query: string, history: any[], useFastMode: boolean) => {
    return orchestrateAI(
        async (ai) => {
            const chat = ai.chats.create({
                model: useFastMode ? 'gemini-3-flash-preview' : 'gemini-3-pro-preview',
                history: history,
                config: { systemInstruction: `Context:\n${context}\nAnswer based on this.` }
            });
            return chat.sendMessage({ message: query });
        },
        'CHAT',
        query
    );
};

// --- CHATBOT ---
export const chatWithYann = async (message: string, history: any[]): Promise<string> => {
    const res = await orchestrateAI(
        async (ai) => {
            const chat = ai.chats.create({
                model: 'gemini-3-pro-preview',
                history: history,
                config: { systemInstruction: "Tu es Yann, le Lion de la Clarté. Expert Camerounais." }
            });
            return chat.sendMessage({ message });
        },
        'CHAT',
        message
    );
    return res.text;
};

// --- PERSISTENCE ---
export const saveToHistory = (key: string, item: any) => {
    try {
        const history = JSON.parse(localStorage.getItem(key) || '[]');
        const newItem = { ...item, id: Date.now(), timestamp: new Date().toISOString() };
        history.unshift(newItem);
        localStorage.setItem(key, JSON.stringify(history.slice(0, 20))); // Limit to 20
        return newItem;
    } catch (e) {
        console.error("Storage error", e);
        return item;
    }
};

export const getHistory = (key: string) => {
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
        return [];
    }
};
