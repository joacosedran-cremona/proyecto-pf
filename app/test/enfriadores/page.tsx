"use client";

import { useEnfriadorContext } from "@/context/EnfriadorContext";

export default function TestPage() {
  const { enfriadores, isLoading } = useEnfriadorContext();

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Prueba WebSocket</h1>
      <div className="mb-4">
        Estado: {isLoading ? 
          <span className="text-green-500">Conectado</span> : 
          <span className="text-red-500">Desconectado</span>
        }
      </div>
      {enfriadores && (
        <pre className="bg-black p-4 rounded">
          {JSON.stringify(enfriadores, null, 2)}
        </pre>
      )}
    </div>
  );
}