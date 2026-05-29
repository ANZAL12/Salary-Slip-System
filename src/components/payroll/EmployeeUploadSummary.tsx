'use client';

import { FileText, CheckCircle2, XCircle, Copy, Clock, FileType } from 'lucide-react';

interface EmployeeUploadSummaryProps {
  total: number;
  valid: number;
  invalid: number;
  duplicate: number;
  fileName: string | null;
  uploadTime: string | null;
}

export default function EmployeeUploadSummary({
  total,
  valid,
  invalid,
  duplicate,
  fileName,
  uploadTime
}: EmployeeUploadSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <h3 className="text-base font-bold text-gray-900 mb-6">Upload Summary</h3>

      <div className="space-y-5 flex-1">
        <div className="flex justify-between items-center pb-3 border-b border-gray-50">
          <div className="flex items-center text-sm font-medium text-gray-600">
            <FileText className="w-4 h-4 text-blue-500 mr-3" />
            Total Records
          </div>
          <span className="text-sm font-bold text-blue-600">{total}</span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-gray-50">
          <div className="flex items-center text-sm font-medium text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-green-500 mr-3" />
            Valid Records
          </div>
          <span className="text-sm font-bold text-green-600">{valid}</span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-gray-50">
          <div className="flex items-center text-sm font-medium text-gray-600">
            <XCircle className="w-4 h-4 text-[#EB0A1E] mr-3" />
            Invalid Records
          </div>
          <span className="text-sm font-bold text-[#EB0A1E]">{invalid}</span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-gray-50">
          <div className="flex items-center text-sm font-medium text-gray-600">
            <Copy className="w-4 h-4 text-orange-500 mr-3" />
            Duplicate Employee IDs
          </div>
          <span className="text-sm font-bold text-orange-600">{duplicate}</span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-gray-50">
          <div className="flex items-center text-sm font-medium text-gray-600">
            <FileType className="w-4 h-4 text-gray-400 mr-3" />
            File Name
          </div>
          <span className="text-sm text-gray-900 truncate max-w-[150px]">{fileName || '-'}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm font-medium text-gray-600">
            <Clock className="w-4 h-4 text-gray-400 mr-3" />
            Upload Time
          </div>
          <span className="text-sm text-gray-900">{uploadTime || '-'}</span>
        </div>
      </div>
    </div>
  );
}
