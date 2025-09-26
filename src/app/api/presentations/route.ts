import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth/tokenService";
import { ENDPOINTS } from "@/lib/api/endpoints";

/**
 * Endpoint de la API para generar presentaciones PPTX.
 *
 * Este endpoint maneja la carga de archivos utilizando el soporte nativo de
 * Next.js para FormData, lo que simplifica la lógica y elimina la necesidad
 * de librerías externas como formidable.
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
        
        // Agregar userId y sessionId hardcodeados
        backendFormData.append("userId", "jorge");
        backendFormData.append("sessionId", "3599804917629321216");
        
        // 5. Enviar la solicitud al backend Python
        const response = await fetch(ENDPOINTS.presentations.create, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: backendFormData,
        });

        // 6. Manejar la respuesta
        if (!response.ok) {
            let userMessage = "No se pudo generar la presentación. Intenta nuevamente más tarde.";
            try {
                const data = await response.json();
                console.error("Error del backend:", data.error);
            } catch (e) {
                console.error("Error del backend (sin JSON legible):", e);
            }
            return NextResponse.json({ message: userMessage }, { status: response.status });
        }

        // 7. Si la respuesta es exitosa, devolver el archivo PPTX
        // Esto crea un Blob a partir de la respuesta y devuelve una URL temporal
        const fileBlob = await response.blob();

        return new NextResponse(fileBlob, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "Content-Disposition": `attachment; filename="presentacion.pptx"`,
            },
        });

    } catch (error) {
        console.error("Error en /api/presentations:", error);
        return NextResponse.json({
            message: "Ocurrió un error interno al generar la presentación. Inténtalo de nuevo más tarde."
        }, { status: 500 });
    }
}
