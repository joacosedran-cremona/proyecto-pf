"use client";

import { useCocinaContext } from "@/context/CocinaContext";

export default function TestPage() {
  const { cocinas, isLoading } = useCocinaContext();

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Prueba WebSocket</h1>
      <div className="mb-4">
        Estado: {isLoading ? 
          <span className="text-green">Conectado</span> : 
          <span className="text-red">Desconectado</span>
        }
      </div>
      {cocinas && (
        <pre className="bg-black p-4 rounded">
          {JSON.stringify(cocinas, null, 2)}
        </pre>
      )}
    </div>
  );
}