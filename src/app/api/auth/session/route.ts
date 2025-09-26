// src/app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        // ⭐️ Log para confirmar que la llamada desde el cliente ha llegado al servidor.
        console.log("[API /auth/session] Petición GET recibida. Verificando la sesión...--------------------------");

        const cookieStore = await cookies();
        const cookie = cookieStore.get("horus_session")?.value;
        if (!cookie) return NextResponse.json({ authenticated: false }, { status: 200 });

        const session = JSON.parse(cookie);
        console.log("session.ts")
        console.log(session)
        return NextResponse.json({ authenticated: true, session }, { status: 200 });
    } catch (err) {
        console.error("[API /auth/session] Error leyendo cookie:", err);
        return NextResponse.json({ authenticated: false }, { status: 500 });
    }
}
