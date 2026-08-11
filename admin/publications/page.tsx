'use client';

import { useState, useEffect } from 'react';
import { Clock, ArrowLeft, Download, Search } from 'lucide-react';
import Link from 'next/link';

export default function PublicationPage() {
  const [pubList, setPubList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchPublications = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/publication');
        const json = await res.json();
        if (json?.success && Array.isArray(json.data)) {
          setPubList(json.data);
        }
      } catch (err) {
        console.error('Publication fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  // Filter Publications based on active category & search
  const filteredPubs = pubList.filter((item) => {
    const matchesCategory =
      activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleItemClick = (pdfUrl?: string) => {
    if (pdfUrl && pdfUrl.trim() !== '') {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8 lg:px-16 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header & Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#008751] hover:underline mb-2"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-[#008751]">
              Publications & Tenders
            </h1>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#008751]"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 bg-[#eaedf4] p-2 rounded-xl text-sm font-bold text-gray-700">
          {[
            { id: 'all', label: 'All Publications' },
            { id: 'Journal', label: 'Journal' },
            { id: 'Tenders', label: 'Tenders' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-[#008751] text-white shadow-md'
                  : 'hover:bg-white/60 text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Publications Items Grid/List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-bold text-lg bg-white rounded-xl shadow-xs">
              Loading publications...
            </div>
          ) : filteredPubs.length > 0 ? (
            filteredPubs.map((item, idx) => (
              <div
                key={item._id || idx}
                onClick={() => handleItemClick(item.pdfUrl)}
                className={`bg-white hover:shadow-md transition-all p-5 rounded-xl flex items-center gap-6 border border-gray-100 ${
                  item.pdfUrl ? 'cursor-pointer hover:border-[#008751]' : ''
                }`}
              >
                {/* Date Box */}
                <div className="flex flex-col items-center justify-center shrink-0 w-[80px] bg-[#eaedf4] p-3 rounded-lg">
                  <span className="text-3xl font-black text-gray-900 leading-none mb-1">
                    {item.day || '12'}
                  </span>
                  <span className="bg-[#008751] text-white text-xs font-bold px-2 py-0.5 rounded-xs">
                    {item.monthYear || 'Mar 25'}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <span className="inline-block text-xs font-bold text-[#008751] bg-[#008751]/10 px-2.5 py-1 rounded-md">
                    {item.category || 'Journal'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500">
                    <Clock size={16} />
                    <span>{item.time || '3:40 PM'}</span>
                  </div>
                </div>

                {/* Action Icon */}
                {item.pdfUrl && (
                  <div className="shrink-0 p-3 text-[#008751] bg-[#008751]/10 rounded-full">
                    <Download size={20} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500 font-bold text-lg bg-white rounded-xl">
              No publications found in this category.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}