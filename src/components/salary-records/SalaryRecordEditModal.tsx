import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Edit2 } from 'lucide-react';
import { salarySchema, RawSalaryData, SalaryRecordDB } from '@/lib/schemas/salary.schema';
import { updateSalaryRecord } from '@/services/payroll.service';
import { z } from 'zod';

// Define edit schema explicitly since we can't use .omit() on refined schemas
const editSalarySchema = z.object({
  base_salary: z.coerce.number().min(1, "Base Salary must be > 0"),
  hra: z.coerce.number().min(0, "HRA must be positive"),
  allowances: z.coerce.number().min(0, "Allowances must be positive"),
  deductions: z.coerce.number().min(0, "Deductions must be positive"),
  month: z.string().min(1, "Month is required"),
  year: z.coerce.number().min(2000, "Valid Year is required"),
}).superRefine((data, ctx) => {
  const earnings = data.base_salary + data.hra + data.allowances;
  if (data.deductions > earnings) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Deductions cannot exceed earnings",
      path: ["deductions"]
    });
  }
});

type EditSalaryData = z.infer<typeof editSalarySchema>;

interface SalaryRecordEditModalProps {
  record: SalaryRecordDB;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function SalaryRecordEditModal({ record, onClose, onSuccess }: SalaryRecordEditModalProps) {
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm<EditSalaryData>({
    resolver: zodResolver(editSalarySchema) as any,
    defaultValues: {
      month: String(record.month),
      year: record.year,
      base_salary: record.base_salary,
      hra: record.hra,
      allowances: record.allowances,
      deductions: record.deductions,
    }
  });

  // Watch fields to calculate net salary live
  const baseSalary = useWatch({ control, name: 'base_salary' }) || 0;
  const hra = useWatch({ control, name: 'hra' }) || 0;
  const allowances = useWatch({ control, name: 'allowances' }) || 0;
  const deductions = useWatch({ control, name: 'deductions' }) || 0;
  
  const liveNetSalary = (Number(baseSalary) + Number(hra) + Number(allowances)) - Number(deductions);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const onSubmit = async (data: EditSalaryData) => {
    const payload = {
      month: Number(data.month),
      year: Number(data.year),
      base_salary: Number(data.base_salary),
      hra: Number(data.hra),
      allowances: Number(data.allowances),
      deductions: Number(data.deductions),
    };

    const result = await updateSalaryRecord(record.id, payload);
    
    if (result.success) {
      onSuccess('Salary record updated successfully');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gray-50/80 border-b border-gray-100 px-6 py-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Edit2 className="w-5 h-5 mr-2 text-gray-400" />
            Edit Salary Record
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 flex justify-between items-center">
            <div>
              <span className="font-semibold text-blue-900">Employee ID: </span> 
              {record.employees?.employee_id || 'Unknown'}
            </div>
            <div>
              <span className="font-semibold text-blue-900">Created: </span>
              {new Date(record.created_at).toLocaleDateString()}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Month */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month <span className="text-red-500">*</span></label>
                <select
                  {...register('month')}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-colors ${errors.month ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                >
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                {errors.month && <p className="mt-1 text-xs text-red-500">{errors.month.message}</p>}
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  {...register('year')}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-colors ${errors.year ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.year && <p className="mt-1 text-xs text-red-500">{errors.year.message}</p>}
              </div>

              {/* Base Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  {...register('base_salary')}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-colors ${errors.base_salary ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.base_salary && <p className="mt-1 text-xs text-red-500">{errors.base_salary.message}</p>}
              </div>

              {/* HRA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HRA (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  {...register('hra')}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-colors ${errors.hra ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.hra && <p className="mt-1 text-xs text-red-500">{errors.hra.message}</p>}
              </div>

              {/* Allowances */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allowances (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  {...register('allowances')}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-colors ${errors.allowances ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.allowances && <p className="mt-1 text-xs text-red-500">{errors.allowances.message}</p>}
              </div>

              {/* Deductions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deductions (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  {...register('deductions')}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-colors ${errors.deductions ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.deductions && <p className="mt-1 text-xs text-red-500">{errors.deductions.message}</p>}
              </div>

            </div>

            {/* Live Net Salary Calculator */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="text-sm font-medium text-green-800">Calculated Net Salary</div>
              <div className={`text-xl font-bold ${liveNetSalary < 0 ? 'text-red-600' : 'text-green-700'}`}>
                {formatCurrency(liveNetSalary)}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || liveNetSalary < 0}
                className="px-4 py-2 bg-[#EB0A1E] text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB0A1E] transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
