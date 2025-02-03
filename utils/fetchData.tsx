import { useContext } from 'react';
import { CocinaContext } from '@/context/CocinaContext';
import { EnfriadorContext } from '@/context/EnfriadorContext';

export function fetchData(contextType: 'cocinas' | 'enfriadores') {
    const cocinaContext = useContext(CocinaContext);
    const enfriadorContext = useContext(EnfriadorContext);

    if (contextType === 'cocinas') {
        return cocinaContext?.cocinaData;
    } else {
        return enfriadorContext?.enfriadorData;
    }
}
