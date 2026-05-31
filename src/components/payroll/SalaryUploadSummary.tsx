import { FileText, CheckCircle2, XCircle, Clock, Copy } from 'lucide-react';

interface SalaryUploadSummaryProps {
  total: number;
  valid: number;
  invalid: number;
  duplicate: number;
  fileName: string | null;
  uploadTime: string | null;
  activeFilter?: 'All' | 'Valid' | 'Invalid' | 'Duplicate';
  onFilterChange?: (filter: 'All' | 'Valid' | 'Invalid' | 'Duplicate') => void;
}

export default function SalaryUploadSummary({ total, valid, invalid, duplicate, fileName, uploadTime, activeFilter = 'All', onFilterChange }: SalaryUploadSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-6">Upload Summary</h3>
      
      <div className="space-y-4">
        <button 
          onClick={() => onFilterChange?.('All')}
          className={`w-full flex justify-between items-center pb-3 border-b border-gray-50 transition-colors ${activeFilter === 'All' ? 'bg-gray-50 -mx-2 px-2 rounded-lg' : 'hover:bg-gray-50/50 -mx-2 px-2 rounded-lg'}`}
        >
          <div className="flex items-center text-sm font-medium text-gray-600">
            <FileText className="w-4 h-4 text-blue-500 mr-3" />
            Total Records
          </div>
          <span className="text-sm font-bold text-blue-600">{total}</span>
        </button>

        <button 
          onClick={() => onFilterChange?.('Valid')}
          className={`w-full flex justify-between items-center pb-3 border-b border-gray-50 transition-colors ${activeFilter === 'Valid' ? 'bg-green-50 -mx-2 px-2 rounded-lg' : 'hover:bg-green-50/50 -mx-2 px-2 rounded-lg'}`}
        >
          <div className="flex items-center text-sm font-medium text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-green-500 mr-3" />
            Valid Records
          </div>
          <span className="text-sm font-bold text-green-600">{valid}</span>
        </button>

        <button 
          onClick={() => onFilterChange?.('Invalid')}
          className={`w-full flex justify-between items-center pb-3 border-b border-gray-50 transition-colors ${activeFilter === 'Invalid' ? 'bg-red-50 -mx-2 px-2 rounded-lg' : 'hover:bg-red-50/50 -mx-2 px-2 rounded-lg'}`}
        >
          <div className="flex items-center text-sm font-medium text-gray-600">
            <XCircle className="w-4 h-4 text-[#EB0A1E] mr-3" />
            Invalid Records
          </div>
          <span className="text-sm font-bold text-[#EB0A1E]">{invalid}</span>
        </button>

        <button 
          onClick={() => onFilterChange?.('Duplicate')}
          className={`w-full flex justify-between items-center pb-3 border-b border-gray-50 transition-colors ${activeFilter === 'Duplicate' ? 'bg-orange-50 -mx-2 px-2 rounded-lg' : 'hover:bg-orange-50/50 -mx-2 px-2 rounded-lg'}`}
        >
          <div className="flex items-center text-sm font-medium text-gray-600">
            <Copy className="w-4 h-4 text-orange-500 mr-3" />
            Duplicate Salary Records
          </div>
          <span className="text-sm font-bold text-orange-600">{duplicate}</span>
        </button>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center text-xs text-gray-500">
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            File Name
          </div>
          <span className="text-xs font-medium text-gray-900 truncate max-w-[150px]">{fileName || '-'}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Upload Time
          </div>
          <span className="text-xs font-medium text-gray-900">{uploadTime || '-'}</span>
        </div>
      </div>
    </div>
  );
}
