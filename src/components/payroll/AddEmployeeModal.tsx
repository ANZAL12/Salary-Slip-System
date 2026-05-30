'use client';

import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import type { ParsedEmployee } from './EmployeePreviewTable';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: ParsedEmployee) => void;
  suggestedId: string;
}

export default function AddEmployeeModal({ isOpen, onClose, onAdd, suggestedId }: AddEmployeeModalProps) {
  const [formData, setFormData] = useState({
    employee_id: suggestedId,
    name: '',
    email: '',
    designation: '',
    dob: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      status: 'Under Review' // Will be validated by parent
    });
    // Reset form for next use
    setFormData({
      employee_id: `EMP${String(parseInt(formData.employee_id.replace('EMP', '')) + 1).padStart(3, '0')}`,
      name: '',
      email: '',
      designation: '',
      dob: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-900">
            <UserPlus className="w-5 h-5 text-[#EB0A1E]" />
            <h3 className="text-lg font-bold">Add Employee Manually</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EB0A1E] transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EB0A1E] transition-colors"
              placeholder="john@toyota.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <input 
              required
              type="text" 
              value={formData.designation}
              onChange={e => setFormData({...formData, designation: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EB0A1E] transition-colors"
              placeholder="Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input 
              required
              type="date" 
              value={formData.dob}
              onChange={e => setFormData({...formData, dob: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EB0A1E] transition-colors"
            />
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
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
