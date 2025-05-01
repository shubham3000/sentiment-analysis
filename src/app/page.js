"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeSentiment = async () => {
    setLoading(true);
    const res = await fetch("/api/sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResponse(data.result || "No response");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Patient Sentiment Analysis
        </h1>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          placeholder="Write a patient's statement..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={analyzeSentiment}
          disabled={loading}
          className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {response && (
          <div className="mt-6 p-4 bg-gray-100 border rounded-md">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
