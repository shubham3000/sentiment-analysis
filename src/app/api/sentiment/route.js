export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { text } = req.body;

  try {
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
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
      }
    );

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content;

    return res.status(200).json({ result: reply });
  } catch (err) {
    return res.status(500).json({ error: "OpenAI request failed" });
  }
}
