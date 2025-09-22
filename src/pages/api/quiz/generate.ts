import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File } from "formidable";
import fs from "fs";
import { getAuthToken } from "@/lib/auth/tokenService";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from '@/types/api';

export const config = {
    api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
        const form = new IncomingForm();
        const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve([fields, files]);
            });
        });

        const token = await getAuthToken();

        const backendFormData = new FormData();
        backendFormData.append("sourceType", fields.sourceType);
        backendFormData.append("questionType", fields.questionType);
        backendFormData.append("numQuestions", fields.numQuestions);
        backendFormData.append("codProgram", fields.codProgram);
        backendFormData.append("language", fields.language);
        backendFormData.append("userId", "jorge");
        backendFormData.append("sessionId", "5749693197559267328");

        // Campos opcionales
        if (fields.instruction_teacher) {
            backendFormData.append("instructions", fields.instructions as string);
        }

        // Siempre enviamos el sourceValue, sin importar el tipo
        if (fields.sourceValue) {
            backendFormData.append("sourceValue", fields.sourceValue as string);
        }

        // Manejo de archivos subidos (si existen)
        if (files.file) {
            const file = files.file[0] as File;

            // Leemos el archivo desde el sistema de archivos (formidable lo guarda temporalmente)
            const fileBuffer = fs.readFileSync(file.filepath);

            // Convertimos a Blob (formato estándar para enviar archivos via HTTP)
            const fileBlob = new Blob([fileBuffer], {
                type: file.mimetype || 'application/octet-stream' // Tipo MIME o genérico si no se detecta
            });

            // Agregamos el archivo al FormData del backend
            backendFormData.append("file", fileBlob, file.originalFilename || "archivo");
        }

        const response = await fetch(ENDPOINTS.quiz.generate, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: backendFormData as any,
        });

        const responseData: ApiResponse = await response.json();
        return res.status(response.status).json(responseData);

    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: "Error procesando el formulario" });
    }
}