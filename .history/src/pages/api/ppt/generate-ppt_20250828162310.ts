import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthToken } from "@/lib/auth/tokenService";
import { ENDPOINTS } from "@/lib/api/endpoints";
import formidable, { Files, Fields, File } from "formidable";
import fs from "fs";
import FormData from "form-data";

// 👇 Necesario para que Next no intente parsear el body (porque lo hará formidable)
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

/**
 * 🔹 Normaliza los valores de formidable:
 * formidable devuelve strings o arrays de strings.
 * Como en nuestro caso siempre esperamos un valor único,
 * este helper devuelve siempre un string.
 */
function normalizeField(value: string | string[] | undefined): string {
  if (!value) return "";
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensaje: "Método no permitido" });
  }

  try {
    // ✅ Parsear siempre multipart con formidable
    //    🔹 Importante: multiples: false → asegura que solo manejamos UN archivo
    const form = formidable({ multiples: false });

    const { fields, files }: { fields: Fields; files: Files } = await new Promise(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );

    // 🔹 Normalizamos todos los campos (porque podrían venir como arrays)
    const sourceType = normalizeField(fields.sourceType as any);
    const sourceValue = normalizeField(fields.sourceValue as any);
    const titulo = normalizeField(fields.titulo as any);
    const numSlides = normalizeField(fields.numSlides as any);
    const plantilla = normalizeField(fields.plantilla as any);
    const instruccionesProfesor = normalizeField(fields.instrucciones_profesor as any);

    // 🔹 Construimos el payload para el backend Python
    let payload = new FormData();
    payload.append("source_type", sourceType);
    payload.append("source_value", sourceValue);
    payload.append("title", titulo);
    payload.append("slide_count", numSlides);
    payload.append("template", plantilla);
    payload.append("user_id", "jorge");
    payload.append("session_id", "9143660192620085248");
    if (instruccionesProfesor) {
      payload.append("instruction_teacher", instruccionesProfesor);
    }

    const filepath = (file as any).filepath || (file as any).path;
    if (!filepath) throw new Error("No se encontró ruta del archivo subido");
    // ✅ Solo un archivo permitido
    if (files.file) {
      const file = files.file as unknown as formidable.File;
      payload.append("file", fs.createReadStream(file.filepath), {
        filename: file.originalFilename || "upload",
        contentType: file.mimetype || "application/octet-stream",
      });
    }

    const token = await getAuthToken();

    const response = await fetch(ENDPOINTS.ppt.generate, {
      method: "POST",
      headers: {
        ...payload.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
      body: payload as any,
    });

    if (!response.ok) throw new Error(`Error desde backend Python: ${response.statusText}`);

    // 🔹 Leemos la respuesta binaria y la devolvemos como PPTX
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${titulo || "presentacion"}.pptx"`
    );
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error en /api/generate-ppt:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}
