// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const { text } = await req.json();

//   try {
//     const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4.1",
//         messages: [
//           {
//             role: "developer",
//             content:
//               "You are a helpful assistant. Analyze the sentiment of a patient statement and provide a short suggestion.",
//           },
//           {
//             role: "user",
//             content: `Analyze the following patient statement: "${text}" and return:\nSentiment: <Positive/Neutral/Negative>\nSuggestion: <one short, empathetic sentence>.`,
//           },
//         ],
//         temperature: 0.7,
//       }),
//     });

//     const data = await openaiRes.json();
//     console.log("Raw OpenAI Response:", data);

//     if (!openaiRes.ok) {
//       return NextResponse.json({ error: data }, { status: openaiRes.status });
//     }

//     const message = data.choices?.[0]?.message?.content;

//     if (!message) {
//       return NextResponse.json({ error: "Empty message from OpenAI." }, { status: 500 });
//     }

//     return NextResponse.json({ result: message });
//   } catch (err) {
//     console.error("OpenAI fetch error:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const { input } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Analyze the following user's medical problem, determine the sentiment (positive, neutral, or negative), and suggest a helpful action or advice.
      Problem: "${input}"
      Format the output as JSON with two fields: sentiment and suggestion.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const match = text.match(/\{[\s\S]*?\}/);
    const json = match ? JSON.parse(match[0]) : {
      sentiment: "unknown",
      suggestion: "Unable to determine sentiment. Try rephrasing your message.",
    };

    return Response.json(json);
  } catch (error) {
    console.error("Gemini error:", error);
    return new Response(JSON.stringify({ error: "Failed to analyze sentiment." }), {
      status: 500,
    });
  }
}
