import type { NextApiRequest, NextApiResponse } from 'next';
import { apiRequest } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import {ApiResponse} from '@/types/api'

interface Plantilla {
  nombre: string;
  preview: string;
  archivo: string;
  disponible: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === 'GET') {
    return handleGetPlantillas(req, res);
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ mensaje: 'Método no permitido' });
}

async function handleGetPlantillas(req: NextApiRequest, res: NextApiResponse) {
  try {
    const responseData: ApiResponse = await apiRequest(ENDPOINTS.templates.list, { method: 'GET' });

    if (!responseData.success || !Array.isArray(responseData.data)) {
      throw new Error('Respuesta inválida del backend Python');
    }

    const plantillas: Plantilla[] = responseData.data.map((t: any) => ({
      nombre: t.display_name,
      preview: `data:image/png;base64,${t.image_bytes}`,
      archivo: t.name,
      disponible: true,
    }));

    return res.status(200).json(plantillas);

  } catch (error) {
    console.error("Error al obtener plantillas del backend Python:", error);
    // ⚠️ Siempre devolvemos un array, aunque sea vacío, para no romper el front
    return res.status(200).json([]);
  }
}
