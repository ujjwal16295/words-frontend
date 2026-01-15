'use client';

import Navbar from '@/component/Navbar';
import { useState, useEffect, useRef } from 'react';

export default function AllWordsPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [speakingWord, setSpeakingWord] = useState(null);
  const [showDetailsOnly, setShowDetailsOnly] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasMore: false
  });

  const endRef = useRef(null);
  const topRef = useRef(null);

  useEffect(() => {
    fetchAllWords(1);
  }, []);

  const fetchAllWords = async (page) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(
        `https://words-backend-k8uu.onrender.com/api/vocabulary?page=${page}&limit=50`
      );
      const result = await response.json();

      if (page === 1) {
        setWords(result.data);
      } else {
        setWords(prevWords => [...prevWords, ...result.data]);
      }

      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching words:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    fetchAllWords(pagination.page + 1);
  };

  const scrollToEnd = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (word) => {
    if (!confirm(`Delete "${word}"?`)) return;

    try {
      const response = await fetch(
        `https://words-backend-k8uu.onrender.com/api/vocabulary/${word}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setWords(words.filter((w) => w.word !== word));
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1
        }));
      }
    } catch (error) {
      console.error('Error deleting word:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div ref={topRef} className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">All Words</h2>
          <p className="text-gray-600">
            Browse your complete vocabulary collection ({pagination.total} words)
          </p>
        </div>

        <div className="mb-6 flex gap-4 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-black flex-1 min-w-[200px] px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          />
          
          <button
            onClick={() => setShowDetailsOnly(!showDetailsOnly)}
            className={`px-6 py-3 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2 whitespace-nowrap ${
              showDetailsOnly
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showDetailsOnly ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              )}
              {showDetailsOnly ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              ) : null}
            </svg>
            {showDetailsOnly ? 'Words Only' : 'Show Details'}
          </button>

          <button
            onClick={scrollToEnd}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-sm font-medium flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Go to End
          </button>
        </div>

        {pagination.hasMore && !searchTerm && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {loadingMore ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                `Load More (${pagination.page} / ${pagination.totalPages})`
              )}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              showDetailsOnly 
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {filteredWords.map((item) => (
                <div
                  key={item.word}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 ${
                    showDetailsOnly ? 'p-4' : 'p-6'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      <h3 className={`font-bold text-indigo-600 capitalize ${
                        showDetailsOnly ? 'text-lg' : 'text-xl'
                      }`}>
                        {item.word}
                      </h3>
                      <button
                        onClick={() => speakWord(item.word)}
                        disabled={speakingWord === item.word}
                        className="p-1.5 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        title="Pronounce word"
                      >
                        {speakingWord === item.word ? (
                          <svg className="w-4 h-4 text-indigo-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.553 3.064A.75.75 0 0112 3.75v16.5a.75.75 0 01-1.255.555L5.46 16H2.75A1.75 1.75 0 011 14.25v-4.5C1 8.784 1.784 8 2.75 8h2.71l5.285-4.805a.75.75 0 01.808-.13zM10.5 5.445l-4.245 3.86a.75.75 0 01-.505.195h-3a.25.25 0 00-.25.25v4.5c0 .138.112.25.25.25h3a.75.75 0 01.505.195l4.245 3.86V5.445z"/>
                            <path d="M18.718 4.222a.75.75 0 011.06 0c4.296 4.296 4.296 11.26 0 15.556a.75.75 0 01-1.06-1.06 9.5 9.5 0 000-13.436.75.75 0 010-1.06z"/>
                            <path d="M16.243 7.757a.75.75 0 10-1.061 1.061 4.5 4.5 0 010 6.364.75.75 0 001.06 1.06 6 6 0 000-8.485z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.553 3.064A.75.75 0 0112 3.75v16.5a.75.75 0 01-1.255.555L5.46 16H2.75A1.75 1.75 0 011 14.25v-4.5C1 8.784 1.784 8 2.75 8h2.71l5.285-4.805a.75.75 0 01.808-.13zM10.5 5.445l-4.245 3.86a.75.75 0 01-.505.195h-3a.25.25 0 00-.25.25v4.5c0 .138.112.25.25.25h3a.75.75 0 01.505.195l4.245 3.86V5.445z"/>
                            <path d="M18.718 4.222a.75.75 0 011.06 0c4.296 4.296 4.296 11.26 0 15.556a.75.75 0 01-1.06-1.06 9.5 9.5 0 000-13.436.75.75 0 010-1.06z"/>
                            <path d="M16.243 7.757a.75.75 0 10-1.061 1.061 4.5 4.5 0 010 6.364.75.75 0 001.06 1.06 6 6 0 000-8.485z"/>
                          </svg>
                        )}
                      </button>
                      {!showDetailsOnly && item.group_name && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                          {item.group_name}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(item.word)}
                      className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {!showDetailsOnly && (
                    <>
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
                                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                              >
                                {syn}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && filteredWords.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No words found matching your search' : 'No words yet. Start adding some!'}
            </p>
          </div>
        )}

        <div ref={endRef} className="h-1"></div>

        {!loading && filteredWords.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={scrollToTop}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-sm font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Go to Top
            </button>
          </div>
        )}
      </div>
    </div>
  );
}