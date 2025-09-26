import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/api';

/**
 * Endpoint de la API para crear una nueva instrucción de chatbot.
 *
 * Esta función se invoca automáticamente cuando una solicitud POST llega
 * al endpoint /api/chatbot/instruction.
 *
 * @param {Request} request El objeto de la petición (automáticamente inyectado por Next.js).
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { intention } = body;

        if (!intention) {
            return NextResponse.json({
                success: false,
                error: {
                    code: 'MISSING_INTENTION',
                    message: 'El campo "intention" es obligatorio.'
                }
            }, { status: 400 });
        }

        const requestBody = {
            intention,
            userId: 'jorge',
            sessionId: '5941860342303817728',
        };

        const responseData: ApiResponse = await apiRequest(ENDPOINTS.instruction.create, {
            method: 'POST',
            body: JSON.stringify(requestBody),
        });

        // Se envía la respuesta del backend directamente, sin volver a envolverla
        return NextResponse.json(responseData);

    } catch (error) {
        console.error('❌ Error en /api/chatbot/instruction:', error);
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
