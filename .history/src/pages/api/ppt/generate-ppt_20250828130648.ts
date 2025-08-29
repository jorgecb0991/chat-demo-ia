import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthToken } from "@/lib/auth/tokenService";
import { ENDPOINTS } from '@/lib/api/endpoints';

export const config = {
  api: { responseLimit: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ mensaje: 'Método no permitido' });
  }

  const { sourceType, sourceValue, titulo, numSlides, plantilla, instrucciones_profesor , file_bytes, mime_type  } = req.body;

  try {
    // 1️⃣ Obtener token dinámico
    const token = await getAuthToken();

    //se detecta si es webpage o youtube
    let finalSourceType = sourceType;

    if (sourceType === "url") {
      if (
        typeof sourceValue === "string" &&
        /(youtube\.com|youtu\.be)/.test(sourceValue)
      ) {
        finalSourceType = "youtube";
      } else {
        finalSourceType = "webpage";
      }
    }

    // 2️⃣ Armar payload dinámico
    const payload: Record<string, any> = {
      source_type: finalSourceType,
      source_value: sourceValue,
      title: titulo,
      slide_count: numSlides,
      template: plantilla,
      user_id: "jorge",
      session_id: "9143660192620085248"
    };

    // 👇 Solo incluir si existe valor
    if (instrucciones_profesor && instrucciones_profesor.trim() !== "") {
      payload.instruction_teacher = instrucciones_profesor.trim();
    } else {
      payload.instruction_teacher = null;
    }

    // 3️⃣ Llamar a tu API Python
    const response = await fetch(ENDPOINTS.ppt.generate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
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
