// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { getGoogleAuthUrl } from "horus-auth-client"; // tu lib local
import { HORUS_CONFIG } from "@/config/horus";

export async function GET(request: Request) {
    try {
        const origin = new URL(request.url).origin;
        const redirectUri = `${origin}/api/auth/callback`; // Google redirige aquí después
        console.log("[API /auth/login] Generando URL Google, redirectUri=", redirectUri);

        const url = await getGoogleAuthUrl(
            HORUS_CONFIG.baseUrl,
            HORUS_CONFIG.clientId,
            HORUS_CONFIG.applicationId,
            redirectUri
        );

        console.log("[API /auth/login] Redirigiendo a Google:", url);
        return NextResponse.redirect(url);
    } catch (err) {
        console.error("[API /auth/login] Error:", err);
        return NextResponse.json({ error: "Cannot generate Google auth URL" }, { status: 500 });
    }
}
