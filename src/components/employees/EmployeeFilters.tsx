import React, { useMemo } from 'react';
import { Search, FilterX } from 'lucide-react';
import { EmployeeRecord } from '@/lib/schemas/employee.schema';

export interface EmployeeFilterState {
  search: string;
  designation: string;
  status: string;
}

interface EmployeeFiltersProps {
  filters: EmployeeFilterState;
  setFilters: React.Dispatch<React.SetStateAction<EmployeeFilterState>>;
  onClear: () => void;
  data: EmployeeRecord[];
}

export default function EmployeeFilters({ filters, setFilters, onClear, data }: EmployeeFiltersProps) {
  const designations = useMemo(() => {
    const desigs = new Set(data.map(d => d.designation).filter(Boolean));
    return Array.from(desigs).sort();
  }, [data]);

  return (
    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by ID, name, email..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#EB0A1E] focus:border-[#EB0A1E] sm:text-sm transition-colors"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="flex-1 md:flex-none min-w-[140px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Designation</label>
          <select
            value={filters.designation}
            onChange={(e) => setFilters(prev => ({ ...prev, designation: e.target.value }))}
            className="block w-full pl-3 pr-8 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB0A1E] focus:border-[#EB0A1E] bg-white cursor-pointer"
          >
            <option value="All">All Designations</option>
            {designations.map((desig: any) => (
              <option key={desig} value={desig}>{desig}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 md:flex-none min-w-[120px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="block w-full pl-3 pr-8 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB0A1E] focus:border-[#EB0A1E] bg-white cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="pt-5">
          <button
            onClick={onClear}
            className="flex items-center px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 focus:outline-none transition-colors h-[34px]"
          >
            <FilterX className="h-4 w-4 mr-1.5" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
