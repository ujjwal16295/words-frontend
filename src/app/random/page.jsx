'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/component/Navbar';

export default function RandomWordsPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomWords();
  }, []);

  const fetchRandomWords = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://words-backend-zkxe.onrender.com/api/vocabulary/random');
      const data = await response.json();
      setWords(data);
      console.log(data)
    } catch (error) {
      console.error('Error fetching random words:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Random 10 Words</h2>
          <p className="text-gray-600 mb-6">Practice with a random selection</p>
          
          <button
            onClick={fetchRandomWords}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : '🎲 Get New Random Words'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {words.map((item, index) => (
              <div
                key={item.word}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-purple-600 capitalize mb-2">
                      {item.word}
                    </h3>
                    
                    <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                      {item.meaning}
                    </p>
                    
                    {item.synonyms && item.synonyms.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Synonyms
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.synonyms.map((syn, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium"
                            >
                              {syn}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && words.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No words available. Add some words first!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}