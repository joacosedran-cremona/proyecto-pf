"use client";

import EquipoPage from "@/components/equiposPage";
import { useSearchParams } from 'next/navigation';

export default function Cocinas() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const initialId = idParam ? parseInt(idParam) : undefined;

  return <EquipoPage type="cocina" initialId={initialId} />;
}