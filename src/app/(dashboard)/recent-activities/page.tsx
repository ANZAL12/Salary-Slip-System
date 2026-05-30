'use client';

import React, { useEffect, useState } from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle, Send, UploadCloud, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllActivities } from '@/services/activity.service';

export default function RecentActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function loadData() {
      const result = await getAllActivities();
      if (result.success && result.data) {
        setActivities(result.data);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#EB0A1E]" />
      </div>
    );
  }

  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
  const currentActivities = activities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="border-b border-gray-100 pb-5 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Recent Activities</h1>
          <p className="text-sm text-gray-500 mt-1">Full history of system activities, payroll uploads, and email dispatches.</p>
        </div>

        <div className="space-y-0 divide-y divide-gray-100">
          {activities.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-12">No recent activities found.</p>
          )}
          {currentActivities.map((act, i) => {
            let Icon = Info;
            let colors = 'text-gray-500 bg-gray-50';
            if (act.type === 'success') { Icon = CheckCircle; colors = 'text-green-500 bg-green-50'; }
            if (act.type === 'warning') { Icon = AlertTriangle; colors = 'text-orange-500 bg-orange-50'; }
            if (act.type === 'error') { Icon = XCircle; colors = 'text-red-500 bg-red-50'; }
            if (act.title.toLowerCase().includes('email')) { Icon = Send; colors = 'text-blue-500 bg-blue-50'; }
            if (act.title.toLowerCase().includes('upload')) { Icon = UploadCloud; colors = 'text-purple-500 bg-purple-50'; }

            return (
              <div key={act.id || i} className="flex items-start py-4 sm:py-5 hover:bg-gray-50/50 transition-colors px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.split(' ')[1]} shrink-0 mt-0.5`}>
                  <Icon className={`w-5 h-5 ${colors.split(' ')[0]}`} />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                    <p className="text-sm font-bold text-gray-900">{act.title}</p>
                    <span className="text-xs font-medium text-gray-400 shrink-0 mt-0.5">
                      {new Date(act.time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{act.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-6 mt-6 gap-4 sm:gap-0">
            <span className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, activities.length)}</span> of <span className="font-medium text-gray-900">{activities.length}</span> activities
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
