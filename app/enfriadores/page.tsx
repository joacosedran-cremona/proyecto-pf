"use client";

import EquipoPage from "@/components/equiposPage";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Enfriadores() {
    const searchParams = useSearchParams();
    const [initialId, setInitialId] = useState<number>(1);
    
    useEffect(() => {
        const idParam = searchParams.get('id');
        if (idParam) {
            const id = parseInt(idParam.replace('E', '').replace('L1', ''));
            setInitialId(Math.min(8, Math.max(1, id)));
            localStorage.setItem('lastEnfriadorId', id.toString());
        } else {
            const savedId = localStorage.getItem('lastEnfriadorId');
            setInitialId(savedId ? parseInt(savedId) : 1);
        }
    }, [searchParams]);

    return <EquipoPage type="enfriador" initialId={initialId} />;
}