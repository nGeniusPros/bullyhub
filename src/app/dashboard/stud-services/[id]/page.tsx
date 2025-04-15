'use client';

import { StudServiceForm } from '@/features/stud-services';

// Metadata must be in a separate file or removed when using 'use client'

export default function StudServiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Stud Service</h1>
        <p className="text-muted-foreground">
          Update your stud service details
        </p>
      </div>

      <StudServiceForm initialData={{ id: params.id }} />
    </div>
  );
}
