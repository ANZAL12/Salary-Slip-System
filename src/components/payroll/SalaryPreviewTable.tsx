'use client';

import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ValidatedSalaryRecord } from '@/services/payroll.service';

interface SalaryPreviewTableProps {
  data: ValidatedSalaryRecord[];
}

export default function SalaryPreviewTable({ data }: SalaryPreviewTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col mt-6">
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-base font-bold text-gray-900">Data Preview</h2>
          <p className="text-sm text-gray-500 mt-0.5">Review your data before saving to database</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <th className="px-6 py-3 font-semibold">Employee ID</th>
              <th className="px-6 py-3 font-semibold">Employee Name</th>
              <th className="px-6 py-3 font-semibold text-right">Base Salary (₹)</th>
              <th className="px-6 py-3 font-semibold text-right">HRA (₹)</th>
              <th className="px-6 py-3 font-semibold text-right">Allowances (₹)</th>
              <th className="px-6 py-3 font-semibold text-right">Deductions (₹)</th>
              <th className="px-6 py-3 font-semibold">Month</th>
              <th className="px-6 py-3 font-semibold">Year</th>
              <th className="px-6 py-3 font-semibold text-right text-blue-600">Net Salary (₹)</th>
              <th className="px-6 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <tr key={i} className={`border-b border-gray-50 hover:bg-gray-50/50 ${row.status === 'Invalid' ? 'bg-red-50/20' : ''}`}>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.employee_id}</td>
                  <td className="px-6 py-4">{row.employee_name}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(row.base_salary)}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(row.hra)}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(row.allowances)}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(row.deductions)}</td>
                  <td className="px-6 py-4">{row.month}</td>
                  <td className="px-6 py-4">{row.year}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-700">{formatCurrency(row.net_salary)}</td>
                  <td className="px-6 py-4">
                    {row.status === 'Valid' && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-md border border-green-100">Valid</span>
                    )}
                    {row.status === 'Invalid' && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-red-50 text-[#EB0A1E] rounded-md border border-red-100" title={row.errors?.join(', ')}>Invalid</span>
                    )}
                    {row.status === 'Duplicate' && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-orange-50 text-orange-600 rounded-md border border-orange-100" title={row.errors?.join(', ')}>Duplicate</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-gray-500 text-sm">
                  {data.length === 0 ? "No data uploaded yet." : "No matching records found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <p className="text-sm text-gray-500">
          Showing {Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredData.length, currentPage * itemsPerPage)} of {filteredData.length} records
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-1.5 text-sm font-medium bg-[#EB0A1E] text-white rounded-md">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
