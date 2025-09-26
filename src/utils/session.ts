"use server";

import { cookies } from "next/headers";

export async function saveSession(session: any) {
    (await cookies()).set({
        name: "horus_session",
        value: JSON.stringify(session),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
    });
}

export async function getSession() {
    const cookie = (await cookies()).get("horus_session");
    if (!cookie) return null;
    return JSON.parse(cookie.value);
}

export async function clearSession() {
    (await cookies()).delete("horus_session");
}
