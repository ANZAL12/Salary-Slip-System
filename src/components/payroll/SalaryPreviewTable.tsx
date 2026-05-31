'use client';

import { Search, ChevronLeft, ChevronRight, Edit2, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ValidatedSalaryRecord } from '@/services/payroll.service';

interface SalaryPreviewTableProps {
  data: ValidatedSalaryRecord[];
  onUpdateRow?: (index: number, data: ValidatedSalaryRecord) => void;
  filterStatus?: 'All' | 'Valid' | 'Invalid' | 'Duplicate';
}

export default function SalaryPreviewTable({ data, onUpdateRow, filterStatus = 'All' }: SalaryPreviewTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ValidatedSalaryRecord>>({});

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  const dataWithOriginalIndex = data.map((d, i) => ({ ...d, originalIndex: i }));

  const duplicateIds = new Set<string>();
  
  if (filterStatus === 'Duplicate') {
    dataWithOriginalIndex.forEach(row => {
      if (row.status === 'Duplicate') {
        if (row.employee_id) duplicateIds.add(row.employee_id.toLowerCase());
      }
    });
  }

  let filteredData = dataWithOriginalIndex.filter(row => {
    const matchesSearch = Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    let matchesFilter = false;
    if (filterStatus === 'All') {
      matchesFilter = true;
    } else if (filterStatus === 'Duplicate') {
      matchesFilter = row.status === 'Duplicate' || 
                      (row.employee_id && duplicateIds.has(row.employee_id.toLowerCase()));
    } else {
      matchesFilter = row.status === filterStatus;
    }
    
    return matchesSearch && matchesFilter;
  });

  if (filterStatus === 'Duplicate') {
    filteredData.sort((a, b) => {
      const idA = a.employee_id?.toLowerCase() || '';
      const idB = b.employee_id?.toLowerCase() || '';
      return idA.localeCompare(idB);
    });
  }

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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <div className="p-0 sm:p-4 overflow-x-auto custom-scrollbar bg-gray-50 md:bg-white">
        {/* Desktop Table */}
        <table className="hidden md:table w-full text-left border-collapse min-w-[1000px]">
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
                          <div className="flex flex-col mt-0.5">
                            {row.errors.map((err, i) => (
                              <span key={i} className="text-[10px] text-red-500 leading-tight" title={err}>
                                • {err}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {row.status === 'Duplicate' && (
                      <div className="flex flex-col gap-1">
                        <span className="px-2.5 py-1 text-xs font-medium bg-orange-50 text-orange-600 rounded-md border border-orange-100 w-fit" title={row.errors?.join(', ')}>Duplicate</span>
                        {row.errors && row.errors.length > 0 && (
                          <div className="flex flex-col mt-0.5">
                            {row.errors.map((err, i) => (
                              <span key={i} className="text-[10px] text-orange-500 leading-tight" title={err}>
                                • {err}
                              </span>
                            ))}
                          </div>
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

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col space-y-3 p-3">
          {paginatedData.length > 0 ? (
            paginatedData.map((row) => {
              const isEditing = editingIndex === row.originalIndex;
              return (
                <div key={row.originalIndex} className={`bg-white p-4 rounded-xl shadow-sm border ${row.status === 'Invalid' ? 'border-red-200' : 'border-gray-100'} flex flex-col space-y-3`}>
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-gray-900 text-base">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editFormData.employee_id || ''} 
                          onChange={e => setEditFormData({...editFormData, employee_id: e.target.value})}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ) : row.employee_id}
                    </div>
                    {/* Status Badge */}
                    <div className="flex-shrink-0 ml-2">
                      {row.status === 'Under Review' && <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600 rounded-md border border-blue-100">Under Review</span>}
                      {row.status === 'Valid' && <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-green-50 text-green-600 rounded-md border border-green-100">Valid</span>}
                      {row.status === 'Invalid' && <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-red-50 text-[#EB0A1E] rounded-md border border-red-100" title={row.errors?.join(', ')}>Invalid</span>}
                      {row.status === 'Duplicate' && <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-orange-50 text-orange-600 rounded-md border border-orange-100" title={row.errors?.join(', ')}>Duplicate</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    <div className="col-span-2">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Employee Name</p>
                      <p className="text-gray-900 font-medium mt-0.5">{row.employee_name}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Base Salary</p>
                      {isEditing ? (
                        <input type="number" value={editFormData.base_salary || ''} onChange={e => setEditFormData({...editFormData, base_salary: Number(e.target.value)})} className="w-full px-2 py-1 mt-1 text-sm border rounded" />
                      ) : <p className="text-gray-900 font-medium mt-0.5">{formatCurrency(row.base_salary)}</p>}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">HRA</p>
                      {isEditing ? (
                        <input type="number" value={editFormData.hra || ''} onChange={e => setEditFormData({...editFormData, hra: Number(e.target.value)})} className="w-full px-2 py-1 mt-1 text-sm border rounded" />
                      ) : <p className="text-gray-900 font-medium mt-0.5">{formatCurrency(row.hra)}</p>}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Allowances</p>
                      {isEditing ? (
                        <input type="number" value={editFormData.allowances || ''} onChange={e => setEditFormData({...editFormData, allowances: Number(e.target.value)})} className="w-full px-2 py-1 mt-1 text-sm border rounded" />
                      ) : <p className="text-gray-900 font-medium mt-0.5">{formatCurrency(row.allowances)}</p>}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Deductions</p>
                      {isEditing ? (
                        <input type="number" value={editFormData.deductions || ''} onChange={e => setEditFormData({...editFormData, deductions: Number(e.target.value)})} className="w-full px-2 py-1 mt-1 text-sm border rounded" />
                      ) : <p className="text-gray-900 font-medium mt-0.5">{formatCurrency(row.deductions)}</p>}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Month</p>
                      {isEditing ? (
                        <input type="text" value={editFormData.month || ''} onChange={e => setEditFormData({...editFormData, month: e.target.value})} className="w-full px-2 py-1 mt-1 text-sm border rounded" />
                      ) : <p className="text-gray-900 font-medium mt-0.5">{row.month}</p>}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Year</p>
                      {isEditing ? (
                        <input type="number" value={editFormData.year || ''} onChange={e => setEditFormData({...editFormData, year: Number(e.target.value)})} className="w-full px-2 py-1 mt-1 text-sm border rounded" />
                      ) : <p className="text-gray-900 font-medium mt-0.5">{row.year}</p>}
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between items-center">
                     <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Net Salary</p>
                     <p className="text-blue-700 font-bold">{formatCurrency(row.net_salary)}</p>
                  </div>

                  {(row.status === 'Invalid' || row.status === 'Duplicate') && row.errors && row.errors.length > 0 && (
                    <div className={`mt-2 p-2 rounded-md border ${row.status === 'Invalid' ? 'bg-red-50/50 border-red-100' : 'bg-orange-50/50 border-orange-100'}`}>
                      {row.errors.map((err, i) => (
                        <p key={i} className={`text-xs font-medium ${row.status === 'Invalid' ? 'text-red-600' : 'text-orange-600'}`}>• {err}</p>
                      ))}
                    </div>
                  )}

                  {onUpdateRow && (
                    <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end">
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <button onClick={handleCancelEdit} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
                          <button onClick={() => handleSaveEdit(row.originalIndex, row)} className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors flex items-center"><Check className="w-3 h-3 mr-1" /> Save</button>
                        </div>
                      ) : (
                        <button onClick={() => handleEditClick(row)} className="px-3 py-1.5 text-xs font-medium text-toyota-red bg-red-50 hover:bg-red-100 rounded-md transition-colors flex items-center">
                          <Edit2 className="w-3 h-3 mr-1" /> Edit Details
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm bg-white rounded-xl border border-gray-100">
              {data.length === 0 ? "No data uploaded yet." : "No matching records found."}
            </div>
          )}
        </div>
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
