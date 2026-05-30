'use client';

import { useState } from 'react';
import { X, FilePlus } from 'lucide-react';
import type { ValidatedSalaryRecord } from '@/services/payroll.service';

interface AddSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (record: ValidatedSalaryRecord) => void;
  suggestedId: string;
}

export default function AddSalaryModal({ isOpen, onClose, onAdd, suggestedId }: AddSalaryModalProps) {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' }).substring(0, 3);
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    employee_id: suggestedId,
    base_salary: 0,
    hra: 0,
    allowances: 0,
    deductions: 0,
    month: currentMonth,
    year: currentYear
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const net_salary = (formData.base_salary + formData.hra + formData.allowances) - formData.deductions;
    
    onAdd({
      employee_id: formData.employee_id,
      employee_name: '-', // Will be updated during validation
      base_salary: formData.base_salary,
      hra: formData.hra,
      allowances: formData.allowances,
      deductions: formData.deductions,
      net_salary,
      month: formData.month,
      month_int: 0,
      year: formData.year,
      status: 'Under Review', // Default before validation
      errors: []
    });

    // Reset form for next use
    setFormData({
      employee_id: `EMP${String(parseInt(formData.employee_id.replace('EMP', '')) + 1).padStart(3, '0')}`,
      base_salary: 0,
      hra: 0,
      allowances: 0,
      deductions: 0,
      month: currentMonth,
      year: currentYear
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-900">
            <FilePlus className="w-5 h-5 text-[#EB0A1E]" />
            <h3 className="text-lg font-bold">Add Salary Record Manually</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <input 
              required
              type="text" 
              value={formData.employee_id}
              onChange={e => setFormData({...formData, employee_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EB0A1E] transition-colors"
              placeholder="EMP001"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary (₹)</label>
              <input 
                required
                type="number" 
                min="0"
                value={formData.base_salary || ''}
                onChange={e => setFormData({...formData, base_salary: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EB0A1E] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HRA (₹)</label>
              <input 
                required
                type="number" 
                min="0"
                value={formData.hra || ''}
                onChange={e => setFormData({...formData, hra: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EB0A1E] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allowances (₹)</label>
              <input 
                required
                type="number" 
                min="0"
                value={formData.allowances || ''}
                onChange={e => setFormData({...formData, allowances: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EB0A1E] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deductions (₹)</label>
              <input 
                required
                type="number" 
                min="0"
                value={formData.deductions || ''}
                onChange={e => setFormData({...formData, deductions: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EB0A1E] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <input 
                required
                type="text" 
                value={formData.month}
                onChange={e => setFormData({...formData, month: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EB0A1E] transition-colors"
                placeholder="Jan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input 
                required
                type="number" 
                value={formData.year}
                onChange={e => setFormData({...formData, year: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EB0A1E] transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#EB0A1E] text-white font-medium hover:bg-red-700 rounded-lg transition-colors shadow-sm"
            >
              Add Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
