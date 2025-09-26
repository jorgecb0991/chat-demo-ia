// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("horus_session");
        console.log("[API /auth/logout] Sesión eliminada (cookie borrada)");
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[API /auth/logout] Error al hacer logout:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
