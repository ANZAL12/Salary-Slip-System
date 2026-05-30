'use client';

import { useState } from 'react';
import { Calendar, Menu, LogOut, AlertTriangle } from 'lucide-react';
import { logout } from '@/app/(auth)/actions';

export default function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const currentMonth = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <header className="h-[88px] bg-[#FAFBFB] flex items-center justify-between px-4 md:px-8 z-10 w-full">
      
      {/* Left side: Greeting & Mobile Menu */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
            Welcome back <span className="hidden md:inline">, Admin</span> <span className="ml-2 text-xl">👋</span>
          </h1>
          <p className="hidden md:block text-sm text-gray-500 mt-1">
            Here&apos;s what&apos;s happening with salary slip automation today.
          </p>
        </div>
      </div>

      {/* Right side: Tools & Profile */}
      <div className="flex items-center space-x-6">
        
        {/* Date Picker Button (Hidden on very small screens) */}
        <button className="hidden sm:flex items-center bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          {currentMonth}
          <Calendar className="w-4 h-4 ml-3 text-gray-500" />
        </button>


        <div className="h-8 w-px bg-gray-200"></div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            AD
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-gray-900 transition-colors">Admin User</span>
            <span className="text-xs text-gray-500">Super Admin</span>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200"></div>

        {/* Logout Button */}
        <button 
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-[#EB0A1E] hover:bg-red-50 transition-colors focus:outline-none"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>

        {showLogoutModal && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-[#EB0A1E]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
                <p className="text-sm text-gray-500">Are you sure you want to log out of the Toyota Salary Slip System?</p>
              </div>
              <div className="bg-gray-50 p-4 flex gap-3">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => logout()}
                  className="flex-1 px-4 py-2 bg-[#EB0A1E] shadow-sm rounded-lg text-sm font-bold text-white hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
