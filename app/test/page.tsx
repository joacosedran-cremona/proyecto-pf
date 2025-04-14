"use client";

import { useWebSocketContext } from "@/context/WebSocketContext";

export default function TestPage() {
  const { data, isConnected } = useWebSocketContext();

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Prueba WebSocket</h1>
      <div className="mb-4">
        Estado: {isConnected ? 
          <span className="text-green">Conectado</span> : 
          <span className="text-red">Desconectado</span>
        }
      </div>
      {data && (
        <pre className="bg-black p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}