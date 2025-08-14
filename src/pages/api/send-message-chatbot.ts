// src/pages/api/send-message-chatbot.ts

import type { NextApiRequest, NextApiResponse } from 'next';
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

  const { message, session_id } = req.body;

  try {
    // 1️⃣ Obtener token dinámico
    const token = await getAuthToken();

    // Aquí se conecta con tu backend Python
    const response = await fetch('https://api-test5.utec.net.pe/vertex-ai-api/api/v1/chatbot/send-message-chatbot', {
      method: 'POST',
      headers: {  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message:message , user_id:"jorge", session_id:session_id})
    });

    console.log(response);
    if (!response.ok) {
      throw new Error(`Error desde backend Python: ${response.statusText}`);
    }

    const data = await response.json();
    //const instruction = data.instruction;
    console.log(data)

    return res.status(200).json({ data });
  } catch (error) {
    console.error('Error en /api/send-message-chatbot:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}