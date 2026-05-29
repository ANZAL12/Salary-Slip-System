-- Employees Table
CREATE TABLE public.employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    dob DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for searching employees
CREATE INDEX idx_employees_email ON public.employees(email);
CREATE INDEX idx_employees_employee_id ON public.employees(employee_id);

-- Salary Records Table
CREATE TABLE public.salary_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    month SMALLINT NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL,
    base_salary NUMERIC(10, 2) NOT NULL DEFAULT 0,
    hra NUMERIC(10, 2) NOT NULL DEFAULT 0,
    allowances NUMERIC(10, 2) NOT NULL DEFAULT 0,
    deductions NUMERIC(10, 2) NOT NULL DEFAULT 0,
    net_salary NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Constraint to prevent duplicate records for same employee in the same month & year
    UNIQUE(employee_id, month, year)
);

-- Index for dashboard reporting
CREATE INDEX idx_salary_records_employee_id ON public.salary_records(employee_id);
CREATE INDEX idx_salary_records_period ON public.salary_records(year, month);

-- Generated PDFs Table
CREATE TABLE public.generated_pdfs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    salary_record_id UUID NOT NULL REFERENCES public.salary_records(id) ON DELETE CASCADE,
    pdf_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for future generation/retrieval
CREATE INDEX idx_generated_pdfs_record ON public.generated_pdfs(salary_record_id);

-- Email Logs Table
-- Create an ENUM for status
CREATE TYPE email_status AS ENUM ('pending', 'sent', 'failed');

CREATE TABLE public.email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    salary_record_id UUID REFERENCES public.salary_records(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    status email_status DEFAULT 'pending',
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE
);

-- Index for analytics
CREATE INDEX idx_email_logs_status ON public.email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON public.email_logs(sent_at);

-- Activity Logs Table
CREATE TABLE public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for JSONB queries and time-series search
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX idx_activity_logs_metadata ON public.activity_logs USING GIN (metadata);
