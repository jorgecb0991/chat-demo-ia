// src/pages/api/chatbot/instruction/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Endpoint de ejemplo para manejar una instrucción específica por su ID.
 * Rutas posibles:
 *   GET    /api/chatbot/instruction/:id   → Obtener instrucción
 *   PUT    /api/chatbot/instruction/:id   → Actualizar instrucción
 *   DELETE /api/chatbot/instruction/:id   → Eliminar instrucción
 *
 * NOTA: Actualmente no implementado. Este archivo es un placeholder para guiar el desarrollo.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    // 1️⃣ Validar que haya ID
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ mensaje: 'Falta el parámetro ID en la URL.' });
    }

    // 2️⃣ Seleccionar el método HTTP
    switch (req.method) {
        case 'GET':
            // TODO: Implementar lógica para obtener la instrucción por ID
            return res.status(200).json({ mensaje: `GET instrucción con id: ${id}` });

        case 'PUT':
            // TODO: Implementar lógica para actualizar la instrucción
            return res.status(200).json({ mensaje: `PUT instrucción con id: ${id}` });

        case 'DELETE':
            // TODO: Implementar lógica para eliminar la instrucción
            return res.status(200).json({ mensaje: `DELETE instrucción con id: ${id}` });

        default:
            // Método no permitido
            return res.status(405).json({ mensaje: 'Método no permitido' });
    }
}
