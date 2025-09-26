// src/app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { HorusAuthService } from "@/services/HorusAuthService"; // usa tu wrapper
// o: import { authenticateAndGetSettings } from "horus-auth-client";
import { HORUS_CONFIG } from "@/config/horus";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    console.log("[API /auth/callback] Entró callback, params:", Object.fromEntries(url.searchParams.entries()));

    if (!code) {
        console.warn("[API /auth/callback] No recibí code, redirigiendo a /login");
        return NextResponse.redirect(new URL("/login", url.origin));
    }

    try {
        console.log("[API /auth/callback] Intercambiando code con Horus...", { code });

        // Llamas al servicio que encapsula la librería horus-auth-client
        const data = await HorusAuthService.authenticate(code);

        console.log("[API /auth/callback] Respuesta Horus:", data);

        if (!data?.content?.session) {
            console.error("[API /auth/callback] No hay session en la respuesta");
            return NextResponse.redirect(new URL("/login", url.origin));
        }

        const session = data.content.session;

        const cookieStore = await cookies();

        // Guardar cookie segura (httpOnly)
        cookieStore.set({
            name: "horus_session",
            value: JSON.stringify(session),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        console.log("[API /auth/callback] Cookie horus_session seteada. Redirigiendo /dashboard");
        return NextResponse.redirect(new URL("/dashboard", url.origin));
    } catch (err) {
        console.error("[API /auth/callback] Error intercambiando code:", err);
        // opcional: devolver info para debugeo (cautela en prod)
        return NextResponse.redirect(new URL("/login", url.origin));
    }
}
