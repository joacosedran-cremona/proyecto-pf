"use client";

import EquipoPage from "@/components/equiposPage";
import { useSearchParams } from 'next/navigation';

export default function Enfriadores() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const initialId = idParam ? Math.min(8, Math.max(1, parseInt(idParam))) : 1;

  return <EquipoPage type="enfriador" initialId={initialId} />;
}