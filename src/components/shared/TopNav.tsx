'use client';

import { Bell, Calendar } from 'lucide-react';
import { logout } from '@/app/(auth)/actions';

export default function TopNav() {
  const currentMonth = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });

  return (
    <header className="h-[88px] bg-[#FAFBFB] flex items-center justify-between px-8 z-10 w-full">
      
      {/* Left side: Greeting */}
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          Welcome back, Admin <span className="ml-2 text-xl">👋</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with salary slip automation today.
        </p>
      </div>

      {/* Right side: Tools & Profile */}
      <div className="flex items-center space-x-6">
        
        {/* Date Picker Button */}
        <button className="flex items-center bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          {currentMonth}
          <Calendar className="w-4 h-4 ml-3 text-gray-500" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1.5 w-4 h-4 bg-[#EB0A1E] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#FAFBFB]">
            3
          </span>
        </button>

        <div className="h-8 w-px bg-gray-200"></div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => logout()}>
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            AD
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-gray-900 group-hover:text-[#EB0A1E] transition-colors">Admin User</span>
            <span className="text-xs text-gray-500">Super Admin</span>
          </div>
        </div>

      </div>
    </header>
  );
}
