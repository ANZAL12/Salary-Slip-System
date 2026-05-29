'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  HelpCircle
} from 'lucide-react';
import { sidebarNavigation } from '@/config/navigation';
import { SiToyota } from 'react-icons/si';

export default function Sidebar() {
  const pathname = usePathname();

  const menuGroups = sidebarNavigation;

  return (
    <div className="flex flex-col w-[260px] bg-[#16191D] h-full text-gray-300 shadow-xl overflow-hidden">
      {/* Brand Header */}
      <div className="flex flex-col items-center pt-4 pb-3 bg-[#16191D] border-b border-gray-800">
        <div className="flex items-center space-x-1.5">
          <SiToyota className="w-[26px] h-[26px] text-gray-300" />
          <span className="text-[#EB0A1E] font-bold text-[21px] tracking-tight">TOYOTA</span>
        </div>
        <span className="text-white text-[10px] mt-0.5">Nippon Toyota</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2.5 py-3 flex flex-col">
        {/* Main Dashboard Link */}
        <Link
          href="/dashboard"
          className={`flex items-center px-2.5 py-[7px] text-[12px] font-semibold rounded-md transition-colors mb-3 ${
            pathname === '/dashboard'
              ? 'bg-[#EB0A1E] text-white shadow-md' 
              : 'hover:bg-gray-800 hover:text-white'
          }`}
        >
          <LayoutDashboard className={`w-[17px] h-[17px] mr-2.5 flex-shrink-0 ${pathname === '/dashboard' ? 'text-white' : 'text-gray-400'}`} />
          Dashboard
        </Link>

        {/* Menu Groups */}
        <div className="space-y-3.5 flex-1">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h3 className="px-2.5 text-[9px] font-bold text-gray-500 tracking-wider mb-1.5 uppercase">
                {group.title}
              </h3>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-2.5 py-[7px] text-[12.5px] font-medium rounded-md transition-colors ${
                        isActive 
                          ? 'bg-gray-800 text-white' 
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-[17px] h-[17px] mr-2.5 flex-shrink-0" />
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
        <div className="bg-[#1F2429] p-2.5 rounded-md border border-gray-700/50 flex items-start space-x-2.5 mb-2.5">
          <HelpCircle className="w-[17px] h-[17px] text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-medium text-white leading-tight">Need Help?</p>
            <p className="text-[9px] text-gray-400 mt-1">Check documentation</p>
          </div>
        </div>
        
        <div className="text-[10px] text-gray-500 leading-tight px-1 text-center">
          &copy; {new Date().getFullYear()} Nippon Toyota
        </div>
      </div>
    </div>
  );
}
