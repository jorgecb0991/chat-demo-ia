import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: { responseLimit: false },
};

// 🔹 Función para obtener token dinámico
async function getAuthToken(): Promise<string> {
  const authUrl = "https://api-test5.utec.net.pe/horus-api/v1/nonspec/oauth2/auth/server";
  const body = {
    grantType: "client_credentials",
    clientId: "26336c0a-24f9-4339-b0a7-e23eda8ca62d",
    clientSecret: "4a90130b-da4c-4d89-b942-c60d1ba2a578"
  };

  const res = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Error al obtener token: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log("xxx")
  console.log(data)

  if (!data.content?.accessToken) {
    throw new Error("No se recibió accessToken en la respuesta");
  }

  return data.content.accessToken;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ mensaje: 'Método no permitido' });
  }

  const { tema, titulo, numSlides, plantilla } = req.body;

  try {
    // 1️⃣ Obtener token dinámico
    const token = await getAuthToken();

    // 2️⃣ Llamar a tu API para generar PPT
    const response = await fetch('https://api-test5.utec.net.pe/vertex-ai-api/api/v1/ppt/generate-ppt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: titulo,
        topic: tema,
        slide_count: numSlides,
        template: plantilla,
        user_id: "jorge",
        session_id: "7517697999418425344"
      })
    });

    if (!response.ok) throw new Error(`Error desde backend Python: ${response.statusText}`);

    // 3️⃣ Leer binario y devolverlo como PPTX
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
