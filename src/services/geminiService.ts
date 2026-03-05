import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface Tweet {
  id: string;
  author: string;
  handle: string;
  content: string;
  timestamp: string;
  country: string;
  countryCode: string;
}

export async function fetchLiveTweets(country: string, lang: string = 'ar'): Promise<Tweet[]> {
  try {
    const prompt = `Generate 5 extremely recent, realistic "tweets" about current events in ${country}. 
    The tweets should feel like they are from a live news feed. 
    Include a mix of news, local updates, and trending topics.
    Language: ${lang === 'ar' ? 'Arabic' : 'English'}.
    Return the data in a structured JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              author: { type: Type.STRING },
              handle: { type: Type.STRING },
              content: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              country: { type: Type.STRING },
              countryCode: { type: Type.STRING }
            },
            required: ["id", "author", "handle", "content", "timestamp", "country", "countryCode"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching live tweets:", error);
    return [];
  }
}
