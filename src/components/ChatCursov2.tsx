"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

interface MensajeChat {
  pregunta: string;
  respuesta: string;
}

export default function ChatCurso() {
  const [mensaje, setMensaje] = useState('');
  const [respuestas, setRespuestas] = useState<MensajeChat[]>([]);
  const [cursoId, setCursoId] = useState('');
  const [sessionId, setSessionId] = useState(''); 

   // Genera un nuevo sessionId al montar el componente (inicio del chat)
   useEffect(() => {
    const newSessionId = uuidv4(); // Ej: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"
    setSessionId(newSessionId);
    console.log('Nuevo sessionId:', newSessionId);
  }, []); 

  const enviarPregunta = async () => {
    if (!mensaje.trim()) return;

    const preguntaConCurso = `[CURSO: ${cursoId}] ${mensaje}`;
    const response = await fetch('/api/bedrock-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta: preguntaConCurso , sessionId : sessionId })
    });
    const data = await response.json();
    setRespuestas((prev) => [...prev, { pregunta: mensaje, respuesta: data.respuesta }]);
    setMensaje('');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Asistente Educativo por Curso</h1>

      <div className="border rounded p-4 flex-1 overflow-y-auto bg-gray-50 space-y-4">
        {respuestas.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-end">
              <div className="bg-blue-100 text-blue-900 p-3 rounded-xl max-w-[75%]">
                <p className="text-sm">Tú</p>
                <p className="font-medium">{item.pregunta}</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-xl max-w-[75%]">
                <p className="text-sm">Agente</p>
                <p>{item.respuesta}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="ID del curso (ej. CS1021)"
          value={cursoId}
          onChange={(e) => setCursoId(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="text"
            className="border p-2 rounded flex-grow"
            placeholder="Escribe tu pregunta..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarPregunta()}
          />
          <Button onClick={enviarPregunta}>Enviar</Button>
        </div>
      </div>
    </div>
  );
}
