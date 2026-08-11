'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import {
  Bell,
  Search,
  Settings,
  Menu,
  Layers,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SubSection {
  name: string;
  count: number;
}

interface SectionData {
  id: string;
  title: string;
  subsections: SubSection[];
}

interface StatsData {
  sections: SectionData[];
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [userEmail, setUserEmail] = useState<string>('Admin');
  const router = useRouter();

  const fetchDashboardStats = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/dashboard/stats', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const isAuthLocal = localStorage.getItem('isAuthenticated');
    const isAuthSession = sessionStorage.getItem('isAuthenticated');

    const storedEmail =
      localStorage.getItem('userEmail') ||
      sessionStorage.getItem('userEmail') ||
      'admin@uamc.edu.bd';

    setUserEmail(storedEmail);

    if (!isAuthLocal && !isAuthSession) {
      router.push('/');
    } else {
      setIsLoading(false);
      fetchDashboardStats();

      const interval = setInterval(() => {
        fetchDashboardStats();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [router, fetchDashboardStats]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalSections = stats?.sections?.length || 0;
  const totalSubsections =
    stats?.sections?.reduce(
      (acc, sec) => acc + (sec.subsections?.length || 0),
      0
    ) || 0;
  const totalAllItems =
    stats?.sections?.reduce(
      (acc, sec) =>
        acc + sec.subsections.reduce((subAcc, sub) => subAcc + sub.count, 0),
      0
    ) || 0;

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'A';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#008751] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-gray-600">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 w-full">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none"
              aria-label="Open Sidebar"
            >
              <Menu size={22} />
            </button>

            <div className="relative w-full max-w-sm">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search or type command..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#008751] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={fetchDashboardStats}
              title="Refresh Stats"
              className="p-2 text-gray-600 hover:text-[#008751] transition-colors rounded-full hover:bg-gray-100"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin text-[#008751]' : ''} />
            </button>

            <button className="relative p-2 text-gray-600 hover:text-[#008751] transition-colors rounded-full hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="p-2 text-gray-600 hover:text-[#008751] transition-colors rounded-full hover:bg-gray-100">
              <Settings size={20} />
            </button>

            <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

            {/* User Dynamic Profile */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#3b1219] text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                {userInitial}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-gray-800 leading-tight max-w-[200px] truncate" title={userEmail}>
                  {userEmail}
                </span>
                <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Banner */}
          <div className="bg-gradient-to-r from-[#008751] to-emerald-700 rounded-xl p-6 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Welcome Back, Admin!</h1>
              <p className="text-emerald-100 text-xs sm:text-sm mt-1">
                Manage all college content, admission procedures, notices, and faculty portals easily.
              </p>
            </div>
            <button className="px-4 py-2 bg-[#FFC107] text-black font-semibold text-xs rounded-lg hover:bg-amber-400 transition-all shadow-sm">
              + Add New Notice
            </button>
          </div>

          {/* Section & Sub-section Breakdown Grid */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800">All Project Sections & Sub-sections</h2>
                <p className="text-xs text-gray-500">Detailed item count across each page segment</p>
              </div>

              {/* Live Monitoring Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs">
                  <span className="text-gray-600 font-medium">Sections: <strong className="text-gray-900">{totalSections}</strong></span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-600 font-medium">Subsections: <strong className="text-gray-900">{totalSubsections}</strong></span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-600 font-medium">Total Items: <strong className="text-[#008751] font-bold">{totalAllItems}</strong></span>
                </div>

                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-emerald-50 text-[#008751] rounded-full border border-emerald-200">
                  <span className="w-2 h-2 bg-[#008751] rounded-full animate-ping"></span>
                  Live Monitoring
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {stats?.sections?.map((sec) => {
                const totalInSec = sec.subsections.reduce((acc, curr) => acc + curr.count, 0);
                const isExpanded = expandedSections[sec.id];

                return (
                  <div
                    key={sec.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-100/70 text-[#008751] rounded-lg">
                          <Layers size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-800">{sec.title}</h3>
                          <p className="text-[11px] text-gray-500 font-medium">
                            {sec.subsections.length} Sub-categories
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold bg-[#008751] text-white px-2.5 py-1 rounded-full">
                        {totalInSec} items
                      </span>
                    </div>

                    {/* Sub-sections Item List */}
                    <div className="p-4 space-y-2">
                      {sec.subsections.slice(0, isExpanded ? sec.subsections.length : 4).map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-gray-50 hover:bg-emerald-50/50 transition-colors"
                        >
                          <span className="text-gray-700 font-medium truncate pr-2">{sub.name}</span>
                          <span className="font-semibold text-gray-900 bg-white border border-gray-200 px-2 py-0.5 rounded-md text-[11px]">
                            {sub.count}
                          </span>
                        </div>
                      ))}

                      {/* Expand/Collapse Trigger Button */}
                      {sec.subsections.length > 4 && (
                        <button
                          onClick={() => toggleSection(sec.id)}
                          className="w-full mt-2 pt-2 border-t border-dashed border-gray-200 text-center text-[11px] font-bold text-[#008751] hover:underline flex items-center justify-center gap-1"
                        >
                          {isExpanded ? (
                            <>
                              Show Less <ChevronUp size={14} />
                            </>
                          ) : (
                            <>
                              +{sec.subsections.length - 4} More Subsections <ChevronDown size={14} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}