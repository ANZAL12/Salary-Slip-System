'use client';

import { Users, FileText, Send, Clock, ArrowRight, UploadCloud } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
import { SiToyota } from 'react-icons/si';

const payrollData = [
  { name: 'Basic Salary', value: 7840000, color: '#EB0A1E' },
  { name: 'HRA', value: 1860000, color: '#3B82F6' },
  { name: 'Allowances', value: 1620000, color: '#10B981' },
  { name: 'Deductions', value: 1220000, color: '#F59E0B' },
  { name: 'Others', value: 240000, color: '#8B5CF6' },
];

const emailData = [
  { name: 'Sent Successfully', value: 240, color: '#10B981' },
  { name: 'Pending', value: 8, color: '#F59E0B' },
  { name: 'Failed', value: 0, color: '#EB0A1E' },
];

export default function DashboardPage() {
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
              <p className="text-3xl font-bold text-gray-900 mt-1">248</p>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-green-600">
            <span className="mr-1">↑</span>12 <span className="text-gray-400 font-normal">from last month</span>
          </p>
        </div>

        {/* Salary Records */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Salary Records (May 2026)</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">248</p>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-green-600">
            100% <span className="text-gray-400 font-normal">records uploaded</span>
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
              <p className="text-3xl font-bold text-gray-900 mt-1">240</p>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-green-600">
            96.77% <span className="text-gray-400 font-normal">success rate</span>
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
              <p className="text-3xl font-bold text-gray-900 mt-1">8</p>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-orange-500">
            Needs attention
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
          <div className="flex items-center h-64">
            <div className="w-1/2 h-full relative">
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
                <span className="text-lg font-bold text-gray-900">₹ 1,24,80,000</span>
              </div>
            </div>
            <div className="w-1/2 pl-6 space-y-4">
              {payrollData.map((item) => (
                <div key={item.name} className="flex items-start">
                  <div className="w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ₹ {(item.value / 100000).toFixed(2).replace(/\.00$/, '')},00,000 
                      <span className="ml-1">({((item.value / 12480000) * 100).toFixed(1)}%)</span>
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
          <div className="flex items-center h-64">
            <div className="w-1/2 h-full relative">
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
                <span className="text-2xl font-bold text-gray-900">248</span>
              </div>
            </div>
            <div className="w-1/2 pl-6 space-y-5">
              {emailData.map((item) => (
                <div key={item.name} className="flex items-start">
                  <div className="w-3 h-3 rounded-full mt-1 mr-3 flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.value} <span className="ml-1">({((item.value / 248) * 100).toFixed(2)}%)</span>
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
          <div className="p-2 overflow-x-auto">
            <table className="w-full text-left border-collapse">
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
                {[
                  { name: 'Salary_May_2026.xlsx', m: 'May 2026', r: 248, by: 'Admin User', at: '28 May 2026, 10:30 AM' },
                  { name: 'Salary_Apr_2026.xlsx', m: 'Apr 2026', r: 245, by: 'Admin User', at: '30 Apr 2026, 11:15 AM' },
                  { name: 'Salary_Mar_2026.xlsx', m: 'Mar 2026', r: 240, by: 'Admin User', at: '29 Mar 2026, 09:45 AM' }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-4 font-medium text-green-700 flex items-center">
                      <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[10px] mr-2 font-bold uppercase tracking-wider">XLS</span>
                      {row.name}
                    </td>
                    <td className="px-4 py-4 text-gray-700">{row.m}</td>
                    <td className="px-4 py-4 text-gray-700">{row.r}</td>
                    <td className="px-4 py-4 text-gray-700">{row.by}</td>
                    <td className="px-4 py-4 text-gray-500">{row.at}</td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-md border border-green-100">Processed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            {[
              { title: 'Salary slips generated for May 2026', desc: '248 records processed successfully', time: '10:32 AM', icon: FileText, c: 'text-green-500', bg: 'bg-green-50' },
              { title: 'Email sent to John Doe (EMP001)', desc: 'Salary slip for May 2026', time: '10:31 AM', icon: Send, c: 'text-blue-500', bg: 'bg-blue-50' },
              { title: '8 emails are pending', desc: 'Retry or check email logs', time: '10:30 AM', icon: Clock, c: 'text-orange-500', bg: 'bg-orange-50' },
              { title: 'Payroll file uploaded', desc: 'Salary_May_2026.xlsx', time: '10:29 AM', icon: UploadCloud, c: 'text-purple-500', bg: 'bg-purple-50' }
            ].map((act, i) => (
              <div key={i} className="flex items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${act.bg} shrink-0 mt-0.5`}>
                  <act.icon className={`w-4 h-4 ${act.c}`} />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-gray-900">{act.title}</p>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{act.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{act.desc}</p>
                </div>
              </div>
            ))}
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
