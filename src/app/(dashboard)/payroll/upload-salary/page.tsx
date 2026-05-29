'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import SalaryUploadStepper from '@/components/payroll/SalaryUploadStepper';
import SalaryUploadZone from '@/components/payroll/SalaryUploadZone';
import SalaryUploadSummary from '@/components/payroll/SalaryUploadSummary';
import SalaryPreviewTable from '@/components/payroll/SalaryPreviewTable';
import SalaryValidationRules from '@/components/payroll/SalaryValidationRules';
import { validateSalaryData, saveSalaryRecordsBatch, ValidatedSalaryRecord } from '@/services/payroll.service';
import { Download, CheckCircle2, Save, Trash2, CheckCircle } from 'lucide-react';

export default function UploadSalaryPage() {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadTime, setUploadTime] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ValidatedSalaryRecord[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<{show: boolean, count: number}>({ show: false, count: 0 });

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setMessage(null);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      const initialRecords: ValidatedSalaryRecord[] = rawJson.map((row: any) => {
        const base_salary = Number(row['Base Salary'] || row['base_salary'] || 0);
        const hra = Number(row['HRA'] || row['hra'] || 0);
        const allowances = Number(row['Allowances'] || row['allowances'] || 0);
        const deductions = Number(row['Deductions'] || row['deductions'] || 0);
        const net_salary = (base_salary + hra + allowances) - deductions;
        
        return {
          employee_id: String(row['Employee ID'] || row['employee_id'] || '').trim(),
          employee_name: '-', // Will be fetched on validation
          base_salary,
          hra,
          allowances,
          deductions,
          net_salary,
          month: String(row['Month'] || row['month'] || '').trim(),
          month_int: 0,
          year: Number(row['Year'] || row['year'] || new Date().getFullYear()),
          status: 'Valid', // default before db check
          errors: []
        };
      });

      setParsedData(initialRecords);
      setFileName(file.name);
      setUploadTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setStep(2); // Preview
      setIsValidated(false);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to parse Excel file. Please ensure it is correctly formatted.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleValidate = async () => {
    setIsProcessing(true);
    setStep(3); // Validating
    setMessage(null);

    try {
      // Pass the raw data to the server action for DB validation
      const rawData = parsedData.map(r => ({
        employee_id: r.employee_id,
        base_salary: r.base_salary,
        hra: r.hra,
        allowances: r.allowances,
        deductions: r.deductions,
        month: r.month,
        year: r.year
      }));

      const validatedRecords = await validateSalaryData(rawData);
      setParsedData(validatedRecords);
      setIsValidated(true);

      const hasErrors = validatedRecords.some(d => d.status !== 'Valid');
      if (hasErrors) {
        setMessage({ type: 'error', text: 'Validation failed. Please review the errors in the table.' });
      } else {
        setMessage({ type: 'success', text: 'Validation successful. All records are ready to save.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Validation failed due to a server error.' });
      setStep(2); // Revert step if complete failure
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStep(4); // Saving
    setMessage(null);

    const validRecords = parsedData.filter(e => e.status === 'Valid');

    if (validRecords.length === 0) {
      setMessage({ type: 'error', text: 'No valid salary records to save.' });
      setIsSaving(false);
      return;
    }

    const result = await saveSalaryRecordsBatch(validRecords);

    if (result.success) {
      setShowSuccessModal({ show: true, count: validRecords.length });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save salary records.' });
      setStep(3); // Go back if failed
    }
    
    setIsSaving(false);
  };

  const handleRemoveFile = () => {
    setParsedData([]);
    setFileName(null);
    setUploadTime(null);
    setStep(1);
    setIsValidated(false);
    setMessage(null);
  };

  const handleModalClose = () => {
    setShowSuccessModal({ show: false, count: 0 });
    handleRemoveFile();
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{
      'Employee ID': 'EMP001',
      'Base Salary': 50000,
      'HRA': 10000,
      'Allowances': 5000,
      'Deductions': 2000,
      'Month': 'May',
      'Year': 2026
    }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salary_Data");
    XLSX.writeFile(wb, "Salary_Upload_Template.xlsx");
  };

  const total = parsedData.length;
  const valid = parsedData.filter(d => d.status === 'Valid').length;
  const invalid = parsedData.filter(d => d.status === 'Invalid').length;
  const duplicate = parsedData.filter(d => d.status === 'Duplicate').length;
  const canSave = isValidated && total > 0 && valid > 0;

  return (
    <div className="space-y-6">
      
      {/* Header & Stepper */}
      <SalaryUploadStepper currentStep={step} />

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg border text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-[#EB0A1E] border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Upload Zone & Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <SalaryUploadZone onFileSelect={handleFileSelect} onDownloadTemplate={downloadTemplate} isLoading={isProcessing || isSaving} />
        
        <SalaryUploadSummary 
          total={total}
          valid={valid}
          invalid={invalid}
          duplicate={duplicate}
          fileName={fileName}
          uploadTime={uploadTime}
        />
      </div>

      {/* Action Buttons & Table */}
      {total > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 mb-4 space-y-4 sm:space-y-0">
            <h2 className="text-lg font-bold text-gray-900 hidden sm:block">Salary Data Preview</h2>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button 
                onClick={handleRemoveFile}
                disabled={isProcessing || isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove File
              </button>
              
              {!isValidated ? (
                <button 
                  onClick={handleValidate}
                  disabled={isProcessing}
                  className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-[#EB0A1E] text-[#EB0A1E] rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Validating...' : 'Validate Data'}
                </button>
              ) : (
                <button 
                  onClick={handleSave}
                  disabled={!canSave || isSaving}
                  className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Salary Data'}
                </button>
              )}
            </div>
          </div>

          <SalaryPreviewTable data={parsedData} />
          
          <SalaryValidationRules />
        </div>
      )}

      {/* Custom Success Modal */}
      {showSuccessModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Successful!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Successfully saved <span className="font-bold text-gray-900">{showSuccessModal.count}</span> salary records to the database.
              </p>
              <button
                onClick={handleModalClose}
                className="w-full py-2.5 bg-[#EB0A1E] text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
