import { Metadata } from 'next';
import AdminDashboardContent from './components/AdminDashboardContent';

export const metadata: Metadata = {
  title: 'Admin Dashboard | EaglesTech',
};

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
