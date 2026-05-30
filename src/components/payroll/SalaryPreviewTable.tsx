'use client';

import { Search, ChevronLeft, ChevronRight, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';
import { ValidatedSalaryRecord } from '@/services/payroll.service';

interface SalaryPreviewTableProps {
  data: ValidatedSalaryRecord[];
  onUpdateRow?: (index: number, data: ValidatedSalaryRecord) => void;
}

export default function SalaryPreviewTable({ data, onUpdateRow }: SalaryPreviewTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ValidatedSalaryRecord>>({});

  const dataWithOriginalIndex = data.map((d, i) => ({ ...d, originalIndex: i }));

  const filteredData = dataWithOriginalIndex.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  const handleEditClick = (row: ValidatedSalaryRecord & { originalIndex: number }) => {
    setEditingIndex(row.originalIndex);
    setEditFormData({
      employee_id: row.employee_id,
      base_salary: row.base_salary,
      hra: row.hra,
      allowances: row.allowances,
      deductions: row.deductions,
      month: row.month,
      year: row.year
    });
  };

  const handleSaveEdit = (originalIndex: number, originalRow: ValidatedSalaryRecord) => {
    if (onUpdateRow) {
      const b = Number(editFormData.base_salary || 0);
      const h = Number(editFormData.hra || 0);
      const a = Number(editFormData.allowances || 0);
      const d = Number(editFormData.deductions || 0);
      const n = (b + h + a) - d;

      onUpdateRow(originalIndex, {
        ...originalRow,
        employee_id: editFormData.employee_id || '',
        base_salary: b,
        hra: h,
        allowances: a,
        deductions: d,
        net_salary: n,
        month: editFormData.month || '',
        year: Number(editFormData.year || new Date().getFullYear()),
      });
    }
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col mt-6">
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-base font-bold text-gray-900">Data Preview</h2>
          <p className="text-sm text-gray-500 mt-0.5">Review your data before saving to database</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <th className="px-6 py-3 font-semibold">Employee ID</th>
              <th className="px-6 py-3 font-semibold">Employee Name</th>
              <th className="px-6 py-3 font-semibold text-right">Base Salary (₹)</th>
              <th className="px-6 py-3 font-semibold text-right">HRA (₹)</th>
              <th className="px-6 py-3 font-semibold text-right">Allowances (₹)</th>
              <th className="px-6 py-3 font-semibold text-right">Deductions (₹)</th>
              <th className="px-6 py-3 font-semibold">Month</th>
              <th className="px-6 py-3 font-semibold">Year</th>
              <th className="px-6 py-3 font-semibold text-right text-blue-600">Net Salary (₹)</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              {onUpdateRow && <th className="px-6 py-3 font-semibold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => {
                const isEditing = editingIndex === row.originalIndex;
                
                return (
                  <tr key={row.originalIndex} className={`border-b border-gray-50 hover:bg-gray-50/50 ${row.status === 'Invalid' ? 'bg-red-50/20' : ''}`}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editFormData.employee_id || ''} 
                          onChange={e => setEditFormData({...editFormData, employee_id: e.target.value})}
                          className="w-full px-2 py-1 text-sm border rounded min-w-[100px]"
                        />
                      ) : row.employee_id}
                    </td>
                    <td className="px-6 py-4">{row.employee_name}</td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editFormData.base_salary || ''} 
                          onChange={e => setEditFormData({...editFormData, base_salary: Number(e.target.value)})}
                          className="w-full px-2 py-1 text-sm border rounded text-right min-w-[80px]"
                        />
                      ) : formatCurrency(row.base_salary)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editFormData.hra || ''} 
                          onChange={e => setEditFormData({...editFormData, hra: Number(e.target.value)})}
                          className="w-full px-2 py-1 text-sm border rounded text-right min-w-[80px]"
                        />
                      ) : formatCurrency(row.hra)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editFormData.allowances || ''} 
                          onChange={e => setEditFormData({...editFormData, allowances: Number(e.target.value)})}
                          className="w-full px-2 py-1 text-sm border rounded text-right min-w-[80px]"
                        />
                      ) : formatCurrency(row.allowances)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editFormData.deductions || ''} 
                          onChange={e => setEditFormData({...editFormData, deductions: Number(e.target.value)})}
                          className="w-full px-2 py-1 text-sm border rounded text-right min-w-[80px]"
                        />
                      ) : formatCurrency(row.deductions)}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editFormData.month || ''} 
                          onChange={e => setEditFormData({...editFormData, month: e.target.value})}
                          className="w-full px-2 py-1 text-sm border rounded min-w-[60px]"
                        />
                      ) : row.month}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editFormData.year || ''} 
                          onChange={e => setEditFormData({...editFormData, year: Number(e.target.value)})}
                          className="w-full px-2 py-1 text-sm border rounded min-w-[80px]"
                        />
                      ) : row.year}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-blue-700">{formatCurrency(row.net_salary)}</td>
                  <td className="px-6 py-4">
                    {row.status === 'Under Review' && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-md border border-blue-100 w-fit">Under Review</span>
                    )}
                    {row.status === 'Valid' && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-md border border-green-100 w-fit">Valid</span>
                    )}
                    {row.status === 'Invalid' && (
                      <div className="flex flex-col gap-1">
                        <span className="px-2.5 py-1 text-xs font-medium bg-red-50 text-[#EB0A1E] rounded-md border border-red-100 w-fit" title={row.errors?.join(', ')}>Invalid</span>
                        {row.errors && row.errors.length > 0 && (
                          <span className="text-[10px] text-red-500 leading-tight" title={row.errors.join(', ')}>
                            {row.errors[0]}
                          </span>
                        )}
                      </div>
                    )}
                    {row.status === 'Duplicate' && (
                      <div className="flex flex-col gap-1">
                        <span className="px-2.5 py-1 text-xs font-medium bg-orange-50 text-orange-600 rounded-md border border-orange-100 w-fit" title={row.errors?.join(', ')}>Duplicate</span>
                        {row.errors && row.errors.length > 0 && (
                          <span className="text-[10px] text-orange-500 leading-tight" title={row.errors.join(', ')}>
                            {row.errors[0]}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  {onUpdateRow && (
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <div className="flex justify-end items-center space-x-2">
                          <button onClick={() => handleSaveEdit(row.originalIndex, row)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Save">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={handleCancelEdit} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="Cancel">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleEditClick(row)} className="p-1.5 text-gray-400 hover:text-[#EB0A1E] hover:bg-red-50 rounded transition-colors" title="Edit row">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
              <tr>
                <td colSpan={onUpdateRow ? 11 : 10} className="px-6 py-12 text-center text-gray-500 text-sm">
                  {data.length === 0 ? "No data uploaded yet." : "No matching records found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <p className="text-sm text-gray-500">
          Showing {Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredData.length, currentPage * itemsPerPage)} of {filteredData.length} records
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-1.5 text-sm font-medium bg-[#EB0A1E] text-white rounded-md">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
