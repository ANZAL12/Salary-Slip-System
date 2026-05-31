# System Architecture & Design Document

**Project:** Toyota Salary Slip Automation System  
**Target Audience:** Developers, Technical Reviewers, Evaluators

This document serves as a comprehensive technical overview of the system's architecture, data flow, design patterns, and security strategies.

---

## 🏛️ System Architecture

The application is built using a modern **Monolithic Serverless** architecture leveraging the Next.js App Router framework.

1. **Frontend Layer:** React Server Components (RSC) and Client Components built with Next.js 15 and Tailwind CSS. Emphasizes an aesthetic, responsive UI with immediate feedback.
2. **Business Logic Layer (Service Layer):** Encapsulated Server Actions (`src/services/*`) that bridge the gap between the UI and the database. These act as our secure backend API.
3. **Database Layer:** Supabase PostgreSQL handles relational data integrity, constraints, and querying.
4. **Storage Layer:** Supabase Storage securely houses generated PDF salary slips.
5. **Email Layer:** Nodemailer configured with standard SMTP (Gmail) is used for reliable external communication.

---

## 📂 Folder Structure

The `src/` directory is logically partitioned to enforce separation of concerns:

- **`src/app/`**: Contains the Next.js file-system based routing. It defines the layout (`DashboardShell`) and all page entry points.
- **`src/components/`**: Houses all modular React components. Grouped by domain (e.g., `/employees`, `/salary-records`, `/layout`). Follows a smart/dumb component pattern where possible.
- **`src/services/`**: The core of the backend logic. Exposes asynchronous Server Actions that perform CRUD operations, data aggregation, and trigger external processes.
- **`src/lib/`**: Contains foundational utilities, instances, and configurations.
  - `/email`: Transporter setup and HTML string templates.
  - `/schemas`: Zod schemas ensuring strict type safety and data validation.
  - `pdf-generator.ts`: Logic for rendering PDFs using `pdf-lib`.
  - `supabase/`: Database client initializers.
- **`src/utils/`**: Generic helper functions (formatting dates, parsing currency, etc.).

---

## 🔄 Data Flow

### 1. Employee Upload Flow
1. User uploads a CSV/XLSX file via the Client UI.
2. The browser parses the file into a JSON array.
3. Data is passed through **Zod Validation** schemas. Invalid rows are flagged for user correction.
4. Clean data is passed to `employee.service.ts` (Server Action).
5. The Service Layer bulk inserts the data into the Supabase `employees` table.

### 2. Salary Upload Flow
1. User uploads the monthly payroll CSV.
2. File is parsed and validated against `salary.schema.ts`. Net Salary is computed dynamically if not present.
3. The UI attempts to map `employee_code` to existing Database IDs.
4. Unmatched or invalid rows highlight red in the Preview Table.
5. Valid rows are committed via `payroll.service.ts` to the `salary_records` table.

### 3. PDF Generation Flow
1. User triggers "Generate Slips" from the UI.
2. The `salary-slip.service.ts` queries the DB for records where `pdf_status` is not 'Generated'.
3. For each record, the data is passed to `pdf-generator.ts`.
4. `pdf-lib` creates a new document, draws the Toyota watermark, constructs the tabular data layout, and appends a Verification QR Code.
5. The Buffer is uploaded to Supabase Storage. The DB is updated with the `pdf_url`.

### 4. Email Delivery Flow
1. User triggers "Send Emails" for a specific record or bulk.
2. `email.service.ts` retrieves the record and the designated `is_default` Email Template.
3. Placeholders (e.g., `{{employee_name}}`) in the template are replaced with actual data.
4. Nodemailer establishes an SMTP connection and dispatches the HTML email with the PDF attached (via Storage URL or memory Buffer).
5. Success or failure is logged in the `email_logs` table.

---

## 🗄️ Database Design

The relational database is housed in Supabase (PostgreSQL).

### Tables
- **`employees`**
  - Primary entity holding staff details (`employee_id`, `name`, `email`, `designation`).
  - Indexed on `employee_id` (Unique) and `email` for fast lookups.
- **`salary_records`**
  - Holds the payroll data for a specific month/year.
  - Foreign Key: `employee_id` referencing `employees(id)`.
  - Constraint: Unique combination of `(employee_id, month, year)` prevents duplicate payroll entries.
- **`email_logs`**
  - Tracks delivery statuses.
  - Foreign Key: `salary_record_id` and `employee_id`.
- **`email_templates`**
  - Stores HTML structures for email bodies and subjects. Features an `is_default` boolean to designate the active template.

---

## ☁️ Supabase Architecture

- **Database:** Used purely as a scalable PostgreSQL instance. Direct SQL access via Prisma or Supabase JS client.
- **Storage:** Public/Private buckets used to persist PDF binaries.
- **API Access:** For this application, we utilize the `SUPABASE_SERVICE_ROLE_KEY` on the server-side to bypass Row Level Security (RLS) during trusted operations, ensuring fast and unfettered access to complex aggregations without needing a complex Auth implementation for the single-tenant admin panel.

---

## 📄 PDF Generation Architecture

The system utilizes `pdf-lib` to generate PDFs natively within Node.js.

