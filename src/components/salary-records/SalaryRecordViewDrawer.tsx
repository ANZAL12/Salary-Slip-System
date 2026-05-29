import React from 'react';
import { X, FileText } from 'lucide-react';
import { SalaryRecordDB } from '@/lib/schemas/salary.schema';

interface SalaryRecordViewDrawerProps {
  record: SalaryRecordDB;
  onClose: () => void;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export default function SalaryRecordViewDrawer({ record, onClose }: SalaryRecordViewDrawerProps) {
  
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
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col h-full border-l border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">View Salary Record</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Employee Header */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-0.5">Employee ID</p>
              <h2 className="text-xl font-bold text-blue-600">{record.employees?.employee_id || 'Unknown'}</h2>
            </div>
          </div>

          <div className="border-t border-gray-100 my-2"></div>

          {/* Details Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm text-gray-500">Month</div>
              <div className="text-sm font-medium text-gray-900">: {monthNames[record.month - 1]}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm text-gray-500">Year</div>
              <div className="text-sm font-medium text-gray-900">: {record.year}</div>
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm text-gray-500">Base Salary</div>
              <div className="text-sm font-medium text-gray-900">: {formatCurrency(record.base_salary)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm text-gray-500">HRA</div>
              <div className="text-sm font-medium text-gray-900">: {formatCurrency(record.hra)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm text-gray-500">Allowances</div>
              <div className="text-sm font-medium text-gray-900">: {formatCurrency(record.allowances)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm text-gray-500">Deductions</div>
              <div className="text-sm font-medium text-gray-900">: {formatCurrency(record.deductions)}</div>
            </div>
          </div>

          {/* Highlighted Net Salary */}
          <div className="mt-6 bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="text-sm font-bold text-green-700">Net Salary</div>
            <div className="text-sm font-bold text-green-700">: {formatCurrency(record.net_salary)}</div>
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="text-sm text-gray-500">Created At</div>
            <div className="text-xs font-medium text-gray-900">: {formatDate(record.created_at)}</div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>

      </div>
    </>
  );
}
