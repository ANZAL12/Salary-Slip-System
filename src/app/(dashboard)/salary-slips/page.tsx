'use client';

import { useState, useEffect } from 'react';
import { getSalarySlips, EnrichedSalarySlip, SalarySlipStats as StatsType, saveGeneratedPdfMetadata, sendEmailSimulation, uploadPdfToStorage } from '@/services/salary-slip.service';
import SalarySlipStats from '@/components/salary-slips/SalarySlipStats';
import SalarySlipFilters, { FilterState } from '@/components/salary-slips/SalarySlipFilters';
import SalarySlipActions from '@/components/salary-slips/SalarySlipActions';
import SalarySlipTable from '@/components/salary-slips/SalarySlipTable';
import SalarySlipPreviewModal from '@/components/salary-slips/SalarySlipPreviewModal';
import { createClient } from '@/lib/supabase/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SalarySlipsPage() {
  const [data, setData] = useState<EnrichedSalarySlip[]>([]);
  const [stats, setStats] = useState<StatsType>({ total: 0, generatedThisMonth: 0, pendingGeneration: 0, emailReady: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
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
  const generatePdfBlob = (record: EnrichedSalarySlip): Blob => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(235, 10, 30); // Toyota Red
    doc.text('TOYOTA', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Nippon Toyota', 14, 26);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Salary Slip', 140, 20);
    doc.setFontSize(10);
    doc.text(`Month: ${record.month}/${record.year}`, 140, 26);

    // Details
    autoTable(doc, {
      startY: 40,
      head: [['Employee Details', '']],
      body: [
        ['Employee ID:', record.employee_code],
        ['Name:', record.employee_name],
        ['Designation:', record.designation],
      ],
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 }
    });

    const formatCurrency = (num: number) => `Rs. ${new Intl.NumberFormat('en-IN').format(num || 0)}`;

    // Financials
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Earnings', 'Amount', 'Deductions', 'Amount']],
      body: [
        ['Base Salary', formatCurrency(record.base_salary), 'Total Deductions', formatCurrency(record.deductions)],
        ['HRA', formatCurrency(record.hra), '', ''],
        ['Allowances', formatCurrency(record.allowances), '', ''],
      ],
      theme: 'grid',
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
    });

    // Totals
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY,
      body: [
        ['Net Salary', '', '', formatCurrency(record.net_salary)]
      ],
      theme: 'grid',
      styles: { fontStyle: 'bold', textColor: [235, 10, 30] } // Red Net Salary
    });

    return doc.output('blob');
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleDownloadPdf = (record: EnrichedSalarySlip) => {
    const blob = generatePdfBlob(record);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Salary_Slip_${record.employee_code}_${record.month}_${record.year}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGeneratePdf = async (record: EnrichedSalarySlip) => {
    setIsGenerating(true);
    try {
      const blob = generatePdfBlob(record);
      const fileName = `salary_slips/${record.employee_code}_${record.month}_${record.year}.pdf`;
      
      const base64 = await blobToBase64(blob);
      
      // Upload via Server Action to bypass RLS
      const result = await uploadPdfToStorage(fileName, base64);

      if (!result.success) {
        console.error("Storage error:", result.error);
        alert("Failed to upload PDF to storage: " + result.error);
        return;
      }
      
      // Save metadata to DB
      await saveGeneratedPdfMetadata(record.id, record.employee_id, result.publicUrl!, fileName);
      
      // Refresh data
      await fetchData();
    } catch (e) {
      console.error(e);
      alert("Error generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async (record: EnrichedSalarySlip) => {
    setIsSending(true);
    try {
      // Simulation of email dispatch that writes to email_logs table
      await sendEmailSimulation(record.id, record.employee_id, record.email);
      await fetchData();
      alert(`Email successfully queued for ${record.employee_name}`);
    } catch (e) {
      console.error(e);
      alert("Error sending email");
    } finally {
      setIsSending(false);
    }
  };

  // --- Batch Actions ---
  const handleGenerateAll = async () => {
    if (!confirm(`Are you sure you want to regenerate all ${data.length} slips?`)) return;
    setIsGenerating(true);
    for (const record of data) {
      await handleGeneratePdf(record);
    }
    setIsGenerating(false);
    alert("Batch generation complete!");
  };

  const handleGenerateMissing = async () => {
    const missing = data.filter(d => d.pdf_status !== 'Generated');
    if (missing.length === 0) {
      alert("No missing slips found!");
      return;
    }
    if (!confirm(`Generate PDFs for ${missing.length} missing records?`)) return;
    
    setIsGenerating(true);
    for (const record of missing) {
      await handleGeneratePdf(record);
    }
    setIsGenerating(false);
    alert("Generated missing slips successfully!");
  };

  const handleSendAllEmails = async () => {
    const readyToSend = data.filter(d => d.pdf_status === 'Generated' && d.email_status !== 'Sent');
    if (readyToSend.length === 0) {
      alert("No emails ready to be sent.");
      return;
    }
    if (!confirm(`Send emails for ${readyToSend.length} generated slips?`)) return;
    
    setIsSending(true);
    for (const record of readyToSend) {
      await handleSendEmail(record);
    }
    setIsSending(false);
    alert("Batch email dispatch complete!");
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
        </>
      )}

    </div>
  );
}
