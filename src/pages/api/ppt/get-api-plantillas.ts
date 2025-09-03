import type { NextApiRequest, NextApiResponse } from 'next';
import { apiRequest } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

interface Plantilla {
  nombre: string;
  preview: string;
  archivo: string;
  disponible: boolean;
}

interface data {
  templates:[],
  status:string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGetPlantillas(req, res);
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ mensaje: 'Método no permitido' });
}

async function handleGetPlantillas(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Llamada al backend usando apiRequest que maneja el token
    const data: data = await apiRequest(ENDPOINTS.ppt.template.list, { method: 'GET' });

    if (data.status !== 'OK' || !Array.isArray(data.templates)) {
      throw new Error('Respuesta inválida del backend Python');
    }

    // Mapear las plantillas al formato esperado por el frontend
    const plantillas: Plantilla[] = data.templates.map((t: any) => ({
      nombre: t.display_name,
      preview: `data:image/png;base64,${t.image_bytes}`,
      archivo: t.name,
      disponible: true,
    }));

    return res.status(200).json(plantillas);

  } catch (error) {
    console.error('Error al obtener plantillas del backend Python:', error);
    return res.status(500).json({
      mensaje: 'Error interno al obtener plantillas',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
}
