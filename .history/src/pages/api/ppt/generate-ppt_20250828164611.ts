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

    // 🔹 Reenviamos el mismo stream multipart/form-data al backend Python
    const response = await fetch(ENDPOINTS.ppt.generate, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // 👇 MUY IMPORTANTE: dejamos que fetch pase el boundary automáticamente
        // No seteamos Content-Type, Next ya entrega correctamente el body como stream
      },
      body: req as any, // ← reenvía directamente el stream con FormData
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
