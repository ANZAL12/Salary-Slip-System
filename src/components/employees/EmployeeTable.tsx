import React from 'react';
import { Eye, Edit2, Trash2, ArrowLeft, ArrowRight, User } from 'lucide-react';
import { EmployeeRecord } from '@/lib/schemas/employee.schema';
import EmployeeStatusBadge from './EmployeeStatusBadge';

interface EmployeeTableProps {
  data: EmployeeRecord[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (record: EmployeeRecord) => void;
  onEdit: (record: EmployeeRecord) => void;
  onDelete: (record: EmployeeRecord) => void;
}

export default function EmployeeTable({ 
  data, 
  currentPage, 
  totalPages, 
  onPageChange,
  onView,
  onEdit,
  onDelete
}: EmployeeTableProps) {
  
  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl py-16 text-center shadow-sm">
        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
        <p className="text-gray-500 max-w-sm mx-auto text-sm">
          Upload employee data or add employees manually to get started.
        </p>
      </div>
    );
  }

  // Get Initials for Avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-0 sm:p-4 overflow-x-auto bg-gray-50 md:bg-white">
        {/* Desktop Table */}
        <table className="hidden md:table min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Employee ID
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Designation
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-100 shrink-0">
                      {getInitials(employee.name)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                  {employee.employee_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.designation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EmployeeStatusBadge status={employee.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onView(employee)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(employee)}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Edit Employee"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(employee)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Employee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col space-y-3 p-3">
          {data.map((employee) => (
            <div key={employee.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold border border-blue-100 shrink-0">
                    {getInitials(employee.name)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{employee.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{employee.employee_id}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <EmployeeStatusBadge status={employee.status} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm mt-2">
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="text-gray-900 font-medium mt-0.5 break-all">{employee.email}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Designation</p>
                  <p className="text-gray-900 font-medium mt-0.5">{employee.designation}</p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end space-x-2">
                <button
                  onClick={() => onView(employee)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center"
                >
                  <Eye className="w-3 h-3 mr-1" /> View
                </button>
                <button
                  onClick={() => onEdit(employee)}
                  className="px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 rounded-md transition-colors flex items-center"
                >
                  <Edit2 className="w-3 h-3 mr-1" /> Edit
                </button>
                <button
                  onClick={() => onDelete(employee)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">{data.length}</span> employees
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-[#EB0A1E] text-white border border-[#EB0A1E]'
                      : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
