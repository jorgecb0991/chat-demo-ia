// src/app/(auth)/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage({ searchParams }: { searchParams: { code?: string } }) {
    const router = useRouter();

    useEffect(() => {
        const code = searchParams.code;

        if (!code) {
            router.replace("/login");
            return;
        }

        fetch(`/api/auth/callback?code=${code}`, { method: "POST" })
            .then(res => res.json())
            .then(() => router.replace("/dashboard"))
            .catch(() => router.replace("/login"));
    }, [searchParams, router]);

    return <div>Procesando autenticación...</div>;
}
