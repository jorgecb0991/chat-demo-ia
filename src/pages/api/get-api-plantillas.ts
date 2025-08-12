import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

// Configuración de las plantillas
const PLANTILLAS_DIR = path.join(process.cwd(), 'public', 'plantillas');
const PLANTILLAS_PERMITIDAS = ['profesional', 'creativa']; // Nombres base sin extensión

interface Plantilla {
  nombre: string;
  preview: string;
  archivo: string;
  disponible: boolean;
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
    // Verificar si existe el directorio de plantillas
    try {
      await fs.access(PLANTILLAS_DIR);
    } catch (error) {
      console.error('Directorio de plantillas no encontrado:', PLANTILLAS_DIR);
      return res.status(404).json({
        mensaje: 'Directorio de plantillas no encontrado',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }

    // Crear lista de plantillas disponibles
    const plantillasDisponibles: Plantilla[] = await Promise.all(
    PLANTILLAS_PERMITIDAS.map(async (nombre): Promise<Plantilla> => {
    const pptxPath = path.join(PLANTILLAS_DIR, `${nombre}.pptx`);
    const previewPath = path.join(PLANTILLAS_DIR, `${nombre}.png`);

    try {
          await fs.access(pptxPath);
          await fs.access(previewPath);

          return {
            nombre,
            preview: `/plantillas/${nombre}.png`,
            archivo: `/plantillas/${nombre}.pptx`,
            disponible: true
          };
        } catch (error) {
          console.warn(`Plantilla incompleta: ${nombre}`);
          console.error(error);
          return {
            nombre,
            preview: '',
            archivo: '',
            disponible: false
          };
        }
    })
    );

    // Filtrar solo las plantillas disponibles
    const plantillas = plantillasDisponibles.filter(p => p.disponible);

    if (plantillas.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron plantillas válidas',
        detalles: `Se esperaban archivos .pptx y .jpg para: ${PLANTILLAS_PERMITIDAS.join(', ')}`
      });
    }

    return res.status(200).json(plantillas);

  } catch (error) {
    console.error('Error al listar plantillas:', error);
    return res.status(500).json({
      mensaje: 'Error interno al listar plantillas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}