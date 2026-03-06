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
    const prompt = `Generate 3 extremely recent, realistic "tweets" about current events in ${country}. 
    The tweets should feel like they are from a live news feed. 
    Include a mix of news, local updates, and trending topics.
    Language: ${lang === 'ar' ? 'Arabic' : 'English'}.
    IMPORTANT: Ensure each tweet has a unique, random numeric ID string.
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
    if (!text) return getMockTweets(country, lang);
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Error fetching live tweets:", error);
    
    // Check for various error formats
    const isQuotaError = 
      error.message?.includes('429') || 
      error.message?.includes('RESOURCE_EXHAUSTED') ||
      error.status === 'RESOURCE_EXHAUSTED' ||
      error.error?.code === 429 ||
      error.error?.status === 'RESOURCE_EXHAUSTED';

    if (isQuotaError) {
      return getMockTweets(country, lang);
    }
    throw error;
  }
}

function getMockTweets(country: string, lang: string): Tweet[] {
  const isAr = lang === 'ar';
  return [
    {
      id: Math.random().toString(),
      author: isAr ? "نظام النبض" : "Pulse System",
      handle: "nabd_intel",
      content: isAr 
        ? `تحديث أمني: جاري مراقبة التطورات في ${country}. النظام يعمل في وضع الاستعداد بسبب ضغط البيانات.`
        : `Security Update: Monitoring developments in ${country}. System operating in standby mode due to data traffic.`,
      timestamp: isAr ? "الآن" : "Now",
      country: country,
      countryCode: "INTEL"
    },
    {
      id: Math.random().toString(),
      author: isAr ? "مراقب الأخبار" : "News Monitor",
      handle: "monitor_x",
      content: isAr
        ? `تقارير أولية عن نشاط اقتصادي متزايد في المنطقة. ننتظر التأكيد من المصادر الميدانية.`
        : `Initial reports of increased economic activity in the region. Awaiting field confirmation.`,
      timestamp: isAr ? "منذ دقيقة" : "1m ago",
      country: country,
      countryCode: "INTEL"
    }
  ];
}
