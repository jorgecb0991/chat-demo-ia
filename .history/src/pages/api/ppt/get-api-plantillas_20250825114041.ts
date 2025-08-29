import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const PLANTILLAS_DIR = path.join(process.cwd(), 'public', 'template');

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

    // Leer archivos de la carpeta
    const archivos = await fs.readdir(PLANTILLAS_DIR);

    // Filtrar solo imágenes PNG
    const pngFiles = archivos.filter(f => f.endsWith('.png'));

    // Construir la lista de plantillas a partir de las imágenes
    const plantillas: Plantilla[] = pngFiles.map(file => {
      const nombre = path.basename(file, '.png');
      return {
        nombre,
        preview: `/template/${nombre}.png`,
        archivo: `/template/${nombre}.pptx`, // aunque no exista, sirve como referencia visual
        disponible: true
      };
    });

    if (plantillas.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron imágenes de plantillas en /public/template'
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
