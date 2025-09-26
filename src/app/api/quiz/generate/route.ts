import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth/tokenService";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from '@/types/api';

/**
 * Este endpoint maneja la generación de un quiz a partir de datos de un formulario
 * que pueden incluir un archivo. Utiliza el soporte nativo de Next.js para FormData.
 */
export async function POST(request: Request) {
    try {
        // 1. Obtener los datos del formulario directamente desde el objeto Request
        const formData = await request.formData();
        
        // 2. Obtener el token de autenticación
        const token = await getAuthToken();

        // 3. Crear un nuevo FormData para enviar al backend de Python
        const backendFormData = new FormData();

        // 4. Recorrer los campos del FormData original para pasarlos al nuevo
        for (const [name, value] of formData.entries()) {
            // El valor puede ser un archivo (Blob) o un campo de texto.
            // Los archivos se convierten a Blob si es necesario, pero request.formData() ya devuelve un Blob.
            // Si el valor no es un Blob, lo tratamos como texto.
            if (value instanceof Blob) {
                // Si es un archivo, lo adjuntamos al FormData del backend
                const fileBlob = value;
                const fileName = (value as any).name || 'file'; // Obtener el nombre del archivo si está disponible
                backendFormData.append(name, fileBlob, fileName);
            } else {
                // Si es un campo de texto, lo pasamos directamente
                backendFormData.append(name, value);
            }
        }
        
        // 5. Enviar el FormData al backend
        const response = await fetch(ENDPOINTS.quiz.generate, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: backendFormData as any,
        });

        const responseData: ApiResponse = await response.json();
        
        // 6. Devolver la respuesta del backend
        return NextResponse.json(responseData, { status: response.status });

    } catch (err: any) {
        console.error("Error al procesar el formulario:", err);
        return NextResponse.json(
            { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Error procesando el formulario" } },
            { status: 500 }
        );
    }
}
