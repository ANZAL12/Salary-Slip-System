'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  HelpCircle
} from 'lucide-react';
import { sidebarNavigation } from '@/config/navigation';
import { SiToyota } from 'react-icons/si';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const menuGroups = sidebarNavigation;

  return (
    <div className="flex flex-col w-[260px] bg-[#16191D] h-full text-gray-300 shadow-xl overflow-hidden">
      {/* Brand Header */}
      <div className="flex flex-col items-center pt-5 pb-4 bg-[#16191D] border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <SiToyota className="w-[34px] h-[34px] text-gray-300" />
          <span className="text-[#EB0A1E] font-bold text-[26px] tracking-tight">TOYOTA</span>
        </div>
        <span className="text-white text-xs mt-1 tracking-wide text-gray-400">Nippon Toyota</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2.5 py-3 flex flex-col">
        {/* Main Dashboard Link */}
        <Link
          href="/dashboard"
          onClick={onClose}
          className={`flex items-center px-3 py-2 text-sm font-semibold rounded-md transition-colors mb-4 ${
            pathname === '/dashboard'
              ? 'bg-[#EB0A1E] text-white shadow-md' 
              : 'hover:bg-gray-800 hover:text-white'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 mr-3 flex-shrink-0 ${pathname === '/dashboard' ? 'text-white' : 'text-gray-400'}`} />
          Dashboard
        </Link>

        {/* Menu Groups */}
        <div className="space-y-3.5 flex-1">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h3 className="px-3 text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">
                {group.title}
              </h3>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive 
                          ? 'bg-gray-800 text-white' 
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Area */}
      <div className="p-2.5 bg-[#16191D] border-t border-gray-800">
        <div className="bg-[#1F2429] p-3 rounded-md border border-gray-700/50 flex items-start space-x-3 mb-3">
          <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-white leading-tight">Need Help?</p>
            <p className="text-[10px] text-gray-400 mt-1">Check documentation</p>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 leading-tight px-1 text-center">
          &copy; {new Date().getFullYear()} Nippon Toyota
        </div>
      </div>
    </div>
  );
}
