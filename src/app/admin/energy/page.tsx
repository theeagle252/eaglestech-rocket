import { Metadata } from 'next';
import AdminEnergyContent from './components/AdminEnergyContent';

export const metadata: Metadata = {
  title: 'Energy & Power Admin | EaglesTech',
};

export default function AdminEnergyPage() {
  return <AdminEnergyContent />;
}
