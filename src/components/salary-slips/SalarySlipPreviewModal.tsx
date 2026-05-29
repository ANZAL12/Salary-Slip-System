import { EnrichedSalarySlip } from '@/services/salary-slip.service';
import { X, Download } from 'lucide-react';
import Image from 'next/image';

interface SalarySlipPreviewModalProps {
  record: EnrichedSalarySlip | null;
  onClose: () => void;
  onDownload: () => void;
}

export default function SalarySlipPreviewModal({ record, onClose, onDownload }: SalarySlipPreviewModalProps) {
  if (!record) return null;

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  const getMonthName = (month: number) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1] || month;
  };

  const totalEarnings = record.base_salary + record.hra + record.allowances;
  const totalDeductions = record.deductions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Preview Salary Slip - {record.employee_code}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Slip Content */}
        <div className="p-6 sm:p-10 bg-gray-50/50">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            
            {/* Slip Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-8 border-b border-gray-200 gap-6">
              <div>
                <Image src="/toyota-logo.png" alt="Toyota Logo" width={150} height={40} className="mb-2" />
                <p className="text-sm font-bold text-gray-900">Nippon Toyota</p>
                <p className="text-xs text-gray-500 mt-1">Salary Slip Automation System</p>
              </div>
              <div className="text-left sm:text-right">
                <h4 className="text-xl font-black text-gray-900">Salary Slip</h4>
                <p className="text-sm font-medium text-gray-600 mt-1">{getMonthName(record.month)} {record.year}</p>
              </div>
            </div>

            {/* Employee Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              <div className="flex text-sm">
                <span className="text-gray-500 w-32 font-medium">Employee ID:</span>
                <span className="font-bold text-gray-900">{record.employee_code}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-500 w-32 font-medium">Month:</span>
                <span className="font-bold text-gray-900">{getMonthName(record.month)}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-500 w-32 font-medium">Employee Name:</span>
                <span className="font-bold text-gray-900">{record.employee_name}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-500 w-32 font-medium">Year:</span>
                <span className="font-bold text-gray-900">{record.year}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-500 w-32 font-medium">Designation:</span>
                <span className="font-bold text-gray-900">{record.designation}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-500 w-32 font-medium">Date:</span>
                <span className="font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Financials Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-700 divide-x divide-gray-200">
                <div className="p-3 flex justify-between">
                  <span>Earnings</span>
                  <span>Amount (₹)</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span>Deductions</span>
                  <span>Amount (₹)</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 text-sm divide-x divide-gray-200">
                {/* Earnings Column */}
                <div className="p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Salary</span>
                    <span className="font-medium text-gray-900">{formatCurrency(record.base_salary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HRA</span>
                    <span className="font-medium text-gray-900">{formatCurrency(record.hra)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Allowances</span>
                    <span className="font-medium text-gray-900">{formatCurrency(record.allowances)}</span>
                  </div>
                </div>

                {/* Deductions Column */}
                <div className="p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Deductions</span>
                    <span className="font-medium text-gray-900">{formatCurrency(record.deductions)}</span>
                  </div>
                </div>
              </div>

              {/* Totals Row */}
              <div className="grid grid-cols-2 border-t border-gray-200 text-sm font-bold divide-x divide-gray-200">
                <div className="p-4 flex justify-between bg-gray-50">
                  <span className="text-gray-900">Total Earnings</span>
                  <span className="text-gray-900">{formatCurrency(totalEarnings)}</span>
                </div>
                <div className="p-4 flex justify-between bg-gray-50">
                  <span className="text-gray-900">Total Deductions</span>
                  <span className="text-gray-900">{formatCurrency(totalDeductions)}</span>
                </div>
              </div>
            </div>

            {/* Net Salary Highlight */}
            <div className="mt-6 border border-red-200 bg-red-50 rounded-lg p-4 flex justify-between items-center">
              <span className="font-bold text-[#EB0A1E]">Net Salary</span>
              <span className="text-xl font-black text-[#EB0A1E]">₹ {formatCurrency(record.net_salary)}</span>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-white">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Close
          </button>
          <button 
            onClick={onDownload}
            className="flex items-center px-6 py-2.5 text-sm font-medium text-white bg-[#EB0A1E] hover:bg-red-700 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>

      </div>
    </div>
  );
}
