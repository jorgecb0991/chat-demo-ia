import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ mensaje: 'Método no permitido' });
  }

  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const body = req.body;
  console.log(body);
  const tema = body.tema || 'Sin tema';
  const numSlides = body.numSlides || '0'; // Asigna valores por defecto
  const titulo = body.titulo || 'Sin título';
  const pregunta = `[tema:${tema}][numSlides:${numSlides}][titulo:${titulo}]`;
  const plantilla = body.plantilla;
  let jsonEstructuraSlide = {slides:[{imagen_sugerida:""}] , titulo:""};

  try{
    // Aquí se conecta con tu backend Python
    const response = await fetch('http://localhost:8000/api/bedrock-agente-contenido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta })
    });

    if (!response.ok) {
      throw new Error(`Error desde backend Python bedrock-agente-contenido: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("--------------data : "+JSON.stringify(data));
    jsonEstructuraSlide = data.respuesta;
    console.log("respuesta de json structura : "+jsonEstructuraSlide);
  }catch(error){
    console.error('Error al generar estructura slide:', error);
  }
  
  // Si llega como string, convértelo a objeto
  const estructura =
  typeof jsonEstructuraSlide === "string"
    ? JSON.parse(jsonEstructuraSlide)
    : jsonEstructuraSlide;

  // Validación defensiva
  if (!estructura || !Array.isArray(estructura.slides)) {
  throw new Error("Estructura inválida: slides no encontrados");
  }
  

  // Ruta a la carpeta /public/img relativa al proyecto
  const savePathBase = path.join(process.cwd(), 'public', 'img');

  try {
    await fs.mkdir(savePathBase, { recursive: true });

    const slidesConImagenes = [];
    console.log("------estructura: "+ JSON.stringify(estructura));

    for (let i = 0; i < estructura.slides.length; i++) {
      const slide = estructura.slides[i];

      // Agrega recomendaciones extra al prompt
      //const promptFinal = slide.imagen_sugerida.trim().replace(/\.*$/, "") + "," + recomendacionesExtra;
      const promptFinal = slide.imagen_sugerida;

      const response = await fetch('http://localhost:8001/api/generar-imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptFinal })
      });

      if (!response.ok) {
        throw new Error(`Error al generar imagen: ${response.statusText}`);
      }

      const data = await response.json();
      const base64Image = data.imagen_base64;

      // En tu API (/api/bedrock-generate-slide)
      const fileName = `slide_${Date.now()}_${i + 1}.png`; // Ej: slide_1712345678900_1.png
      const imagePath = path.join(savePathBase, fileName);
      await fs.writeFile(imagePath, Buffer.from(base64Image, 'base64'));

      slidesConImagenes.push({
        ...slide,
        imagen_local: `/img/${fileName}`,
        imagen_local_absoluta: `chat-bedrock/public/img/${fileName}`
      });
    }

    const resultado = {
      titulo: estructura.titulo,
      slides: slidesConImagenes,
      plantilla: "chat-bedrock/public/plantillas/"+plantilla+".pptx"
    };

    console.log("Datos enviados al servicio:", JSON.stringify(resultado, null, 2));

    // 2. Llamar al servicio
    const response = await fetch('http://localhost:8002/generate-presentation', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(resultado)
    });

    // 3. Verificar respuesta
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al generar presentación");
    }

    const result = await response.json();
    if (result.success) {
      //window.open(`http://localhost:8002/download/${result.download_url.split('/').pop()}`,'_blank');}
      console.log("PPT GENERADO CON EXITO");
    }

    return res.status(200).json({ estructura: resultado });

  } catch (error) {
    console.error('Error al generar imágenes:', error);
    return res.status(500).json({ mensaje: 'Error al generar imágenes para los slides' });
  }
}
