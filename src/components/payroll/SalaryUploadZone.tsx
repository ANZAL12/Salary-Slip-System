'use client';

import { UploadCloud, FileSpreadsheet, Download } from 'lucide-react';
import { useRef, useState } from 'react';

interface SalaryUploadZoneProps {
  onFileSelect: (file: File) => void;
  onDownloadTemplate: () => void;
  isLoading?: boolean;
}

export default function SalaryUploadZone({ onFileSelect, onDownloadTemplate, isLoading }: SalaryUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-colors ${
        isDragging ? 'border-[#EB0A1E] bg-red-50/50' : 'border-red-200 bg-white hover:bg-gray-50'
      } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="w-16 h-16 bg-red-50 text-[#EB0A1E] rounded-2xl flex items-center justify-center mb-6">
        <FileSpreadsheet className="w-8 h-8" />
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Salary Excel File</h3>
      <p className="text-sm text-gray-500 mb-8 max-w-[250px]">
        Drag and drop your Excel file here, or click to browse
      </p>

      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="bg-[#EB0A1E] hover:bg-red-700 text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm transition-colors flex items-center disabled:opacity-70"
        >
          <UploadCloud className="w-4 h-4 mr-2" />
          {isLoading ? 'Processing...' : 'Choose File'}
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDownloadTemplate();
          }}
          disabled={isLoading}
          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm px-6 py-2.5 rounded-lg shadow-sm transition-colors flex items-center disabled:opacity-70"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-6">Supports .xlsx, .csv files up to 10MB</p>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".xlsx, .xls, .csv"
        onChange={handleChange}
      />
    </div>
  );
}
