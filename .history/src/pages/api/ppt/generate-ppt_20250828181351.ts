import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthToken } from "@/lib/auth/tokenService";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { IncomingForm, File } from 'formidable';
import * as fs from 'fs';

// Configuración especial para API Routes en Next.js
export const config = {
  api: {
    bodyParser: false, // Desactiva el parsing automático de Next.js porque usamos 'formidable'
    responseLimit: false, // Permite respuestas de cualquier tamaño (necesario para archivos PPTX)
  },
};

/**
 * Función auxiliar para detectar si una URL es de YouTube
 * @param url La URL a verificar
 * @returns boolean true si es una URL de YouTube
 */
function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Verificamos los dominios principales de YouTube
    return hostname.includes('youtube.com') || hostname.includes('youtu.be');
  } catch (error) {
    // Si la URL no es válida, consideramos que no es de YouTube
    return false;
  }
}

/**
 * Manejador de API para generar presentaciones PPTX
 * 
 * Este endpoint actúa como intermediario entre el frontend y el backend Python:
 * 1. Recibe FormData del frontend (puede incluir archivos)
 * 2. Procesa los datos con 'formidable' (mejor para archivos que el parser nativo de Next.js)
 * 3. Reconstruye los datos para enviarlos al backend Python
 * 4. Devuelve el PPTX generado como descarga
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Solo permitimos método POST porque estamos creando un recurso
  if (req.method !== "POST") {
    return res.status(405).json({ mensaje: "Método no permitido" });
  }

  try {
    // Usamos 'formidable' para parsear FormData porque Next.js no tiene soporte nativo
    // para multipart/form-data (especialmente con archivos)
    const form = new IncomingForm();
    
    // Convertimos el callback de formidable a Promise para usar async/await
    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Obtenemos token de autenticación para el backend Python
    const token = await getAuthToken();

    // DETERMINAMOS EL TIPO DE FUENTE CORRECTO
    // Si el frontend envió "url" como sourceType, verificamos si es de YouTube
    let sourceTypeForBackend = fields.sourceType as string;
    console.log("sourceTypeForBackend:"+sourceTypeForBackend);
    
    if (sourceTypeForBackend === "url" && fields.sourceValue) {

    if (sourceTypeForBackend === "url" && fields.sourceValue) {

      // Verificamos si la URL es de YouTube
      if (isYouTubeUrl(fields.sourceValue as string)) {
        sourceTypeForBackend = "youtube";

      } else {
        sourceTypeForBackend = "webpage";
      }
    }

    console.log("sourceTypeForBackend:"+sourceTypeForBackend);

    // Creamos nuevo FormData para enviar al backend Python
    // Nota: Usamos snake_case para los nombres porque es el estándar en Python
    const backendFormData = new FormData();
    
    // Mapeamos campos del frontend (camelCase) al backend (snake_case)
    backendFormData.append("source_type", sourceTypeForBackend); // Usamos el tipo determinado
    backendFormData.append("title", fields.title as string);
    backendFormData.append("slide_count", fields.slide_count as string);
    backendFormData.append("template", fields.template as string);
    backendFormData.append("user_id", "jorge"); // Valor hardcodeado por ahora
    backendFormData.append("session_id", "9143660192620085248"); // Valor hardcodeado por ahora
    
    // Campos opcionales
    if (fields.instruction_teacher) {
      backendFormData.append("instruction_teacher", fields.instruction_teacher as string);
    }
    
    // Siempre enviamos el sourceValue, sin importar el tipo
    if (fields.sourceValue) {
      backendFormData.append("source_value", fields.sourceValue as string);
    }

    // Manejo de archivos subidos (si existen)
    if (files.file) {
      const file = files.file[0] as File;
      
      // Leemos el archivo desde el sistema de archivos (formidable lo guarda temporalmente)
      const fileBuffer = fs.readFileSync(file.filepath);
      
      // Convertimos a Blob (formato estándar para enviar archivos via HTTP)
      const fileBlob = new Blob([fileBuffer], { 
        type: file.mimetype || 'application/octet-stream' // Tipo MIME o genérico si no se detecta
      });
      
      // Agregamos el archivo al FormData del backend
      backendFormData.append("file", fileBlob, file.originalFilename || "archivo");
    }

    // Enviamos la solicitud al backend Python
    const response = await fetch(ENDPOINTS.ppt.generate, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Autenticación Bearer token
      },
      body: backendFormData, // Enviamos el FormData reconstruido
    });

    // Manejo de errores del backend Python
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error desde backend Python: ${response.status} ${response.statusText}. ${errorText}`);
    }

    // Procesamos la respuesta (archivo PPTX)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); // Convertimos a Buffer de Node.js

    // Configuramos headers para forzar la descarga del archivo
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" // Tipo MIME de PPTX
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="presentacion.pptx"` // Fuerza descarga con nombre específico
    );
    
    // Enviamos el archivo como respuesta
    res.status(200).send(buffer);
  } catch (error) {
    // Manejo centralizado de errores
    console.error("Error en /api/generate-ppt:", error);
    res.status(500).json({ 
      mensaje: "Error interno del servidor", 
      error: (error as Error).message // Incluimos detalles del error para debugging
    });
  }
}