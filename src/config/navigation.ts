import { 
  UserPlus, 
  Upload, 
  FileText, 
  Users, 
  Receipt, 
  Mail, 
  File, 
  BarChart, 
  Download, 
  Settings, 
  User 
} from 'lucide-react';

export const sidebarNavigation = [
  {
    title: 'PAYROLL MANAGEMENT',
    items: [
      { name: 'Upload Employees', href: '/payroll/upload-employees', icon: UserPlus },
      { name: 'Upload Salary', href: '/payroll/upload-salary', icon: Upload },
      { name: 'Salary Slips', href: '/salary-slips', icon: FileText },
      { name: 'Employees', href: '/employees', icon: Users },
      { name: 'Salary Records', href: '/salary-records', icon: Receipt },
    ]
  },
  {
    title: 'EMAIL MANAGEMENT',
    items: [
      { name: 'Email Logs', href: '/email-logs', icon: Mail },
      { name: 'Email Templates', href: '/email-templates', icon: File },
    ]
  },
  {
    title: 'REPORTS',
    items: [
      { name: 'Reports & Analytics', href: '/reports', icon: BarChart },
      { name: 'Download Center', href: '/download-center', icon: Download },
    ]
  },
  {
    title: 'SETTINGS',
    items: [
      { name: 'Settings', href: '/settings', icon: Settings },
      { name: 'Profile Settings', href: '/profile', icon: User },
    ]
  }
];
