import React from 'react';
import { X, Mail, Phone, Calendar, Building2, Briefcase, User as UserIcon } from 'lucide-react';
import { EmployeeRecord } from '@/lib/schemas/employee.schema';
import EmployeeStatusBadge from './EmployeeStatusBadge';

interface EmployeeViewModalProps {
  employee: EmployeeRecord;
  onClose: () => void;
}

export default function EmployeeViewModal({ employee, onClose }: EmployeeViewModalProps) {
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Header */}
        <div className="bg-gray-50/80 border-b border-gray-100 px-6 py-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <UserIcon className="w-5 h-5 mr-2 text-gray-400" />
            Employee Details
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile Header section */}
          <div className="flex items-start space-x-5 mb-8">
            <div className="h-20 w-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold border-2 border-blue-100 shrink-0 shadow-sm">
              {getInitials(employee.name)}
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                <EmployeeStatusBadge status={employee.status} />
              </div>
              <p className="text-gray-500 font-medium text-sm flex items-center mt-1">
                <Briefcase className="w-4 h-4 mr-1.5 text-gray-400" />
                {employee.designation}
              </p>
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="w-4 h-4 mr-1.5 text-gray-400" />
                  <a href={`mailto:${employee.email}`} className="hover:text-blue-600">{employee.email}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 grid grid-cols-2 gap-6">
            
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Employee ID</p>
              <p className="text-sm font-medium text-gray-900">{employee.employee_id}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" /> Date of Birth
              </p>
              <p className="text-sm font-medium text-gray-900">{formatDate(employee.dob)}</p>
            </div>

          </div>

          {/* Timestamps */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <p>Added on {formatDate(employee.created_at)}</p>
            <p>Last updated {formatDate(employee.updated_at)}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
