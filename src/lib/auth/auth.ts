// src/lib/auth/auth.ts
import { cookies } from "next/headers";

export async function getSession() {
    try {
        const cookieStore = await cookies();
        const raw = cookieStore.get("horus_session")?.value;
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (err) {
        console.error("[lib/auth] getSession parse error:", err);
        return null;
    }
}
