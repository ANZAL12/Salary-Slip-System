'use client';

import { AlertTriangle, Check } from 'lucide-react';

export default function EmployeeValidationRules() {
  const rules = [
    "Employee ID is required",
    "Employee ID must be unique",
    "Name is required",
    "Email is required",
    "Email must be valid",
    "Designation is required",
    "Date of Birth is required"
  ];

  return (
    <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-6 mt-6">
      <div className="flex items-start mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
        <h3 className="text-sm font-bold text-gray-900">Validation Rules</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 pl-7">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex items-center text-sm text-gray-600">
            <Check className="w-3.5 h-3.5 text-gray-400 mr-2 flex-shrink-0" />
            {rule}
          </div>
        ))}
      </div>
    </div>
  );
}
