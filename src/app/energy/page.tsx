import { Metadata } from 'next';
import EnergyContent from './components/EnergyContent';

export const metadata: Metadata = {
  title: 'Energy & Power Solutions | EaglesTech',
  description: 'Solar panels, inverters, power stations, rechargeable fans and complete energy solutions. Beat power outages with EaglesTech.',
};

export default function EnergyPage() {
  return <EnergyContent />;
}
