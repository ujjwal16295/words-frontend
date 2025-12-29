// app/add/page.jsx
'use client';

import { useState } from 'react';
import Navbar from '@/component/Navbar';

export default function AddWordsPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setProgress({ current: 0, total: 0 });

    try {
      const words = JSON.parse(jsonInput);
      
      if (!Array.isArray(words)) {
        throw new Error('Input must be an array');
      }

      setProgress({ current: 0, total: words.length });

      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch('https://words-backend-k8uu.onrender.com/api/vocabulary/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ words, offset }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to add words');
        }

        setProgress({ current: result.totalProcessed, total: result.totalWords });
        hasMore = result.hasMore;
        offset = result.nextOffset;

        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      setStatus({ type: 'success', message: `Successfully added ${words.length} words!` });
      setJsonInput('');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const exampleData = `[
  {
    "word": "eloquent",
    "meaning": "fluent or persuasive in speaking or writing",
    "synonyms": ["articulate", "fluent", "persuasive"]
  },
  {
    "word": "ephemeral",
    "meaning": "lasting for a very short time",
    "synonyms": ["transient", "fleeting", "temporary"]
  }
]`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Add Words</h2>
          <p className="text-gray-600">Add multiple words to your vocabulary in JSON format</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Expected Format</h3>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm border border-gray-200">
            <code className="text-gray-800">{exampleData}</code>
          </pre>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <label className="block mb-3">
            <span className="text-gray-700 font-medium">JSON Input</span>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your JSON array here..."
              rows={12}
              className="text-black mt-2 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition font-mono text-sm"
              disabled={loading}
              required
            />
          </label>

          {loading && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Uploading words...</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-teal-500 h-2 transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {status && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !jsonInput.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Words...' : 'Add Words to Database'}
          </button>
        </form>
      </div>
    </div>
  );
}