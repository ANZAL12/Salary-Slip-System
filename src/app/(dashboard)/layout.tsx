import Sidebar from '@/components/shared/Sidebar';
import TopNav from '@/components/shared/TopNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#FAFBFB] overflow-hidden font-sans text-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex flex-shrink-0 z-20">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 w-0 overflow-hidden relative">
        <TopNav />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none px-4 sm:px-8 pb-12 pt-2">
          {children}
        </main>
      </div>
    </div>
  );
}
