'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DownloadCloud, Plus } from 'lucide-react';
import { getEmployees, deleteEmployee, EmployeeStats as StatsType } from '@/services/employee.service';
import { EmployeeRecord } from '@/lib/schemas/employee.schema';
import EmployeeStats from '@/components/employees/EmployeeStats';
import EmployeeFilters, { EmployeeFilterState } from '@/components/employees/EmployeeFilters';
import EmployeeTable from '@/components/employees/EmployeeTable';
import EmployeeViewModal from '@/components/employees/EmployeeViewModal';
import EmployeeFormModal from '@/components/employees/EmployeeFormModal';

export default function EmployeesPage() {
  const router = useRouter();
  
  const [data, setData] = useState<EmployeeRecord[]>([]);
  const [stats, setStats] = useState<StatsType>({ total: 0, active: 0, inactive: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [viewRecord, setViewRecord] = useState<EmployeeRecord | null>(null);
  const [editRecord, setEditRecord] = useState<EmployeeRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Filtering state
  const [filters, setFilters] = useState<EmployeeFilterState>({
    search: '',
    designation: 'All',
    status: 'All'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const result = await getEmployees();
    if (result.success && result.data) {
      setData(result.data as EmployeeRecord[]);
      setStats(result.stats || { total: 0, active: 0, inactive: 0 });
    }
    setIsLoading(false);
  };

  // Filter Logic
  const filteredData = data.filter(row => {
    if (filters.designation !== 'All' && row.designation !== filters.designation) return false;
    if (filters.status !== 'All' && row.status !== filters.status) return false;
    
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (
        !row.employee_id.toLowerCase().includes(s) && 
        !row.name.toLowerCase().includes(s) &&
        !row.email.toLowerCase().includes(s)
      ) {
        return false;
      }
    }
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearFilters = () => {
    setFilters({ search: '', designation: 'All', status: 'All' });
    setCurrentPage(1);
  };

  const handleDelete = async (record: EmployeeRecord) => {
    if (!confirm(`Are you sure you want to delete ${record.name}? WARNING: This may cascade and delete all associated salary records and PDFs.`)) {
      return;
    }
    const result = await deleteEmployee(record.id);
    if (result.success) {
      alert("Employee deleted successfully");
      fetchData();
    } else {
      alert(`Failed to delete employee: ${result.error}`);
    }
  };

  const handleFormSuccess = (msg: string) => {
    alert(msg);
    setIsAddModalOpen(false);
    setEditRecord(null);
    fetchData();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Employees</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and view all employee information</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => router.push('/payroll/upload-employees')}
            className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 bg-white font-medium rounded-lg hover:bg-gray-50 focus:outline-none transition-colors shadow-sm"
          >
            <DownloadCloud className="w-4 h-4 mr-2" />
            Import Employees
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-[#EB0A1E] text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB0A1E] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-28 bg-gray-100 rounded-2xl"></div>
            <div className="h-28 bg-gray-100 rounded-2xl"></div>
            <div className="h-28 bg-gray-100 rounded-2xl"></div>
          </div>
          <div className="h-20 bg-gray-100 rounded-xl"></div>
          <div className="h-96 bg-gray-100 rounded-xl"></div>
        </div>
      ) : (
        <>
          <EmployeeStats {...stats} />

          <EmployeeFilters 
            filters={filters} 
            setFilters={setFilters} 
            onClear={handleClearFilters}
            data={data}
          />

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EmployeeTable 
              data={paginatedData}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onView={(record) => setViewRecord(record)}
              onEdit={(record) => setEditRecord(record)}
              onDelete={handleDelete}
            />
          </div>

          {/* Modals */}
          {viewRecord && (
            <EmployeeViewModal 
              employee={viewRecord} 
              onClose={() => setViewRecord(null)} 
            />
          )}

          {(isAddModalOpen || editRecord) && (
            <EmployeeFormModal 
              employee={editRecord || undefined}
              onClose={() => {
                setIsAddModalOpen(false);
                setEditRecord(null);
              }}
              onSuccess={handleFormSuccess}
            />
          )}

        </>
      )}

    </div>
  );
}
