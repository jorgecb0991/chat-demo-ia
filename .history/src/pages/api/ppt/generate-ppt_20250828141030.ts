import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthToken } from "@/lib/auth/tokenService";
import { ENDPOINTS } from '@/lib/api/endpoints';
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { responseLimit: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ mensaje: 'Método no permitido' });
  }

  try {
    let payload: Record<string, any> = {};
    let isMultipart = req.headers['content-type']?.includes("multipart/form-data");

    if (isMultipart) {
      // 1️⃣ Parsear con formidable
      const form = formidable({ multiples: false });
      const { fields, files }: any = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      payload = {
        source_type: fields.sourceType,
        title: fields.titulo,
        slide_count: parseInt(fields.numSlides),
        template: fields.plantilla,
        user_id: "jorge",
        session_id: "9143660192620085248",
        instruction_teacher: fields.instrucciones_profesor || null,
      };

      if (files.file) {
        const fileBuffer = fs.readFileSync(files.file.filepath);
        payload.file_bytes = fileBuffer.toString("base64"); // ⚡ lo mandamos como base64
        payload.mime_type = files.file.mimetype;
      }
    } else {
      // 2️⃣ JSON normal
      const { sourceType, sourceValue, titulo, numSlides, plantilla, instrucciones_profesor, file_bytes, mime_type } = req.body;

      let finalSourceType = sourceType;
      if (sourceType === "url") {
        if (typeof sourceValue === "string" && /(youtube\.com|youtu\.be)/.test(sourceValue)) {
          finalSourceType = "youtube";
        } else {
          finalSourceType = "webpage";
        }
      }

      payload = {
        source_type: finalSourceType,
        source_value: sourceValue,
        title: titulo,
        slide_count: numSlides,
        template: plantilla,
        user_id: "jorge",
        session_id: "9143660192620085248",
        instruction_teacher: instrucciones_profesor || null,
        file_bytes: file_bytes || null,
        mime_type: mime_type || null,
      };
    }

    const token = await getAuthToken();

    const response = await fetch(ENDPOINTS.ppt.generate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });


    if (!response.ok) throw new Error(`Error desde backend Python: ${response.statusText}`);

    // 4️⃣ Leer binario y devolverlo como PPTX
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${titulo || 'presentacion'}.pptx"`);
    res.status(200).send(buffer);

  } catch (error) {
    console.error('Error en /api/generate-ppt:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}
