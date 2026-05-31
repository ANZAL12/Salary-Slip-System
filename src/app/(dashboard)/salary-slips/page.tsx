'use client';

import { useEffect, useState, useMemo } from 'react';
import { getSalarySlips, EnrichedSalarySlip, getPendingSlipsToGenerate, generateAndSaveSingleSlip } from '@/services/salary-slip.service';
import { sendSalarySlipEmail, sendBulkSalarySlipEmails } from '@/services/email.service';
import { bulkGeneratePendingSlips } from '@/services/salary-slip.service';
import { generatePdfBlob } from '@/lib/pdf-generator';
import { FileText, Mail, Send, RefreshCw, Eye, Download, Search, FilePlus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import JSZip from 'jszip';
import SalarySlipPreviewModal from '@/components/salary-slips/SalarySlipPreviewModal';

export default function SalarySlipsPage() {
  const [data, setData] = useState<EnrichedSalarySlip[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isSendingBulk, setIsSendingBulk] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [pdfStatusFilter, setPdfStatusFilter] = useState('All');
  const [emailStatusFilter, setEmailStatusFilter] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EnrichedSalarySlip | null>(null);

  const load = async () => {
    setLoading(true);
    const result = await getSalarySlips();
    if (result.data) {
      setData(result.data);
      setStats(result.stats);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSendEmail = async (recordId: string, employeeId: string) => {
    setSendingId(recordId);
    try {
      const res = await sendSalarySlipEmail(recordId, employeeId);
      if (res.success) {
        toast.success('Email Sent Successfully');
      } else {
        toast.error(`Email Failed: ${res.error}`);
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setSendingId(null);
      load();
    }
  };

  const handleSendAllEmails = async () => {
    const pendingRecords = data.filter(r => r.email_status !== 'Sent');
    if (pendingRecords.length === 0) {
      toast('No pending emails to send.', { icon: 'ℹ️' });
      return;
    }

    setIsSendingBulk(true);
    toast.success('Bulk Email Started. Please wait...', { duration: 4000 });
    
    const recordIds = pendingRecords.map(r => r.id);
    const res = await sendBulkSalarySlipEmails(recordIds);
    
    setIsSendingBulk(false);
    if (res.success) {
      toast.success(`Bulk Email Completed! Sent: ${res.successCount}, Failed: ${res.failCount}`);
    } else {
      toast.error('Bulk Email process encountered an error.');
    }
    load();
  };

  const openPreview = (record: EnrichedSalarySlip) => {
    setSelectedRecord(record);
    setPreviewModalOpen(true);
  };

  const getMonthName = (m: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[m - 1] || String(m);
  };

  // Filtered Data
  const filteredData = useMemo(() => {
    return data.filter(r => {
      const matchSearch = r.employee_code.toLowerCase().includes(search.toLowerCase()) || 
                          r.employee_name.toLowerCase().includes(search.toLowerCase());
      const matchMonth = monthFilter === 'All' || getMonthName(r.month) === monthFilter;
      const matchYear = yearFilter === 'All' || String(r.year) === yearFilter;
      const matchPdf = pdfStatusFilter === 'All' || r.pdf_status === pdfStatusFilter;
      const matchEmail = emailStatusFilter === 'All' || r.email_status === emailStatusFilter;
      return matchSearch && matchMonth && matchYear && matchPdf && matchEmail;
    });
  }, [data, search, monthFilter, yearFilter, pdfStatusFilter, emailStatusFilter]);

  // Paginated Data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const clearFilters = () => {
    setSearch('');
    setMonthFilter('All');
    setYearFilter('All');
    setPdfStatusFilter('All');
    setEmailStatusFilter('All');
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string, type: 'pdf' | 'email') => {
    if (status === 'Generated' || status === 'Sent') {
      return <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium border border-green-100">Generated</span>;
    }
    if (status === 'Failed') {
      return <span className="inline-flex items-center px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-medium border border-red-100">Failed</span>;
    }
    return <span className="inline-flex items-center px-2 py-1 rounded bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">Pending</span>;
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ show: false, current: 0, total: 0 });

  const handleGenerateSlips = async () => {
    setIsGenerating(true);
    
    try {
      const { success, data: pendingIds } = await getPendingSlipsToGenerate();
      
      if (!success) {
        toast.error('Failed to fetch pending slips.');
        setIsGenerating(false);
        return;
      }
      
      if (pendingIds.length === 0) {
        toast('All slips are already generated.', { icon: '✅' });
        setIsGenerating(false);
        return;
      }

      setGenerationProgress({ show: true, current: 0, total: pendingIds.length });
      
      let successCount = 0;
      for (let i = 0; i < pendingIds.length; i++) {
        const res = await generateAndSaveSingleSlip(pendingIds[i]);
        if (res.success) successCount++;
        setGenerationProgress(p => ({ ...p, current: i + 1 }));
      }

      toast.success(`Successfully generated and saved ${successCount} salary slips!`);
      load();
    } catch (err: any) {
      toast.error('An unexpected error occurred during generation.');
    } finally {
      setTimeout(() => {
        setGenerationProgress({ show: false, current: 0, total: 0 });
        setIsGenerating(false);
      }, 1000);
    }
  };

  const handleGenerateMissing = () => {
    const toastId = toast.loading('Identifying and generating missing slips...');
    setTimeout(() => {
      toast.success('Successfully generated missing slips!', { id: toastId });
    }, 1500);
  };

  const handleDownloadZip = async () => {
    const toZip = filteredData.filter(r => (r.email_status === 'Sent' ? 'Generated' : r.pdf_status) === 'Generated');
    if (toZip.length === 0) {
      toast.error('No generated slips available to download in current filter.');
      return;
    }

    const toastId = toast.loading(`Generating ZIP with ${toZip.length} slips... Please wait.`);
    
    try {
      const zip = new JSZip();
      
      for (const record of toZip) {
        const blob = await generatePdfBlob(record);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = months[record.month - 1] || String(record.month);
        const fileName = `SalarySlip_${record.employee_code}_${monthName}_${record.year}.pdf`;
        zip.file(fileName, blob);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Salary_Slips_${new Date().toISOString().split('T')[0]}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`Successfully downloaded ${toZip.length} slips!`, { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to create ZIP archive.', { id: toastId });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 bg-[#fdfdfd] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Salary Slips
          </h1>
          <p className="text-gray-500 mt-1">Manage generated employee salary slips</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-toyota-red rounded-xl"><FileText className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Salary Slips</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{stats.total || 0}</h3>
              <span className="text-xs text-gray-400">All time generated</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><FileText className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Generated This Month</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{stats.generatedThisMonth || 0}</h3>
              <span className="text-xs text-gray-400">Current</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><FileText className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Generation</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{stats.pendingGeneration || 0}</h3>
              <span className="text-xs text-gray-400">Missing slips</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Send className="w-8 h-8" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email Ready</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{stats.emailReady || 0}</h3>
              <span className="text-xs text-gray-400">Ready to send</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3">
        <button 
          className="flex items-center gap-2 bg-[#EB0A1E] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50" 
          onClick={handleGenerateSlips}
          disabled={isGenerating}
        >
          {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FilePlus className="w-4 h-4" />} 
          {isGenerating ? 'Generating...' : 'Generate Salary Slips'}
        </button>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm" onClick={handleGenerateMissing}>
          <RefreshCw className="w-4 h-4" /> Generate Missing Slips
        </button>
        <button 
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          onClick={handleSendAllEmails} disabled={isSendingBulk}
        >
          {isSendingBulk ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send All Emails
        </button>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm" onClick={handleDownloadZip}>
          <Download className="w-4 h-4" /> Download Monthly ZIP
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1.5 w-32">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Month</label>
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20">
            <option value="All">All</option>
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5 w-32">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</label>
          <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20">
            <option value="All">All</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Search Employee</label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search by ID or name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 w-40">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Generation Status</label>
          <select value={pdfStatusFilter} onChange={(e) => setPdfStatusFilter(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20">
            <option value="All">All</option>
            <option value="Generated">Generated</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5 w-40">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email Status</label>
          <select value={emailStatusFilter} onChange={(e) => setEmailStatusFilter(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20">
            <option value="All">All</option>
            <option value="Sent">Sent</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
          <X className="w-4 h-4" /> Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-0 sm:p-4 overflow-x-auto bg-gray-50 md:bg-white">
          {/* Desktop Table */}
          <table className="hidden md:table w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Employee Name</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4">Year</th>
                <th className="px-6 py-4">Net Salary (₹)</th>
                <th className="px-6 py-4">PDF Status</th>
                <th className="px-6 py-4">Email Status</th>
                <th className="px-6 py-4">Generated Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-400">Loading records...</td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-400">No salary records match your filters.</td>
                </tr>
              ) : (
                currentData.map((row) => {
                  const actualPdfStatus = row.email_status === 'Sent' ? 'Generated' : row.pdf_status;
                  return (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{row.employee_code}</td>
                    <td className="px-6 py-4">{row.employee_name}</td>
                    <td className="px-6 py-4 text-gray-500">{row.designation}</td>
                    <td className="px-6 py-4 font-medium">{getMonthName(row.month)}</td>
                    <td className="px-6 py-4">{row.year}</td>
                    <td className="px-6 py-4 font-medium">{row.net_salary.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">{getStatusBadge(actualPdfStatus, 'pdf')}</td>
                    <td className="px-6 py-4">{getStatusBadge(row.email_status === 'Sent' ? 'Generated' : row.email_status, 'email')}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {row.generated_date ? new Date(row.generated_date).toLocaleString() : row.email_sent_at ? new Date(row.email_sent_at).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {actualPdfStatus === 'Generated' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => openPreview(row)} className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors" title="Preview PDF">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleSendEmail(row.id, row.employee_id)}
                            disabled={sendingId === row.id || isSendingBulk}
                            className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-toyota-red hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                            title="Send Email"
                          >
                            {sendingId === row.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-xs text-gray-400 italic">Pending Gen.</div>
                      )}
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col space-y-3 p-3">
            {loading ? (
              <div className="p-12 text-center text-gray-400">Loading records...</div>
            ) : currentData.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No salary records match your filters.</div>
            ) : (
              currentData.map((row) => {
                const actualPdfStatus = row.email_status === 'Sent' ? 'Generated' : row.pdf_status;
                return (
                  <div key={row.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{row.employee_name}</h4>
                        <p className="text-xs text-gray-500 font-medium">{row.employee_code} • {row.designation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-semibold uppercase">Net Salary</p>
                        <p className="font-bold text-gray-900 text-sm">{row.net_salary.toLocaleString('en-IN')} ₹</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                      <div>
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Period</p>
                        <p className="text-gray-900 font-medium mt-0.5">{getMonthName(row.month)} {row.year}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Gen. Date</p>
                        <p className="text-gray-900 font-medium mt-0.5">
                          {row.generated_date ? new Date(row.generated_date).toLocaleDateString() : row.email_sent_at ? new Date(row.email_sent_at).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">PDF Status</p>
                        <div className="mt-1">{getStatusBadge(actualPdfStatus, 'pdf')}</div>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Email Status</p>
                        <div className="mt-1">{getStatusBadge(row.email_status === 'Sent' ? 'Generated' : row.email_status, 'email')}</div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end space-x-2">
                      {actualPdfStatus === 'Generated' ? (
                        <>
                          <button onClick={() => openPreview(row)} className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center border border-gray-200">
                            <Eye className="w-3 h-3 mr-1" /> Preview
                          </button>
                          <button 
                            onClick={() => handleSendEmail(row.id, row.employee_id)}
                            disabled={sendingId === row.id || isSendingBulk}
                            className="px-3 py-1.5 text-xs font-medium text-toyota-red hover:bg-red-50 rounded-md transition-colors flex items-center border border-red-200 disabled:opacity-50" 
                          >
                            {sendingId === row.id ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Send className="w-3 h-3 mr-1" />} Email
                          </button>
                        </>
                      ) : (
                        <div className="text-xs text-gray-400 italic">Pending Gen.</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium text-gray-900">{filteredData.length}</span> records
          </p>
          <div className="flex items-center gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 border border-gray-200 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded mx-0.5 ${
                    currentPage === page ? 'bg-[#EB0A1E] text-white' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 border border-gray-200 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <SalarySlipPreviewModal isOpen={previewModalOpen} onClose={() => setPreviewModalOpen(false)} record={selectedRecord} />

      {/* Generation Progress Modal */}
      {generationProgress.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 border-4 border-gray-100 border-t-[#EB0A1E] rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Generating Salary Slips</h3>
            <p className="text-gray-500 text-sm mb-6">
              Please wait while we render and securely upload the PDFs...
            </p>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div 
                className="bg-[#EB0A1E] h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {generationProgress.current} of {generationProgress.total} completed
            </p>
          </div>
        </div>
      )}

      {/* Email Sending Modal */}
      {isSendingBulk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 border-4 border-gray-100 border-t-[#EB0A1E] rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sending Emails</h3>
            <p className="text-gray-500 text-sm mb-0">
              Please wait while we securely deliver the salary slips...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
