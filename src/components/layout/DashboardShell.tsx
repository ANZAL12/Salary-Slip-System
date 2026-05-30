'use client';

import { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import TopNav from '@/components/shared/TopNav';

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FAFBFB] overflow-hidden font-sans text-gray-900">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex flex-col flex-1 w-0 overflow-hidden relative">
        <TopNav onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none px-4 sm:px-8 pb-12 pt-2">
          {children}
        </main>
      </div>
    </div>
  );
}
