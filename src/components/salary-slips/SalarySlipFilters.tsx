import { Search, FilterX } from 'lucide-react';

export interface FilterState {
  month: string;
  year: string;
  search: string;
  pdfStatus: string;
  emailStatus: string;
}

interface SalarySlipFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClear: () => void;
}

export default function SalarySlipFilters({ filters, setFilters, onClear }: SalarySlipFiltersProps) {
  const months = [
    { value: 'All', label: 'All Months' },
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  const years = ['All', '2026', '2025', '2024'];
  const pdfStatuses = ['All', 'Generated', 'Pending', 'Failed'];
  const emailStatuses = ['All', 'Sent', 'Pending', 'Failed'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
        
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Month</label>
          <select 
            value={filters.month}
            onChange={e => setFilters(prev => ({...prev, month: e.target.value}))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
          >
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Year</label>
          <select 
            value={filters.year}
            onChange={e => setFilters(prev => ({...prev, year: e.target.value}))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
          >
            {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Search Employee</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID or name..."
              value={filters.search}
              onChange={e => setFilters(prev => ({...prev, search: e.target.value}))}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Generation Status</label>
          <select 
            value={filters.pdfStatus}
            onChange={e => setFilters(prev => ({...prev, pdfStatus: e.target.value}))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
          >
            {pdfStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Status</label>
          <select 
            value={filters.emailStatus}
            onChange={e => setFilters(prev => ({...prev, emailStatus: e.target.value}))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
          >
            {emailStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="lg:col-span-6 flex justify-end">
          <button 
            onClick={onClear}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-[#EB0A1E] transition-colors"
          >
            <FilterX className="w-4 h-4 mr-1.5" />
            Clear Filters
          </button>
        </div>

      </div>
    </div>
  );
}
