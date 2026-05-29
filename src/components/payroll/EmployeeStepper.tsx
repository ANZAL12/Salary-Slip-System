'use client';

import { Check } from 'lucide-react';

interface EmployeeStepperProps {
  currentStep: number;
}

export default function EmployeeStepper({ currentStep }: EmployeeStepperProps) {
  const steps = [
    { num: 1, title: 'Upload File', desc: 'Upload employee Excel file' },
    { num: 2, title: 'Preview Data', desc: 'Review and validate data' },
    { num: 3, title: 'Validate', desc: 'System validation' },
    { num: 4, title: 'Confirm & Save', desc: 'Save to database' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center w-full">
      {steps.map((step, idx) => {
        const isActive = currentStep === step.num;
        const isCompleted = currentStep > step.num;

        return (
          <div key={step.num} className={`flex items-center ${idx !== steps.length - 1 ? 'flex-1' : ''}`}>
            {/* Step Node */}
            <div className="flex items-center space-x-3 relative z-10">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isActive ? 'bg-[#EB0A1E] text-white shadow-md shadow-red-200' 
                  : isCompleted ? 'bg-gray-100 text-gray-900 border border-gray-200'
                  : 'bg-gray-50 text-gray-400 border border-gray-100'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.num}
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-bold ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.title}
                </p>
                <p className={`text-[11px] mt-0.5 ${isActive || isCompleted ? 'text-gray-500' : 'text-gray-400'}`}>
                  {step.desc}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {idx !== steps.length - 1 && (
              <div className="flex-1 mx-4 sm:mx-6">
                <div className={`h-px w-full ${isCompleted ? 'bg-gray-300' : 'bg-gray-100'}`}></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
