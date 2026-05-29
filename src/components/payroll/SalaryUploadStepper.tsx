import { Check } from 'lucide-react';

export default function SalaryUploadStepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { id: 1, title: 'Upload File', desc: 'Upload salary Excel file' },
    { id: 2, title: 'Preview Data', desc: 'Review and validate data' },
    { id: 3, title: 'Validate', desc: 'System validation' },
    { id: 4, title: 'Confirm & Save', desc: 'Save to database' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between overflow-x-auto custom-scrollbar">
      {steps.map((step, idx) => {
        const isActive = currentStep === step.id;
        const isPast = currentStep > step.id;

        return (
          <div key={step.id} className="flex items-center min-w-max">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                isActive ? 'bg-[#EB0A1E] text-white shadow-md shadow-red-200' : 
                isPast ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {isPast ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${isActive ? 'text-gray-900' : isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.title}
                </span>
                <span className="text-xs text-gray-400">{step.desc}</span>
              </div>
            </div>
            
            {idx < steps.length - 1 && (
              <div className={`w-12 sm:w-20 md:w-32 h-[2px] mx-4 sm:mx-8 transition-colors ${
                isPast ? 'bg-green-100' : 'bg-gray-100'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
