'use client';

import { useState, useEffect } from 'react';
import { getSalarySlips, EnrichedSalarySlip, SalarySlipStats as StatsType, saveGeneratedPdfMetadata, sendEmailSimulation, uploadPdfToStorage } from '@/services/salary-slip.service';
import SalarySlipStats from '@/components/salary-slips/SalarySlipStats';
import SalarySlipFilters, { FilterState } from '@/components/salary-slips/SalarySlipFilters';
import SalarySlipActions from '@/components/salary-slips/SalarySlipActions';
import SalarySlipTable from '@/components/salary-slips/SalarySlipTable';
import SalarySlipPreviewModal from '@/components/salary-slips/SalarySlipPreviewModal';
import { createClient } from '@/lib/supabase/client';
import { generatePdfBlob } from '@/lib/pdf-generator';

export default function SalarySlipsPage() {
  const [data, setData] = useState<EnrichedSalarySlip[]>([]);
  const [stats, setStats] = useState<StatsType>({ total: 0, generatedThisMonth: 0, pendingGeneration: 0, emailReady: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{current: number, total: number, message: string} | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    month: 'All',
    year: 'All',
    search: '',
    pdfStatus: 'All',
    emailStatus: 'All'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [previewRecord, setPreviewRecord] = useState<EnrichedSalarySlip | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const result = await getSalarySlips();
    if (result.data) {
      setData(result.data);
      setStats(result.stats);
    }
    setIsLoading(false);
  };

  // --- Filtering Logic ---
  const filteredData = data.filter(row => {
    if (filters.month !== 'All' && String(row.month) !== filters.month) return false;
    if (filters.year !== 'All' && String(row.year) !== filters.year) return false;
    if (filters.pdfStatus !== 'All' && row.pdf_status !== filters.pdfStatus) return false;
    if (filters.emailStatus !== 'All' && row.email_status !== filters.emailStatus) return false;
    
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!row.employee_code.toLowerCase().includes(s) && 
          !row.employee_name.toLowerCase().includes(s)) {
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
    setFilters({ month: 'All', year: 'All', search: '', pdfStatus: 'All', emailStatus: 'All' });
    setCurrentPage(1);
  };

  // --- PDF Generation Logic ---
  const handleDownloadPdf = async (record: EnrichedSalarySlip) => {
    try {
      const blob = await generatePdfBlob(record);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Salary_Slip_${record.employee_code}_${record.month}_${record.year}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch(err) {
       console.error("PDF Download error", err);
       alert("Failed to generate PDF");
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generateSinglePdf = async (record: EnrichedSalarySlip) => {
    try {
      const blob = await generatePdfBlob(record);
      const fileName = `salary_slips/${record.employee_code}_${record.month}_${record.year}.pdf`;
      const base64 = await blobToBase64(blob);
      const result = await uploadPdfToStorage(fileName, base64);

      if (!result.success) {
        console.error("Storage error:", result.error);
        return false;
      }
      
      await saveGeneratedPdfMetadata(record.id, record.employee_id, result.publicUrl!, fileName);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleGeneratePdf = async (record: EnrichedSalarySlip) => {
    setIsGenerating(true);
    await generateSinglePdf(record);
    await fetchData();
    setIsGenerating(false);
  };

  const sendSingleEmail = async (record: EnrichedSalarySlip) => {
    try {
      await sendEmailSimulation(record.id, record.employee_id, record.email);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleSendEmail = async (record: EnrichedSalarySlip) => {
    setIsSending(true);
    await sendSingleEmail(record);
    await fetchData();
    alert(`Email successfully queued for ${record.employee_name}`);
    setIsSending(false);
  };

  // --- Batch Actions ---
  const handleGenerateAll = async () => {
    if (!confirm(`Are you sure you want to regenerate all ${data.length} slips?`)) return;
    setIsGenerating(true);
    setBatchProgress({ current: 0, total: data.length, message: 'Generating PDFs...' });
    
    let successCount = 0;
    for (let i = 0; i < data.length; i++) {
      const success = await generateSinglePdf(data[i]);
      if (success) successCount++;
      setBatchProgress({ current: i + 1, total: data.length, message: 'Generating PDFs...' });
    }
    
    await fetchData();
    setBatchProgress(null);
    setIsGenerating(false);
    alert(`Batch generation complete! Successfully generated ${successCount} out of ${data.length} slips.`);
  };

  const handleGenerateMissing = async () => {
    const missing = data.filter(d => d.pdf_status !== 'Generated');
    if (missing.length === 0) {
      alert("No missing slips found!");
      return;
    }
    if (!confirm(`Generate PDFs for ${missing.length} missing records?`)) return;
    
    setIsGenerating(true);
    setBatchProgress({ current: 0, total: missing.length, message: 'Generating PDFs...' });
    
    let successCount = 0;
    for (let i = 0; i < missing.length; i++) {
      const success = await generateSinglePdf(missing[i]);
      if (success) successCount++;
      setBatchProgress({ current: i + 1, total: missing.length, message: 'Generating PDFs...' });
    }
    
    await fetchData();
    setBatchProgress(null);
    setIsGenerating(false);
    alert(`Generated missing slips successfully! (${successCount}/${missing.length})`);
  };

  const handleSendAllEmails = async () => {
    const readyToSend = data.filter(d => d.pdf_status === 'Generated' && d.email_status !== 'Sent');
    if (readyToSend.length === 0) {
      alert("No emails ready to be sent.");
      return;
    }
    if (!confirm(`Send emails for ${readyToSend.length} generated slips?`)) return;
    
    setIsSending(true);
    setBatchProgress({ current: 0, total: readyToSend.length, message: 'Sending Emails...' });
    
    let successCount = 0;
    for (let i = 0; i < readyToSend.length; i++) {
      const success = await sendSingleEmail(readyToSend[i]);
      if (success) successCount++;
      setBatchProgress({ current: i + 1, total: readyToSend.length, message: 'Sending Emails...' });
    }
    
    await fetchData();
    setBatchProgress(null);
    setIsSending(false);
    alert(`Batch email dispatch complete! Sent ${successCount} out of ${readyToSend.length} emails.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Salary Slips</h2>
        <p className="text-sm text-gray-500 mt-1">Manage generated employee salary slips</p>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-100 rounded-xl"></div>
          <div className="h-20 bg-gray-100 rounded-xl"></div>
          <div className="h-96 bg-gray-100 rounded-xl"></div>
        </div>
      ) : (
        <>
          <SalarySlipStats {...stats} />

          <SalarySlipActions 
            onGenerateAll={handleGenerateAll}
            onGenerateMissing={handleGenerateMissing}
            onSendAllEmails={handleSendAllEmails}
            onDownloadZip={() => alert("Downloading ZIP feature coming soon.")}
            isGenerating={isGenerating}
            isSending={isSending}
          />

          <SalarySlipFilters 
            filters={filters} 
            setFilters={setFilters} 
            onClear={handleClearFilters} 
          />

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SalarySlipTable 
              data={paginatedData}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onPreview={(record) => setPreviewRecord(record)}
              onDownload={handleDownloadPdf}
              onRegenerate={handleGeneratePdf}
              onSendEmail={handleSendEmail}
            />
          </div>

          {/* Preview Modal */}
          {previewRecord && (
            <SalarySlipPreviewModal 
              record={previewRecord} 
              onClose={() => setPreviewRecord(null)}
              onDownload={() => {
                handleDownloadPdf(previewRecord);
                setPreviewRecord(null);
              }}
            />
          )}

          {/* Batch Processing Overlay Modal */}
          {batchProgress && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200 border border-gray-100">
                <div className="w-16 h-16 border-4 border-red-100 border-t-[#EB0A1E] rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{batchProgress.message}</h3>
                <p className="text-sm font-medium text-gray-500 mb-6">
                  Processing record {batchProgress.current} of {batchProgress.total}
                </p>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                  <div 
                    className="bg-[#EB0A1E] h-full rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">
                  {Math.round((batchProgress.current / batchProgress.total) * 100)}%
                </p>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
