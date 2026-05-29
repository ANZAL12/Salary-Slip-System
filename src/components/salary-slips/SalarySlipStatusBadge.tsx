export default function SalarySlipStatusBadge({ status }: { status: 'Generated' | 'Pending' | 'Failed' | 'Sent' }) {
  if (status === 'Generated' || status === 'Sent') {
    return (
      <span className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-md border border-green-100">
        {status}
      </span>
    );
  }
  
  if (status === 'Pending') {
    return (
      <span className="px-2.5 py-1 text-xs font-medium bg-orange-50 text-orange-600 rounded-md border border-orange-100">
        {status}
      </span>
    );
  }

  return (
    <span className="px-2.5 py-1 text-xs font-medium bg-red-50 text-[#EB0A1E] rounded-md border border-red-100">
      {status}
    </span>
  );
}
