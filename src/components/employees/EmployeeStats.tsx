import React from 'react';
import { Users, UserCheck, UserMinus, UserPlus } from 'lucide-react';
import { EmployeeStats as StatsType } from '@/services/employee.service';

export default function EmployeeStats({ total, active, inactive }: StatsType) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Employees</p>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <h3 className="text-2xl font-bold text-gray-900">{total}</h3>
            <span className="text-xs text-gray-400">All employees</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Active Employees</p>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <h3 className="text-2xl font-bold text-gray-900">{active}</h3>
            <span className="text-xs text-gray-400">Currently active</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <UserMinus className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Inactive Employees</p>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <h3 className="text-2xl font-bold text-gray-900">{inactive}</h3>
            <span className="text-xs text-gray-400">Not active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
