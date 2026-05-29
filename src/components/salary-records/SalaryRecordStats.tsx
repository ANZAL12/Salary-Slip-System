import React from 'react';
import { FileText, Calendar, IndianRupee, TrendingUp } from 'lucide-react';
import { SalaryRecordStats as StatsType } from '@/services/payroll.service';

export default function SalaryRecordStats({ totalRecords, currentMonthRecords, totalPayrollAmount, averageNetSalary }: StatsType) {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Salary Records</p>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <h3 className="text-2xl font-bold text-gray-900">{totalRecords}</h3>
            <span className="text-xs text-gray-400">All time records</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Current Month Records</p>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <h3 className="text-2xl font-bold text-gray-900">{currentMonthRecords}</h3>
            <span className="text-xs text-gray-400">{currentMonthName}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <IndianRupee className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Payroll Amount</p>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayrollAmount)}</h3>
            <span className="text-xs text-gray-400">{currentMonthName}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Average Net Salary</p>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(averageNetSalary)}</h3>
            <span className="text-xs text-gray-400">{currentMonthName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
