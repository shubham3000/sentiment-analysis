'use client';

import { useState } from 'react';
import Head from 'next/head';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default function Home() {
  const [input, setInput] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);

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
        sentiment: 'unknown',
        suggestion: 'Unable to determine sentiment. Try rephrasing your message.',
      };

      setSentiment(json.sentiment);
      setSuggestion(json.suggestion);
    } catch (err) {
      console.error('Gemini Error:', err);
      setSentiment('error');
      setSuggestion('Something went wrong while analyzing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Medical Sentiment Analyzer</title>
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Medical Sentiment Analyzer</h1>
        <textarea
          rows="5"
          className="w-full max-w-lg p-4 border border-gray-300 rounded-md mb-4"
          placeholder="Describe your medical issue..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>

        {sentiment && (
          <div className="mt-6 bg-white p-4 rounded shadow-md w-full max-w-lg">
            <p><strong>Sentiment:</strong> {sentiment}</p>
            <p className="mt-2"><strong>Suggestion:</strong> {suggestion}</p>
          </div>
        )}
      </main>
    </>
  );
}
