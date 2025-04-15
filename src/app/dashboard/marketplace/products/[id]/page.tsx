'use client';

import { ProductDetail } from '@/features/marketplace';

// Metadata must be in a separate file or removed when using 'use client'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetail productId={params.id} />;
}
