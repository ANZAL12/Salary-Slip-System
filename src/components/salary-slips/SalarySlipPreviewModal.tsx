'use client';

import { X, Download } from 'lucide-react';
import { generatePdfBlob } from '@/lib/pdf-generator';
import type { EnrichedSalarySlip } from '@/services/salary-slip.service';
import toast from 'react-hot-toast';
import { SiToyota } from 'react-icons/si';

interface SalarySlipPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: EnrichedSalarySlip | null;
}

export default function SalarySlipPreviewModal({ isOpen, onClose, record }: SalarySlipPreviewModalProps) {
  if (!isOpen || !record) return null;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN');
  };

  const getMonthName = (m: number) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[m - 1] || String(m);
  };

  const totalEarnings = record.base_salary + record.hra + record.allowances;
  const pf = record.deductions * 0.8;
  const pt = record.deductions * 0.1;
  const otherDed = record.deductions * 0.1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Preview Salary Slip - {record.employee_code}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - The Preview */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/50">
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 max-w-2xl mx-auto">
            {/* Toyota Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <SiToyota className="w-8 h-8 text-gray-900" />
                  <span className="text-3xl tracking-tight text-[#EB0A1E]">TOYOTA</span>
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide mt-1">Nippon Toyota</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-900">Salary Slip - {getMonthName(record.month)} {record.year}</h2>
              </div>
            </div>

            {/* Employee Info Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 text-sm">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-gray-500">Employee ID</span>
                <span className="font-medium text-gray-900">: {record.employee_code}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-gray-500">Month</span>
                <span className="font-medium text-gray-900">: {getMonthName(record.month)}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-gray-500">Employee Name</span>
                <span className="font-medium text-gray-900">: {record.employee_name}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-gray-500">Year</span>
                <span className="font-medium text-gray-900">: {record.year}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-gray-500">Designation</span>
                <span className="font-medium text-gray-900">: {record.designation}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-900">: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
              </div>
            </div>

            {/* Financials Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
                <div className="p-3 flex justify-between"><span>Earnings</span><span>Amount (₹)</span></div>
                <div className="p-3 flex justify-between border-l border-gray-200"><span>Deductions</span><span>Amount (₹)</span></div>
              </div>
              <div className="grid grid-cols-2 text-sm text-gray-600">
                {/* Earnings Col */}
                <div className="p-3 space-y-3">
                  <div className="flex justify-between"><span>Base Salary</span><span>{formatCurrency(record.base_salary)}</span></div>
                  <div className="flex justify-between"><span>HRA</span><span>{formatCurrency(record.hra)}</span></div>
                  <div className="flex justify-between"><span>Allowances</span><span>{formatCurrency(record.allowances)}</span></div>
                </div>
                {/* Deductions Col */}
                <div className="p-3 space-y-3 border-l border-gray-200">
                  <div className="flex justify-between"><span>Deducted Amount</span><span>{formatCurrency(record.deductions)}</span></div>
                </div>
              </div>
              
              {/* Totals Row */}
              <div className="grid grid-cols-2 bg-gray-50 border-t border-gray-200 text-sm font-semibold text-gray-900">
                <div className="p-3 flex justify-between"><span>Total Earnings</span><span>{formatCurrency(totalEarnings)}</span></div>
                <div className="p-3 flex justify-between border-l border-gray-200"><span>Total Deductions</span><span>{formatCurrency(record.deductions)}</span></div>
              </div>
            </div>

            {/* Net Salary Highlights */}
            <div className="mt-6 p-4 bg-red-50/50 border border-red-100 rounded-lg flex justify-between items-center">
              <span className="font-bold text-gray-900">Net Salary</span>
              <span className="text-xl font-bold text-[#EB0A1E]">₹ {formatCurrency(record.net_salary)}</span>
            </div>
            
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
