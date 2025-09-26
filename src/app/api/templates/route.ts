import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/api';

// Define la estructura de la plantilla para una mejor tipificación
interface Plantilla {
  nombre: string;
  preview: string;
  archivo: string;
  disponible: boolean;
}

/**
 * Maneja las peticiones GET para la ruta /api/templates.
 *
 * En Next.js 14 App Router, se exporta una función con el nombre del método HTTP.
 * Esto hace que el código sea más claro y explícito, sin necesidad de un handler general.
 * @param {Request} request - El objeto de la petición (automáticamente inyectado por Next.js).
 */
export async function GET() {
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

    // Se usa NextResponse.json para devolver la respuesta JSON de forma nativa.
    return NextResponse.json(plantillas);

  } catch (error) {
    console.error("Error al obtener plantillas del backend Python:", error);
    // ⚠️ Siempre devolvemos un array, aunque sea vacío, para no romper el front
    return NextResponse.json([]);
  }
}
