// Interfaz de chat React que se conecta con tu backend en Python
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MensajeChat {
  pregunta: string;
  respuesta: string;
}

export default function ChatCurso() {
  const [mensaje, setMensaje] = useState('');
  const [respuestas, setRespuestas] = useState<MensajeChat[]>([]);
  const [cursoId, setCursoId] = useState('CS1021');

  const enviarPregunta = async () => {
    const preguntaConCurso = `[CURSO: ${cursoId}] ${mensaje}`;
    const response = await fetch('/api/bedrock-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta: preguntaConCurso })
    });
    const data = await response.json();
    setRespuestas((prev) => [...prev, { pregunta: mensaje, respuesta: data.respuesta }]);
    setMensaje('');
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Asistente por Curso</h1>
      <input
        type="text"
        className="border p-2 w-full rounded mb-2"
        placeholder="ID del curso (ej. CS1021)"
        value={cursoId}
        onChange={(e) => setCursoId(e.target.value)}
      />
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 flex-grow rounded"
          placeholder="Escribe tu pregunta..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviarPregunta()}
        />
        <Button onClick={enviarPregunta}>Enviar</Button>
      </div>
      <div className="space-y-2">
        {respuestas.map((item, index) => (
          <div key={index} className="border rounded p-2">
            <p className="font-semibold">Tú: {item.pregunta}</p>
            <p className="text-gray-700">Agente: {item.respuesta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
