"use client";

import EquipoPage from "@/components/equiposPage";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCocina } from "@/context/CocinaContext";

export default function CocinasPage() {
    const { todasLasCocinas } = useCocina();
    const searchParams = useSearchParams();
    const [initialId, setInitialId] = useState<number>(1);
    
    useEffect(() => {
        const idParam = searchParams.get('id');
        if (idParam) {
            const id = parseInt(idParam);
            if (!isNaN(id)) {
                // Validamos que el ID exista en los datos y esté en el rango correcto (1-6)
                const cocinaExists = todasLasCocinas.some(
                    cocina => cocina.id === id
                );
                if (cocinaExists && id >= 1 && id <= 6) {
                    setInitialId(id);
                    localStorage.setItem('lastCocinaId', id.toString());
                }
            }
        } else {
            const savedId = localStorage.getItem('lastCocinaId');
            const id = savedId ? parseInt(savedId) : 1;
            // Validamos que el ID guardado sea válido
            if (id >= 1 && id <= 6) {
                setInitialId(id);
            }
        }
    }, [searchParams, todasLasCocinas]);

    return <EquipoPage type="cocina" initialId={initialId} />;
}