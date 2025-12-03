// app/groups/page.jsx
'use client';

import Navbar from '@/component/Navbar';
import { useState, useEffect } from 'react';

export default function GroupsPage() {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      
      // Check session storage first
      const cachedData = sessionStorage.getItem('vocabularyGroups');
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setGroups(parsedData);
        setExpandedGroups(new Set(Object.keys(parsedData)));
        setLoading(false);
        return;
      }

      // If no cache, fetch from API
      const response = await fetch('https://words-backend-zkxe.onrender.com/api/vocabulary/groups');
      const data = await response.json();
      
      // Save to session storage
      sessionStorage.setItem('vocabularyGroups', JSON.stringify(data));
      
      setGroups(data);
      setExpandedGroups(new Set(Object.keys(data)));
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const filteredGroups = Object.entries(groups).filter(([groupName, words]) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      groupName.toLowerCase().includes(searchLower) ||
      words.some(w => w.word.toLowerCase().includes(searchLower))
    );
  });

  const totalGroups = Object.keys(groups).length;
  const totalWords = Object.values(groups).reduce((sum, words) => sum + words.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Word Groups</h2>
          <p className="text-gray-600">
            Explore {totalWords} words organized into {totalGroups} meaningful groups
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Groups</p>
                <p className="text-2xl font-bold text-gray-900">{totalGroups}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-pink-100">
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-lg">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Words</p>
                <p className="text-2xl font-bold text-gray-900">{totalWords}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-indigo-100">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg per Group</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalGroups > 0 ? Math.round(totalWords / totalGroups) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search groups or words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-black w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Groups Display */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGroups.map(([groupName, words]) => {
              const isExpanded = expandedGroups.has(groupName);
              
              return (
                <div
                  key={groupName}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(groupName)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-gray-900 capitalize">
                          {groupName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {words.length} {words.length === 1 ? 'word' : 'words'}
                        </p>
                      </div>
                    </div>
                    
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Group Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {words.map((item) => (
                          <div
                            key={item.word}
                            className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors"
                          >
                            <h4 className="text-lg font-bold text-purple-700 capitalize mb-2">
                              {item.word}
                            </h4>
                            <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                              {item.meaning}
                            </p>
                            
                            {item.synonyms && item.synonyms.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {item.synonyms.map((syn, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-white text-purple-600 rounded-full text-xs font-medium"
                                  >
                                    {syn}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredGroups.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No groups found matching your search' : 'No word groups yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}