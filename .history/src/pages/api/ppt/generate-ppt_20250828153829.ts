import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthToken } from "@/lib/auth/tokenService";
import { ENDPOINTS } from '@/lib/api/endpoints';
import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

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

    let payload= new FormData();
    payload.append("source_type",fields.sourceType);
    payload.append("source_value",fields.sourceValue);
    payload.append("title",fields.titulo);
    payload.append("slide_count",fields.numSlides);
    payload.append("template",fields.plantilla);
    payload.append("user_id","jorge");
    payload.append("session_id","9143660192620085248");
    payload.append("instruction_teacher",fields.instrucciones_profesor || null);

    if (files.file) {
      payload.append("file", fs.createReadStream(files.file.filepath), {
        filename: files.file.originalFilename,
        contentType: files.file.mimetype,
      });
    }

    const token = await getAuthToken();

    const response = await fetch(ENDPOINTS.ppt.generate, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      body: payload as any,
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
