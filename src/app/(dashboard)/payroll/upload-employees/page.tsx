'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import EmployeeStepper from '@/components/payroll/EmployeeStepper';
import EmployeeUploadZone from '@/components/payroll/EmployeeUploadZone';
import EmployeeUploadSummary from '@/components/payroll/EmployeeUploadSummary';
import EmployeePreviewTable, { ParsedEmployee } from '@/components/payroll/EmployeePreviewTable';
import EmployeeValidationRules from '@/components/payroll/EmployeeValidationRules';
import AddEmployeeModal from '@/components/payroll/AddEmployeeModal';
import { saveEmployeesBatch, getEmployees } from '@/services/employee.service';
import { employeeSchema, EmployeeData } from '@/lib/schemas/employee.schema';
import { Download, CheckCircle2, Save, Trash2, UserPlus } from 'lucide-react';

export default function UploadEmployeesPage() {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadTime, setUploadTime] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedEmployee[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<{show: boolean, count: number}>({ show: false, count: 0 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setMessage(null);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      const employees: ParsedEmployee[] = rawJson.map((row: any) => ({
        employee_id: String(row['Employee ID'] || row['employee_id'] || '').trim(),
        name: String(row['Name'] || row['name'] || '').trim(),
        email: String(row['Email'] || row['email'] || '').trim(),
        designation: String(row['Designation'] || row['designation'] || '').trim(),
        dob: String(row['Date of Birth'] || row['dob'] || '').trim(),
        status: 'Under Review' // default, to be validated
      }));

      setParsedData(employees);
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

    const existingResult = await getEmployees();
    const existingIds = new Set(existingResult.data?.map(e => e.employee_id.toLowerCase()) || []);
    const existingEmails = new Set(existingResult.data?.map(e => e.email.toLowerCase()) || []);

    const seenIds = new Set<string>();
    const seenEmails = new Set<string>();

    const validatedData = parsedData.map(emp => {
      const errors: string[] = [];
      const result = employeeSchema.safeParse({ ...emp, status: 'Active' });

      if (!result.success) {
        result.error.issues.forEach(e => errors.push(e.message));
      }

      // Check uniqueness within the file AND in DB
      if (emp.employee_id) {
        if (seenIds.has(emp.employee_id.toLowerCase())) {
          errors.push("Duplicate Employee ID in file");
        } else if (existingIds.has(emp.employee_id.toLowerCase())) {
          errors.push("Duplicate Employee ID in DB");
        }
        seenIds.add(emp.employee_id.toLowerCase());
      }

      if (emp.email) {
        if (seenEmails.has(emp.email.toLowerCase())) {
          errors.push("Duplicate Email in file");
        } else if (existingEmails.has(emp.email.toLowerCase())) {
          errors.push("Duplicate Email in DB");
        }
        seenEmails.add(emp.email.toLowerCase());
      }

      if (errors.length > 0) {
        return {
          ...emp,
          status: errors.some(e => e.includes('Duplicate')) ? 'Duplicate' as const : 'Invalid' as const,
          errors
        };
      }

      return { ...emp, status: 'Valid' as const, errors: [] };
    });

    setParsedData(validatedData);
    setIsValidated(true);
    setIsProcessing(false);

    const hasErrors = validatedData.some(d => d.status !== 'Valid');
    if (hasErrors) {
      setMessage({ type: 'error', text: 'Validation failed. Please review the errors or duplicates in the table.' });
    } else {
      setMessage({ type: 'success', text: 'Validation successful. Ready to save.' });
    }
  };

  const handleRemoveInvalidAndDuplicates = () => {
    setParsedData(prev => prev.filter(d => d.status === 'Valid' || d.status === 'Under Review'));
    setMessage({ type: 'success', text: 'Invalid and duplicate records removed. You can now save the remaining valid employees.' });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStep(4); // Saving
    setMessage(null);

    const validEmployees: EmployeeData[] = parsedData
      .filter(e => e.status === 'Valid')
      .map(e => ({
        employee_id: e.employee_id,
        name: e.name,
        email: e.email,
        designation: e.designation,
        dob: e.dob,
        status: 'Active'
      }));

    if (validEmployees.length === 0) {
      setMessage({ type: 'error', text: 'No valid employees to save.' });
      setIsSaving(false);
      return;
    }

    const result = await saveEmployeesBatch(validEmployees);

    if (result.success) {
      setShowSuccessModal({ show: true, count: validEmployees.length });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save employees.' });
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

  const handleAddEmployee = () => {
    setIsAddModalOpen(true);
  };

  const handleAddEmployeeSubmit = (employee: ParsedEmployee) => {
    setParsedData(prev => [...prev, employee]);
    if (!fileName) {
      setFileName('Manual Entry');
      setUploadTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setStep(2);
    }
    setIsValidated(false);
  };

  const handleModalClose = () => {
    setShowSuccessModal({ show: false, count: 0 });
    handleRemoveFile();
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{
      'Employee ID': 'EMP001',
      'Name': 'John Doe',
      'Email': 'john.doe@toyota.com',
      'Designation': 'Software Engineer',
      'Date of Birth': '1995-05-15'
    }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "Employee_Upload_Template.xlsx");
  };

  const handleUpdateRow = (index: number, updatedData: ParsedEmployee) => {
    setParsedData(prev => {
      const newData = [...prev];
      newData[index] = { ...updatedData, status: 'Under Review' }; // Needs re-validation after edit
      return newData;
    });
    setIsValidated(false); // require re-validation after an edit
    setStep(2);
  };

  const total = parsedData.length;
  const valid = parsedData.filter(d => d.status === 'Valid').length;
  const invalid = parsedData.filter(d => d.status === 'Invalid').length;
  const duplicate = parsedData.filter(d => d.status === 'Duplicate').length;
  const canSave = isValidated && total > 0 && valid > 0;

  return (
    <div className="space-y-6">
      
      {/* Header & Stepper */}
      <EmployeeStepper currentStep={step} />

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
        <EmployeeUploadZone 
          onFileSelect={handleFileSelect} 
          onDownloadTemplate={downloadTemplate} 
          onAddEmployee={handleAddEmployee}
          isLoading={isProcessing || isSaving} 
        />
        
        <EmployeeUploadSummary 
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
            <h2 className="text-lg font-bold text-gray-900 hidden sm:block">Employee Master Data</h2>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button 
                onClick={handleAddEmployee}
                disabled={isProcessing || isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Row
              </button>
              
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
                  Validate Data
                </button>
              ) : (
                <>
                  {(duplicate > 0 || invalid > 0) && (
                    <button 
                      onClick={handleRemoveInvalidAndDuplicates}
                      disabled={isSaving}
                      className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-orange-400 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Invalid & Duplicates
                    </button>
                  )}
                  <button 
                    onClick={handleSave}
                    disabled={!canSave || isSaving}
                    className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Employees'}
                  </button>
                </>
              )}
            </div>
          </div>

          <EmployeePreviewTable data={parsedData} onUpdateRow={handleUpdateRow} />
          
          <EmployeeValidationRules />
        </div>
      )}

      {/* Custom Success Modal */}
      {showSuccessModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Successful!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Successfully saved <span className="font-bold text-gray-900">{showSuccessModal.count}</span> employees to the database.
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

      <AddEmployeeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddEmployeeSubmit}
        suggestedId={`EMP${String(parsedData.length + 1).padStart(3, '0')}`}
      />
    </div>
  );
}
