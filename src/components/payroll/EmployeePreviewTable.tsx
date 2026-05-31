'use client';

import { Search, ChevronLeft, ChevronRight, Edit2, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export type ParsedEmployee = {
  employee_id: string;
  name: string;
  email: string;
  designation: string;
  dob: string;
  status: 'Valid' | 'Invalid' | 'Duplicate' | 'Under Review';
  errors?: string[];
};

interface EmployeePreviewTableProps {
  data: ParsedEmployee[];
  onUpdateRow?: (index: number, data: ParsedEmployee) => void;
  filterStatus?: 'All' | 'Valid' | 'Invalid' | 'Duplicate';
}

export default function EmployeePreviewTable({ data, onUpdateRow, filterStatus = 'All' }: EmployeePreviewTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ParsedEmployee>>({});

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  const dataWithOriginalIndex = data.map((d, i) => ({ ...d, originalIndex: i }));

  const filteredData = dataWithOriginalIndex.filter(emp => {
    const matchesSearch = Object.values(emp).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFilter = filterStatus === 'All' || emp.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditClick = (row: ParsedEmployee & { originalIndex: number }) => {
    setEditingIndex(row.originalIndex);
    setEditFormData({
      employee_id: row.employee_id,
      name: row.name,
      email: row.email,
      designation: row.designation,
      dob: row.dob
    });
  };

  const handleSaveEdit = (originalIndex: number, originalRow: ParsedEmployee) => {
    if (onUpdateRow) {
      onUpdateRow(originalIndex, {
        ...originalRow,
        employee_id: editFormData.employee_id || '',
        name: editFormData.name || '',
        email: editFormData.email || '',
        designation: editFormData.designation || '',
        dob: editFormData.dob || '',
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
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <div className="p-0 sm:p-4 overflow-x-auto custom-scrollbar bg-gray-50 md:bg-white">
        {/* Desktop Table */}
        <table className="hidden md:table w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <th className="px-6 py-3 font-semibold">Employee ID</th>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Designation</th>
              <th className="px-6 py-3 font-semibold">Date of Birth</th>
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
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editFormData.employee_id || ''} 
                          onChange={e => setEditFormData({...editFormData, employee_id: e.target.value})}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ) : row.employee_id}
                    </td>
                    <td className="px-6 py-3">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editFormData.name || ''} 
                          onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ) : row.name}
                    </td>
                    <td className="px-6 py-3">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editFormData.email || ''} 
                          onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ) : row.email}
                    </td>
                    <td className="px-6 py-3">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editFormData.designation || ''} 
                          onChange={e => setEditFormData({...editFormData, designation: e.target.value})}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ) : row.designation}
                    </td>
                    <td className="px-6 py-3">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editFormData.dob || ''} 
                          onChange={e => setEditFormData({...editFormData, dob: e.target.value})}
                          className="w-full px-2 py-1 text-sm border rounded"
                          placeholder="YYYY-MM-DD"
                        />
                      ) : row.dob}
                    </td>
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
                      <td className="px-6 py-3 text-right">
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
                <td colSpan={onUpdateRow ? 7 : 6} className="px-6 py-12 text-center text-gray-500 text-sm">
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
                          value={editFormData.name || ''} 
                          onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      ) : row.name}
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
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Employee ID</p>
                      {isEditing ? (
                        <input type="text" value={editFormData.employee_id || ''} onChange={e => setEditFormData({...editFormData, employee_id: e.target.value})} className="w-full px-2 py-1 mt-1 text-sm border rounded" />
                      ) : <p className="text-gray-900 font-medium mt-0.5">{row.employee_id}</p>}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Date of Birth</p>
                      {isEditing ? (
                        <input type="text" value={editFormData.dob || ''} onChange={e => setEditFormData({...editFormData, dob: e.target.value})} className="w-full px-2 py-1 mt-1 text-sm border rounded" />
                      ) : <p className="text-gray-900 font-medium mt-0.5">{row.dob}</p>}
                    </div>
                    <div className="col-span-2">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                      {isEditing ? (
                        <input type="text" value={editFormData.email || ''} onChange={e => setEditFormData({...editFormData, email: e.target.value})} className="w-full px-2 py-1 mt-1 text-sm border rounded" />
                      ) : <p className="text-gray-900 font-medium mt-0.5 break-all">{row.email}</p>}
                    </div>
                    <div className="col-span-2">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Designation</p>
                      {isEditing ? (
                        <input type="text" value={editFormData.designation || ''} onChange={e => setEditFormData({...editFormData, designation: e.target.value})} className="w-full px-2 py-1 mt-1 text-sm border rounded" />
                      ) : <p className="text-gray-900 font-medium mt-0.5">{row.designation}</p>}
                    </div>
                  </div>

                  {(row.status === 'Invalid' || row.status === 'Duplicate') && row.errors && row.errors.length > 0 && (
                    <div className="mt-2 p-2 bg-red-50/50 rounded-md border border-red-100">
                      <p className="text-xs text-red-600 font-medium">{row.errors[0]}</p>
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
