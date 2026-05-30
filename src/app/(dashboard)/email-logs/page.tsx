'use client';

import { useEffect, useState } from 'react';
import { getEmailLogs } from '@/services/email.service';
import { Mail, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function load() {
      const { data } = await getEmailLogs();
      if (data) setLogs(data);
      setLoading(false);
    }
    load();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent': return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Sent</span>;
      case 'failed': return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Failed</span>;
      default: return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
    }
  };

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const paginatedLogs = logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Mail className="w-8 h-8 text-toyota-red" />
            Email Logs
          </h1>
          <p className="text-gray-500 mt-2">Track the delivery status of all automated salary slips.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Employee Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sent At</th>
                <th className="px-6 py-4">Error Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No emails have been sent yet.</td>
                </tr>
              ) : (
                paginatedLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{log.employees?.employee_id || '-'}</td>
                    <td className="px-6 py-4">{log.employees?.name || '-'}</td>
                    <td className="px-6 py-4">{log.email}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {log.sent_at ? new Date(log.sent_at).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {log.error_message ? (
                        <span className="text-red-600 text-xs truncate max-w-[200px] block" title={log.error_message}>
                          {log.error_message}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {!loading && logs.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-500">
              Showing {Math.min(logs.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(logs.length, currentPage * itemsPerPage)} of {logs.length} records
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-1.5 text-sm font-medium bg-[#EB0A1E] text-white rounded-md">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
