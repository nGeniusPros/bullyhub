'use client';

import { StudServiceForm } from '@/features/stud-services';

// Metadata must be in a separate file or removed when using 'use client'

export default function CreateStudServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Stud Service</h1>
        <p className="text-muted-foreground">
          Set up a stud service for one of your dogs
        </p>
      </div>

      <StudServiceForm />
    </div>
  );
}
