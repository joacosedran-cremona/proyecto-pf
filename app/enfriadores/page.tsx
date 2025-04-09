"use client";

import EquipoPage from "@/components/equiposPage";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useEnfriador } from "@/context/EnfriadorContext";

export default function EnfriadoresPage() {
    const { todosLosEnfriadores } = useEnfriador();
    const searchParams = useSearchParams();
    const [initialId, setInitialId] = useState<number>(7); // ID real del primer enfriador
    
    useEffect(() => {
        const idParam = searchParams.get('id');
        if (idParam) {
            const id = parseInt(idParam);
            if (!isNaN(id)) {
                // Validamos que el ID exista en los datos
                const enfriadorExists = todosLosEnfriadores.some(
                    enfriador => enfriador.id === id
                );
                if (enfriadorExists) {
                    setInitialId(id);
                    localStorage.setItem('lastEnfriadorId', id.toString());
                }
            }
        } else {
            const savedId = localStorage.getItem('lastEnfriadorId');
            if (savedId) {
                const id = parseInt(savedId);
                if (!isNaN(id) && id >= 7 && id <= 14) {
                    setInitialId(id);
                }
            }
        }
    }, [searchParams, todosLosEnfriadores]);

    return <EquipoPage type="enfriador" initialId={initialId} />;
}