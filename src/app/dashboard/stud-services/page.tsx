"use client";

import { StudServiceList } from "@/features/stud-services";

// Metadata must be in a separate file or removed when using 'use client'

export default function StudServicesPage() {
  return <StudServiceList showAddButton={true} />;
}
