// src/pages/api/chatbot/send-message.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiRequest } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

/**
 * Endpoint: POST /api/chatbot/send-message
 * Descripción: Envía un mensaje a un chatbot o agente.
 * 
 * 📌 Notas para desarrolladores:
 * - Este endpoint es una acción específica del chatbot, por eso NO está en index.ts.
 * - Si la acción siempre aplica a un chatbot específico, mover a /chatbot/[id]/send-message.ts
 * - Seguir este patrón para acciones específicas: nombre-de-accion.ts
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return await sendMessage(req, res);
    default:
      // ⚠️ Si agregas más métodos HTTP (GET, PUT, DELETE), recuerda documentarlos aquí
      return res.status(405).json({ mensaje: 'Método no permitido' });
  }
}

/**
 * Función principal para manejar el POST (envío de mensaje)
 */
async function sendMessage(req: NextApiRequest, res: NextApiResponse) {
  const { message, session_id } = req.body;

  if (!message || !session_id) {
    return res.status(400).json({ mensaje: 'Faltan parámetros requeridos: message y session_id' });
  }

  try {

    // Llamar al backend Python
    const data = await apiRequest(ENDPOINTS.chatbot.sendMessage, {
      method: 'POST',
      body: JSON.stringify({
        message,
        user_id: "jorge", // 🔹 TODO: reemplazar con user_id dinámico cuando esté implementado
        session_id
      })
    }
    );

    return res.status(200).json({ data });

  } catch (error) {
    console.error('Error en /api/chatbot/send-message:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}
