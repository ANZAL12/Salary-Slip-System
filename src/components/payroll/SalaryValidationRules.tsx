import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SalaryValidationRules() {
  const rules = [
    "Employee ID must exist in the system",
    "Base Salary must be a numeric value greater than 0",
    "Month and Year are required",
    "HRA, Allowances, Deductions must be numeric",
    "Deductions cannot be greater than (Base Salary + Allowances + HRA)"
  ];

  return (
    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 sm:p-6 mt-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-5 h-5 text-orange-600" />
      </div>
      
      <div className="flex-1 w-full">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Validation Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex items-start">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-600">{rule}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 sm:mt-0 sm:self-center">
        <button className="text-xs font-medium text-orange-600 hover:text-orange-700 bg-white border border-orange-200 px-4 py-2 rounded-lg transition-colors whitespace-nowrap shadow-sm hover:shadow">
          View All Rules
        </button>
      </div>
    </div>
  );
}
