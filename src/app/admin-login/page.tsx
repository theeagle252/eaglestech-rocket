import AdminLoginContent from './components/AdminLoginContent';

export const metadata = {
  title: 'Admin Login — EaglesTech',
  description: 'Restricted admin access for EaglesTech dashboard.',
  robots: 'noindex, nofollow',
};

export default function AdminLoginPage() {
  return <AdminLoginContent />;
}
