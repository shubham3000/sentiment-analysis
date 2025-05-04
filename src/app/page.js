'use client';

import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [input, setInput] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
  
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
  
      const data = await res.json();
      setSentiment(data.sentiment);
      setSuggestion(data.suggestion);
    } catch (err) {
      console.error(err);
      setSentiment('error');
      setSuggestion('Something went wrong.');
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
