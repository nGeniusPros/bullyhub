'use client';

import { HealthClearanceList } from '@/features/health-clearances';

// Metadata must be in a separate file or removed when using 'use client'

export default function HealthClearancesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Clearances</h1>
        <p className="text-muted-foreground">
          Manage health clearances and certifications for your dogs
        </p>
      </div>

      <HealthClearanceList showAddButton={true} />
    </div>
  );
}
