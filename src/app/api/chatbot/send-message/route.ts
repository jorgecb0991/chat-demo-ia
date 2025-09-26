import { NextResponse } from "next/server";
import { apiRequest } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/api';

/**
 * Endpoint de la API para enviar un mensaje a un chatbot o agente.
 *
 * Esta función se invoca automáticamente cuando una solicitud POST llega
 * al endpoint /api/chatbot/send-message.
 *
 * @param {Request} request El objeto de la petición (automáticamente inyectado por Next.js).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, session_id } = body;

    // Validación de parámetros
    if (!message || !session_id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_PARAMS',
          message: 'Faltan parámetros requeridos: message y session_id'
        }
      }, { status: 400 });
    }

    // Llamar al backend de Python
    const responseData: ApiResponse = await apiRequest(ENDPOINTS.chatbot.sendMessage, {
      method: 'POST',
      body: JSON.stringify({
        message,
        user_id: "jorge", // 🔹 TODO: reemplazar con user_id dinámico
        session_id
      })
    });

    // Devolver la respuesta del backend directamente
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error en /api/chatbot/send-message:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? JSON.stringify(error) : undefined
      }
    }, { status: 500 });
  }
}
