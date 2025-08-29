import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthToken } from "@/lib/auth/tokenService";
import { ENDPOINTS } from "@/lib/api/endpoints";

// 👇 Como ya no usamos formidable, sí dejamos bodyParser en false para que Next
// no intente convertir multipart en JSON automáticamente
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
    // 🔹 Obtenemos el token
    const token = await getAuthToken();

    const form = new FormData();
    form.append("sourceType", sourceType);
    form.append("title", titulo);
    form.append("slide_count", numSlides.toString());
    form.append("template", plantillaSeleccionada);
    form.append("user_id", "jorge");
    form.append("session_id", "9143660192620085248");

    // 🔹 Reenviamos el mismo stream multipart/form-data al backend Python
    const response = await fetch(ENDPOINTS.ppt.generate, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // 👇 MUY IMPORTANTE: dejamos que fetch pase el boundary automáticamente
        // No seteamos Content-Type, Next ya entrega correctamente el body como stream
      },
      body: req, // ← reenvía directamente el stream con FormData
      duplex: "half",
    });

    if (!response.ok) {
      throw new Error(`Error desde backend Python: ${response.status} ${response.statusText}`);
    }

    // 🔹 Leemos el binario (pptx)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="presentacion.pptx"`
    );
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error en /api/generate-ppt:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}
