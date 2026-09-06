import { Metadata } from 'next';
import { ENERGY_PRODUCTS } from '@/lib/data';
import EnergyProductDetailContent from './components/EnergyProductDetailContent';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = ENERGY_PRODUCTS.find(p => p.id === id);
  if (!product) return { title: 'Product Not Found | EaglesTech' };
  return {
    title: `${product.name} | EaglesTech Energy`,
    description: product.description.slice(0, 160),
  };
}

export default async function EnergyProductPage({ params }: Props) {
  const { id } = await params;
  const product = ENERGY_PRODUCTS.find(p => p.id === id);
  if (!product) notFound();
  return <EnergyProductDetailContent product={product} />;
}
