import React from 'react';

interface EmployeeStatusBadgeProps {
  status: string | undefined;
}

export default function EmployeeStatusBadge({ status }: EmployeeStatusBadgeProps) {
  const getBadgeStyle = (statusName: string | undefined) => {
    switch (statusName) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Inactive':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'On Leave':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const statusText = status || 'Active'; // Default fallback

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getBadgeStyle(statusText)}`}>
      {statusText}
    </span>
  );
}
