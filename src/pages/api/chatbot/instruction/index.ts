import type { NextApiRequest, NextApiResponse } from 'next';
import { apiRequest } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import {ApiResponse} from '@/types/api'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    switch (req.method) {
        case 'POST':
            return await createInstruction(req, res);

        default:
            return res.status(405).json({
                success: false,
                error: {
                    code: 'METHOD_NOT_ALLOWED',
                    message: 'Método no permitido'
                }
            });
    }
}

async function createInstruction(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const { intention } = req.body;

    if (!intention) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'MISSING_INTENTION',
                message: 'El campo "intention" es obligatorio.'
            }
        });
    }

    try {
        const responseData: ApiResponse = await apiRequest(ENDPOINTS.instruction.create, {
            method: 'POST',
            body: JSON.stringify({
                intention,
                userId: 'jorge',
                sessionId: '5941860342303817728',
            }),
        });

        // ✨ Se envía la respuesta del backend directamente, sin volver a envolverla
        return res.status(200).json(responseData);

    } catch (error) {
        console.error('❌ Error en /api/chatbot/instruction:', error);

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
