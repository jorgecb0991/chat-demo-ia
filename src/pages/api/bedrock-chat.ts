// src/pages/api/bedrock-chat.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ mensaje: 'Método no permitido' });
  }

  const { pregunta } = req.body;

  try {
    // Aquí se conecta con tu backend Python
    const response = await fetch('http://localhost:8000/api/bedrock-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta })
    });

    if (!response.ok) {
      throw new Error(`Error desde backend Python: ${response.statusText}`);
    }

    const data = await response.json();
    const respuesta = data.respuesta;

    return res.status(200).json({ respuesta });
  } catch (error) {
    console.error('Error en /api/bedrock-chat:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}