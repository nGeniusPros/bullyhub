"use client";

import { useParams } from "next/navigation";
import { StudReceptionist } from "@/features/stud-services";

// Metadata must be in a separate file or removed when using 'use client'

export default function StudReceptionistPage() {
  const params = useParams();
  return <StudReceptionist serviceId={params.id as string} />;
}
