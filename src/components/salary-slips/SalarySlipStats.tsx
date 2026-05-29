import { FileText, CheckCircle, Clock, Send } from 'lucide-react';

interface StatsProps {
  total: number;
  generatedThisMonth: number;
  pendingGeneration: number;
  emailReady: number;
}

export default function SalarySlipStats({ total, generatedThisMonth, pendingGeneration, emailReady }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start">
        <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mr-4">
          <FileText className="w-6 h-6 text-[#EB0A1E]" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Total Salary Slips</p>
          <h4 className="text-2xl font-black text-gray-900 mt-1">{total}</h4>
          <p className="text-xs text-gray-500 mt-1">All time generated</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start">
        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 mr-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Generated This Month</p>
          <h4 className="text-2xl font-black text-gray-900 mt-1">{generatedThisMonth}</h4>
          <p className="text-xs text-gray-500 mt-1">Current period</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start">
        <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 mr-4">
          <Clock className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Pending Generation</p>
          <h4 className="text-2xl font-black text-gray-900 mt-1">{pendingGeneration}</h4>
          <p className="text-xs text-gray-500 mt-1">Salary records without slips</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start">
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mr-4">
          <Send className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Email Ready</p>
          <h4 className="text-2xl font-black text-gray-900 mt-1">{emailReady}</h4>
          <p className="text-xs text-gray-500 mt-1">Ready to send emails</p>
        </div>
      </div>
    </div>
  );
}
