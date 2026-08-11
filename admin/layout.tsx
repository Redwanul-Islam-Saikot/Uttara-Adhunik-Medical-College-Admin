'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar-এ প্রয়োজনীয় Props পাস করা হয়েছে */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      /> 

      {/* মূল কন্টেন্ট সেকশন */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}