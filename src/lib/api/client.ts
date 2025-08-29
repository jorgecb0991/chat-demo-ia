// src/lib/api/client.ts
import { getAuthToken } from "@/lib/auth/tokenService";

/**
 * 📌 Función genérica para llamar a nuestra API backend
 * - Siempre agrega el token de autenticación automáticamente.
 * - Aplica el header "Content-Type: application/json" por defecto.
 * - Maneja errores HTTP de forma estándar.
 * 
 * @param url    URL del endpoint a llamar.
 * @param options Opciones del fetch estándar de JS (método, headers, body...).
 * @returns La respuesta parseada en JSON (Promise<T>).
 * 
 * 🔹 Ejemplo de uso:
 * await apiRequest<User>(ENDPOINTS.users.create, {
 *   method: 'POST',
 *   body: JSON.stringify({ name: 'Juan' })
 * });
 */
export async function apiRequest<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    // 1️⃣ Obtener token dinámico de autenticación
    const token = await getAuthToken();

    // 2️⃣ Llamar al backend con configuración estándar
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}), // Mezclar headers adicionales si los hay
        },
    });

    // 3️⃣ Manejo de error centralizado
    if (!response.ok) {
        const text = await response.text(); // Leer respuesta para depuración
        throw new Error(`Error HTTP ${response.status}: ${text}`);
    }

    // 4️⃣ Parsear JSON automáticamente
    return response.json() as Promise<T>;
}
