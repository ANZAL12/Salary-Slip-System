'use client';

import React, { useEffect, useState } from 'react';
import { Users, FileText, Send, Clock, ArrowRight, UploadCloud, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
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

  const payrollData = [
    { name: 'Basic Salary', value: payrollOverview.baseSalary, color: '#EB0A1E' },
    { name: 'HRA', value: payrollOverview.hra, color: '#3B82F6' },
    { name: 'Allowances', value: payrollOverview.allowances, color: '#10B981' },
    { name: 'Deductions', value: payrollOverview.deductions, color: '#F59E0B' },
  ].filter(d => d.value > 0);

  const emailData = [
    { name: 'Sent Successfully', value: emailsSent, color: '#10B981' },
    { name: 'Pending', value: emailsPending, color: '#F59E0B' },
    { name: 'Failed', value: emailsFailed, color: '#EB0A1E' },
  ].filter(d => d.value > 0);

  const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      
      {/* 4 Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <Users className="w-7 h-7 text-[#EB0A1E]" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalEmployees}</p>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-green-600">
            Active in system
          </p>
        </div>

        {/* Salary Records */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Salary Records ({currentMonthName})</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{salaryRecordsCurrentMonth}</p>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">
            {salaryRecordsTotal} <span className="font-normal text-gray-400">total records ever</span>
          </p>
        </div>

        {/* Emails Sent */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
              <Send className="w-7 h-7 text-green-500" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Emails Sent</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{emailsSent}</p>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-green-600">
            {emailSuccessRate}% <span className="text-gray-400 font-normal">success rate</span>
          </p>
        </div>

        {/* Pending Emails */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Clock className="w-7 h-7 text-orange-400" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Pending Emails</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{emailsPending}</p>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-orange-500">
            {emailsFailed} <span className="text-gray-400 font-normal">failed emails</span>
          </p>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payroll Overview Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Payroll Overview</h2>
              <p className="text-sm text-gray-500 mt-0.5">Salary distribution for May 2026</p>
            </div>
            <button className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50">
              May 2026 <span className="ml-2 text-gray-400">▼</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start h-auto sm:h-64 gap-6 sm:gap-0">
            <div className="w-full sm:w-1/2 h-48 sm:h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={payrollData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {payrollData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-500 font-medium">Total Payroll</span>
                <span className="text-lg font-bold text-gray-900">
                  ₹ {(payrollOverview.totalPayroll / 100000).toFixed(2).replace(/\.00$/, '')}L
                </span>
              </div>
            </div>
            <div className="w-full sm:w-1/2 sm:pl-6 space-y-4">
              {payrollData.length === 0 && <p className="text-sm text-gray-400">No data available</p>}
              {payrollData.map((item) => (
                <div key={item.name} className="flex items-start">
                  <div className="w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ₹ {(item.value / 100000).toFixed(2).replace(/\.00$/, '')}L 
                      <span className="ml-1">({((item.value / payrollOverview.totalPayroll) * 100).toFixed(1)}%)</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Email Status Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Email Status Overview</h2>
              <p className="text-sm text-gray-500 mt-0.5">Overview of email delivery status</p>
            </div>
            <button className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50">
              This Month <span className="ml-2 text-gray-400">▼</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start h-auto sm:h-64 gap-6 sm:gap-0">
            <div className="w-full sm:w-1/2 h-48 sm:h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emailData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {emailData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-500 font-medium">Total</span>
                <span className="text-2xl font-bold text-gray-900">{totalEmails}</span>
              </div>
            </div>
            <div className="w-full sm:w-1/2 sm:pl-6 space-y-5">
              {emailData.length === 0 && <p className="text-sm text-gray-400">No data available</p>}
              {emailData.map((item) => (
                <div key={item.name} className="flex items-start">
                  <div className="w-3 h-3 rounded-full mt-1 mr-3 flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.value} <span className="ml-1">({((item.value / totalEmails) * 100).toFixed(1)}%)</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 2 Bottom Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-6">
        
        {/* Recent Payroll Uploads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-900">Recent Payroll Uploads</h2>
            <ArrowRight className="w-5 h-5 text-[#EB0A1E] cursor-pointer" />
          </div>
          <div className="p-0 sm:p-2 overflow-x-auto">
            {/* Desktop Table */}
            <table className="hidden md:table w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">File Name</th>
                  <th className="px-4 py-3 font-medium">Month/Year</th>
                  <th className="px-4 py-3 font-medium">Records</th>
                  <th className="px-4 py-3 font-medium">Uploaded By</th>
                  <th className="px-4 py-3 font-medium">Uploaded At</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentUploads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No recent uploads found.</td>
                  </tr>
                )}
                {recentUploads.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-4 font-medium text-green-700 flex items-center">
                      <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[10px] mr-2 font-bold uppercase tracking-wider">XLS</span>
                      Payroll_{monthNames[row.month-1]}_{row.year}.xlsx
                    </td>
                    <td className="px-4 py-4 text-gray-700">{monthNames[row.month-1]} {row.year}</td>
                    <td className="px-4 py-4 text-gray-700">{row.recordCount}</td>
                    <td className="px-4 py-4 text-gray-700">Admin</td>
                    <td className="px-4 py-4 text-gray-500">{new Date(row.uploadedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-md border border-green-100">Processed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col divide-y divide-gray-100">
              {recentUploads.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-gray-500">No recent uploads found.</div>
              )}
              {recentUploads.map((row, i) => (
                <div key={i} className="p-4 space-y-3 hover:bg-gray-50">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-medium text-green-700 flex items-center text-sm break-all">
                      <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[10px] mr-2 font-bold uppercase tracking-wider flex-shrink-0">XLS</span>
                      Payroll_{monthNames[row.month-1]}_{row.year}.xlsx
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-medium bg-green-50 text-green-600 rounded-md border border-green-100 flex-shrink-0">Processed</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Month/Year</p>
                      <p className="font-medium text-gray-900">{monthNames[row.month-1]} {row.year}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Records</p>
                      <p className="font-medium text-gray-900">{row.recordCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Uploaded By</p>
                      <p className="font-medium text-gray-900">Admin</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Uploaded At</p>
                      <p className="font-medium text-gray-900">{new Date(row.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 text-center mt-auto">
            <button className="text-sm font-bold text-[#EB0A1E] w-full py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              View All Uploads
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-900">Recent Activities</h2>
            <span className="text-sm font-bold text-[#EB0A1E] cursor-pointer">View All</span>
          </div>
          <div className="p-6 space-y-6 flex-1">
            {recentActivities.length === 0 && (
              <p className="text-gray-500 text-sm">No recent activities.</p>
            )}
            {recentActivities.map((act, i) => {
              let Icon = Info;
              let colors = 'text-gray-500 bg-gray-50';
              if (act.type === 'success') { Icon = CheckCircle; colors = 'text-green-500 bg-green-50'; }
              if (act.type === 'warning') { Icon = AlertTriangle; colors = 'text-orange-500 bg-orange-50'; }
              if (act.type === 'error') { Icon = XCircle; colors = 'text-red-500 bg-red-50'; }
              if (act.title.toLowerCase().includes('email')) { Icon = Send; colors = 'text-blue-500 bg-blue-50'; }
              if (act.title.toLowerCase().includes('upload')) { Icon = UploadCloud; colors = 'text-purple-500 bg-purple-50'; }

              return (
                <div key={i} className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colors.split(' ')[1]} shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${colors.split(' ')[0]}`} />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold text-gray-900">{act.title}</p>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">
                        {new Date(act.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{act.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="flex justify-between items-center pt-8 pb-4">
        <p className="text-xs text-gray-400 text-center flex-1">
          Built with <span className="text-[#EB0A1E]">❤️</span> for Nippon Toyota | Salary Slip Automation System
        </p>
        <div className="w-8 h-8 flex items-center justify-center opacity-50 text-gray-400">
           <SiToyota className="w-6 h-6" />
        </div>
      </div>
      
    </div>
  );
}
