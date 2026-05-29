import React, { useMemo } from 'react';
import { Search, FilterX } from 'lucide-react';
import { SalaryRecordDB } from '@/lib/schemas/salary.schema';

export interface SalaryFilterState {
  search: string;
  month: string;
  year: string;
}

interface SalaryRecordFiltersProps {
  filters: SalaryFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SalaryFilterState>>;
  onClear: () => void;
  data: SalaryRecordDB[];
}

const monthNames = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export default function SalaryRecordFilters({ filters, setFilters, onClear, data }: SalaryRecordFiltersProps) {
  
  // Extract unique years from the dataset dynamically
  const uniqueYears = useMemo(() => {
    const years = new Set(data.map(d => d.year).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a); // Descending order
  }, [data]);

  return (
    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <label className="block text-xs font-semibold text-gray-500 mb-1">Search Employee ID</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Employee ID..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#EB0A1E] focus:border-[#EB0A1E] sm:text-sm transition-colors"
          />
        </div>
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        
        <div className="flex-1 md:flex-none min-w-[140px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Month</label>
          <select
            value={filters.month}
            onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
            className="block w-full pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB0A1E] focus:border-[#EB0A1E] bg-white cursor-pointer"
          >
            <option value="All">All Months</option>
            {monthNames.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 md:flex-none min-w-[140px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Year</label>
          <select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            className="block w-full pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB0A1E] focus:border-[#EB0A1E] bg-white cursor-pointer"
          >
            <option value="All">All Years</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="pt-5">
          <button
            onClick={onClear}
            className="flex items-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 focus:outline-none transition-colors"
          >
            <FilterX className="h-4 w-4 mr-1.5" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