**Workflow:**
1. **Initialize:** Create a blank A4 canvas.
2. **Watermark:** Draw a faint, scaled Toyota logo image in the center of the page, rotated slightly.
3. **Header:** Embed company name, address, and the specific `Month Year` title.
4. **Data Tables:** Draw horizontal and vertical lines to create a rigid tabular layout for Basic Salary, Allowances, and Deductions.
5. **QR Code:** Generate a base64 DataURI QR Code containing verification details, embedded at the bottom right.
6. **Encryption:** Encrypt the generated PDF buffer using the employee's Date of Birth (DDMMYYYY format) as the password via `@pdfsmaller/pdf-encrypt`.
7. **Output:** Return a `Uint8Array` buffer ready for Storage upload or Email attachment.

---

## 📧 Email Architecture

The system is decoupled to allow flexible email strategies.

- **Nodemailer Service:** Configured as a singleton in `src/lib/email/transporter.ts`.
- **Dynamic Templating:** The `email_templates` table allows Admins to change the copy without developer intervention. A RegEx parser swaps out `{{placeholders}}` with active database context.
- **Resilience:** The bulk email function iterates over records. If one fails, it catches the error, updates `email_logs` to 'failed', and continues to the next, preventing a complete cascade failure.

---

## ⚙️ Service Layer Design

The application abstracts all external side-effects into Services:

- **`employee.service.ts`**: Handles fetching, creating, and deleting employee profiles. Includes statistics aggregation.
- **`payroll.service.ts`**: Manages the upload and validation of bulk salary records.
- **`salary-slip.service.ts`**: Bridges salary records and the PDF generator.
- **`email.service.ts`**: Handles the assembly of the email envelope and Nodemailer dispatch.
- **`report.service.ts`**: Specialized query logic for analytical views (e.g., grouping payroll by department).

---

## 📱 Responsive Design Architecture

A Mobile-First methodology was strictly followed, overriding defaults at distinct breakpoints (`md`, `lg`).

- **Desktop (`1024px+`)**: Optimal view utilizing maximum screen real-estate. Data-heavy tables are fully expanded.
- **Tablet (`768px - 1023px`)**: Grids collapse from 4-columns to 2-columns. Sidebar becomes collapsible to conserve width.
- **Mobile (`< 768px`)**: 
  - Sidebar is completely hidden, accessible via a Backdrop Overlay (Hamburger menu).
  - **Desktop-Table / Mobile-Card Pattern**: A critical design decision. Standard HTML tables are hidden (`hidden md:table`), and replaced by `div`-based stacked cards (`md:hidden flex flex-col`) to present complex tabular data in a vertically scannable format, entirely eliminating horizontal scroll on mobile phones.

---

## 🛡️ Error Handling Strategy

- **Validation Errors:** Zod ensures bad data never reaches the Service Layer. Users receive precise inline UI feedback (e.g., "Invalid Email Format").
- **Database Errors:** Caught within `try/catch` blocks in the Service Layer. Return consistent `{ success: false, error: string }` objects to the frontend to trigger Toast notifications.
- **SMTP/PDF Errors:** Operations that can fail due to network instability are wrapped. A failed email simply updates its status to "Failed" allowing the admin to retry it later, rather than crashing the system.

---

## 🔒 Security Considerations

- **Environment Variables:** All critical secrets (Supabase Keys, SMTP Passwords) are strictly stored in `.env.local` and never exposed to the client bundle.
- **Input Validation:** Zod schemas prevent injection and bad data types.
- **Server Actions:** By utilizing Next.js Server Actions, all database and email operations occur securely on the backend, avoiding exposing database queries in the client-side network tab.

---

## ⚡ Performance Considerations

- **Pagination:** Data tables utilize client/server pagination to prevent rendering thousands of DOM nodes.
- **Service Role Aggregation:** Dashboard metrics rely on Supabase `count` queries rather than pulling full arrays into memory, ensuring quick dashboard loads.
- **Optimistic UI:** Buttons enter loading states (`isGenerating`, `isSending`) immediately upon click to provide perceived performance feedback while the server works.

---

## 👨‍💻 Reviewer Guide

### How To Review This Project

To experience the full capability of the system, please follow this linear flow:

1. **Upload Employees (`/payroll/upload-employees`)**: Use the UI to add mock employees or download the CSV template and upload bulk users. Verify the validation catches missing IDs.
2. **Upload Salary Records (`/payroll/upload-salary`)**: Upload payroll data for the employees you just created. Ensure the UI dynamically calculates the Net Salary.
3. **Generate Salary Slips (`/salary-slips`)**: View your pending records. Click "Generate Salary Slips". This will invoke the `pdf-lib` engine and you will see the statuses change to "Generated". You can click "Preview" to inspect the watermarked PDF.
4. **Send Emails (`/salary-slips`)**: Click "Send All Emails". Review the `email_logs` table to see the delivery status. *(Note: Requires valid SMTP configuration in `.env`)*.
5. **View Analytics (`/reports` & `/`)**: Navigate to the Dashboard and Reports sections to see how the charts dynamically reflect the data you just uploaded. 
6. **Test Responsiveness**: Open Chrome DevTools and toggle Mobile View. Observe how tables seamlessly transition into card layouts.

---

*This document confirms the architectural soundness and production-readiness of the Toyota Salary Slip Automation System.*
