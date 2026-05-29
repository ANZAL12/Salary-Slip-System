import { EnrichedSalarySlip } from '@/services/salary-slip.service';
import { X, Download, IndianRupee, FileText, Calculator, FileCheck } from 'lucide-react';
import Image from 'next/image';
import numberToWords from 'number-to-words';

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

  // Amount in words conversion
  let words = numberToWords.toWords(record.net_salary).replace(/-/g, ' ');
  words = words.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const lastDay = new Date(record.year, record.month, 0).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-900">Preview Salary Slip - {record.employee_code}</h3>
          <div className="flex space-x-3">
            <button 
              onClick={onDownload}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#EB0A1E] hover:bg-red-700 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Slip Content */}
        <div className="p-6 sm:p-10 bg-gray-50/50 overflow-y-auto custom-scrollbar flex-1">
          <div className="bg-white border border-gray-200 rounded-xl p-10 shadow-sm mx-auto max-w-3xl font-sans relative overflow-hidden">
            
            {/* Top Red Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#EB0A1E]"></div>

            {/* Slip Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b-2 border-red-100 gap-6">
              <div>
                <Image src="/toyota-logo.svg" alt="Toyota Logo" width={180} height={48} className="mb-2" />
                <p className="text-sm font-bold text-gray-900 ml-1">Nippon Toyota</p>
              </div>
              <div className="text-left sm:text-right border-l-2 border-red-100 pl-6">
                <h4 className="text-2xl font-black text-gray-900 tracking-wider">SALARY SLIP</h4>
                <p className="text-lg font-bold text-[#EB0A1E] mt-1">{getMonthName(record.month)} {record.year}</p>
              </div>
            </div>

            {/* Employee Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 mb-8">
              <div className="space-y-4">
                <div className="flex text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-500 w-32 font-medium">Employee ID</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="font-bold text-gray-900">{record.employee_code}</span>
                </div>
                <div className="flex text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-500 w-32 font-medium">Employee Name</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="font-bold text-gray-900">{record.employee_name}</span>
                </div>
                <div className="flex text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-500 w-32 font-medium">Designation</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="font-bold text-gray-900">{record.designation}</span>
                </div>
                <div className="flex text-sm pb-2">
                  <span className="text-gray-500 w-32 font-medium">Department</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="font-bold text-gray-900">Toyota Operations</span>
                </div>
              </div>
              
              <div className="space-y-4 border-l-2 border-gray-100 pl-8">
                <div className="flex text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-500 w-32 font-medium">Month</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="font-bold text-gray-900">{getMonthName(record.month)}</span>
                </div>
                <div className="flex text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-500 w-32 font-medium">Year</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="font-bold text-gray-900">{record.year}</span>
                </div>
                <div className="flex text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-500 w-32 font-medium">Date</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="font-bold text-gray-900">{today}</span>
                </div>
                <div className="flex text-sm pb-2">
                  <span className="text-gray-500 w-32 font-medium">Pay Day</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <span className="font-bold text-gray-900">{lastDay}</span>
                </div>
              </div>
            </div>

            {/* Net Salary Highlight */}
            <div className="border border-red-100 bg-[#fff5f5] rounded-xl p-5 mb-8 flex flex-col sm:flex-row justify-between items-center sm:items-start shadow-sm">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-[#EB0A1E] rounded-full flex items-center justify-center mr-4 shadow-md shadow-red-200">
                  <IndianRupee className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Net Salary</h5>
                  <p className="text-2xl font-black text-[#EB0A1E] mt-0.5">₹ {formatCurrency(record.net_salary)}</p>
                </div>
              </div>
              <div className="text-center sm:text-right pt-2 border-t sm:border-t-0 sm:border-l border-red-100 sm:pl-6 w-full sm:w-auto">
                <p className="text-xs font-medium text-gray-500 italic mb-1">Amount in Words:</p>
                <p className="text-sm font-bold text-[#EB0A1E] italic">{words} Only</p>
              </div>
            </div>

            {/* Financials Tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              
              {/* Earnings Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-xs font-bold text-green-700 tracking-wider">EARNINGS</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">Amount (₹)</span>
                </div>
                <div className="p-4 space-y-4 text-sm">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-600">Base Salary</span>
                    <span className="font-medium text-gray-900">{formatCurrency(record.base_salary)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-600">HRA</span>
                    <span className="font-medium text-gray-900">{formatCurrency(record.hra)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-600">Allowances</span>
                    <span className="font-medium text-gray-900">{formatCurrency(record.allowances)}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-gray-600">Other Allowances</span>
                    <span className="font-medium text-gray-400">-</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200 border-dashed flex justify-between items-center">
                  <span className="text-sm font-bold text-green-700">TOTAL EARNINGS</span>
                  <span className="text-base font-black text-green-700">{formatCurrency(totalEarnings)}</span>
                </div>
              </div>

              {/* Deductions Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4 text-[#EB0A1E] mr-2" />
                    <span className="text-xs font-bold text-[#EB0A1E] tracking-wider">DEDUCTIONS</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">Amount (₹)</span>
                </div>
                <div className="p-4 space-y-4 text-sm">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-600">Provident Fund (PF)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(record.deductions * 0.8)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-600">Professional Tax</span>
                    <span className="font-medium text-gray-900">{formatCurrency(record.deductions * 0.1)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-600">Other Deductions</span>
                    <span className="font-medium text-gray-900">{formatCurrency(record.deductions * 0.1)}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-gray-600">Income Tax</span>
                    <span className="font-medium text-gray-400">-</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200 border-dashed flex justify-between items-center">
                  <span className="text-sm font-bold text-[#EB0A1E]">TOTAL DEDUCTIONS</span>
                  <span className="text-base font-black text-[#EB0A1E]">{formatCurrency(totalDeductions)}</span>
                </div>
              </div>
            </div>

            {/* Summary Equation */}
            <div className="border border-gray-200 bg-gray-50 rounded-xl p-5 mb-8 flex items-center shadow-sm overflow-x-auto">
              <div className="flex items-center mr-6 border-r border-gray-300 pr-6 shrink-0">
                <Calculator className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-sm font-bold text-gray-900">NET SALARY (₹)</span>
              </div>
              <div className="flex items-center space-x-6 shrink-0 text-sm">
                <div className="text-center">
                  <p className="text-gray-500 mb-1">Total Earnings (₹)</p>
                  <p className="font-bold text-green-700">{formatCurrency(totalEarnings)}</p>
                </div>
                <div className="font-bold text-gray-400">-</div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">Total Deductions (₹)</p>
                  <p className="font-bold text-[#EB0A1E]">{formatCurrency(totalDeductions)}</p>
                </div>
                <div className="font-bold text-gray-400">=</div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">Net Salary (₹)</p>
                  <p className="font-black text-green-700">{formatCurrency(record.net_salary)}</p>
                </div>
              </div>
            </div>

            {/* Message Box */}
            <div className="border border-gray-200 bg-white rounded-xl p-5 mb-12 shadow-sm flex items-start">
              <FileCheck className="w-5 h-5 text-[#EB0A1E] mr-3 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#EB0A1E] mb-1 uppercase tracking-wider">Summary</p>
                <p className="text-sm text-gray-700">Thank you for your contributions.</p>
              </div>
            </div>

            {/* Footer Signature Area */}
            <div className="flex flex-col sm:flex-row justify-between items-end pt-8 border-t-2 border-red-100">
              <div className="text-xs text-gray-500 space-y-1 mb-6 sm:mb-0">
                <p>This is a system generated salary slip.</p>
                <p>For any queries, please contact HR Department.</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Authorized Signature</p>
                <div className="w-full flex justify-center mb-0 relative h-12">
                  <svg 
                    viewBox="-10 0 140 80" 
                    className="absolute -bottom-2 h-16 w-auto stroke-[#1a1a80] fill-none z-10" 
                    style={{ strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}
                  >
                    <path d="M 0 30 C 10 0, 30 0, 20 40 C 10 80, -10 60, 5 40 C 15 20, 25 30, 30 40 M 45 40 L 45 41 M 60 20 C 50 20, 50 60, 60 60 C 80 60, 80 20, 60 20 C 70 30, 75 40, 70 50 C 65 60, 80 50, 85 45 C 90 40, 95 30, 90 35 C 85 40, 95 50, 100 45 C 105 40, 110 35, 120 45" />
                  </svg>
                </div>
                <div className="w-48 h-px bg-gray-400 mx-auto relative z-0"></div>
                <p className="text-xs text-gray-500 mt-2">HR Manager</p>
              </div>
            </div>
            
            {/* Bottom Red Banner */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#EB0A1E] flex flex-col items-center justify-center">
              <p className="text-white text-[10px] font-bold">TOYOTA | Nippon Toyota</p>
              <p className="text-white/80 text-[8px]">Drive Your World</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
