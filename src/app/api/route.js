// For App Router: app/api/analyze/route.js
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  const { input } = await req.json();

  const prompt = `
    Analyze the following user's medical problem, determine the sentiment (positive, neutral, or negative), 
    and suggest a helpful action or advice.
    Problem: "${input}"
    Format the output as JSON with two fields: sentiment and suggestion.
  `;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.responseId.text();
    const match = text.match(/\{[\s\S]*?\}/);
    const json = match ? JSON.parse(match[0]) : {
      sentiment: "unknown",
      suggestion: "Unable to determine sentiment. Try rephrasing your message.",
    };
    
    return Response.json(json);
  } catch (err) {
    console.error("Gemini Error:", err);
    return Response.json({ sentiment: "error", suggestion: "Internal server error." }, { status: 500 });
  }
}
