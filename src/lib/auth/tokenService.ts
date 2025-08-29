// src/lib/auth/tokenService.ts
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getAuthToken(): Promise<string> {
    const now = Date.now();

    // Reutilizar token si sigue válido
    if (cachedToken && tokenExpiry && now < tokenExpiry) {
        return cachedToken;
    }

    //const authUrl = "https://api-test5.utec.net.pe/horus-api/v1/nonspec/oauth2/auth/server";
    const authUrl = "http://localhost:5050/horus-api/v1/nonspec/oauth2/auth/server";
    const body = {
        grantType: "client_credentials",
        clientId: "26336c0a-24f9-4339-b0a7-e23eda8ca62d",
        clientSecret: "4a90130b-da4c-4d89-b942-c60d1ba2a578",
    };

    const res = await fetch(authUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error(`Error al obtener token: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const token = data.content?.accessToken;
    const expiresIn = data.content?.expiresIn || 3600; // por defecto 1 hora

    if (!token) {
        throw new Error("No se recibió accessToken en la respuesta");
    }

    cachedToken = token;
    tokenExpiry = now + expiresIn * 1000;

    return cachedToken!;
}
