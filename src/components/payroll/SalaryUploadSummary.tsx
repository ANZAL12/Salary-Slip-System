import { FileText, CheckCircle, XCircle, Clock, Copy } from 'lucide-react';

interface SalaryUploadSummaryProps {
  total: number;
  valid: number;
  invalid: number;
  duplicate: number;
  fileName: string | null;
  uploadTime: string | null;
}

export default function SalaryUploadSummary({ total, valid, invalid, duplicate, fileName, uploadTime }: SalaryUploadSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-6">Upload Summary</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="w-4 h-4 mr-2 text-blue-500" />
            Total Records
          </div>
          <span className="font-bold text-blue-600">{total}</span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            Valid Records
          </div>
          <span className="font-bold text-green-600">{valid}</span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
          <div className="flex items-center text-sm text-gray-600">
            <XCircle className="w-4 h-4 mr-2 text-[#EB0A1E]" />
            Invalid Records
          </div>
          <span className="font-bold text-[#EB0A1E]">{invalid}</span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
          <div className="flex items-center text-sm text-gray-600">
            <Copy className="w-4 h-4 mr-2 text-orange-500" />
            Duplicate Records
          </div>
          <span className="font-bold text-orange-600">{duplicate}</span>
        </div>

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
