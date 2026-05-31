'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, FileText, Send, Clock, ArrowRight, UploadCloud, Info, CheckCircle, AlertTriangle, XCircle, Activity, Layers, Mail, PieChart as PieChartIcon } from 'lucide-react';
import { SiToyota } from 'react-icons/si';
import { getDashboardMetrics, DashboardMetrics } from '@/services/dashboard.service';

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const result = await getDashboardMetrics();
      if (result.success && result.data) {
        setMetrics(result.data);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-32 bg-gray-100 rounded-xl"></div>
          <div className="h-32 bg-gray-100 rounded-xl"></div>
          <div className="h-32 bg-gray-100 rounded-xl"></div>
          <div className="h-32 bg-gray-100 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-100 rounded-xl"></div>
          <div className="h-80 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const {
    totalEmployees,
    salaryRecordsCurrentMonth,
    salaryRecordsTotal,
    emailsSent,
    emailsPending,
    emailsFailed,
    payrollOverview,
    recentUploads,
    recentActivities
  } = metrics;

  const totalEmails = emailsSent + emailsPending + emailsFailed;
  const emailSuccessRate = totalEmails > 0 ? ((emailsSent / totalEmails) * 100).toFixed(1) : '0';

  const payrollCompleted = salaryRecordsCurrentMonth;
  const payrollInProgress = Math.max(0, totalEmployees - salaryRecordsCurrentMonth);
  const payrollFailed = 0;
  const payrollHealthRate = totalEmployees > 0 ? ((payrollCompleted / totalEmployees) * 100).toFixed(0) : '0';

  const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  // Gauge SVG Math
  const gaugeTotalLen = 150.79; // 270 degrees sweep

  const pGap = totalEmployees > 0 ? 2 : 0;
  const cLen = totalEmployees > 0 ? (payrollCompleted / totalEmployees) * gaugeTotalLen : 0;
  const iLen = totalEmployees > 0 ? (payrollInProgress / totalEmployees) * gaugeTotalLen : 0;
  const fLen = totalEmployees > 0 ? (payrollFailed / totalEmployees) * gaugeTotalLen : 0;
  const cDraw = Math.max(0, cLen - pGap);
  const iDraw = Math.max(0, iLen - pGap);
  const fDraw = Math.max(0, fLen - pGap);

  const eGap = totalEmails > 0 ? 2 : 0;
  const eSentLen = totalEmails > 0 ? (emailsSent / totalEmails) * gaugeTotalLen : 0;
  const eFailedLen = totalEmails > 0 ? (emailsFailed / totalEmails) * gaugeTotalLen : 0;
  const ePendingLen = totalEmails > 0 ? (emailsPending / totalEmails) * gaugeTotalLen : 0;
  const eSentDraw = Math.max(0, eSentLen - eGap);
  const eFailedDraw = Math.max(0, eFailedLen - eGap);
  const ePendingDraw = Math.max(0, ePendingLen - eGap);

  return (
    <div className="space-y-6 relative z-0">
      
      {/* Custom Toyota Dealership Wireframe Background */}
      <div 
        className="fixed bottom-0 right-0 w-[900px] h-[500px] opacity-20 pointer-events-none -z-10 hidden xl:block mix-blend-multiply"
        style={{
          backgroundImage: `url("/toyota-dealership-bg.png")`,
          backgroundSize: 'contain',
          backgroundPosition: 'bottom right',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Mobile Toyota Dealership Wireframe Background */}
      <div 
        className="fixed inset-0 w-full h-full opacity-[0.12] pointer-events-none -z-10 block xl:hidden mix-blend-multiply"
        style={{
          backgroundImage: `url("/toyota-dealership-bg-mobile.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* SECTION 2: PAYROLL AUTOMATION WORKFLOW */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
        <div className="mb-6">
          <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase">Payroll Automation Workflow</h2>
          <p className="text-xs text-gray-500 mt-1">Real-time overview of payroll process</p>
        </div>
        
        {/* Workflow Steps */}
        <div className="flex flex-col md:flex-row items-center justify-between relative gap-8 md:gap-0">
          
          {/* Desktop Horizontal Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-[2px] bg-gray-100 -translate-y-1/2 -z-0"></div>
          
          {/* Mobile Vertical Connecting Line */}
          <div className="block md:hidden absolute left-1/2 top-10 bottom-10 w-[2px] bg-gray-100 -translate-x-1/2 -z-0"></div>

          {/* Step 1 */}
          <div className="flex flex-col items-center bg-white z-10 px-4 py-2 md:py-0 group">
            <div className="text-[10px] font-bold text-[#EB0A1E] mb-2">01</div>
            <div className="w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center bg-white mb-3 group-hover:border-[#EB0A1E] transition-colors relative">
               <Users className="w-6 h-6 text-[#EB0A1E]" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-900">Employees</h3>
              <p className="text-[10px] text-gray-500 mb-1">Upload & Manage</p>
              <div className="text-xl font-bold text-gray-900">{totalEmployees}</div>
              <div className="text-[10px] font-medium text-green-600">Active</div>
            </div>
          </div>

          <div className="hidden md:block w-8 border-t-2 border-dashed border-gray-300"></div>

          {/* Step 2 */}
          <div className="flex flex-col items-center bg-white z-10 px-4 py-2 md:py-0 group">
            <div className="text-[10px] font-bold text-blue-500 mb-2">02</div>
            <div className="w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center bg-white mb-3 group-hover:border-blue-500 transition-colors">
               <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-900">Salary Records</h3>
              <p className="text-[10px] text-gray-500 mb-1">Upload Salary Data</p>
              <div className="text-xl font-bold text-gray-900">{salaryRecordsTotal}</div>
              <div className="text-[10px] font-medium text-blue-600">Total Records</div>
            </div>
          </div>

          <div className="hidden md:block w-8 border-t-2 border-dashed border-gray-300"></div>

          {/* Step 3 */}
          <div className="flex flex-col items-center bg-white z-10 px-4 py-2 md:py-0 group">
            <div className="text-[10px] font-bold text-green-500 mb-2">03</div>
            <div className="w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center bg-white mb-3 group-hover:border-green-500 transition-colors">
               <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-900">Salary Slips</h3>
              <p className="text-[10px] text-gray-500 mb-1">Generate PDFs</p>
              <div className="text-xl font-bold text-gray-900">{salaryRecordsCurrentMonth}</div>
              <div className="text-[10px] font-medium text-green-600">Generated</div>
            </div>
          </div>

          <div className="hidden md:block w-8 border-t-2 border-dashed border-gray-300"></div>

          {/* Step 4 */}
          <div className="flex flex-col items-center bg-white z-10 px-4 py-2 md:py-0 group">
            <div className="text-[10px] font-bold text-orange-500 mb-2">04</div>
            <div className="w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center bg-white mb-3 group-hover:border-orange-500 transition-colors">
               <Send className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-900">Email Delivery</h3>
              <p className="text-[10px] text-gray-500 mb-1">Send to Employees</p>
              <div className="text-xl font-bold text-gray-900">{emailsSent}</div>
              <div className="text-[10px] font-medium text-orange-600">Sent</div>
              {emailsPending > 0 && (
                <div className="text-[10px] font-medium text-gray-400 mt-0.5">{emailsPending} Pending</div>
              )}
              {emailsFailed > 0 && (
                <div className="text-[10px] font-medium text-red-500 mt-0.5">{emailsFailed} Failed</div>
              )}
            </div>
          </div>

          <div className="hidden md:block w-8 border-t-2 border-dashed border-gray-300"></div>

          {/* Step 5 */}
          <div className="flex flex-col items-center bg-white z-10 px-4 py-2 md:py-0 group">
            <div className="text-[10px] font-bold text-purple-500 mb-2">05</div>
            <div className="w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center bg-white mb-3 group-hover:border-purple-500 transition-colors">
               <PieChartIcon className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-900">Reports</h3>
              <p className="text-[10px] text-gray-500 mb-1">Analyze & Track</p>
              <div className="text-xl font-bold text-gray-900">Live</div>
              <div className="text-[10px] font-medium text-purple-600">Analytics</div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: OPERATION HEALTH CENTER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Payroll Health */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center mb-6">
            <Activity className="w-4 h-4 text-[#EB0A1E] mr-2" />
            <div>
              <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase">Payroll Health</h2>
              <p className="text-[10px] text-gray-500">Overall payroll completion</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col xl:flex-row items-center justify-between gap-4">
            {/* Custom Gauge */}
            <div className="relative w-36 h-36 flex-shrink-0">
               <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                 <style>{`
                   @keyframes revUpPayroll {
                     0% { transform: rotate(135deg); }
                     100% { transform: rotate(var(--target-deg)); }
                   }
                   .animate-rev-payroll {
                     animation: revUpPayroll 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                   }
                 `}</style>
                 
                 {/* Outer Ring */}
                 <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="212.05 282.74" strokeDashoffset="0" transform="rotate(135 50 50)" />
                 
                 {/* Ticks */}
                 {[0, 1, 2, 3, 4, 5, 6].map(i => {
                   const angle = 135 + i * 45;
                   const rad = angle * Math.PI / 180;
                   return <line key={i} x1={50 + 41 * Math.cos(rad)} y1={50 + 41 * Math.sin(rad)} x2={50 + 45 * Math.cos(rad)} y2={50 + 45 * Math.sin(rad)} stroke="#d1d5db" strokeWidth="1" />
                 })}
                 
                 {/* Background Track */}
                 <circle cx="50" cy="50" r="32" fill="none" stroke="#f3f4f6" strokeWidth="10" strokeDasharray="150.79 201.06" transform="rotate(135 50 50)" />
                 
                 {/* Segments */}
                 {cDraw > 0 && <circle cx="50" cy="50" r="32" fill="none" stroke="#EB0A1E" strokeWidth="10" strokeDasharray={`${cDraw} 201.06`} transform="rotate(135 50 50)" />}
                 {iDraw > 0 && <circle cx="50" cy="50" r="32" fill="none" stroke="#F59E0B" strokeWidth="10" strokeDasharray={`${iDraw} 201.06`} strokeDashoffset={-cLen} transform="rotate(135 50 50)" />}
                 {fDraw > 0 && <circle cx="50" cy="50" r="32" fill="none" stroke="#10B981" strokeWidth="10" strokeDasharray={`${fDraw} 201.06`} strokeDashoffset={-(cLen + iLen)} transform="rotate(135 50 50)" />}

                 {/* Needle */}
                 <g className="animate-rev-payroll" style={{ '--target-deg': `${135 + (2.7 * Number(payrollHealthRate))}deg`, transformOrigin: '50px 50px' } as React.CSSProperties}>
                   <polygon points="47,50 53,50 50,15" fill="#1f2937" />
                   <circle cx="50" cy="50" r="5" fill="#1f2937" />
                   <circle cx="50" cy="50" r="2" fill="#ffffff" />
                 </g>
               </svg>
               <div className="absolute inset-x-0 top-[76%] flex flex-col items-center justify-center translate-x-1">
                 <span className="text-2xl font-bold text-gray-900 leading-none">{payrollHealthRate}%</span>
                 <span className="text-[10px] text-gray-500 font-medium mt-0.5">Healthy</span>
               </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#EB0A1E] mr-2 flex-shrink-0"></div>
                <div>
                  <div className="text-[10px] font-bold text-gray-900">Completed</div>
                  <div className="text-[10px] text-gray-500">{payrollCompleted} / {totalEmployees}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-orange-400 mr-2 flex-shrink-0"></div>
                <div>
                  <div className="text-[10px] font-bold text-gray-900">In Progress</div>
                  <div className="text-[10px] text-gray-500">{payrollInProgress} / {totalEmployees}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
                <div>
                  <div className="text-[10px] font-bold text-gray-900">Failed</div>
                  <div className="text-[10px] text-gray-500">{payrollFailed} / {totalEmployees}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Payroll Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden">
          <div className="flex items-center mb-6">
            <Layers className="w-4 h-4 text-blue-500 mr-2" />
            <div>
              <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase">Payroll Summary</h2>
              <p className="text-[10px] text-gray-500">Financial overview for {currentMonthName}</p>
            </div>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
             {/* Connection Lines (SVG) */}
             <svg className="absolute inset-0 w-full h-full -z-0" pointerEvents="none">
               <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
               <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
               <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
               <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
             </svg>

             {/* Center Hexagon */}
             <div className="absolute w-28 h-28 flex items-center justify-center z-10 bg-white rounded-full">
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-white filter drop-shadow-md">
                 <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="white" stroke="#e5e7eb" strokeWidth="2" />
               </svg>
               <div className="relative z-10 flex flex-col items-center text-center px-2">
                 <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Payroll</div>
                 <div className="text-lg font-bold text-gray-900">₹ {(payrollOverview.totalPayroll / 100000).toFixed(2)}L</div>
                 <div className="text-[8px] text-gray-400 mt-1">{currentMonthName}</div>
               </div>
             </div>

             {/* Corner Values */}
             <div className="absolute top-[10%] left-[5%] text-left bg-white p-1 z-10 w-24">
               <div className="text-[9px] font-bold text-gray-900 uppercase">Basic Salary</div>
               <div className="text-sm font-bold text-gray-900 leading-tight">₹ {(payrollOverview.baseSalary / 100000).toFixed(2)}L</div>
               <div className="text-[9px] text-[#EB0A1E] font-medium">{payrollOverview.totalPayroll > 0 ? ((payrollOverview.baseSalary / payrollOverview.totalPayroll) * 100).toFixed(1) : 0}%</div>
             </div>
             
             <div className="absolute top-[10%] right-[5%] text-right bg-white p-1 z-10 w-24">
               <div className="text-[9px] font-bold text-gray-900 uppercase">HRA</div>
               <div className="text-sm font-bold text-gray-900 leading-tight">₹ {(payrollOverview.hra / 100000).toFixed(2)}L</div>
               <div className="text-[9px] text-blue-500 font-medium">{payrollOverview.totalPayroll > 0 ? ((payrollOverview.hra / payrollOverview.totalPayroll) * 100).toFixed(1) : 0}%</div>
             </div>

             <div className="absolute bottom-[10%] left-[5%] text-left bg-white p-1 z-10 w-24">
               <div className="text-[9px] font-bold text-gray-900 uppercase">Allowances</div>
               <div className="text-sm font-bold text-gray-900 leading-tight">₹ {(payrollOverview.allowances / 100000).toFixed(2)}L</div>
               <div className="text-[9px] text-green-500 font-medium">{payrollOverview.totalPayroll > 0 ? ((payrollOverview.allowances / payrollOverview.totalPayroll) * 100).toFixed(1) : 0}%</div>
             </div>

             <div className="absolute bottom-[10%] right-[5%] text-right bg-white p-1 z-10 w-24">
               <div className="text-[9px] font-bold text-gray-900 uppercase">Deductions</div>
               <div className="text-sm font-bold text-gray-900 leading-tight">₹ {(payrollOverview.deductions / 100000).toFixed(2)}L</div>
               <div className="text-[9px] text-orange-500 font-medium">{payrollOverview.totalPayroll > 0 ? ((payrollOverview.deductions / payrollOverview.totalPayroll) * 100).toFixed(1) : 0}%</div>
             </div>
          </div>
        </div>

        {/* Card 3: Email Delivery Health */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:col-span-2 lg:col-span-1">
          <div className="flex items-center mb-6">
            <Mail className="w-4 h-4 text-green-500 mr-2" />
            <div>
              <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase">Email Delivery Health</h2>
              <p className="text-[10px] text-gray-500">Email delivery performance</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col xl:flex-row items-center justify-between gap-4">
            {/* Custom Gauge */}
            <div className="relative w-36 h-36 flex-shrink-0">
               <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                 <style>{`
                   @keyframes revUpEmail {
                     0% { transform: rotate(135deg); }
                     100% { transform: rotate(var(--target-deg)); }
                   }
                   .animate-rev-email {
                     animation: revUpEmail 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                   }
                 `}</style>
                 
                 {/* Outer Ring */}
                 <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="212.05 282.74" strokeDashoffset="0" transform="rotate(135 50 50)" />
                 
                 {/* Ticks */}
                 {[0, 1, 2, 3, 4, 5, 6].map(i => {
                   const angle = 135 + i * 45;
                   const rad = angle * Math.PI / 180;
                   return <line key={i} x1={50 + 41 * Math.cos(rad)} y1={50 + 41 * Math.sin(rad)} x2={50 + 45 * Math.cos(rad)} y2={50 + 45 * Math.sin(rad)} stroke="#d1d5db" strokeWidth="1" />
                 })}
                 
                 {/* Background Track */}
                 <circle cx="50" cy="50" r="32" fill="none" stroke="#f3f4f6" strokeWidth="10" strokeDasharray="150.79 201.06" transform="rotate(135 50 50)" />
                 
                 {/* Segments */}
                 {eSentDraw > 0 && <circle cx="50" cy="50" r="32" fill="none" stroke="#10B981" strokeWidth="10" strokeDasharray={`${eSentDraw} 201.06`} transform="rotate(135 50 50)" />}
                 {eFailedDraw > 0 && <circle cx="50" cy="50" r="32" fill="none" stroke="#EB0A1E" strokeWidth="10" strokeDasharray={`${eFailedDraw} 201.06`} strokeDashoffset={-eSentLen} transform="rotate(135 50 50)" />}
                 {ePendingDraw > 0 && <circle cx="50" cy="50" r="32" fill="none" stroke="#F59E0B" strokeWidth="10" strokeDasharray={`${ePendingDraw} 201.06`} strokeDashoffset={-(eSentLen + eFailedLen)} transform="rotate(135 50 50)" />}

                 {/* Needle */}
                 <g className="animate-rev-email" style={{ '--target-deg': `${135 + (2.7 * Number(emailSuccessRate))}deg`, transformOrigin: '50px 50px' } as React.CSSProperties}>
                   <polygon points="47,50 53,50 50,15" fill="#1f2937" />
                   <circle cx="50" cy="50" r="5" fill="#1f2937" />
                   <circle cx="50" cy="50" r="2" fill="#ffffff" />
                 </g>
               </svg>
               <div className="absolute inset-x-0 top-[76%] flex flex-col items-center justify-center translate-x-1">
                 <span className="text-2xl font-bold text-gray-900 leading-none">{Math.round(Number(emailSuccessRate))}%</span>
                 <span className="text-[10px] text-gray-500 font-medium mt-0.5">Success Rate</span>
               </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
                <div>
                  <div className="text-[10px] font-bold text-gray-900">Sent Successfully</div>
                  <div className="text-[10px] text-gray-500">{emailsSent} ({emailSuccessRate}%)</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#EB0A1E] mr-2 flex-shrink-0"></div>
                <div>
                  <div className="text-[10px] font-bold text-gray-900">Failed</div>
                  <div className="text-[10px] text-gray-500">{emailsFailed} ({(totalEmails > 0 ? (emailsFailed/totalEmails)*100 : 0).toFixed(1)}%)</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-orange-400 mr-2 flex-shrink-0"></div>
                <div>
                  <div className="text-[10px] font-bold text-gray-900">Pending</div>
                  <div className="text-[10px] text-gray-500">{emailsPending} ({(totalEmails > 0 ? (emailsPending/totalEmails)*100 : 0).toFixed(1)}%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: OPERATIONS MONITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_1fr] gap-6">
        
        {/* Left Card: Recent Payroll Uploads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-[#EB0A1E] mr-2" />
              <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase">Recent Payroll Uploads</h2>
            </div>
            <Link href="/salary-records" className="text-xs font-bold text-[#EB0A1E] hover:underline flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] text-gray-400 border-b border-gray-50 bg-gray-50/50 uppercase tracking-wider">
                  <th className="px-5 py-3 font-semibold">File Name</th>
                  <th className="px-5 py-3 font-semibold">Month/Year</th>
                  <th className="px-5 py-3 font-semibold">Records</th>
                  <th className="px-5 py-3 font-semibold">Uploaded By</th>
                  <th className="px-5 py-3 font-semibold">Uploaded At</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {recentUploads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-500">No recent uploads found.</td>
                  </tr>
                )}
                {recentUploads.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-green-700 flex items-center">
                      <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[9px] mr-2 font-bold uppercase tracking-wider border border-green-200">XLS</span>
                      Payroll_{monthNames[row.month-1]}_{row.year}.xlsx
                    </td>
                    <td className="px-5 py-4 text-gray-700 font-medium">{monthNames[row.month-1]} {row.year}</td>
                    <td className="px-5 py-4 text-gray-700 font-medium">{row.recordCount}</td>
                    <td className="px-5 py-4 text-gray-700 font-medium">Admin</td>
                    <td className="px-5 py-4 text-gray-500">{new Date(row.uploadedAt).toLocaleDateString()} {new Date(row.uploadedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 text-[10px] font-bold bg-green-50 text-green-600 rounded border border-green-100">Processed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Card: Activity Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
             <div className="flex items-center">
               <Clock className="w-4 h-4 text-[#EB0A1E] mr-2" />
               <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase">Activity Timeline</h2>
             </div>
             <Link href="/recent-activities" className="text-xs font-bold text-[#EB0A1E] hover:underline flex items-center">
               View All <ArrowRight className="w-3 h-3 ml-1" />
             </Link>
          </div>
          <div className="p-6">
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
               {recentActivities.slice(0, 4).map((act, i) => {
                 let Icon = Info;
                 let color = 'bg-gray-500 text-white';
                 if (act.type === 'success') { Icon = CheckCircle; color = 'bg-green-500 text-white shadow-green-100'; }
                 if (act.type === 'warning') { Icon = AlertTriangle; color = 'bg-orange-500 text-white shadow-orange-100'; }
                 if (act.type === 'error') { Icon = XCircle; color = 'bg-red-500 text-white shadow-red-100'; }
                 if (act.title.toLowerCase().includes('email')) { Icon = Send; color = 'bg-blue-500 text-white shadow-blue-100'; }
                 if (act.title.toLowerCase().includes('upload')) { Icon = UploadCloud; color = 'bg-purple-500 text-white shadow-purple-100'; }

                 return (
                   <div key={i} className="relative pl-6">
                     <div className={`absolute -left-[17px] top-0.5 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${color}`}>
                       <Icon className="w-3.5 h-3.5" />
                     </div>
                     <div>
                       <div className="flex justify-between items-start">
                         <h3 className="text-xs font-bold text-gray-900">{act.title}</h3>
                         <span className="text-[10px] font-medium text-gray-400">
                           {new Date(act.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </span>
                       </div>
                       <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{act.desc}</p>
                     </div>
                   </div>
                 );
               })}
               {recentActivities.length === 0 && (
                 <div className="text-xs text-gray-500 pl-6">No recent activities.</div>
               )}
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 5: FOOTER */}
      <div className="flex justify-between items-center pt-8 pb-4">
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 flex items-center justify-center opacity-30 grayscale">
              <SiToyota className="w-6 h-6" />
           </div>
           <p className="text-[10px] text-gray-400 font-medium">
             Built with <span className="text-[#EB0A1E]">❤️</span> for Toyota Payroll Automation System
           </p>
        </div>
        <div className="text-[10px] text-gray-400 font-medium">
          © {new Date().getFullYear()} Nippon Toyota
        </div>
      </div>
      
    </div>
  );
}
