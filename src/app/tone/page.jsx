'use client';

import Navbar from '@/component/Navbar';
import { useState, useEffect } from 'react';

export default function TonesPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [speakingWord, setSpeakingWord] = useState(null);

  useEffect(() => {
    fetchTones();
  }, []);

  const fetchTones = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://words-backend-k8uu.onrender.com/api/vocabulary/tones'
      );
      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.error('Error fetching tones:', error);
    } finally {
      setLoading(false);
    }
  };

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
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

  const filteredWords = words.filter((w) =>
    w.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tones</h2>
          <p className="text-gray-600">
            Special collection of tone-related vocabulary ({words.length} words)
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search tones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-black w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWords.map((item) => (
                <div
                  key={item.word}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      <h3 className="text-xl font-bold text-purple-600 capitalize">
                        {item.word}
                      </h3>
                      <button
                        onClick={() => speakWord(item.word)}
                        disabled={speakingWord === item.word}
                        className="p-1.5 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        title="Pronounce word"
                      >
                        {speakingWord === item.word ? (
                          <svg className="w-4 h-4 text-purple-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.553 3.064A.75.75 0 0112 3.75v16.5a.75.75 0 01-1.255.555L5.46 16H2.75A1.75 1.75 0 011 14.25v-4.5C1 8.784 1.784 8 2.75 8h2.71l5.285-4.805a.75.75 0 01.808-.13zM10.5 5.445l-4.245 3.86a.75.75 0 01-.505.195h-3a.25.25 0 00-.25.25v4.5c0 .138.112.25.25.25h3a.75.75 0 01.505.195l4.245 3.86V5.445z"/>
                            <path d="M18.718 4.222a.75.75 0 011.06 0c4.296 4.296 4.296 11.26 0 15.556a.75.75 0 01-1.06-1.06 9.5 9.5 0 000-13.436.75.75 0 010-1.06z"/>
                            <path d="M16.243 7.757a.75.75 0 10-1.061 1.061 4.5 4.5 0 010 6.364.75.75 0 001.06 1.06 6 6 0 000-8.485z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.553 3.064A.75.75 0 0112 3.75v16.5a.75.75 0 01-1.255.555L5.46 16H2.75A1.75 1.75 0 011 14.25v-4.5C1 8.784 1.784 8 2.75 8h2.71l5.285-4.805a.75.75 0 01.808-.13zM10.5 5.445l-4.245 3.86a.75.75 0 01-.505.195h-3a.25.25 0 00-.25.25v4.5c0 .138.112.25.25.25h3a.75.75 0 01.505.195l4.245 3.86V5.445z"/>
                            <path d="M18.718 4.222a.75.75 0 011.06 0c4.296 4.296 4.296 11.26 0 15.556a.75.75 0 01-1.06-1.06 9.5 9.5 0 000-13.436.75.75 0 010-1.06z"/>
                            <path d="M16.243 7.757a.75.75 0 10-1.061 1.061 4.5 4.5 0 010 6.364.75.75 0 001.06 1.06 6 6 0 000-8.485z"/>
                          </svg>
                        )}
                      </button>
                      {item.group_name && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                          {item.group_name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {item.meaning}
                  </p>

                  {item.sentence && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border-l-4 border-amber-400">
                      <p className="text-xs font-semibold text-amber-700 uppercase mb-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z"/>
                          <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z"/>
                        </svg>
                        Example
                      </p>
                      <p className="text-gray-800 text-sm italic">
                        "{item.sentence}"
                      </p>
                    </div>
                  )}
                  
                  {item.synonyms && item.synonyms.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Synonyms
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.synonyms.map((syn, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                          >
                            {syn}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && filteredWords.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No words found matching your search' : 'No tones available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}