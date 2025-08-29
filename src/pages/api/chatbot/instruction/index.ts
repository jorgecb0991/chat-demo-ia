// src/pages/api/chatbot/instruction/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiRequest } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
            // ✅ POST → Crear una nueva instrucción
            // Aquí llamamos a la función que maneja la lógica de creación
            return await createInstruction(req, res);

        /**
         * 🔹 Si en el futuro quieres manejar otros métodos HTTP, agrégalos aquí.
         * Ejemplos:
         *
         * case 'GET':
         *   // GET → Listar todas las instrucciones o devolver una por query param
         *   return await getInstructions(req, res);
         *
         * case 'PUT':
         *   // PUT → Actualizar una instrucción existente
         *   return await updateInstruction(req, res);
         *
         * case 'DELETE':
         *   // DELETE → Eliminar una instrucción
         *   return await deleteInstruction(req, res);
         *
         * 📌 Importante:
         * - Mantener la convención de que cada método HTTP se maneja en su propio bloque.
         * - La lógica de cada caso debe ir en una función separada para mantener el handler limpio.
         * - Si hay operaciones que requieren ID, deben implementarse en [id].ts, no aquí.
         */
        
        default:
            return res.status(405).json({ mensaje: 'Método no permitido' });
    }
}


async function createInstruction(req: NextApiRequest, res: NextApiResponse) {
    const { intention } = req.body;
    if (!intention) {
        return res.status(400).json({ mensaje: 'El campo "intention" es obligatorio.' });
    }

    try {
        const data = await apiRequest(ENDPOINTS.instruction.generate, {
            method: 'POST',
            body: JSON.stringify({
              intention,
              user_id: 'jorge',
              session_id: '5941860342303817728',
            }),
          });
        return res.status(200).json({ data });

    } catch (error) {
        console.error('❌ Error en /api/chatbot/instruction:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
}
