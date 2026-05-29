'use client';

import React, { useState, useEffect } from 'react';
import { getSalaryRecords, deleteSalaryRecord, SalaryRecordStats as StatsType } from '@/services/payroll.service';
import { SalaryRecordDB } from '@/lib/schemas/salary.schema';
import SalaryRecordStats from '@/components/salary-records/SalaryRecordStats';
import SalaryRecordFilters, { SalaryFilterState } from '@/components/salary-records/SalaryRecordFilters';
import SalaryRecordTable from '@/components/salary-records/SalaryRecordTable';
import SalaryRecordViewDrawer from '@/components/salary-records/SalaryRecordViewDrawer';
import SalaryRecordEditModal from '@/components/salary-records/SalaryRecordEditModal';

export default function SalaryRecordsPage() {
  
  const [data, setData] = useState<SalaryRecordDB[]>([]);
  const [stats, setStats] = useState<StatsType>({ totalRecords: 0, currentMonthRecords: 0, totalPayrollAmount: 0, averageNetSalary: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [viewRecord, setViewRecord] = useState<SalaryRecordDB | null>(null);
  const [editRecord, setEditRecord] = useState<SalaryRecordDB | null>(null);

  // Pagination & Filtering
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [filters, setFilters] = useState<SalaryFilterState>({
    search: '',
    month: 'All',
    year: 'All'
  });

  const fetchData = async () => {
    setIsLoading(true);
    const result = await getSalaryRecords();
    if (result.success && result.data) {
      setData(result.data as SalaryRecordDB[]);
      setStats(result.stats || { totalRecords: 0, currentMonthRecords: 0, totalPayrollAmount: 0, averageNetSalary: 0 });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtering Logic
  const filteredData = data.filter(row => {
    if (filters.month !== 'All' && String(row.month) !== filters.month) return false;
    if (filters.year !== 'All' && String(row.year) !== filters.year) return false;
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const empId = row.employees?.employee_id?.toLowerCase() || '';
      if (!empId.includes(searchTerm)) {
        return false;
      }
    }
    return true;
  });

  const handleClearFilters = () => {
    setFilters({ search: '', month: 'All', year: 'All' });
    setCurrentPage(1);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleDelete = async (record: SalaryRecordDB) => {
    const confirm = window.confirm(`Are you sure you want to delete the salary record for ${record.employees?.employee_id}? This action cannot be undone.`);
    if (confirm) {
      const result = await deleteSalaryRecord(record.id);
      if (result.success) {
        fetchData(); // refresh data to update stats
      } else {
        alert(`Error deleting record: ${result.error}`);
      }
    }
  };

  const handleEditSuccess = (message: string) => {
    setEditRecord(null);
    fetchData(); // refresh data to update stats and table
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Salary Records</h1>
        <p className="text-gray-500 mt-1">View and manage monthly salary records</p>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-28 bg-gray-100 rounded-2xl"></div>
            <div className="h-28 bg-gray-100 rounded-2xl"></div>
            <div className="h-28 bg-gray-100 rounded-2xl"></div>
            <div className="h-28 bg-gray-100 rounded-2xl"></div>
          </div>
          <div className="h-20 bg-gray-100 rounded-xl"></div>
          <div className="h-96 bg-gray-100 rounded-xl"></div>
        </div>
      ) : (
        <>
          <SalaryRecordStats {...stats} />

          <SalaryRecordFilters 
            filters={filters} 
            setFilters={setFilters} 
            onClear={handleClearFilters} 
            data={data}
          />

          <SalaryRecordTable 
            data={currentData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onView={setViewRecord}
            onEdit={setEditRecord}
            onDelete={handleDelete}
          />
        </>
      )}

      {/* View Drawer */}
      {viewRecord && (
        <SalaryRecordViewDrawer 
          record={viewRecord} 
          onClose={() => setViewRecord(null)} 
        />
      )}

      {/* Edit Modal */}
      {editRecord && (
        <SalaryRecordEditModal 
          record={editRecord} 
          onClose={() => setEditRecord(null)} 
          onSuccess={handleEditSuccess}
        />
      )}

    </div>
  );
}
