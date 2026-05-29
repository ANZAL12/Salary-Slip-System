export interface GeneratedPdf {
  id: string; // uuid
  employee_id: string; // uuid
  salary_record_id: string; // uuid
  pdf_url: string;
  file_name: string;
  generated_at: string;
}

export type CreateGeneratedPdfDTO = Omit<GeneratedPdf, 'id' | 'generated_at'>;
