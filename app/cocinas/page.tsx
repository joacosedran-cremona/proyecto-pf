"use client";

import EquipoPage from "@/components/equiposPage";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWebSocketContext } from "@/context/WebSocketContext";

export default function Cocinas() {
    const { data, isConnected } = useWebSocketContext("enfriadores-datos");
    const searchParams = useSearchParams();
    const [initialId, setInitialId] = useState<number>(1);
    
    useEffect(() => {
        const idParam = searchParams.get('id');
        if (idParam) {
            // Convertir directamente a número
            const id = parseInt(idParam);
            if (!isNaN(id)) {
                const validId = Math.min(6, Math.max(1, id));
                setInitialId(validId);
                localStorage.setItem('lastCocinaId', validId.toString());
            }
        } else {
            const savedId = localStorage.getItem('lastCocinaId');
            const id = savedId ? parseInt(savedId) : 1;
            setInitialId(id);
        }
    }, [searchParams]);

    return <EquipoPage type="cocina" initialId={initialId} />;
}