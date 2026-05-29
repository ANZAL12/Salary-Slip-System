# Toyota Salary Slip Automation System - Architecture & Workflow

Welcome to the documentation for the **Toyota Salary Slip Automation System**. This document outlines everything we have built so far, the folder structure, the database design, and how the entire workflow operates. 

This is designed to help you learn and understand how a production-grade enterprise application is structured.

---

## 1. What We Have Built So Far

### Phase 1: Foundation & Git Configuration
- We started with a Next.js 15 application using the App Router, TypeScript, and Tailwind CSS.
- **`.gitignore` Setup:** We configured the repository to ignore unnecessary IDE files (`.vscode`, `.idea`), Windows system files (`Thumbs.db`), and standard Node.js folders (`node_modules`, `.next`). This keeps your GitHub repository clean and professional.

### Phase 2: Enterprise Folder Structure (`src/` Architecture)
We migrated the project from a basic structure to a clean, highly scalable `src/` directory architecture. Here is what each folder does:

- **`src/app/`**: Contains Next.js routing and UI pages.
- **`src/components/`**: UI components categorized by feature (e.g., `dashboard/`, `employees/`, `payroll/`). This modularity makes it easy to find and update UI elements without affecting other parts of the app.
- **`src/lib/`**: Wrappers for external third-party libraries (e.g., Supabase client, PDF generation logic, Email sending via Nodemailer). By wrapping these, if you ever change your PDF library, you only update the code here, not everywhere in your app.
- **`src/services/`**: The core **Business Logic Layer**. Instead of writing database queries directly in your UI components, the UI calls these services (`EmployeeService`, `PayrollService`). This makes the code reusable and easy to test.
- **`src/hooks/`**: Custom React hooks (`useEmployees`, `usePayroll`) to manage state and complex side effects in your UI components.
- **`src/types/`**: Global TypeScript interfaces (`Employee`, `SalaryRecord`). This guarantees strict typing across the entire app, preventing runtime errors.
- **`src/utils/`**: Helper functions (date formatting, salary calculation) and **Zod Validation Schemas** to validate user input before sending it to the database.

### Phase 3: Database & Backend Design (Supabase)
We designed a complete relational PostgreSQL database schema optimized for an internship submission.
- **SQL Schema (`supabase/schema.sql`)**: Contains the table creation scripts, constraints, and indexes.
- **Tables Created**:
  1. `employees`: Stores employee data with unique constraints on `employee_id` and `email`.
  2. `salary_records`: Stores monthly payroll data, linked to the employee. Includes a unique constraint to prevent duplicate salary entries for the same month/year.
  3. `generated_pdfs`: Keeps track of the generated salary slip PDFs and their storage bucket URLs.
  4. `email_logs`: Tracks whether an email was 'sent', 'pending', or 'failed' for auditing.
  5. `activity_logs`: Uses `JSONB` to store flexible metadata for tracking user activity and analytics across the system.

---

## 2. The Application Workflow (How Data Flows)

To understand how you will build features moving forward, here is the mental model of the **Data Flow**:

### 1. User Interaction (UI Component)
A user clicks "Add Employee" on the `EmployeeForm` component located in `src/components/employees/`.

### 2. Validation (Utils)
Before doing anything, the component checks the data against the **Zod Validation Schema** in `src/utils/validations.ts` to ensure the email is valid and names aren't empty.

### 3. State Management (Hook)
If valid, the component passes the data to a custom hook like `useEmployees()` located in `src/hooks/useEmployees.ts`. The hook updates the loading state (e.g., showing a spinner on the screen).

### 4. Business Logic (Service)
The hook calls `EmployeeService.createEmployee(data)` located in `src/services/employee.service.ts`.

### 5. Database Interaction (Lib / Supabase)
The Service uses the configured Supabase client from `src/lib/supabase/client.ts` to securely run an `INSERT` command into the PostgreSQL database.

### 6. Response
The database returns success. The Service passes it to the Hook, which stops the loading spinner, and the UI shows a "Success" notification.

---

## 3. Next Steps For You to Learn and Implement

1. **Supabase Cloud Setup**: You need to run the `supabase/schema.sql` code in your actual Supabase project online to create the tables.
2. **Environment Variables**: Link your local app to the cloud database using `.env.local`.
3. **Connecting the Services**: Open `src/services/employee.service.ts`. Right now, it has `TODO` placeholders. Your next coding task will be replacing those TODOs with real `supabase.from('employees').select('*')` queries.
4. **Building the UI**: Start creating React components inside `src/app/` and `src/components/` that visually represent the dashboard and forms!

---
*Created as part of the Toyota Salary Slip Automation System internship project setup.*
