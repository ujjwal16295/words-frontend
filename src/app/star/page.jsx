'use client';

import Navbar from '@/component/Navbar';
import { useState, useEffect, useRef } from 'react';
import { WordCard } from '../page';

const API_BASE = 'https://words-backend-k8uu.onrender.com';

export default function StarredWordsPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [speakingWord, setSpeakingWord] = useState(null);
  const [showDetailsOnly, setShowDetailsOnly] = useState(false);
  const [jumpToPage, setJumpToPage] = useState('');
  const [togglingStars, setTogglingStars] = useState(new Set());
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  const endRef = useRef(null);
  const topRef = useRef(null);

  useEffect(() => {
    fetchStarredWords(1);
  }, []);

  const fetchStarredWords = async (page) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(
        `${API_BASE}/api/vocabulary/starred?page=${page}&limit=50`
      );
      const result = await response.json();

      if (page === 1) setWords(result.data);
      else setWords((prev) => [...prev, ...result.data]);

      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching starred words:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => fetchStarredWords(pagination.page + 1);

  const handleJumpToPage = async () => {
    const pageNum = parseInt(jumpToPage);
    if (!pageNum || pageNum < 1) {
      alert('Please enter a valid page number (minimum 1)');
      return;
    }
    if (pageNum > pagination.totalPages) {
      alert(`Page ${pageNum} doesn't exist. Maximum page is ${pagination.totalPages}`);
      return;
    }
    try {
      setLoading(true);
      scrollToTop();
      const response = await fetch(
        `${API_BASE}/api/vocabulary/starred?page=${pageNum}&limit=50`
      );
      const result = await response.json();
      setWords(result.data);
      setPagination(result.pagination);
      setJumpToPage('');
    } catch (error) {
      console.error('Error jumping to page:', error);
      alert('Error loading page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJumpInputKeyPress = (e) => {
    if (e.key === 'Enter') handleJumpToPage();
  };

  const scrollToEnd = () => endRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleDelete = async (word) => {
    if (!confirm(`Delete "${word}"?`)) return;
    try {
      const response = await fetch(`${API_BASE}/api/vocabulary/${word}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setWords((prev) => prev.filter((w) => w.word !== word));
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  // Unstarring a word removes it from this page
  const handleToggleStar = async (word, currentStarred) => {
    setTogglingStars((prev) => new Set(prev).add(word));
    try {
      const response = await fetch(`${API_BASE}/api/vocabulary/${word}/star`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_starred: !currentStarred }),
      });
      if (response.ok) {
        // Remove from starred list if unstarred
        if (currentStarred) {
          setWords((prev) => prev.filter((w) => w.word !== word));
          setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
        }
      }
    } catch (error) {
      console.error('Error toggling star:', error);
    } finally {
      setTogglingStars((prev) => {
        const next = new Set(prev);
        next.delete(word);
        return next;
      });
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
      utterance.onend = () => setSpeakingWord(null);
      utterance.onerror = () => setSpeakingWord(null);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };

  const filteredWords = words.filter((w) =>
    w.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div ref={topRef} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900">Starred Words</h2>
          </div>
          <p className="text-gray-600">
            Your saved favourites — {pagination.total} starred word{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="mb-6 flex gap-4 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search starred words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-black flex-1 min-w-[200px] px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
          />

          <button
            onClick={() => setShowDetailsOnly(!showDetailsOnly)}
            className={`px-6 py-3 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2 whitespace-nowrap ${
              showDetailsOnly
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {showDetailsOnly ? 'Words Only' : 'Show Details'}
          </button>

          <button
            onClick={scrollToEnd}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all shadow-sm font-medium flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Go to End
          </button>
        </div>

        {/* Jump to Page */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Jump to Page:
            </label>
            <input
              type="number"
              min="1"
              max={pagination.totalPages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              onKeyPress={handleJumpInputKeyPress}
              placeholder={`1 - ${pagination.totalPages}`}
              className="text-black w-32 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
            />
            <button
              onClick={handleJumpToPage}
              disabled={!jumpToPage}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Go
            </button>
            <span className="text-sm text-gray-600">
              Currently on page{' '}
              <span className="font-semibold text-amber-500">{pagination.page}</span> of{' '}
              <span className="font-semibold">{pagination.totalPages || 1}</span>
            </span>
          </div>
        </div>

        {pagination.hasMore && !searchTerm && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:bg-amber-300 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {loadingMore ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredWords.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No starred words match your search' : 'No starred words yet. Star some words to see them here!'}
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              showDetailsOnly
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredWords.map((item) => (
              <WordCard
                key={item.word}
                item={item}
                showDetailsOnly={showDetailsOnly}
                speakingWord={speakingWord}
                togglingStars={togglingStars}
                onSpeak={speakWord}
                onDelete={handleDelete}
                onToggleStar={handleToggleStar}
              />
            ))}
          </div>
        )}

        <div ref={endRef} className="h-1" />

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