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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-[#EB0A1E] text-white border border-[#EB0A1E]'
                      : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
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
