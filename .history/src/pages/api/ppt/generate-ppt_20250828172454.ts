import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthToken } from "@/lib/auth/tokenService";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { IncomingForm, File } from 'formidable';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensaje: "Método no permitido" });
  }

  try {
    // Parsear el FormData usando formidable
    const form = new IncomingForm();
    
    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Obtener el token de autenticación
    const token = await getAuthToken();

    // Crear un nuevo FormData para enviar al backend
    const backendFormData = new FormData();
    
    // Agregar campos al FormData del backend
    backendFormData.append("sourceType", fields.sourceType as string);
    backendFormData.append("title", fields.title as string);
    backendFormData.append("slide_count", fields.slide_count as string);
    backendFormData.append("template", fields.template as string);
    backendFormData.append("user_id", "jorge");
    backendFormData.append("session_id", "9143660192620085248");
    
    if (fields.instruction_teacher) {
      backendFormData.append("instruction_teacher", fields.instruction_teacher as string);
    }
    
    if (fields.sourceValue) {
      backendFormData.append("sourceValue", fields.sourceValue as string);
    }

    // Manejar el archivo si existe
    if (files.file) {
      const file = files.file[0] as File;
      // Convertir el archivo a Blob para FormData
      const fileStream = Readable.from(file as unknown as Buffer);
      const fileBlob = new Blob([await streamToBuffer(fileStream)], { type: file.mimetype || 'application/octet-stream' });
      backendFormData.append("file", fileBlob, file.originalFilename || "archivo");
    }

    // Enviar al backend
    const response = await fetch(ENDPOINTS.ppt.generate, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error desde backend Python: ${response.status} ${response.statusText}. ${errorText}`);
    }

    // Obtener el archivo PPTX como buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Configurar headers para descarga
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="presentacion.pptx"`
    );
    
    // Enviar el archivo
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error en /api/generate-ppt:", error);
    res.status(500).json({ mensaje: "Error interno del servidor", error: (error as Error).message });
  }
}

// Función auxiliar para convertir stream a buffer
function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}