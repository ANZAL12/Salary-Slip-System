'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, ChevronDown, Download, Users, Wallet, 
  FileText, TrendingUp, TrendingDown, RefreshCw, FileSpreadsheet,
  FileIcon
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import toast from 'react-hot-toast';
import Link from 'next/link';

import { 
  getDashboardKPIs, getPayrollTrend, getSalaryDistribution, getTopEmployees, getPayrollSummary 
} from '@/services/report.service';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export default function ReportsAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  
  const [kpis, setKpis] = useState<any>(null);
  const [payrollTrend, setPayrollTrend] = useState<any[]>([]);
  const [salaryDist, setSalaryDist] = useState<any[]>([]);
  const [topEmployees, setTopEmployees] = useState<any[]>([]);
  const [payrollSummary, setPayrollSummary] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [kpiData, trendData, distData, topEmpData, summaryData] = await Promise.all([
        getDashboardKPIs(),
        getPayrollTrend(),
        getSalaryDistribution(),
        getTopEmployees(),
        getPayrollSummary()
      ]);
      
      setKpis(kpiData);
      setPayrollTrend(trendData);
      setSalaryDist(distData);
      setTopEmployees(topEmpData);
      setPayrollSummary(summaryData);
    } catch (err) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }

  const handleExportCSV = (reportName: string) => {
    toast.success(`${reportName} Exported Successfully`);
    // In a real app, you'd trigger a CSV download here.
  };

  if (loading) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin mb-4 text-toyota-red" />
          <p>Analyzing payroll data...</p>
        </div>
      </div>
    );
  }

  if (kpis?.totalEmployees === 0) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center text-gray-500 text-center max-w-md">
          <TrendingUp className="w-16 h-16 mb-4 text-gray-300" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No analytics data available yet</h2>
          <p className="text-sm">Upload employees and process salary records first to unlock the Reports & Analytics dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1 text-sm">Analyze payroll data and generate valuable insights</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
          Last updated: {new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
          <button onClick={loadData} className="p-1 hover:bg-gray-100 rounded-full transition-colors" title="Refresh Data">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white">
          <Calendar className="w-4 h-4 text-gray-400" />
          May 1 - May 31, 2026
          <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-toyota-red">₹</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Payroll Cost</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(kpis?.totalPayroll || 0)}</h3>
            <p className="text-xs font-medium text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {kpis?.trends?.payroll} <span className="text-gray-400 font-normal">vs Apr 2026</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Employees</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpis?.totalEmployees}</h3>
            <p className="text-xs font-medium text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {kpis?.trends?.employees} <span className="text-gray-400 font-normal">vs Apr 2026</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average Net Salary</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(kpis?.avgNetSalary || 0)}</h3>
            <p className="text-xs font-medium text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {kpis?.trends?.avgSalary} <span className="text-gray-400 font-normal">vs Apr 2026</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Salary Slips Generated</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpis?.slipsGenerated}</h3>
            <p className="text-xs font-medium text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {kpis?.trends?.slips} <span className="text-gray-400 font-normal">vs Apr 2026</span>
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payroll Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-gray-900">Payroll Trend</h3>
            <button className="text-xs font-medium text-gray-500 flex items-center gap-1 border border-gray-200 rounded px-2 py-1">
              Last 6 Months <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={payrollTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(val) => `₹${val/100000}L`} dx={-10} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), "Payroll Cost"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="value" stroke="#EB0A1E" strokeWidth={3} dot={{ r: 4, fill: '#EB0A1E', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-base font-bold text-gray-900 mb-6">Net Salary Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryDist} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#EB0A1E" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {salaryDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#EB0A1E" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-2">Net Salary Range (₹)</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payroll Summary Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-base font-bold text-gray-900 mb-4">Payroll Summary</h3>
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="hidden md:table w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="pb-3 font-medium">Component</th>
                  <th className="pb-3 font-medium text-right">Total Amount (₹)</th>
                  <th className="pb-3 font-medium text-right">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payrollSummary.map((item, i) => (
                  <tr key={i} className={item.isTotal ? "font-bold text-gray-900 bg-gray-50/50" : "text-gray-700"}>
                    <td className={`py-3.5 ${item.isTotal ? 'rounded-l-lg px-2' : ''}`}>{item.component}</td>
                    <td className="py-3.5 text-right">{formatCurrency(item.amount)}</td>
                    <td className={`py-3.5 text-right ${item.isTotal ? 'rounded-r-lg px-2' : ''}`}>{item.percentage.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col space-y-3">
              {payrollSummary.map((item, i) => (
                <div key={i} className={`p-4 rounded-xl border ${item.isTotal ? 'bg-gray-50 border-gray-300 font-bold' : 'bg-white border-gray-100'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-900 text-sm">{item.component}</span>
                    <span className="text-sm">{item.percentage.toFixed(2)}%</span>
                  </div>
                  <div className="text-right text-lg text-gray-900">{formatCurrency(item.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Employees */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-base font-bold text-gray-900 mb-4">Top 5 Highest Paid Employees</h3>
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="hidden md:table w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="pb-3 font-medium">Employee</th>
                  <th className="pb-3 font-medium text-right">Net Salary (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topEmployees.map((emp, i) => (
                  <tr key={i} className="text-gray-700">
                    <td className="py-3.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random&color=fff`} alt={emp.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-gray-900">{emp.id} - {emp.name}</span>
                    </td>
                    <td className="py-3.5 text-right font-medium">{formatCurrency(emp.netSalary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col space-y-3">
              {topEmployees.map((emp, i) => (
                <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random&color=fff`} alt={emp.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-tight">{emp.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{emp.id}</p>
                    </div>
                  </div>
                  <div className="text-right font-bold text-gray-900 text-sm">
                    {formatCurrency(emp.netSalary)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link href="/employees" className="mt-4 text-sm font-bold text-toyota-red hover:text-red-700 flex items-center gap-1 transition-colors inline-flex">
            View All Employees <span>→</span>
          </Link>
        </div>



      </div>

    </div>
  );
}
