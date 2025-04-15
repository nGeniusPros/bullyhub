'use client';

import { HealthClearanceDetail } from '@/features/health-clearances';

// Metadata must be in a separate file or removed when using 'use client'

export default function HealthClearanceDetailPage({ params }: { params: { id: string } }) {
  return <HealthClearanceDetail clearanceId={params.id} />;
}
