import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthToken } from "@/lib/auth/tokenService";
import { ENDPOINTS } from '@/lib/api/endpoints';
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ mensaje: 'Método no permitido' });
  }

  try {
    // ✅ Siempre multipart
    const form = formidable({ multiples: false });
    const { fields, files }: any = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    let payload: new FormData()
    payload.append()
    
    = {
      source_type: fields.sourceType,
      source_value: fields.sourceValue || null, // opcional
      title: fields.titulo,
      slide_count: parseInt(fields.numSlides),
      template: fields.plantilla,
      user_id: "jorge",
      session_id: "9143660192620085248",
      instruction_teacher: fields.instrucciones_profesor || null,
    };

    if (files.file) {
      // ⚡ Enviar el archivo como stream o buffer directo
      payload.file = {
        stream: fs.createReadStream(files.file.filepath), // mejor práctica para no cargarlo todo en memoria
        filename: files.file.originalFilename,
        mimetype: files.file.mimetype,
      };
    }

    const token = await getAuthToken();

    const response = await fetch(ENDPOINTS.ppt.generate, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      body: payload,
    });

    if (!response.ok) throw new Error(`Error desde backend Python: ${response.statusText}`);

    // 4️⃣ Leer binario y devolverlo como PPTX
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${fields.titulo || 'presentacion'}.pptx"`);
    res.status(200).send(buffer);

  } catch (error) {
    console.error('Error en /api/generate-ppt:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}
