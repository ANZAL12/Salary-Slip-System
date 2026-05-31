import React from 'react';
import { Eye, Edit2, Trash2, ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { SalaryRecordDB } from '@/lib/schemas/salary.schema';

interface SalaryRecordTableProps {
  data: SalaryRecordDB[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (record: SalaryRecordDB) => void;
  onEdit: (record: SalaryRecordDB) => void;
  onDelete: (record: SalaryRecordDB) => void;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export default function SalaryRecordTable({ 
  data, 
  currentPage, 
  totalPages, 
  onPageChange,
  onView,
  onEdit,
  onDelete
}: SalaryRecordTableProps) {
  
  const getVisiblePages = (current: number, total: number) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl py-16 text-center shadow-sm">
        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No salary records found</h3>
        <p className="text-gray-500 max-w-sm mx-auto text-sm">
          Upload salary data to view records.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-0 sm:p-4 overflow-x-auto bg-gray-50 md:bg-white">
        {/* Desktop Table */}
        <table className="hidden md:table min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Employee ID
              </th>
              <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Month
              </th>
              <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Base Salary
              </th>
              <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                HRA
              </th>
              <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Allowances
              </th>
              <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Deductions
              </th>
              <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Net Salary
              </th>
              <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-blue-600">{record.employees?.employee_id || 'Unknown'}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {monthNames[record.month - 1]}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.year}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(record.base_salary)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(record.hra)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(record.allowances)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(record.deductions)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  {formatCurrency(record.net_salary)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-400 flex flex-col justify-center h-full">
                  <span>{new Date(record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>{new Date(record.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onView(record)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(record)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Edit Record"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(record)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col space-y-3 p-3">
          {data.map((record) => (
            <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-600 text-sm">{record.employees?.employee_id || 'Unknown'}</h4>
                    <p className="text-xs text-gray-500 font-medium">{monthNames[record.month - 1]} {record.year}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Net Salary</p>
                  <p className="font-bold text-green-600 text-sm">{formatCurrency(record.net_salary)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Base Salary</p>
                  <p className="text-gray-900 font-medium mt-0.5">{formatCurrency(record.base_salary)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">HRA</p>
                  <p className="text-gray-900 font-medium mt-0.5">{formatCurrency(record.hra)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Allowances</p>
                  <p className="text-gray-900 font-medium mt-0.5">{formatCurrency(record.allowances)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Deductions</p>
                  <p className="text-gray-900 font-medium mt-0.5">{formatCurrency(record.deductions)}</p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end space-x-2">
                <button
                  onClick={() => onView(record)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center"
                >
                  <Eye className="w-3 h-3 mr-1" /> View
                </button>
                <button
                  onClick={() => onEdit(record)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center"
                >
                  <Edit2 className="w-3 h-3 mr-1" /> Edit
                </button>
                <button
                  onClick={() => onDelete(record)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{(currentPage - 1) * 10 + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * 10, totalPages * 10)}</span> records
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1">
              {getVisiblePages(currentPage, totalPages).map((page, idx) => (
                typeof page === 'number' ? (
                  <button
                    key={`page-${page}`}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#EB0A1E] text-white border border-[#EB0A1E]'
                        : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-500">
                    ...
                  </span>
                )
              ))}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
