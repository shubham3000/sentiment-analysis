import { NextResponse } from "next/server";

export async function POST(req) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo", // ✅ use a valid model
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that performs sentiment analysis and gives empathetic suggestions to patients based on what they write.",
          },
          {
            role: "user",
            content: `Analyze this patient's statement and return:
1. Sentiment: Positive, Neutral, or Negative
2. Suggestion: one helpful, short sentence.

Statement: "${text}"`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("OpenAI reply error:", data);
      return NextResponse.json({ error: "Empty reply from OpenAI" }, { status: 500 });
    }

    return NextResponse.json({ result: reply });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "OpenAI request failed" }, { status: 500 });
  }
}
