import { FilePlus2, RefreshCw, Send, Download } from 'lucide-react';

interface SalarySlipActionsProps {
  onGenerateAll: () => void;
  onGenerateMissing: () => void;
  onSendAllEmails: () => void;
  onDownloadZip: () => void;
  isGenerating: boolean;
  isSending: boolean;
}

export default function SalarySlipActions({ 
  onGenerateAll, 
  onGenerateMissing, 
  onSendAllEmails, 
  onDownloadZip,
  isGenerating,
  isSending
}: SalarySlipActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
      <button 
        onClick={onGenerateAll}
        disabled={isGenerating || isSending}
        className="flex items-center justify-center px-4 py-2.5 bg-[#EB0A1E] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm"
      >
        <FilePlus2 className="w-4 h-4 mr-2" />
        {isGenerating ? 'Generating...' : 'Generate Salary Slips'}
      </button>

      <button 
        onClick={onGenerateMissing}
        disabled={isGenerating || isSending}
        className="flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Generate Missing Slips
      </button>

      <button 
        onClick={onSendAllEmails}
        disabled={isGenerating || isSending}
        className="flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
      >
        <Send className="w-4 h-4 mr-2" />
        {isSending ? 'Sending...' : 'Send All Emails'}
      </button>

      <button 
        onClick={onDownloadZip}
        disabled={isGenerating || isSending}
        className="flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm sm:ml-auto"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Monthly ZIP
      </button>
    </div>
  );
}
