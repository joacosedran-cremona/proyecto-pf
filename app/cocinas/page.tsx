"use client";

import EquipoPage from "@/components/equiposPage";
import { useSearchParams } from 'next/navigation';

export default function Cocinas() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const initialId = idParam ? Math.min(6, Math.max(1, parseInt(idParam))) : 1;

  return <EquipoPage type="cocina" initialId={initialId} />;
}