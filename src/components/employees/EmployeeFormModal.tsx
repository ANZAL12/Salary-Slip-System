import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, User as UserIcon } from 'lucide-react';
import { employeeSchema, EmployeeData, EmployeeRecord } from '@/lib/schemas/employee.schema';
import { createEmployee, updateEmployee } from '@/services/employee.service';

interface EmployeeFormModalProps {
  employee?: EmployeeRecord; // If provided, it's edit mode
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function EmployeeFormModal({ employee, onClose, onSuccess }: EmployeeFormModalProps) {
  const isEditMode = !!employee;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<EmployeeData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      status: 'Active',
    }
  });

  useEffect(() => {
    if (employee) {
      reset({
        employee_id: employee.employee_id,
        name: employee.name,
        email: employee.email,
        designation: employee.designation,
        dob: employee.dob || '',
        status: employee.status as any,
      });
    }
  }, [employee, reset]);

  const onSubmit = async (data: EmployeeData) => {
    let result;
    if (isEditMode && employee) {
      result = await updateEmployee(employee.id, data);
    } else {
      result = await createEmployee(data);
    }

    if (result.success) {
      onSuccess(isEditMode ? 'Employee updated successfully' : 'Employee added successfully');
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
            <UserIcon className="w-5 h-5 mr-2 text-gray-400" />
            {isEditMode ? 'Edit Employee' : 'Add New Employee'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register('employee_id')}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-colors ${errors.employee_id ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  placeholder="e.g. EMP001"
                />
                {errors.employee_id && <p className="mt-1 text-xs text-red-500">{errors.employee_id.message}</p>}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register('name')}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-colors ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  {...register('email')}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  placeholder="john.doe@toyota.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register('designation')}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-colors ${errors.designation ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  placeholder="e.g. Software Engineer"
                />
                {errors.designation && <p className="mt-1 text-xs text-red-500">{errors.designation.message}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  {...register('dob')}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-colors ${errors.dob ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                <select
                  {...register('status')}
                  className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] bg-white transition-colors ${errors.status ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
                {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>}
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
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#EB0A1E] text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB0A1E] transition-colors flex items-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isEditMode ? 'Save Changes' : 'Add Employee'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
