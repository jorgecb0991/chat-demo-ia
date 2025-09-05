"use client";

import { ReactNode } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

interface DefaultLayoutProps {
    title?: string;
    titleIcon?: ReactNode;
    description?: string;
    children: ReactNode;
    loading?: boolean;
    loadingMessage?: string;
    loadingIcon?: ReactNode;
}

export default function DefaultLayout({
    title,
    titleIcon,
    description,
    children,
    loading = false,
    loadingMessage = "Cargando...",
    loadingIcon,
}: DefaultLayoutProps) {
    return (
        <div className="relative flex justify-center items-start p-6 h-full">
            {/* Overlay de carga */}
            {loading && (
                <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
                    {loadingIcon ? (
                        <>{loadingIcon}</>
                    ) : (
                        <>
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
                            <p className="text-white text-lg font-semibold">{loadingMessage}</p>
                        </>
                    )}
                </div>
            )}

            <Card className="w-full max-w-7xl mx-auto shadow-xl border border-gray-200 flex flex-col flex-1 min-h-0 gap-2">
                <CardHeader>
                    {title && (
                        <CardTitle className="text-2xl md:text-3xl font-bold text-blue-900 flex items-center gap-2">
                            {titleIcon && <span className="text-blue-900">{titleIcon}</span>}
                            {title}
                        </CardTitle>
                    )}
                    {description && (
                        <CardDescription className="text-gray-700 mt-2 text-sm md:text-base">
                            {description}
                        </CardDescription>
                    )}
                </CardHeader>

                <CardContent className="flex-1 min-h-0">
                    {/* ✅ Aquí el único scroll */}
                    <div className="p-4 md:p-6">
                        {children}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}