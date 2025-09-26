import fs from 'fs/promises';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("-----------------chat_stats------------------------")
    // Ruta absoluta a chat_stats.json, subiendo un nivel desde el root del proyecto Next.js
    const filePath = path.resolve(process.cwd(), '..', 'chat_stats.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const registros = data
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));

    res.status(200).json({ registros });
  } catch (error) {
    console.error('[ERROR] No se pudo leer el archivo:', error);
    res.status(500).json({ error: 'Error al leer las estadísticas' });
  }
}
