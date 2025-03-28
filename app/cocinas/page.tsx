"use client";

import EquipoPage from "@/components/equiposPage";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Cocinas() {
    const searchParams = useSearchParams();
    const [initialId, setInitialId] = useState<number>(1);
    
    useEffect(() => {
        const idParam = searchParams.get('id');
        if (idParam) {
            const id = parseInt(idParam.replace('C', '').replace('L1', ''));
            setInitialId(Math.min(6, Math.max(1, id)));
            localStorage.setItem('lastCocinaId', id.toString());
        } else {
            const savedId = localStorage.getItem('lastCocinaId');
            setInitialId(savedId ? parseInt(savedId) : 1);
        }
    }, [searchParams]);

    return <EquipoPage type="cocina" initialId={initialId} />;
}