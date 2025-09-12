import type { NextApiRequest, NextApiResponse } from 'next';
import { apiRequest } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/api';

/**
 * Endpoint: POST /api/chatbot/send-message
 * Descripción: Envía un mensaje a un chatbot o agente.
 * * 📌 Notas para desarrolladores:
 * - Este endpoint es una acción específica del chatbot, por eso NO está en index.ts.
 * - Si la acción siempre aplica a un chatbot específico, mover a /chatbot/[id]/send-message.ts
 * - Seguir este patrón para acciones específicas: nombre-de-accion.ts
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  switch (req.method) {
    case 'POST':
      return await sendMessage(req, res);
    default:
      // ⚠️ Si agregas más métodos HTTP (GET, PUT, DELETE), recuerda documentarlos aquí
      return res.status(405).json({ 
        success: false,
        error: {
          code: 'METHOD_NOT_ALLOWED',
          message: 'Método no permitido'
        }
      });
  }
}

/**
 * Función principal para manejar el POST (envío de mensaje)
 */
async function sendMessage(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { message, session_id } = req.body;

  if (!message || !session_id) {
    return res.status(400).json({ 
      success: false,
      error: {
        code: 'MISSING_PARAMS',
        message: 'Faltan parámetros requeridos: message y session_id'
      }
    });
  }

  try {
    // Llamar al backend Python
    // La función apiRequest ya maneja errores y devuelve una respuesta en el formato ApiResponse.
    const responseData: ApiResponse = await apiRequest(ENDPOINTS.chatbot.sendMessage, {
      method: 'POST',
      body: JSON.stringify({
        message,
        user_id: "jorge", // 🔹 TODO: reemplazar con user_id dinámico cuando esté implementado
        session_id
      })
    });

    // ✨ Devolver la respuesta del backend directamente, sin volver a encapsularla.
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Error en /api/chatbot/send-message:', error);
    return res.status(500).json({ 
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }
    });
  }
}
