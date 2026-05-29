import { EnrichedSalarySlip } from '@/services/salary-slip.service';
import SalarySlipStatusBadge from './SalarySlipStatusBadge';
import { Eye, Download, RefreshCw, Send, ChevronLeft, ChevronRight } from 'lucide-react';

interface SalarySlipTableProps {
  data: EnrichedSalarySlip[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPreview: (record: EnrichedSalarySlip) => void;
  onDownload: (record: EnrichedSalarySlip) => void;
  onRegenerate: (record: EnrichedSalarySlip) => void;
  onSendEmail: (record: EnrichedSalarySlip) => void;
}

export default function SalarySlipTable({ 
  data, 
  currentPage, 
  totalPages, 
  onPageChange,
  onPreview,
  onDownload,
  onRegenerate,
  onSendEmail
}: SalarySlipTableProps) {
  
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1] || month;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <th className="px-6 py-4 font-semibold">Employee ID</th>
              <th className="px-6 py-4 font-semibold">Employee Name</th>
              <th className="px-6 py-4 font-semibold">Designation</th>
              <th className="px-6 py-4 font-semibold">Month</th>
              <th className="px-6 py-4 font-semibold">Year</th>
              <th className="px-6 py-4 font-semibold">Net Salary (₹)</th>
              <th className="px-6 py-4 font-semibold">PDF Status</th>
              <th className="px-6 py-4 font-semibold">Email Status</th>
              <th className="px-6 py-4 font-semibold">Generated Date</th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.employee_code}</td>
                  <td className="px-6 py-4">{row.employee_name}</td>
                  <td className="px-6 py-4 text-gray-500">{row.designation}</td>
                  <td className="px-6 py-4">{getMonthName(row.month)}</td>
                  <td className="px-6 py-4">{row.year}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(row.net_salary)}</td>
                  <td className="px-6 py-4">
                    <SalarySlipStatusBadge status={row.pdf_status} />
                  </td>
                  <td className="px-6 py-4">
                    <SalarySlipStatusBadge status={row.email_status} />
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(row.generated_date)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                      <button 
                        onClick={() => onPreview(row)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Preview PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDownload(row)}
                        disabled={row.pdf_status !== 'Generated'}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-30"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onRegenerate(row)}
                        className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                        title="Regenerate PDF"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onSendEmail(row)}
                        disabled={row.pdf_status !== 'Generated'}
                        className="p-1.5 text-gray-400 hover:text-[#EB0A1E] hover:bg-red-50 rounded-md transition-colors disabled:opacity-30"
                        title="Send Email"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-gray-500 text-sm">
                  No salary slips match your current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <p className="text-sm text-gray-500">
          Showing page {currentPage} of {Math.max(1, totalPages)}
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-1.5 text-sm font-medium bg-[#EB0A1E] text-white rounded-md">
              {currentPage}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
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
