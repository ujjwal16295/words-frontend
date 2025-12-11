'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/component/Navbar';

export default function RandomWordsPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speakingWord, setSpeakingWord] = useState(null);

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

  const speakWord = (word) => {
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Set speaking state
      setSpeakingWord(word);
      
      utterance.onend = () => {
        setSpeakingWord(null);
      };
      
      utterance.onerror = () => {
        setSpeakingWord(null);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
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
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-purple-600 capitalize">
                        {item.word}
                      </h3>
                      
                      <button
                        onClick={() => speakWord(item.word)}
                        disabled={speakingWord === item.word}
                        className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Pronounce word"
                      >
                        {speakingWord === item.word ? (
                          <svg className="w-5 h-5 text-purple-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.553 3.064A.75.75 0 0112 3.75v16.5a.75.75 0 01-1.255.555L5.46 16H2.75A1.75 1.75 0 011 14.25v-4.5C1 8.784 1.784 8 2.75 8h2.71l5.285-4.805a.75.75 0 01.808-.13zM10.5 5.445l-4.245 3.86a.75.75 0 01-.505.195h-3a.25.25 0 00-.25.25v4.5c0 .138.112.25.25.25h3a.75.75 0 01.505.195l4.245 3.86V5.445z"/>
                            <path d="M18.718 4.222a.75.75 0 011.06 0c4.296 4.296 4.296 11.26 0 15.556a.75.75 0 01-1.06-1.06 9.5 9.5 0 000-13.436.75.75 0 010-1.06z"/>
                            <path d="M16.243 7.757a.75.75 0 10-1.061 1.061 4.5 4.5 0 010 6.364.75.75 0 001.06 1.06 6 6 0 000-8.485z"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.553 3.064A.75.75 0 0112 3.75v16.5a.75.75 0 01-1.255.555L5.46 16H2.75A1.75 1.75 0 011 14.25v-4.5C1 8.784 1.784 8 2.75 8h2.71l5.285-4.805a.75.75 0 01.808-.13zM10.5 5.445l-4.245 3.86a.75.75 0 01-.505.195h-3a.25.25 0 00-.25.25v4.5c0 .138.112.25.25.25h3a.75.75 0 01.505.195l4.245 3.86V5.445z"/>
                            <path d="M18.718 4.222a.75.75 0 011.06 0c4.296 4.296 4.296 11.26 0 15.556a.75.75 0 01-1.06-1.06 9.5 9.5 0 000-13.436.75.75 0 010-1.06z"/>
                            <path d="M16.243 7.757a.75.75 0 10-1.061 1.061 4.5 4.5 0 010 6.364.75.75 0 001.06 1.06 6 6 0 000-8.485z"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    
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