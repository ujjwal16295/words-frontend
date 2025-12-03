// app/page.jsx
'use client';

import Navbar from '@/component/Navbar';
import { useState, useEffect } from 'react';

export default function AllWordsPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0,
    hasMore: false
  });

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
        `https://words-backend-zkxe.onrender.com/api/vocabulary?page=${page}&limit=30`
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

  const handleDelete = async (word) => {
    if (!confirm(`Delete "${word}"?`)) return;

    try {
      const response = await fetch(
        `https://words-backend-zkxe.onrender.com/api/vocabulary/${word}`,
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

  const filteredWords = words.filter((w) =>
    w.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">All Words</h2>
          <p className="text-gray-600">
            Browse your complete vocabulary collection ({pagination.total} words)
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-black w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
                    <h3 className="text-xl font-bold text-indigo-600 capitalize">
                      {item.word}
                    </h3>
                    <button
                      onClick={() => handleDelete(item.word)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
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
                            className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
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

            {/* Load More Button */}
            {pagination.hasMore && !searchTerm && (
              <div className="flex justify-center mt-8">
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
          </>
        )}

        {!loading && filteredWords.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No words found matching your search' : 'No words yet. Start adding some!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}